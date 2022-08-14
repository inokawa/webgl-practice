#version 300 es
precision mediump float;

// Expect the interpolated value from the vertex shader
in vec4 vVertexColor;

// Return the final color as fragColor
out vec4 fragColor;

void main(void)  {
    // Simply set the value passed in from the vertex shader
    fragColor = vVertexColor;
}