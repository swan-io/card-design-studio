# Card design studio

## Presentation

The card design studio is a mini web-app where you can customize your own card like in the Swan dashboard and get a 3D preview.

## Motivation

When we released the card settings page in the Swan dashboard, we wanted a public page to show configuration capabilities to everyone, even people without a Swan account.  
This project was also an opportunity to learn and experiment with WebGL and threejs.

## Technologie used

- [Vite](https://vitejs.dev/) for development server and bundle the app
- [React](https://reactjs.org/) for UI
- [CSS modules](https://github.com/css-modules/css-modules) for stylesheet
- [reat-aria](https://react-spectrum.adobe.com/react-aria/) for accessibility
- [react-spring](https://react-spring.io/) for animations and transitions
- [threejs](https://threejs.org/) to create 3D scene

### Why this project doesn't use react-three-fiber?
[react-three-fiber](https://github.com/pmndrs/react-three-fiber) and the eco-system around it looks amazing to do 3D projects with React. As this project was a first experiment with [threejs](https://threejs.org/), using `react-three-fiber` requires more time to learn. And it might makes experimentation harder because in case of error, the lack of experience with threejs will make us doubt if it comes from an error with `threejs` or a miss-usage of `react-three-fiber`.

## Technical details about 3D

### Lighting

Most of lighting is done with an hdri image available [here](https://hdrihaven.com/hdri/?h=adams_place_bridge) and was converted with [HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/) (because threejs environment works cube texture)

### 3D model

The 3D card model and textures was created with [Blender](https://www.blender.org/).
After export to gltf format, few changes was made on `card.gltf` file:
- all `doubleSided` keys on all materials was set to false. It improves performances and avoid some glitches.
- for the `black_band` material, the `roughnessFactor` was changed to improve reflection of magnetic band in threejs. (The reflection isn't exaclty the same between Blender and threejs).

### SVG logo integration in 3D

Threejs has a [SVGLoader](https://threejs.org/docs/#examples/en/loaders/SVGLoader) but most of SVG we tried didn't work. My first idea was to improve the loader to make my SVG working but it will be very long and hard to handle all cases.  
To workaround this, we put the SVG in an Image element and then pass it to a threejs material as an alpha map (white pixels are displayed and black pixels make the plane transparent).  
As the image is transformed from vector to pixel matrix, the result can be a little blurry but we're sure it works as well as if we display the SVG in a `img` tag.

### Custom shader for card color

Here we will talk about shaders, to give you a brief presentation, shaders are programs written in [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language) executed by the GPU.  
There are 2 kinds of shaders:
- vertex shader which compute the position of points in the WebGL canvas.
- fragment shader which compute the color of each pixels in the area defined by the vertex shader.

> fragment shaders can be confusing at the begining because as front-end developers, we used to code with blocks having a size (width and height), a shape (corner radius, custom shapes with svg, ...) and colors (single color, grandients, ...). With fragment shader, we write a function returning the color of 1 single pixel. I recommand [The Book of Shaders
](https://thebookofshaders.com/) to learn shaders with examples.

In `CardPreview` component, the `cardMaterial` defines card color and light reflection (there are more parameters but we sumarize to keep explanation as simple as possible).  
With the `MeshStandardMaterial` class, we can set a texture to define the card color with the `map` key.  
So we could change the card color by just switching between `map: cardTextures.silver` and `cardTextures.black`. But it will changes the color without any transition.  
If we want a transition between 2 textures we have to:
- send silver and black textures to the material shader
- send animation progress to the material shader
- change the material shader to add a transition between silver and black colors depending on animation progress

A great thing about threejs is that we can change some parts of provided shaders to create custom behavior without having to recreate it from scratch.  
In our case it makes possible to have a custom behavior about color and keep all lights reflection from `MeshStandardMaterial`.  

To do that, materials provide `onBeforeCompile` property where we can define a function which customize the material's shader.

To send values from our JS runtime to a shader, we use uniforms.
- silver texture is send with `map` key
- black texture is send with `shader.uniforms.map2`
- `shader.uniforms.uPercent` send animation progress to the shader

To make our material color changes depending on those uniforms, we have to insert chunks of GLSL program in the material shader:
- `map_pars_fragment` contains code which defines uniforms and custom function declarations we'll use for our transition.
- `map_fragment` contains the code defining the transition between silver and black color depending on `uPercentage`.

> We need to inject 2 fragments because uniforms and functions declaration can be done only outside the `main` function. `map_pars_fragment` is injected outside this `main` function, and `map_fragment` is injected inside.

> The transition is done with a perlin noise, this function make possible to have an organic transition, more details here: https://en.wikipedia.org/wiki/Perlin_noise

### Custom shader for app background

To have a scene background similar to the website with the orange -> purple gradient, we created a custom shader which is applied to a plan.  
- `gradientVertex` make the plan full screen and behind other objects.
- `gradientFragment` define the color of each pixel.

As the `gradientFragment` is executed for each pixel, the code isn't very intuitive for people discovering shaders, to sumarize:
- we create a diagonal gradiant from orange to purple
- we create a white to black radial gradiant
- we use "white to black radial gradiant" as a mask of the diagonal gradiant
