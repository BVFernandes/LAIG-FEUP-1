#ifdef GL_ES
precision highp float;
#endif


varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform float timeFactor;
uniform vec3 colour;


void main() {
	// Branching should be reduced to a minimal.
	// When based on a non-changing uniform, it is usually optimized.
	/*
	if (uUseTexture)
	{
		vec4 textureColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = textureColor * mix(vFinalColor,vec4(colour, 1.0),timeFactor);
	}
	else
		gl_FragColor = mix(vFinalColor,vec4(colour, 1.0),timeFactor);
	*/
	
	gl_FragColor = vFinalColor;
}
