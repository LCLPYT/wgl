#version 100
attribute vec3 coordinates;

void main() {
    gl_Position = vec4(coordinates, 1);
}