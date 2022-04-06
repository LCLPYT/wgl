export function resizeCanvas(canvas: HTMLCanvasElement) {
    const clientRect = canvas.getBoundingClientRect();
    canvas.width = clientRect.width;
    canvas.height = clientRect.height;
}

export function createWebGL2Context(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    return gl;
}

export function createShaderProgram(gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) {
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

    return shaderProgram;
}