precision mediump float;

uniform float u_time;
uniform vec2 u_resolution,u_mouse;

float sdfSphere(vec2 uv, float size, float intencity){
    return pow(length(uv) * size,intencity);
}

float sdfStar(vec2 uv){
    float d = pow(length(uv.x * uv.y),0.4);
    return pow(d + sdfSphere(uv,2.,2.),1.25);
}

float sdfHexagon(vec2 uv){
    return (length(uv.y - uv.x) + length(uv.y + uv.x) + length( uv.x));
}

vec3 palette(float t){
    vec3 a = vec3(.5,.5,.5);
    vec3 b = vec3(.5,.5,.5);
    vec3 c = vec3(1.,1.,1.);
    vec3 d = vec3(0.1725, 0.5725, 0.8);
    return a - b * cos(6.28318 - (c * t + d));
}

void main(){
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;
    vec2 uvMouse = uv;
    vec3 final_colour = vec3(1.);
    float d0,d1;
    float spd = u_time * 1.;

    uv *= mat2(cos(.8),-sin(.8),sin(.8),cos(.8));

    //Hexagon follow mouse
    uvMouse = (gl_FragCoord.xy / u_resolution) - .5;

    d1 = sdfHexagon(uvMouse);

    d1 = sin(d1 * 4. - spd);

    vec3 col1 = palette(d1 + sin(u_time));

    //Square bg
    for(float i = 0.; i < 5.; i ++){
        uv = fract(uv * 1.1) - .5;

        uv *= (1. + sin(spd) * 0.2);

        d0 = sdfStar(uv);
        d0 = sin(d0 * 5. + spd) / 2.;
    
        vec3 col0 = palette(d0);
        float final_alpha = pow(d0 + d1,-2.);
        final_colour = ((col0 * col1) * final_alpha);
    }
    

    gl_FragColor = vec4(final_colour,1.);

}