import vertexShader from "@/assets/shader/mandelbrot/vertex.glsl?raw";
import fragmentShader from "@/assets/shader/mandelbrot/fragment.glsl?raw";
import {createShaderProgram, createWebGL2Context, resizeCanvas} from "@/render/gl";

const vertices = [
    1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0,
    -1.0,  1.0, 0.0
];
const indices = [0, 1, 2, 2, 3, 0];
const zoom = false;

function updateViewport(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, resLoc: WebGLUniformLocation) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2fv(resLoc, new Float32Array([canvas.width, canvas.height]));
}

export function setupMandelbrotScene(canvas: HTMLCanvasElement) {
    resizeCanvas(canvas);

    const gl = createWebGL2Context(canvas);
    if (!gl) {
        console.error("Could not create WebGL2 context");
        return;
    }

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    if (!shaderProgram) {
        console.error("Could not create shader program");
        return;
    }

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const coordinates = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinates);

    const resLoc = gl.getUniformLocation(shaderProgram, "resolution");
    if (!resLoc) {
        console.error("Could not find resLoc uniform");
        return;
    }

    const zoomLoc = gl.getUniformLocation(shaderProgram, "zoom");
    gl.uniform1i(zoomLoc, zoom ? 1 : 0);

    const timeLoc = gl.getUniformLocation(shaderProgram, "time");

    updateViewport(gl, canvas, resLoc);

    gl.clearColor(0, 0, 0, 1);

    animationStart = performance.now();
    render(gl, timeLoc ? time => gl.uniform1f(timeLoc, time / 1000 * 0.5) : undefined);

    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
        updateViewport(gl, canvas, resLoc);
    });
}

let animationStart: DOMHighResTimeStamp = 0;

export function render(gl: WebGL2RenderingContext, timeCallback?: (time: number) => void) {
    requestAnimationFrame(now => {
        const time = now - animationStart;
        if (timeCallback) timeCallback(time);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        render(gl, timeCallback);
    });
}