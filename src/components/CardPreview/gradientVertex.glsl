attribute vec4 position;
attribute vec2 uv;

varying vec2 vUv;

void main(){
  vUv = uv;
  float depth = 1.0;
  gl_Position = vec4(position.xy, depth, 1.0);
}
