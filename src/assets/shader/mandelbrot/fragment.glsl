#version 100
precision mediump float;

uniform vec2 resolution;
uniform bool zoom;
uniform float time;

const float MAX_ITER = 100.0;

float mandelbrot_sample(vec2 xy) {
    vec2 c = 2.0 * xy - vec2(0.7, 0.0);

    // time progression
    if (zoom)
        c = c / pow(time, 4.0) - vec2(0.65, 0.45);

    vec2 z = vec2(0.0, 0.0);
    for (float i = 0.0; i < MAX_ITER; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;  // square z, add c

        // check for radius 2 around the origin
        if (dot(z, z) > 4.0)
            return i / MAX_ITER;
    }

    return 0.0;
}

void main() {
    vec2 xy = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float f = mandelbrot_sample(xy);
    gl_FragColor = vec4(f, f, (5.0 * f) + 0.05, 1);  // make the glow more blue-ish
}