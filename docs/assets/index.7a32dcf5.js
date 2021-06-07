var e=Object.defineProperty,t=Object.prototype.hasOwnProperty,n=Object.getOwnPropertySymbols,a=Object.prototype.propertyIsEnumerable,r=(t,n,a)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a,o=(e,o)=>{for(var s in o||(o={}))t.call(o,s)&&r(e,s,o[s]);if(n)for(var s of n(o))a.call(o,s)&&r(e,s,o[s]);return e};import{r as s,l as i,b as l,d as c,C as m,A as u,P as d,M as g,a as h,T as p,c as f,e as v,V as y,B as w,W as _,s as E,R as b,S as x,G as N,f as P,O as S,g as z,h as C,i as k,j as M,k as R,m as A,u as L,n as j,o as F,p as D,q as T,t as I,v as $,w as V,x as B,y as U,z as O,D as H,E as q,F as Y,H as G,I as W,J as X,K as J,L as K,N as Q,Q as Z,U as ee,X as te,Y as ne}from"./vendor.0491bedf.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(n){const a=new URL(e,location),r=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((n,o)=>{const s=new URL(e,a);if(self[t].moduleMap[s])return n(self[t].moduleMap[s]);const i=new Blob([`import * as m from '${s}';`,`${t}.moduleMap['${s}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(i),onerror(){o(new Error(`Failed to import: ${e}`)),r(l)},onload(){n(self[t].moduleMap[s]),r(l)}});document.head.appendChild(l)})),self[t].moduleMap={}}}("/card-design-studio/assets/");const ae=e=>{const t=s.useRef();return t.current||(t.current=e()),t.current},re=e=>{const t=s.useRef();return t.current||(t.current=e()),s.useEffect((()=>()=>{var e;null==(e=t.current)||e.dispose()})),t.current},oe=({range:e,output:t})=>n=>{const a=e[1]-e[0];return(t[1]-t[0])*(n-e[0])/a+t[0]},se=e=>{let t;const n=()=>{t&&(cancelAnimationFrame(t),t=void 0)};return{start:({to:a,duration:r,easing:o,onComplete:s})=>{n();for(const t in a)if("number"!=typeof e[t])throw new Error(`Animation invalid type: only numbers can be animated and here property "${t}" type is ${typeof t}`);const i=oe({range:[0,r],output:[0,1]}),l={};for(const t in a)l[t]=oe({range:[0,1],output:[e[t],a[t]]});const c=Date.now(),m=()=>{const n=Date.now()-c,u=Math.min(n,r),d=i(u),g=o?o(d):d;for(const t in a){const n=l[t](g);e[t]=n}u<r?t=requestAnimationFrame(m):(null==s||s(),t=void 0)};t=requestAnimationFrame(m)},stop:n,running:()=>!!t}},ie=Math.pow,le=e=>1-ie(1-e,3),ce=e=>1===e?1:1-ie(2,-10*e),me=(e,t="")=>{const n=c(e),a=(new DOMParser).parseFromString(n,"image/svg+xml");if(!(a.children[0]instanceof SVGElement))throw new Error(`File "${t}" isn't a valid svg`);return a.children[0]},ue=e=>"data:image/svg+xml;base64,"+l.encode(e.outerHTML),de=e=>{var t;const n=e.getAttribute("width"),a=e.getAttribute("height"),r=n?parseInt(n):NaN,o=a?parseInt(a):NaN;if(!isNaN(r)||!isNaN(o))return{width:r,height:o};const s=e.getAttribute("viewBox"),[,,i,l]=null!=(t=null==s?void 0:s.split(" "))?t:[],c=i?parseInt(i):NaN,m=l?parseInt(l):NaN;if(isNaN(c)||isNaN(m))throw new Error("Invalid SVG Imported: an SVG must have a viewBox attribute");return{width:c,height:m}},ge=e=>{const t=e.getAttribute("fill"),n=e.getAttribute("stroke"),a=e.getAttribute("style");return"style"===e.tagName?e.innerHTML.includes("fill")||e.innerHTML.includes("stroke"):!!(t||n||a)||[...e.children].some((e=>ge(e)))},he=(e,t)=>{const n=i.match(t).with("black",(()=>"#000")).with("white",(()=>"#FFF")).exhaustive(),a=e.cloneNode(!0);if(!ge(e))return a.setAttribute("fill",n),a.setAttribute("stroke",n),a;const r=["mask"],o=e=>{if("style"===e.tagName){const t=/#[A-F0-9]{6,6}|#[A-F0-9]{3,3}|rgb\(\d{1,3},\d{1,3},\d{1,3}\)|rgba\(\d{1,3},\d{1,3},\d{1,3},\d\.?\d{0,}\)/gim,a=e.innerHTML.replace(t,n);e.innerHTML=a}if("feColorMatrix"===e.tagName){const n=(e=>{const t="white"===e?1:0;return[t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,0,0,0,1,0].join(" ")})(t);e.setAttribute("type","matrix"),e.setAttribute("values",n)}const a=!r.includes(e.tagName),s=a?e.getAttribute("fill"):null,i=a?e.getAttribute("stroke"):null,l=a?e.getAttribute("stop-color"):null,c=a?e.getAttribute("style"):null;if(s&&"none"!==s&&e.setAttribute("fill",n),i&&"none"!==i&&e.setAttribute("stroke",n),l&&"none"!==l&&e.setAttribute("stop-color",n),c){const t=c.split(";").map((e=>{const[t,a]=e.split(":");return["fill","stroke","stop-color"].includes(t)&&"none"!==a?`${t}:${n}`:e})).join(";");e.setAttribute("style",t)}[...e.children].forEach((e=>o(e)))};return o(a),a};var pe="_container_ptv6r_1",fe="_canvas_ptv6r_9",ve="_canvas_hidden_ptv6r_14";const ye=Math.PI/2,we=-ye,_e=oe({range:[-1,1],output:[0,1]}),Ee={content:"",size:.18,side:"front",top:-1.95,left:-3.5,fontName:"maisonNeue"},be=[{content:"TM",size:.03,side:"front",left:3.85,top:-2.15,fontName:"markPro"},{content:"5105 1051 0510 5100",size:.36,side:"back",left:4,top:-1.85,fontName:"maisonNeue"},{content:"08/23",size:.19,side:"back",left:4,top:-2.3,fontName:"maisonNeue"},{content:"CVC 000",size:.19,side:"back",left:2.55,top:-2.3,fontName:"maisonNeue"},{content:"debit",size:.25,side:"back",left:-1.9,top:-1.05,fontName:"markPro"},{content:"Identifier: 0000000000",size:.17,side:"back",left:4,top:.7,fontName:"maisonNeue"}],xe=[{content:"This card is issued by Swan, pursuant to license",size:.147,side:"back",left:4,top:.2,fontName:"maisonNeue"},{content:"by Mastercard international.",size:.147,side:"back",left:4,top:-.1,fontName:"maisonNeue"},{content:"support@swan.io",size:.1,side:"back",left:4,top:2.42,fontName:"markPro"},{content:"IDEMIA 9 1212121L 09/21",size:.1,side:"back",left:-2.4,top:2.42,fontName:"markPro"}],Ne={black:{r:.93,g:.93,b:.93},silver:{r:0,g:0,b:0}},Pe={intro:{getPosition:e=>{const t=Math.min(-20,-12/e);return new y(t,0,0)},rotation:new y(0,0,0)},name:{getPosition:e=>{const t=Math.min(-4.7,-4.7/e);return new y(t,-2.3,-2.5)},rotation:new y(0,0,0)},logo:{getPosition:e=>{const t=Math.min(-10,-10/e),n=Math.min(-1,-1/(e*e));return new y(t,n,0)},rotation:new y(0,0,0)},color:{getPosition:e=>{const t=Math.min(-15,-9/e),n=Math.min(0,-1/e),a=Math.max(0,1/(2.5*e));return new y(t,n,a)},rotation:new y(0,.68,-.22)},completed:{getPosition:e=>{const t=Math.min(-15,-10/e);return new y(t,0,0)},rotation:new y(0,2.5,.22)}},Se=(e,t,n)=>{const a=e.map((e=>{const n=new p(e.content,{font:t[e.fontName],height:0,size:e.size}),a="front"===e.side?we:ye,r="front"===e.side?-.039:.039;return n.rotateY(a),n.translate(r,e.top,e.left),n})),r=w.mergeBufferGeometries(a);return new g(r,n)},ze=e=>{const t=new k;t.setFromBufferAttribute(e.attributes.position);const n=t.max.x-t.min.x,a=t.max.y-t.min.y,r=t.max.z-t.min.z;return new y(n,a,r)},Ce=s.memo((({assets:e,cameraPosition:t,name:n,color:a,logo:r,logoScale:o})=>{const i=s.useRef(null),l=s.useRef(t),c=ae((()=>({width:window.innerWidth,height:window.innerHeight}))),R=ae((()=>document.createElement("canvas"))),A=s.useRef(!1),L=re((()=>{const e=new _({canvas:R,antialias:!0});return e.physicallyCorrectLights=!0,e.outputEncoding=E,e.toneMapping=b,e.toneMappingExposure=3,e})),j=ae((()=>new x)),F=ae((()=>new N)),D=ae((()=>{const e=new P(50,c.width/c.height,.1,100),{getPosition:n,rotation:a}=Pe[t],r=n(c.width/c.height);return e.position.set(r.x,r.y,r.z),F.rotation.set(a.x,a.y,a.z),e})),T=ae((()=>se(D.position))),I=ae((()=>se(F.rotation))),$=ae((()=>{const e=new S(D,R);return e.enablePan=!1,e.maxDistance=30,e.minDistance=5,e.enabled=!1,e.enableDamping=!0,e.dampingFactor=.1,e.rotateSpeed=2,e})),V=(e=>{const t=s.useRef();return t.current||(t.current=e()),s.useEffect((()=>()=>{if(!t.current)return;const{geometry:e,material:n}=t.current;if(e.dispose(),Array.isArray(n))for(const t of n)t.dispose();else n.dispose()})),t.current})((()=>new g(new v(2,2,1,1),new z({uniforms:{uRatio:{value:c.width/c.height},uPosition:{value:new C(.5,.5)}},vertexShader:"attribute vec4 position;\nattribute vec2 uv;\n\nvarying vec2 vUv;\n\nvoid main(){\n  vUv = uv;\n  float depth = 1.0;\n  gl_Position = vec4(position.xy, depth, 1.0);\n}\n",fragmentShader:"precision mediump float;\n\nuniform float uRatio;\nuniform vec2 uPosition;\n\nvarying vec2 vUv;\n\nvoid main(){\n  float gradientOffset = 1.0;\n\n  vec3 background = vec3(0.976, 0.976, 0.980);\n  vec4 color1 = vec4(0.506, 0.4, 0.769, 1.0);\n  vec4 color2 = vec4(0.961, 0.6, 0.286, 0.5);\n\n  vec2 diagonalUv = vec2(\n    smoothstep(uPosition.x - gradientOffset, uPosition.x + gradientOffset, vUv.x),\n    smoothstep(uPosition.y - gradientOffset, uPosition.y + gradientOffset, vUv.y)\n  );\n  float diagonal = smoothstep(0.0, 2.0, diagonalUv.y * 2.0 + 1.0 - diagonalUv.x * 2.0);\n  vec4 color = mix(color1, color2, diagonal);\n\n  float xOffset = 0.5 - 0.5 * uRatio;\n  vec2 squareUv = vec2(vUv.x * uRatio + xOffset, vUv.y);\n  float alpha = 1.0 - distance(uPosition, squareUv) * 0.8 - 0.5;\n\n  gl_FragColor = vec4(mix(background, color.rgb, color.a * alpha), 1.0);\n}\n"})))),B=ae((()=>({value:"silver"===a?0:1}))),U=re((()=>{const t=new h({metalness:.1,roughness:.35,envMapIntensity:3,map:e.cardTextures.silver});return t.onBeforeCompile=t=>{t.uniforms.uPercent=B,t.uniforms.map2={value:e.cardTextures.black},t.fragmentShader=t.fragmentShader.replace("#include <map_pars_fragment>","uniform float uPercent;\nuniform sampler2D map;\nuniform sampler2D map2;\n\n// 2D Perlin noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#classic-perlin-noise\nvec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nfloat cnoise(vec2 P){\n  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);\n  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);\n  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation\n  vec4 ix = Pi.xzxz;\n  vec4 iy = Pi.yyww;\n  vec4 fx = Pf.xzxz;\n  vec4 fy = Pf.yyww;\n  vec4 i = permute(permute(ix) + iy);\n  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...\n  vec4 gy = abs(gx) - 0.5;\n  vec4 tx = floor(gx + 0.5);\n  gx = gx - tx;\n  vec2 g00 = vec2(gx.x,gy.x);\n  vec2 g10 = vec2(gx.y,gy.y);\n  vec2 g01 = vec2(gx.z,gy.z);\n  vec2 g11 = vec2(gx.w,gy.w);\n  vec4 norm = 1.79284291400159 - 0.85373472095314 *\n    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));\n  g00 *= norm.x;\n  g01 *= norm.y;\n  g10 *= norm.z;\n  g11 *= norm.w;\n  float n00 = dot(g00, vec2(fx.x, fy.x));\n  float n10 = dot(g10, vec2(fx.y, fy.y));\n  float n01 = dot(g01, vec2(fx.z, fy.z));\n  float n11 = dot(g11, vec2(fx.w, fy.w));\n  vec2 fade_xy = fade(Pf.xy);\n  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);\n  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);\n  return 2.3 * n_xy;\n}\n"),t.fragmentShader=t.fragmentShader.replace("#include <map_fragment>","float pattern = cnoise(vUv * 2.0 + 2.0) + 0.8;\nfloat colorPattern = 1.0 - step(uPercent * 1.4, pattern);\n\nvec4 silverColor = texture2D(map, vUv);\nvec4 blackColor = texture2D(map2, vUv);\nvec4 texelColor = mix(silverColor, blackColor, colorPattern);\n\ntexelColor = mapTexelToLinear(texelColor);\ndiffuseColor *= texelColor;\n")},t})),O=re((()=>{const e=new h({color:new m(10921638),metalness:.6,roughness:.5,envMapIntensity:3});return e.onBeforeCompile=e=>{e.fragmentShader=e.fragmentShader.replace("#include <color_fragment>","float red = cameraPosition.x * cameraPosition.z;\nfloat green = cameraPosition.y * cameraPosition.z;\nfloat blue = 0.1;\n\nred = sin(red / 5.0) + 1.0 / 2.0;\ngreen = sin(green / 5.0) + 1.0 / 2.0;\n\nvec3 shinyColor = vec3(red, green, blue);\nfloat shinyFactor = 0.35;\n\ndiffuseColor.rgb = mix(diffuseColor.rgb, shinyColor, shinyFactor);\n")},e})),H=re((()=>new h({color:0,metalness:.1,roughness:.35,envMapIntensity:3,transparent:!0}))),q=re((()=>new h({color:0,metalness:.1,roughness:.35,envMapIntensity:3}))),Y=re((()=>new h({color:2236962,metalness:.1,roughness:.35,envMapIntensity:3}))),G=re((()=>new h({color:2236962,metalness:.1,roughness:.35,envMapIntensity:3,transparent:!0,opacity:0}))),W=ae((()=>new N)),X=ae((()=>se(B))),J=ae((()=>se(H.color))),K=ae((()=>se(q.color))),Q=ae((()=>se(G))),Z=()=>{c.width=window.innerWidth,c.height=window.innerHeight;const e=Math.min(devicePixelRatio,2),t=c.width/c.height;V.material.uniforms.uRatio.value=t,D.aspect=t,D.updateProjectionMatrix(),L.setSize(c.width,c.height);const{x:n,y:a,z:r}=Pe[l.current].getPosition(c.width/c.height);D.position.set(n,a,r),L.setPixelRatio(e)};return s.useEffect((()=>{var e;R.className=`${fe} ${ve}`,null==(e=i.current)||e.appendChild(R);const t=setTimeout((()=>{R.className=fe}),100);return()=>{clearTimeout(t)}}),[]),s.useEffect((()=>{Z();const e=()=>Z();return window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}}),[]),s.useEffect((()=>{F.add(D),j.add(F),j.background=new m(16777215),j.environment=e.environmentMap;const t=new u(16777215,2),n=new d(16777215);n.decay=2,n.intensity=2e3,n.position.set(-100,10,-21);const a=new d(16777215);a.decay=2,a.intensity=2e3,a.position.set(100,10,21),j.add(t,n,a),W.position.x=-.039,W.position.y=2.7-.3,W.position.z=4.28-.3,j.add(W),j.add(V);const r=Se(be,e.fonts,q),o=Se(xe,e.fonts,Y);j.add(r),j.add(o),e.gltf.scene.traverse((e=>{e instanceof g&&e.material instanceof h&&("card"===e.name&&(e.material=U),"metal_mastercard"===e.name&&(e.material=O),e.material.envMapIntensity=3,e.material.needsUpdate=!0)})),j.add(e.gltf.scene)}),[]),s.useEffect((()=>{const e=new M,t=()=>{$.enabled&&$.update();const a=e.getElapsedTime();V.material.uniforms.uPosition.value.x=_e(Math.cos(.2*a)),V.material.uniforms.uPosition.value.y=_e(Math.cos(.2*a)),L.render(j,D),n=requestAnimationFrame(t)};let n=requestAnimationFrame(t);return()=>{cancelAnimationFrame(n)}}),[]),s.useEffect((()=>{l.current=t,"completed"!==t&&($.enabled=!1);const{getPosition:e,rotation:n}=Pe[t],a=e(c.width/c.height);T.start({duration:1500,easing:ce,to:{x:a.x,y:a.y,z:a.z},onComplete:()=>{"completed"===t&&($.enabled=!0)}}),I.start({duration:1500,easing:ce,to:{x:n.x,y:n.y,z:n.z}})}),[t]),s.useEffect((()=>{if(n){const t=new p(n,{font:e.fonts[Ee.fontName],size:Ee.size,height:0,curveSegments:6}),a=new g(t,q);return((e,{side:t,left:n,top:a})=>{e.rotation.y="front"===t?we:ye,e.position.x="front"===t?-.039:.039,e.position.y=a,e.position.z=n})(a,Ee),j.add(a),()=>{j.remove(a),t.dispose()}}}),[n]),s.useEffect((()=>{A.current&&(X.start({duration:1e3,easing:le,to:{value:"silver"===a?0:1}}),J.start({duration:1e3,easing:le,to:Ne[a]}),K.start({duration:1e3,easing:le,to:Ne[a]}))}),[a]),s.useEffect((()=>{if(r){const e=(e=>{const t=de(e),n=ue(e),{width:a,height:r}=(e=>{const t=e.width/e.height;if(t>=1){const e=1024;return{width:e,height:e/t}}{const e=256;return{width:e*t,height:e}}})(t),o=new Image(a,r);return o.src=n,o})(he(r,"white")),{width:t,height:n}=(e=>{const t=e.width/e.height;if(t>=5){const e=5;return{width:e,height:e/t}}{const e=1;return{width:e*t,height:e}}})(e),a=new f(e);a.needsUpdate=!0,H.alphaMap=a;const o=new v(t,n),s=new g(o,H),{x:i,y:l}=ze(o),c=-i/2,m=-l/2;return s.rotation.y=we,s.position.set(0,m,c),W.add(s),()=>{W.remove(s),o.dispose(),a.dispose()}}}),[r]),s.useEffect((()=>{if(!A.current)return;if(W.scale.set(o,o,o),0===W.children.length)return;const{z:t,y:n}=(e=>{const t=new k;t.setFromObject(e);const n=t.max.x-t.min.x,a=t.max.y-t.min.y,r=t.max.z-t.min.z;return new y(n,a,r)})(W);Q.running()||Q.start({duration:100,to:{opacity:1}});const a=((e,t,n,a)=>{const r=`${Math.round(10*e)}mm`,o=`${Math.round(10*t)}mm`,s=new p(o,{font:n,size:.15,height:0,curveSegments:6}),i=3.5-ze(s).x-e;s.translate(i,2.2,0);const l=new p(r,{font:n,size:.15,height:0,curveSegments:6}),c=4.2-ze(l).x-.3,m=2-t;l.translate(c,m,0);const u=w.mergeBufferGeometries([s,l]),d=new g(u,a);return d.rotation.y=we,d.position.x=-.2,d})(t,n,e.fonts.markPro,G);j.add(a);const r=setTimeout((()=>{Q.start({duration:300,to:{opacity:0},onComplete:()=>{a&&(j.remove(a),a.geometry.dispose())}})}),1e3);return()=>{j.remove(a),a.geometry.dispose(),clearTimeout(r)}}),[o]),s.useEffect((()=>{A.current=!0}),[]),s.createElement("div",{ref:i,className:pe})}));var ke={"intro.title":"Card design studio","intro.subtitle":"Customize a debit card with your logo and get a realistic 3D preview.","intro.loading":"Loading","intro.start":"Design your card","placeholders.name":"Roland Moreno","labels.name":"Card holder name","labels.selectColor":"Select a color","labels.color":"Card color","labels.silver":"Silver","labels.black":"Black","labels.logo":"Card logo","labels.logoSize":"Logo size","dropzone.text":"Drop your logo here","dropzone.fileFormat":"only SVG files are accepted","dropzone.error":"Invalid file, only SVG files are accepted","info.nameData":"We won't save this information. This preview is just for you, so you can pick any name you want!","logo.haventLogo":"Don't have a logo?","logo.useSwanLogo":"Click here to use Swan's logo","logo.help":"Having trouble with your logo?","step.next":"Next step","step.confirm":"Confirm","help.rotation":"Click + drag or 1 finger drag (on touch screen) to rotate","help.zoom":"Scroll or pinch (on touch screen) to zoom","help.gotIt":"Got it","panel.open":"Change card design","panel.title":"Card design settings","panel.close":"Close"};const Me=e=>ke[e];var Re="_base_yn011_1",Ae="_wrap_yn011_43";const Le={column:"_directionColumn_yn011_10",row:"_directionRow_yn011_7"},je={start:"_alignStart_yn011_14",center:"_alignCenter_yn011_17",end:"_alignEnd_yn011_20",stretch:"_alignStretch_yn011_23"},Fe={start:"_justifyStart_yn011_27",center:"_justifyCenter_yn011_30",end:"_justifyEnd_yn011_33","space-around":"_justifyAround_yn011_36","space-between":"_justifyBetween_yn011_39"},De=s.forwardRef((({direction:e="column",align:t="stretch",justify:n="start",wrap:a=!1,className:r,style:o,children:i},l)=>s.createElement("div",{ref:l,className:R(Re,a&&Ae,r,Le[e],je[t],Fe[n]),style:o},i)));De.displayName="Box";const Te=e=>{const[t,n]=s.useState(null);return s.useEffect((()=>{if(e.current){const t=new A((()=>{if(e.current){const{clientWidth:t,clientHeight:a}=e.current;n({width:t,height:a})}}));return t.observe(e.current),()=>{e.current&&t.unobserve(e.current),t.disconnect()}}}),[]),t};var Ie="_base_1pgs2_1",$e="_border_1pgs2_6";const Ve=({points:e,isDraw:t})=>{const n=s.useMemo((()=>(e=>e.reduce(((e,t)=>i.match(t).with({type:"M"},(({x:t,y:n})=>`${e} M${t},${n}`)).with({type:"L"},(({x:t,y:n})=>`${e} L${t},${n}`)).with({type:"C"},(({x:t,y:n,r:a})=>`${e} A${a},${a} 0 0 1 ${t},${n}`)).exhaustive()),"").trim())(e)),[e]),a=s.useMemo((()=>(e=>e.reduce(((t,n,a)=>{if(0===a)return t;const r=e[a-1];return i.match(n).with({type:"M"},(()=>t)).with({type:"L"},(({x:e,y:n})=>{const a=e-r.x,o=n-r.y,s=Math.sqrt(Math.pow(a,2)+Math.pow(o,2));return t+s})).with({type:"C"},(({r:e})=>{const n=2*Math.PI*e;return t+n/4})).exhaustive()}),0))(e)),e);return s.createElement("path",{className:$e,strokeWidth:2,strokeDasharray:a,strokeDashoffset:t?0:a,d:n})},Be=({width:e,height:t,radius:n,isDraw:a})=>{const r=s.useMemo((()=>[{type:"M",x:1+n,y:1},{type:"L",x:e-n,y:1},{type:"C",r:n,x:e,y:1+n},{type:"L",x:e,y:t-n},{type:"C",r:n,x:e-n,y:t}]),[e,t,n]),o=s.useMemo((()=>[{type:"M",x:e-n,y:t},{type:"L",x:1+n,y:t},{type:"C",r:n,x:1,y:t-n},{type:"L",x:1,y:1+n},{type:"C",r:n,x:1+n,y:1}]),[e,t,n]);return s.createElement(s.Fragment,null,s.createElement(Ve,{points:r,isDraw:a}),s.createElement(Ve,{points:o,isDraw:a}))},Ue=({targetRef:e,focused:t,offset:n,radius:a})=>{const r=Te(e);if(!r)return null;const{width:o,height:i}=r,l=o+2*n,c=i+2*n,m=l-1,u=c-1,d={top:-n,left:-n};return s.createElement("svg",{className:Ie,width:l,height:c,style:d},s.createElement(Be,{width:m,height:u,radius:a,isDraw:t}))},Oe=s.memo((({name:e,width:t,height:n=t})=>s.createElement("svg",{style:{width:t,height:n,flexShrink:0}},s.createElement("use",{xlinkHref:`#${e}`}))));Oe.displayName="Icon";const He=s.memo((({width:e=0,height:t=0})=>s.createElement("div",{style:{width:e,height:t,flexShrink:0}})));He.displayName="Space";var qe="_base_1le56_1",Ye="_rightAlign_1le56_17",Ge="_pressed_1le56_40",We="_disabled_1le56_44";const Xe={primary:"_buttonPrimary_1le56_21",secondary:"_buttonSecondary_1le56_27",empty:"_buttonEmpty_1le56_33"},Je=s.memo((e=>{const t=s.useRef(null),{focusProps:n,isFocusVisible:a}=L(),{buttonProps:r,isPressed:i}=j(o(o({},e),{elementType:"div"}),t),{children:l,isDisabled:c,iconName:m,variation:u="primary",rightAligment:d}=e;return s.createElement("div",o(o({},F(r,n)),{ref:t,className:R(qe,i&&Ge,c&&We,Xe[u],d&&Ye)}),l,!!m&&s.createElement(s.Fragment,null,s.createElement(He,{width:16}),s.createElement(Oe,{name:m,width:20})),s.createElement(Ue,{targetRef:t,focused:a,offset:5,radius:9}))}));Je.displayName="Button";const Ke=s.memo((({minWidth:e=0,minHeight:t=0})=>s.createElement("div",{style:{flex:1,minWidth:e,minHeight:t,flexShrink:0}})));Ke.displayName="Fill";var Qe="_base_1d6xn_1",Ze="_background_1d6xn_10",et="_progress_1d6xn_20",tt="_text_1d6xn_31";const nt=e=>{const{minValue:t,maxValue:n,value:a,width:r}=e,{progressBarProps:i}=D(e),l=s.useMemo((()=>oe({range:[t,n],output:[0,1]})(a)),[t,n,a]);return s.createElement("div",o(o({},i),{style:{width:r}}),s.createElement("div",{className:Qe},s.createElement("div",{className:Ze}),s.createElement("div",{className:et,style:{transform:`scaleX(${l})`}}),s.createElement("div",{className:tt},s.createElement("span",null,Me("intro.loading")),s.createElement(Ke,{minWidth:16}),s.createElement("span",null,i["aria-valuetext"]))))};var at="_container_1nn9o_1",rt="_base_1nn9o_13",ot="_title_1nn9o_21",st="_subtitle_1nn9o_30";const it=({animatedStyles:e,loadingProgress:t,onStart:n})=>{const[a,r]=s.useState(!1);return s.useEffect((()=>{if(t>=1&&a){const e=setTimeout((()=>{n()}),500);return()=>{clearTimeout(e)}}}),[t]),s.createElement(T.div,{className:at,style:e},s.createElement(De,{className:rt},s.createElement("h1",{className:ot},s.createElement(Oe,{name:"swan-logo",width:115,height:26}),s.createElement(He,{width:16,height:12}),Me("intro.title")),s.createElement(He,{height:24}),s.createElement("h2",{className:st},Me("intro.subtitle")),s.createElement(He,{height:48}),s.createElement(De,{direction:"row"},a?s.createElement(nt,{"aria-label":"Loading progress",minValue:0,maxValue:1,value:t,width:223}):s.createElement(Je,{iconName:"arrow-right-filled",onPress:()=>{t>=1?n():r(!0)}},Me("intro.start")))))};var lt="_base_19thg_1";const ct=s.memo((({children:e})=>s.createElement(De,{direction:"row",align:"center",className:lt},s.createElement(Oe,{name:"info-filled",width:20}),s.createElement(He,{width:8}),s.createElement("span",null,e))));ct.displayName="Alert";var mt="_base_somk2_1",ut="_container_somk2_12",dt="_containerWithBackground_somk2_17";const gt=({animatedStyles:e,withoutBackground:t,children:n})=>s.createElement(T.div,{className:mt,style:e},s.createElement("div",{className:R(ut,!t&&dt)},n));var ht="_base_1q9jw_1";const pt=e=>s.createElement("label",o({className:ht},e));var ft="_input_1j2u6_1";const vt=s.memo((e=>{const t=s.useRef(null),n=s.useRef(null),{labelProps:a,inputProps:r}=I(e,n),{focusProps:i,isFocusVisible:l}=L(),{label:c}=e;return s.createElement(De,null,s.createElement(pt,o({},a),c),s.createElement(He,{height:8}),s.createElement(De,{ref:t},s.createElement("input",o(o({},F(r,i)),{ref:n,className:ft})),s.createElement(Ue,{targetRef:t,focused:l,offset:2,radius:6})))}));vt.displayName="TextField";const yt=({animatedStyles:e,name:t,onChange:n,onNext:a})=>s.createElement(gt,{animatedStyles:e},s.createElement(vt,{label:Me("labels.name"),placeholder:Me("placeholders.name"),value:t,onChange:n}),s.createElement(He,{height:16}),s.createElement(ct,null,Me("info.nameData")),s.createElement(He,{height:24}),s.createElement(De,{direction:"row",justify:"end"},s.createElement(Je,{iconName:"arrow-right-filled",onPress:a},Me("step.next"))));var wt="_base_1qnz8_1",_t="_pressed_1qnz8_14",Et="_focused_1qnz8_18";const bt=s.memo((({to:e,children:t})=>{const n=s.useRef(null),{focusProps:a,isFocusVisible:r}=L(),{buttonProps:i,isPressed:l}=j({elementType:"a"},n),{hoverProps:c,isHovered:m}=$({});return s.createElement("div",null,s.createElement("a",o(o({},F(i,a,c)),{ref:n,target:"_blank",rel:"noopener noreferrer",href:e,className:R(wt,l&&_t,r&&Et,m&&Et)}),t))}));bt.displayName="Link";var xt="_group_tw686_1",Nt="_track_tw686_8",Pt="_bar_tw686_14",St="_barLeft_tw686_24",zt="_barRight_tw686_34",Ct="_thumbBase_tw686_44",kt="_thumb_tw686_44",Mt="_thumbFocused_tw686_62";const Rt=e=>{const{position:t,state:n,trackRef:a}=e,r=s.useRef(null),i=s.useRef(null),{thumbProps:l,inputProps:c}=O({index:0,trackRef:a,inputRef:i},n),{focusProps:m,isFocusVisible:u}=L();return s.createElement("div",o(o({},l),{className:Ct,style:{transform:`translateX(${t}px)`}}),s.createElement("div",{ref:r,className:R(kt,u&&Mt)},s.createElement(Ue,{targetRef:r,focused:u,offset:5,radius:15})),s.createElement(H,null,s.createElement("input",o({ref:i},F(c,m)))))},At=e=>{var t;const n=s.useRef(null),a=Te(n),r=V({style:"percent"}),i=B(o(o({},e),{numberFormatter:r})),{groupProps:l,trackProps:c,labelProps:m}=U(e,i,n),u=null!=(t=null==a?void 0:a.width)?t:0,d=oe({range:[0,1],output:[0,u-20]})(i.getThumbPercent(0)),g=Math.max(d-7,0),h=u-(d+20+7);return s.createElement("div",o(o({},l),{className:xt}),s.createElement(pt,o({},m),e.label),s.createElement("div",o(o({},c),{ref:n,className:Nt}),s.createElement("div",{className:Pt},s.createElement("div",{className:St,style:{transform:`scaleX(${g/100})`}}),s.createElement("div",{className:zt,style:{transform:`scaleX(${h/100})`}})),a&&s.createElement(Rt,{position:d,state:i,trackRef:n})))};const Lt={title:"_title_s2zbh_1",main:"_main_s2zbh_6",secondary:"_secondary_s2zbh_11"},jt=s.memo((({children:e,variation:t="main"})=>s.createElement("span",{className:Lt[t]},e)));jt.displayName="Text";var Ft="_base_1azna_1",Dt="_pressed_1azna_12",Tt="_invalid_1azna_15",It="_dragging_1azna_18",$t="_content_1azna_22",Vt="_borderSvg_1azna_27",Bt="_border_1azna_27";const Ut=({width:e,height:t})=>s.createElement("svg",{className:Vt,width:e,height:t},s.createElement("rect",{className:Bt,width:e-2,height:t-2,strokeWidth:2,x:1,y:1,rx:6,ry:6})),Ot=s.memo((({label:e,help:t,logo:n,onSvgDrop:a})=>{const r=s.useRef(null),i=Te(r),[l,c]=s.useState(!1),m=s.useMemo((()=>n?(e=>{const t=he(e,"black"),n=de(t),{width:a,height:r}=(({width:e,height:t})=>{const n=e/t;if(n>7.5){const e=300;return{width:e,height:e/n}}{const e=40;return{width:e*n,height:e}}})(n);return{width:a,height:r,src:ue(t)}})(n):void 0),[n]),{focusProps:u,isFocusVisible:d}=L(),{buttonProps:g,isPressed:h}=j({onPress:()=>{var e;const t=null==(e=r.current)?void 0:e.querySelector("input");t&&t.click()},elementType:"div"},r),{getRootProps:p,getInputProps:f,isDragActive:v,isDragReject:y}=q({multiple:!1,accept:"image/svg+xml",onDrop:([e])=>{e?(e=>new Promise(((t,n)=>{"image/svg+xml"!==e.type&&n("Bad format");const a=new FileReader;a.onload=e=>{var a;if("string"!=typeof(null==(a=e.target)?void 0:a.result))return n("No content");t(e.target.result)},a.readAsText(e)})))(e).then(me).then(a).then((()=>{c(!1)})).catch((e=>{console.error(e),c(!0)})):c(!0)}}),w=l||y;return s.createElement("div",null,s.createElement(De,{direction:"row",align:"end",justify:"space-between"},s.createElement(pt,null,e),t),s.createElement(He,{height:8}),s.createElement("div",o(o({},F(g,u,p())),{ref:r,className:R(Ft,h&&Dt,v&&!y&&It,w&&Tt)}),s.createElement("input",o({},f())),s.createElement(De,{direction:"row",align:"center",justify:"center",className:$t},l||y?s.createElement(s.Fragment,null,s.createElement(Oe,{name:"image-add-regular",width:20}),s.createElement(He,{width:12}),s.createElement(jt,{variation:"secondary"},Me("dropzone.error"))):m?s.createElement("img",o({},m)):s.createElement("div",null,s.createElement(De,{direction:"row",align:"center",justify:"center"},s.createElement(Oe,{name:"image-add-regular",width:20}),s.createElement(He,{width:12}),s.createElement(jt,{variation:"secondary"},Me("dropzone.text"))),s.createElement(He,{height:8}),s.createElement(jt,{variation:"secondary"},Me("dropzone.fileFormat")))),i&&s.createElement(Ut,{width:i.width,height:i.height}),s.createElement(Ue,{targetRef:r,focused:d,offset:0,radius:6})))}));Ot.displayName="SvgDropzone";const Ht=({animatedStyles:e,logo:t,logoScale:n,onChangeLogo:a,onChangeSize:r,onNext:o})=>{const i=s.useCallback((()=>{const e=(()=>{const e=document.createElementNS("http://www.w3.org/2000/svg","svg"),t=document.getElementById("swan-logo");if(!t)throw new Error("Swan logo symbol is missing in index.html");const n=t.getAttribute("viewBox");if(!n)throw new Error("viewBox is missing in Swan logo symbol in index.html");const[,,a,r]=n.split(" ");e.setAttribute("xmlns","http://www.w3.org/2000/svg"),e.setAttribute("width",a),e.setAttribute("height",r),e.setAttribute("viewBox",n);const o=t.children[0].cloneNode(!0);return e.appendChild(o),e})();r(.6),a(e)}),[r,a]);return s.createElement(gt,{animatedStyles:e},s.createElement(Ot,{label:Me("labels.logo"),help:s.useMemo((()=>s.createElement(De,{direction:"column",align:"end"},s.createElement(jt,{variation:"secondary"},Me("logo.haventLogo")),s.createElement(He,{height:4}),s.createElement(Je,{variation:"empty",rightAligment:!0,onPress:i},Me("logo.useSwanLogo")))),[i]),logo:t,onSvgDrop:a}),s.createElement(He,{height:16}),s.createElement(At,{minValue:0,maxValue:1,step:.01,label:Me("labels.logoSize"),value:[n],onChange:([e])=>r(e)}),s.createElement(He,{height:24}),s.createElement(De,{direction:"row",justify:"space-between",align:"center"},s.createElement(bt,{to:"https://docs.swan.io/help/faq/guidelines-card-logo"},Me("logo.help")),s.createElement(He,{width:16}),s.createElement(Je,{iconName:"arrow-right-filled",isDisabled:!t,onPress:o},Me("step.next"))))};var qt="_radioItem_mhjmy_1",Yt="_radioCircle_mhjmy_12",Gt="_radioCircleSelected_mhjmy_21",Wt="_radioLabel_mhjmy_25",Xt="_radioLabelSelected_mhjmy_30";const Jt=s.createContext({name:"",isDisabled:!1,isReadOnly:!1,lastFocusedValue:"",selectedValue:null,setLastFocusedValue:()=>{},setSelectedValue:()=>{}}),Kt=e=>{const{color:t,value:n}=e,a=s.useContext(Jt),r=a.selectedValue===n,i=s.useRef(null),l=s.useRef(null),{inputProps:c}=W(e,a,i),{focusProps:m,isFocusVisible:u}=L();return s.createElement("label",{className:qt},s.createElement(H,null,s.createElement("input",o(o({},F(c,m)),{ref:i}))),s.createElement("div",{ref:l,className:R(Yt,r&&Gt),style:{backgroundColor:t}},s.createElement(Ue,{targetRef:l,focused:u,offset:4,radius:27})),s.createElement(He,{height:8}),s.createElement("span",{className:R(Wt,r&&Xt)},e["aria-label"]))},Qt=s.memo((e=>{const{label:t,children:n}=e,a=Y(e),{radioGroupProps:r,labelProps:i}=G(e,a);return s.createElement("div",o({},r),s.createElement(pt,o({},i),t),s.createElement(He,{height:8}),s.createElement(Jt.Provider,{value:a},n))}));Qt.displayName="ColorsRadioGroup";const Zt=({animatedStyles:e,color:t,onChange:n,onNext:a})=>s.createElement(gt,{animatedStyles:e},s.createElement(De,{direction:"row",justify:"center"},s.createElement(Qt,{label:Me("labels.selectColor"),value:t,onChange:e=>n(e)},s.createElement(De,{direction:"row"},s.createElement(Kt,{"aria-label":Me("labels.silver"),color:"#c9c9c9",value:"silver"}),s.createElement(He,{width:48}),s.createElement(Kt,{"aria-label":Me("labels.black"),color:"#444444",value:"black"})))),s.createElement(He,{height:24}),s.createElement(De,{align:"center"},s.createElement(Je,{iconName:"arrow-right-filled",onPress:a},Me("step.confirm")))),en=({onClose:e})=>s.createElement("div",null,s.createElement(De,{direction:"row",align:"center"},s.createElement(Oe,{name:"cube-rotate-regular",width:40}),s.createElement(He,{width:16}),s.createElement(jt,null,Me("help.rotation"))),s.createElement(He,{height:16}),s.createElement(De,{direction:"row",align:"center"},s.createElement(Oe,{name:"zoom-in-regular",width:40}),s.createElement(He,{width:16}),s.createElement(jt,null,Me("help.zoom"))),s.createElement(He,{height:16}),s.createElement(De,{direction:"row",justify:"center"},s.createElement(Je,{onPress:e},Me("help.gotIt"))));var tn="_base_136mx_1";const nn=({opened:e,name:t,logo:n,color:a,logoScale:r,setName:o,setLogo:i,setLogoScale:l,setColor:c,onClose:m})=>{const u=X(e,{from:{translateX:"100%"},enter:{translateX:"0%"},leave:{translateX:"100%"},reverse:e}),d=s.useMemo((()=>s.createElement(De,{direction:"row"},s.createElement(Kt,{"aria-label":Me("labels.silver"),color:"#c9c9c9",value:"silver"}),s.createElement(He,{width:48}),s.createElement(Kt,{"aria-label":Me("labels.black"),color:"#444444",value:"black"}))),[]);return u(((e,u)=>u&&s.createElement(T.div,{className:tn,style:e},s.createElement(jt,{variation:"title"},Me("panel.title")),s.createElement(He,{height:32}),s.createElement(vt,{label:Me("labels.name"),placeholder:Me("placeholders.name"),value:t,onChange:o}),s.createElement(He,{height:24}),s.createElement(Ot,{label:Me("labels.logo"),logo:n,onSvgDrop:i}),s.createElement(He,{height:24}),s.createElement(At,{minValue:0,maxValue:1,step:.01,label:Me("labels.logoSize"),value:[r],onChange:([e])=>l(e)}),s.createElement(He,{height:24}),s.createElement(Qt,{label:Me("labels.color"),value:a,onChange:c},d),s.createElement(Ke,{minHeight:24}),s.createElement(De,{direction:"row",justify:"center"},s.createElement(Je,{onPress:m},Me("panel.close"))))))},an=e=>{var{animatedStyles:r}=e,i=((e,r)=>{var o={};for(var s in e)t.call(e,s)&&r.indexOf(s)<0&&(o[s]=e[s]);if(null!=e&&n)for(var s of n(e))r.indexOf(s)<0&&a.call(e,s)&&(o[s]=e[s]);return o})(e,["animatedStyles"]);const[l,c]=s.useState(!1),[m,u]=s.useState(!0),[d,g]=s.useState(!1),h=X(m,{from:{opacity:1,translateY:"100%"},enter:{opacity:1,translateY:"0%"},leave:{opacity:0,translateY:"100%"},trail:200,delay:200}),p=X(!m&&!d,{from:{scale:.1,opacity:0},enter:{scale:1,opacity:1},leave:{scale:.9,opacity:0},reverse:d,trail:200,config:J.stiff});return s.useEffect((()=>{setTimeout((()=>{c(!0)}),700)}),[]),s.createElement(s.Fragment,null,h(((e,t)=>t&&s.createElement(gt,{animatedStyles:l?e:r},s.createElement(en,{onClose:()=>u(!1)})))),p(((e,t)=>t&&s.createElement(gt,{animatedStyles:e,withoutBackground:!0},s.createElement(De,{direction:"row",align:"center",justify:"center"},s.createElement(Je,{iconName:"settings-regular",onPress:()=>g(!0)},Me("panel.open")),s.createElement(He,{width:12}),s.createElement(Je,{variation:"secondary",onPress:()=>u(!0)},"?"))))),s.createElement(nn,o(o({},i),{opened:d,onClose:()=>g(!1)})))},rn=()=>{const e=(()=>{const[e,t]=s.useState((()=>({status:"loading",progress:0,gltf:null,environmentMap:null,cardTextures:null,font:null})));return s.useEffect((()=>{const e=new te,n=new K(e),a=new Q(e),r=new Z(e),o=new ee(e),s=a.load(["environments/adams_palace_bridge/px.png","environments/adams_palace_bridge/nx.png","environments/adams_palace_bridge/py.png","environments/adams_palace_bridge/ny.png","environments/adams_palace_bridge/pz.png","environments/adams_palace_bridge/nz.png"]);s.encoding=E;const i={silver:r.load("models/card/color_silver.jpg"),black:r.load("models/card/color_black.jpg")};let l,c,m;i.black.encoding=E,i.silver.encoding=E,o.load("fonts/MaisonNeue_Book.json",(e=>{l=e})),o.load("fonts/MarkPro_Regular.json",(e=>{c=e})),n.load("models/card/card.gltf",(e=>{m=e})),e.onProgress=(e,n,a)=>{t({status:"loading",progress:n/a})},e.onError=()=>{t({status:"failed",progress:0})},e.onLoad=()=>{t({status:"complete",progress:1,gltf:m,environmentMap:s,cardTextures:i,fonts:{maisonNeue:l,markPro:c}})}}),[]),e})(),[t,n]=s.useState("intro"),[a,r]=s.useState(""),[o,l]=s.useState(null),[c,m]=s.useState(1),[u,d]=s.useState("silver"),g=e=>{r(e.substr(0,25))},h=X(t,{from:{opacity:1,translateY:"100%"},enter:{opacity:1,translateY:"0%"},leave:{opacity:0,translateY:"-100%"},trail:200}),p=s.useCallback((()=>n("name")),[]),f=s.useCallback((()=>n("logo")),[]),v=s.useCallback((()=>n("color")),[]),y=s.useCallback((()=>n("completed")),[]);return s.createElement(s.Fragment,null,h((({opacity:t,translateY:n},h)=>i.match(h).with("intro",(()=>s.createElement(it,{animatedStyles:{opacity:t},loadingProgress:e.progress,onStart:p}))).with("name",(()=>s.createElement(yt,{animatedStyles:{opacity:t,translateY:n},name:a,onChange:g,onNext:f}))).with("logo",(()=>s.createElement(Ht,{animatedStyles:{opacity:t,translateY:n},logo:o,logoScale:c,onChangeLogo:l,onChangeSize:m,onNext:v}))).with("color",(()=>s.createElement(Zt,{animatedStyles:{opacity:t,translateY:n},color:u,onChange:d,onNext:y}))).with("completed",(()=>s.createElement(an,{animatedStyles:{opacity:t,translateY:n},name:a,logo:o,logoScale:c,color:u,setName:r,setLogo:l,setLogoScale:m,setColor:d}))).exhaustive())),"complete"===e.status&&s.createElement(Ce,{assets:e,cameraPosition:t,name:a,color:u,logo:o,logoScale:c}))};ne.render(s.createElement(s.StrictMode,null,s.createElement(rn,null)),document.getElementById("app"));
