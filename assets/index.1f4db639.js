import{c as s}from"./webgl.0c8613b1.js";import{S as c}from"./Scene.aa3140c1.js";import{P as a}from"./PostProcess.d4a32b13.js";import"./index.15e2cb8d.js";const t=`#version 300 es
precision mediump float;

in vec2 aVertexPosition;
in vec2 aVertexTextureCoords;

out vec2 vTextureCoords;

void main(void) {
  vTextureCoords = aVertexTextureCoords;
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}`,r=`#version 300 es
precision mediump float;

uniform float uTime;
uniform vec2 uInverseTextureSize;

out vec4 fragColor;

// ro is the ray origin
// rd is the ray direction
// s is the sphere
float sphereIntersection(vec3 ro, vec3 rd, vec4 s) {
    // Transform the ray into object space
    vec3 oro = ro - s.xyz;

    float a = dot(rd, rd);
    float b = 2.0 * dot(oro, rd);
    // w is the sphere radius
    float c = dot(oro, oro) - s.w * s.w;

    float d = b * b - 4.0 * a * c;

    // No intersection
    if (d < 0.0) return d;

    return (-b - sqrt(d)) / 2.0;
}

vec3 sphereNormaml(vec3 pt, vec4 s) {
    return (pt - s.xyz) / s.w;
}

vec3 lightDirection = normalize(vec3(0.5));
vec3 eyePos = vec3(0.0, 1.0, 4.0);
vec3 backgroundColor = vec3(0.2);
vec3 ambient = vec3(0.05, 0.1, 0.1);

vec4 sphere = vec4(1.0);
vec3 sphereColor = vec3(0.9, 0.8, 0.6);
float maxDistance = 1024.0;

float intersect(vec3 ro, vec3 rd, out vec3 norm, out vec3 color) {
    float distance = maxDistance;

    // If we wanted multiple objects in the scene you would loop through them here
    // and return the normal and color with the closest intersection point (lowest distance).
    float intersectionDistance = sphereIntersection(ro, rd, sphere);

    if (intersectionDistance > 0.0 && intersectionDistance < distance) {
        distance = intersectionDistance;
        // Point of intersection
        vec3 pt = ro + distance * rd;
        // Get normal for that point
        norm = sphereNormaml(pt, sphere);
        // Get color for the sphere
        color = sphereColor;
    }

    return distance;
}


void main(void) {
    // Wiggle the sphere back and forth a bit
    sphere.x = 1.5 * sin(uTime);
    sphere.z = 0.5 * cos(uTime * 3.0);

    // Pixel coordinate of the fragment being rendered
    vec2 uv = gl_FragCoord.xy * uInverseTextureSize;
    float aspectRatio = uInverseTextureSize.y / uInverseTextureSize.x;

    // Cast a ray out from the eye position into the scene
    vec3 ro = eyePos;

    // The ray we cast is tilted slightly downward to give a better view of the scene
    vec3 rd = normalize(vec3(-0.5 + uv * vec2(aspectRatio, 1.0), -1.0));

    // Default color if we don't intersect with anything
    vec3 rayColor = backgroundColor;

    // See if the ray intersects with any objects.
    // Provides the normal of the nearest intersection point and color
    vec3 objectNormal, objectColor;
    float t = intersect(ro, rd, objectNormal, objectColor);

    if (t < maxDistance) {
        // Diffuse factor
        float diffuse = clamp(dot(objectNormal, lightDirection), 0.0, 1.0);
        rayColor = objectColor * diffuse + ambient;
    }

    fragColor = vec4(rayColor, 1.0);
}`,f=async e=>{e.clearColor(.2,.2,.2,1),e.clearDepth(100),e.enable(e.DEPTH_TEST),e.depthFunc(e.LESS),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);const i=s(e,t,r,[],[]),n=new c(e,i),o=new a(e,t,r);return n.start(()=>{o.draw()}),()=>{n.dispose(),o.dispose()}};export{f as init};
