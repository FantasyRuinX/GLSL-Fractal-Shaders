precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec3 palette(float t){
    vec3 a = vec3(.5,.75,.75);
    vec3 b = vec3(.5,.5,.5);
    vec3 c = vec3(1.,1.,1.);
    vec3 d = vec3(0.1725, 0.5725, 0.8);//vec3(0.263,0.416,0.557);
    return a - b - b * cos(6.28318 - (c * t + d));
}

float sdfSphere(vec2 uv){
    return length(uv);
}

float sdfSquare(vec2 uv, float size){
    return length(max(abs(uv) - 1. * size, 0.));
}

void main() {

    vec2 uv0 = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;
    vec2 uv1 = uv0;

    float uvAngle = u_time * 0.28318;
    float d0,d1,dColour;
    float spd = u_time * 1.;
    vec3 final_colour = vec3(1.);
    

    for(int i = 0; i < 4; i ++){

        uv0 *= mat2(cos(.8),-sin(.8),sin(.8),cos(.8));
        uv1 *= mat2(cos(uvAngle),-sin(uvAngle),sin(uvAngle),cos(-uvAngle));
    
        uv0 = fract(uv0 * (length(u_mouse) * 0.001)) - .5;//1.5) - .5;

        d0 = sdfSquare(uv0,.1);
        d1 = sdfSquare(uv1,.2);
        dColour = sdfSphere(uv1);

        d0 = abs(sin(d0 * 8. + spd) / 8.);
        d0 = (.05/d0);
        d1 = abs(sin(d1 * 8. + spd) / 8.);
        d1 = (.01/d1);
        dColour = abs(sin(dColour * 2. + (spd)) * 2.);

        vec3 col = palette(dColour);
        vec3 col0 = col * d0;

        final_colour = (col0 + final_colour * d1);
    }

    gl_FragColor = vec4(final_colour,1.);
}