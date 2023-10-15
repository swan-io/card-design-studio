# Card design studio

## Presentation

The card design studio is a mini web-app where you can customize your own card like in the Swan dashboard and get a 3D preview.

## Motivation

When we released the card settings page in the Swan dashboard, we wanted a public page to show configuration capabilities to everyone, even people without a Swan account.  
This project was also an opportunity to learn and experiment with WebGL and threejs.

## Technologie used

- [Vite](https://vitejs.dev/) for development server and bundle the app
- [React](https://reactjs.org/) for UI
- [react-native-web](https://github.com/necolas/react-native-web) for components primitives
- [lake](https://github.com/swan-io/lake) Swan's design system for UI components
- [threejs](https://threejs.org/) to create 3D scene
- [react-three-fiber](https://github.com/pmndrs/react-three-fiber) to use threejs with React

## Technical details about project organization

This app is composed of 2 parts:

- `server` folder which contains a nodejs app to save card configuration in a json file and serve static files
- `client` folder which contains the front-end app with UI and 3D scene

### Server

The server is a fastify app with those routes:

- `GET /health` to check if the server is running
- `POST /api/config` to save card configuration in a json file
- `GET /api/config/:id` to get a specific card configuration
- `GET /env.js` to get environment variables for the front-end app

The app will behave in a different way dependending on the `NODE_ENV` environment variable:

- `production` will serve static files from `/server/dist` folder (this folder is created by Vite in `yarn build` command)
- otherwise the server will start a Vite dev server and proxy all requests to it

> The config file id is the name of the card holder with those transformations:
>
> - all characters are lowercased
> - all special characters are removed
> - all spaces are replaced by `_`
> - if the same id is used multiple times, a number is added at the end of the id (for example: `frederic`, `frederic_1`, `frederic_2`)

### Client

The client is a React app bundled by Vite.  
This app has 3 different urls:

#### `/` Card configuration flow

The root url contains the card configuration flow. The user will be able to select a name, a logo and a color for the card.  
Then he can save the configuration thanks to share button.

#### `/share/:id` Card configuration preview

This url loads a specific card configuration and display it in a 3D scene with automatic rotation.

#### `/website-demo?:backgroundColor&:cardColor&:cardHolderName` Page dedicated for Swan website.

This page gives the possibility to add an animated card preview on a website with an iframe.  
This is configurable with query parameters:

- `backgroundColor` is the background color of the page, we can only set hexadecimal color withut the `#` prefix (for example: `F5F5F7`)
- `cardColor` is the color of the card, possible values are:
  - `black` (default if no color is specified)
  - `silver`
  - `custom`
- `cardHolderName` is the name of the cardholder displayed on the card

## Technical details about 3D

### Lighting

Most of lighting is done with an hdri image available [here](https://hdrihaven.com/hdri/?h=adams_place_bridge) and was converted with [HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/) (because threejs environment works cube texture)

### 3D model

The 3D card model and textures was created with [Blender](https://www.blender.org/).
After export to gltf format, few changes was made on `card.gltf` file:

- all `doubleSided` keys on all materials was set to false. It improves performances and avoid some glitches.
- for the `black_band` material, the `roughnessFactor` was changed to improve reflection of magnetic band in threejs. (The reflection isn't exaclty the same between Blender and threejs).

### SVG logo integration in 3D

Threejs has a [SVGLoader](https://threejs.org/docs/#examples/en/loaders/SVGLoader) but most of SVG we tried didn't work. Our first idea was to improve the loader to make my SVG working but it will be very long and hard to handle all cases.  
To workaround this, we put the SVG in an Image element and then pass it to a threejs material as an alpha map (white pixels are displayed and black pixels make the plane transparent).  
As the image is transformed from vector to pixel matrix, the result can be a little blurry but we're sure it works as well as if we display the SVG in a `img` tag.
