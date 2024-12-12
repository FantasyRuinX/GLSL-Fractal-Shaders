precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float HexagonDiamond3D(vec3 point,float size){
    point = abs(point);
    return length(max(point.yz,0.) - max(point.x,0.)) - size;
}

float sdHexPrism( vec3 p, vec2 h )
{
  const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
  p = abs(p);
  p.xy -= 2.0*min(dot(k.xy, p.xy), 0.0)*k.xy;
  vec2 d = vec2(
       length(p.xy-vec2(clamp(p.x,-k.z*h.x,k.z*h.x), h.x))*sign(p.y-h.x),
       p.z-h.y );
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float smin(float a, float b, float k){
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a , b) - h * h * h * k * (1. / 6.);
}

float map(vec3 point,float size){

    point.y -= 0.5;
    //point.z += sin(point.z + u_time);
    point.z += u_time * 0.5;

    point.xy = fract(point.xy) - 0.5;
    point.z = mod(point.z,1.) - .5;

    float dist = sdHexPrism(point,vec2(size)) * HexagonDiamond3D(point,size * 1.);
    dist = min(dist , (length(fract(point * 2.) - 0.5)- 0.12));

    return dist;
}

vec3 palette(float t){
    vec3 a = vec3(0.4824, 0.6275, 0.4824);
    vec3 b = vec3(0.5137, 0.5137, 0.5137);
    vec3 c = vec3(0.5569, 0.7529, 0.7255);
    vec3 d = vec3(0.902, 0.8314, 0.2);
    return  a + b * cos(6.5 - (c / t * d));
}

void main(){
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;
    uv -= (u_mouse / u_resolution) - .5;

    float spd = u_time * 1.;
    vec3 final_colour = vec3(1.);

    vec3 ray_dir = normalize(vec3(uv,1.));
    vec3 world_origin = vec3(0.,0.,-3.);
    float travelled = 0.;

    int i;
    for(int i = 0; i < 100; i ++){
        vec3 point = world_origin + ray_dir * travelled;
        float uvAngle = (point.z + spd) * .5;
        point.xy *= mat2(cos(uvAngle),-sin(uvAngle),sin(uvAngle),cos(-uvAngle));
        
        float dist = map(point,0.025);

        travelled += dist;
        if (dist < 0.001 || travelled > 100.) break;
    }

    final_colour = palette((travelled * 0.1) + float(i) * 0.05);

    gl_FragColor = vec4(final_colour,1.);
}