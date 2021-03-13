Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 rayDir;

  uniform struct {
  	samplerCube envTexture;
  	float freq;
    float noiseFreq;
    float noiseExp;
    float noiseAmp;
  } material;

  uniform struct {
    mat4 viewProjMatrix;  
    mat4 rayDirMatrix;
    vec3 position;
  } camera;

  uniform struct {
    vec4 position;
    vec3 powerDensity;
  } lights[8];

  uniform struct {
  	mat4 surface;
  	mat4 clipper;
  	mat4 clipper2;
  	vec3 reflectance;
  	float intensity;
  	float type;
  	float shininess;
    vec3 specularColor;
    vec4 solidColor;
  } clippedQuadrics[16];

  vec3 shadeDiffuse(vec3 normal, vec3 lightDir, vec3 viewDir, vec3 powerDensity, vec3 materialColor) {
    float cosa = clamp( dot(lightDir, normal), 0.0, 1.0);
    return powerDensity * materialColor * cosa;
  }

  vec3 shadePhongBlinn(vec3 normal, vec3 lightDir, vec3 viewDir, vec3 powerDensity, vec3 materialColor, vec3 specularColor, float shininess) {
    float cosa = clamp( dot(lightDir, normal), 0.0, 1.0);
    float cosb = clamp(dot(viewDir, normal), 0.0, 1.0);
    vec3 halfway = normalize(viewDir + lightDir);
    float cosDelta = clamp(dot(halfway, normal), 0.0, 1.0);
    //if (isSpot>0.0){
    //  float cosas = clamp( dot(lightDir, -spotDir),0.0,1.0);
    //  if (cosas<=cutOff){
    //    return vec3(0,0,0);
    // }
    //}
    return powerDensity * materialColor * cosa + powerDensity * specularColor * pow(cosDelta, shininess) * cosa / max(cosb, cosa);
  }

  float intersectClippedQuadric(mat4 A, mat4 B, mat4 C, vec4 e, vec4 d){
  	float a = dot(d * A, d);
  	float b = dot(d * A, e) + dot(e * A, d);
  	float c = dot(e * A, e);
  	float dis = b*b-4.0*a*c;
  	if (dis<0.0){
  		return -1.0;
  	}
  	float t1 = (-b + sqrt(dis)) / (2.0*a);
  	float t2 = (-b - sqrt(dis)) / (2.0*a);

  	vec4 r1 = e+d*t1;
  	vec4 r2 = e+d*t2;

  	if (dot(r1*B, r1)>0.0){
  		t1 = -1.0;
  	}

  	if (dot(r1*C, r1)>0.0){
  		t1 = -1.0;
  	}

  	if (dot(r2*B, r2)>0.0){
  		t2 = -1.0;
  	}

  	if (dot(r2*C, r2)>0.0){
  		t2 = -1.0;
  	}
  	return (t1<0.0)?t2:((t2<0.0)?t1:min(t1, t2));
  }

  bool findBestHit(vec4 e,vec4 d, out float bestT, out int bestIndex){
  	bestT = 999.9;
 	bool intersected = false;
  	for (int i=0; i<16; i++){
  		float t = intersectClippedQuadric(clippedQuadrics[i].surface,clippedQuadrics[i].clipper,clippedQuadrics[i].clipper2, e,d);
  		if (t<bestT && t>0.0){
  			bestT = t;
  			bestIndex = i; 
  		}
  	}
  	if (bestT<999.9){
  		return true;
  	}
  	return false;
  }

  float snoise(vec3 r) {
    vec3 s = vec3(7502, 22777, 4767);
    float f = 0.0;
    for(int i=0; i<16; i++) {
      f += sin( dot(s - vec3(32768, 32768, 32768), r)
                                   / 65536.0);
      s = mod(s, 32768.0) * 2.0 + floor(s / 32768.0);
    }
    return f / 32.0 + 0.5;
  }

  vec4 checkboard(vec4 hit){
    float size = 3.5;
  	float result = mod(floor(hit.x/size)+floor(hit.z/size), 2.0);
  	return vec4(result,result,result,1);
  }

  vec4 wood(vec4 hit){
  	vec4 lightWoodColor = vec4(0.871, 0.722, 0.529, 1.0);
	vec4 darkWoodColor = vec4(0.545, 0.271, 0.075, 1.0);
	float a = fract( hit.x * material.freq + pow(snoise(hit.xyz * material.noiseFreq),material.noiseExp) * material.noiseAmp);
	return mix(lightWoodColor, darkWoodColor, a);
  }

  void main(void) {
  	vec4 e = vec4(camera.position, 1);		 //< ray origin
  	vec4 d = vec4(normalize(rayDir).xyz, 0); //< ray direction
  	vec3 w = vec3(1, 1, 1); 

  	for(int i=0;i<9999999;i++){
  		if (length(w)<0.01){ // break condition
  			break;
  		}
  		float bestT = 999.9;
		int bestIndex = 0;
		bool result = findBestHit(e,d,bestT,bestIndex);
		if (!result){
			// reflect background
			fragmentColor.rgb += texture(material.envTexture, d.xyz ).rgb * w;
			w = vec3(0,0,0);
		} else{
			vec4 hit = e + d * bestT;
			vec3 normal = normalize( (hit * clippedQuadrics[bestIndex].surface + clippedQuadrics[bestIndex].surface * hit).xyz );
			if( dot(normal, d.xyz) > 0.0 ) normal = -normal;
			vec3 viewDir = -d.xyz;

			float type = clippedQuadrics[bestIndex].type;
			vec4 color;
			if (type==0.0){
				color = checkboard(hit);
			} else if (type==1.0){
				color = wood(hit);
			} else if (type==2.0){
				color = clippedQuadrics[bestIndex].solidColor;
			} else{
				color = vec4(normal,1);
			}

			for(int i=0;i<7;i++) {
				vec3 lightDiff = lights[i].position.xyz - hit.xyz * lights[i].position.w;
				vec3 lightDir = normalize(lightDiff);
				float distanceSquared = dot(lightDiff,lightDiff);
				vec3 powerDensity = lights[i].powerDensity / distanceSquared;
				vec4 origin = vec4(hit.xyz+normal*0.001,1);
				vec4 direction = vec4(lightDir, 0);
				float bestShadowT = 999.9;
				int bestShadowIndex = 0;

				bool shadowRayHitSomething = findBestHit(origin,direction,bestShadowT,bestShadowIndex);

				// if not blocked
				if( !shadowRayHitSomething || bestShadowT * lights[i].position.w > sqrt(dot(lightDiff, lightDiff)) ){
	 				fragmentColor.rgb += shadePhongBlinn(normal, lightDir, viewDir, powerDensity, color.rgb, clippedQuadrics[bestIndex].specularColor, clippedQuadrics[bestIndex].shininess) * w;
				}
			}
			e = vec4(hit.xyz+normal*0.01, 1); 
			d = vec4( normalize( d.xyz - 2.0 * dot(d.xyz,normal ) * normal ), 0 );
			w *= clippedQuadrics[bestIndex].reflectance*clippedQuadrics[bestIndex].intensity;
			//vec4 ndcHit = hit * camera.viewProjMatrix;
			//gl_FragDepth = ndcHit.z / ndcHit.w * 0.5 + 0.5;
		}
  	}
  }
`;