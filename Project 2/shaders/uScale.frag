#ifdef GL_ES
precision highp float;
#endif

uniform float timeFactor;
uniform vec3 colour;

void main() {
		gl_FragColor =  timeFactor*vec4(colour, 1.0);
}
