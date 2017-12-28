#ifdef GL_ES
precision highp float;
#endif


varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform vec3 colour;


void main() {
	// Branching should be reduced to a minimal.
	// When based on a non-changing uniform, it is usually optimized.

	if (uUseTexture)
	{
		vec4 textureColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = textureColor * vFinalColor*vec4(0.5,0.5,1, 1.0);
	}
	else
		gl_FragColor = vFinalColor*vec4(0.5,0.5,1, 1.0);

}
