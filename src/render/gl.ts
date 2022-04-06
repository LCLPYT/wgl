import vertexShader from "@/assets/shader/vertex.glsl?raw";
import fragmentShader from "@/assets/shader/fragment.glsl?raw";

export function setupCanvas(canvas: HTMLCanvasElement) {
    const clientRect = canvas.getBoundingClientRect();
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;

    const gl = canvas.getContext("webgl2");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    const vertices = [
        1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0
    ];
    const indices = [0, 1, 2, 2, 3, 0];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertShader) {
        console.error("Could not create vertex shader");
        return;
    }
    gl.shaderSource(vertShader, vertexShader);
    gl.compileShader(vertShader);

    const vertexShaderCompiled = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
    if (vertexShaderCompiled !== true) {
        const compilationLog = gl.getShaderInfoLog(vertShader);
        console.error('Could not compile vertex shader:', compilationLog);
        return;
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragShader) {
        console.error("Could not create fragment shader");
        return;
    }
    gl.shaderSource(fragShader, fragmentShader);
    gl.compileShader(fragShader);

    const fragmentShaderCompiled = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
    if (fragmentShaderCompiled !== true) {
        const compilationLog = gl.getShaderInfoLog(fragShader);
        console.error('Could not compile fragment shader:', compilationLog);
        return;
    }

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) {
        console.error("Could not create program");
        return;
    }

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const coordinates = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coordinates, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinates);

    const resLoc = gl.getUniformLocation(shaderProgram, "resolution");
    gl.uniform2fv(resLoc, new Float32Array([canvas.width, canvas.height]));

    // actually draw triangle
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(coordinates);
}