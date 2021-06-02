float pattern = cnoise(vUv * 2.0 + 2.0) + 0.8;
float colorPattern = 1.0 - step(uPercent * 1.4, pattern);

vec4 silverColor = texture2D(map, vUv);
vec4 blackColor = texture2D(map2, vUv);
vec4 texelColor = mix(silverColor, blackColor, colorPattern);

texelColor = mapTexelToLinear(texelColor);
diffuseColor *= texelColor;
