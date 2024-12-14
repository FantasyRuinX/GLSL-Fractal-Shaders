precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


float sdfMap(vec2 uv){

    float square = length(max(abs(uv) - 1. * .25, 0.));

    return min(square,length(uv) - 0.3);
}

vec2 getNormal(vec2 uv){

    float eps = 0.01;
    float d = sdfMap(uv);
    vec2 normal;

    normal.x = sdfMap(uv + vec2(eps,0.)) - d;
    normal.y = sdfMap(uv + vec2(0.,eps)) - d;
    
    return normalize(normal);
}

vec3 lightingDiffuse(vec2 p, vec2 normal, vec2 lightPos) {

    vec2 lightDir = normalize(lightPos - p);
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 diffuse = diff * vec3(1.0, 1.0,1.0);

    return diffuse;
}

void main(){
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;

    float d;
    vec2 normal;
    vec3 colour;
    
    d += 0.01/abs(sdfMap(uv));
    normal += getNormal(uv);

    colour += lightingDiffuse(uv, normal, vec2(
    sin(u_time) * 0.75,
    cos(u_time) * 0.75));

    gl_FragColor = vec4(colour * d, 1.0);


}