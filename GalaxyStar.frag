precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

vec2 rand(vec2 co){
    return vec2(
        fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453),
        fract(cos(dot(co.yx ,vec2(8.64947,45.097))) * 43758.5453)
    )*2.0-1.0;
}

float sdfSphere(vec2 uv, float size, float intencity){
    return pow(length(uv) * size,intencity);
}

float sdfStar(vec2 uv){
    float d = pow(length((uv.x * uv.y)),0.4);
    return pow(d + sdfSphere(uv,.5,20.),2.5);
}

float sdfWave(vec2 uv,float spd){

    vec2 uvOriginal = uv;
    float final_distance,angle = u_time * .5;

    uv *= mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
    float d0 = length(uv.x - sin(angle + uv.y * 20.) * .1);
    float d1 = length(uv.y + cos(angle - uv.x * 20.) * .21);

    float d2 = length(uv.x + sin(angle - uv.y * 20.) * .21);
    float d3 = length(uv.y - cos(angle + uv.x * 20.) * .1);

    final_distance += pow(d0 + d1 + d2 + d3,4.);
    
    final_distance *= sdfStar(uvOriginal * (2. - sin(spd) * 0.5));

    float wave = length(uv);
    wave = 0.02/wave;
    wave -= 0.125 - sin(wave + u_time) * 0.02;

    final_distance += wave;

    return final_distance;
}

vec3 palette(float t){
    vec3 a = vec3(.5,.5,.5);
    vec3 b = vec3(.5,.5,.5);
    vec3 c = vec3(1.,1.,1.);
    vec3 d = vec3(0.2, 0.5059, 0.902);
    return  a - b * cos(6.28318 - (c * t + d));
}


void main(){

    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;
    vec3 final_colour = vec3(1.);
    float spd = u_time * 1.;


    float d = sdfWave(uv,1.);
    vec3 col = palette(length(uv) - (.5 +  sin(spd * 0.5) * 0.5));
    d = 0.002/d;
    float grain = (length(rand(uv))) * (0.2/length(uv));

    final_colour = ((col * d) / grain);
 
    for (float i = 0.; i < 1.; i += 0.05){
    uv *= mat2(cos(i),-sin(i),sin(i),cos(i));

    float grainLine = length(uv.x + cos(spd  + uv.y * 5.) * .05);
    grainLine = grainLine * 2. - .5;
    grainLine = 0.075/grainLine;
    
    grainLine = pow(grainLine,.175);

    final_colour /= grainLine;

    }

    //----------
    float bg_spd = u_time * .25;
    for(int i = 0; i < 4; i ++){

        uv *= mat2(cos(.75 + bg_spd),-sin(.75 + bg_spd),sin(.75 + bg_spd),cos(.75 + bg_spd));

        uv = fract(uv * 2.) - 0.5;

        float dColour = sdfWave(uv,.5);

        dColour = pow(dColour,.15);


        final_colour /= dColour;
    }
    //----------


    gl_FragColor = vec4(final_colour ,1.);

}