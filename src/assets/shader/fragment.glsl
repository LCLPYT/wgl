#version 100
precision lowp float;

uniform vec2 resolution;

void main() {
    vec2 xy = gl_FragCoord.xy / resolution.xy;
    float f = 1.0 - distance(xy, vec2(0.5, 0.5));
    vec3 color = vec3(f, f, f);
    gl_FragColor = vec4(color, 1);
}