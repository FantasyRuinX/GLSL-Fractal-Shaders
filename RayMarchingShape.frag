precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;


float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 q = abs(p) - b + r;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0) - r;
}

float smin(float a, float b, float k){
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a , b) - h * h * h * k * (1. / 6.);
}

float map(vec3 point,float size){

    vec3 pointOriginal = point;
    float square,border0,border1;
    float angle;
    
    angle = (u_time * .5);

    point.xy *= mat2(cos(angle),sin(angle),-sin(angle),cos(angle));

    square = sdRoundBox(point,vec3(size + .025),0.1);

    border0 = length(vec3(
    pointOriginal.x * .2,
    pointOriginal.y * .2,
    pointOriginal.z * 1.)) - 0.31;
    border0 += (0.3/length(pointOriginal) - 0.18);

    pointOriginal.yx *= mat2(cos(angle),sin(angle),-sin(angle),cos(angle));

    border1 = sdRoundBox(vec3(
    pointOriginal.x * .15,
    pointOriginal.y * .15,
    pointOriginal.z * 1.),vec3(size + .025),0.1);
    border1 += (0.3/length(pointOriginal));

    return smin(border1,smin(square,border0,.85),.02);
}

vec3 getNormal(vec3 p, float size) {
    float eps = 0.01;
    float d = map(p, size);
    vec3 normal;
    normal.x = map(p + vec3(eps, 0., 0.), size) - d;
    normal.y = map(p + vec3(0., eps, 0.), size) - d;
    normal.z = map(p + vec3(0., 0., eps), size) - d;
    return normalize(normal);
}

vec3 lighting(vec3 p, vec3 normal, vec3 lightPos, vec3 viewPos) {

    vec3 lightDir = normalize(lightPos - p);
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 viewDir = normalize(viewPos - p);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

    vec3 ambient = 0.25 * vec3(0.2627, 0.702, 0.7608);

    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);
    vec3 specular = spec * vec3(1.0, 1.0, 1.0);

    return ambient + diffuse + specular;
}

void main(){

    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution) / u_resolution.y;
    vec3 colour,normal;

    //Ray marching
    vec3 ray_dir = normalize(vec3(uv,1.));
    vec3 world_origin = vec3(0.,0.,-3.);
    float travelled = 0.;
    float size = 0.345;

    //vec3 lightPos = vec3(sin(u_time) * 3.0, 2.0, cos(u_time) * 3.0);  // Moving light source
    vec3 lightPos = vec3(0.,2.,-3.);  // Moving light source


    for (int i = 0; i < 100; i++){
        vec3 point = world_origin + ray_dir * travelled;

        float dist = map(point,size);

        normal = getNormal(point, size);
        colour = lighting(point, normal, lightPos, world_origin);

        travelled += dist;
        if (dist < 0.001 || travelled > 100.) break;
    }
            
    gl_FragColor = vec4(colour, 1.);
}