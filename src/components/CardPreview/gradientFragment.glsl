precision mediump float;

uniform float uRatio;
uniform vec2 uPosition;

varying vec2 vUv;

void main(){
  float gradientOffset = 1.0;

  vec3 background = vec3(0.976, 0.976, 0.980);
  vec4 color1 = vec4(0.506, 0.4, 0.769, 1.0);
  vec4 color2 = vec4(0.961, 0.6, 0.286, 0.5);

  vec2 diagonalUv = vec2(
    smoothstep(uPosition.x - gradientOffset, uPosition.x + gradientOffset, vUv.x),
    smoothstep(uPosition.y - gradientOffset, uPosition.y + gradientOffset, vUv.y)
  );
  float diagonal = smoothstep(0.0, 2.0, diagonalUv.y * 2.0 + 1.0 - diagonalUv.x * 2.0);
  vec4 color = mix(color1, color2, diagonal);

  float xOffset = 0.5 - 0.5 * uRatio;
  vec2 squareUv = vec2(vUv.x * uRatio + xOffset, vUv.y);
  float alpha = 1.0 - distance(uPosition, squareUv) * 0.8 - 0.5;

  gl_FragColor = vec4(mix(background, color.rgb, color.a * alpha), 1.0);
}
