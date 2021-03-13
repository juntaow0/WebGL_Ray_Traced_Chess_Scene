"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];

    this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad-vs.glsl");    
    this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace-fs.glsl");
    this.programs.push( 
    	this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.traceMaterial = new Material(this.traceProgram);
    this.envTexture = new TextureCube(gl, [
      "media/posx512.jpg",
      "media/negx512.jpg",
      "media/posy512.jpg",
      "media/negy512.jpg",
      "media/posz512.jpg",
      "media/negz512.jpg",]
      );
    this.traceMaterial.envTexture.set(this.envTexture);
    this.traceMaterial.freq = 6;
    this.traceMaterial.noiseFreq = 8;
    this.traceMaterial.noiseExp = -1.1;
    this.traceMaterial.noiseAmp = 4;
    this.traceMesh = new Mesh(this.traceMaterial, this.texturedQuadGeometry);

    this.traceQuad = new GameObject(this.traceMesh);

    this.clippedQuadrics = [];
    for (let i=0; i<16;i++){
      this.clippedQuadrics.push(
      new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
    }

    this.clippedQuadrics[0].type = 2;
    this.clippedQuadrics[0].solidColor.set(0.2,0.2,0.2,1);
    this.clippedQuadrics[0].shininess = 25;
    this.clippedQuadrics[0].specularColor.set(0.8,0.8,0.8);
    this.clippedQuadrics[0].makeUnitCone();
    this.clippedQuadrics[0].scale.set(1,3.5,1);
    this.clippedQuadrics[0].cscale.set(1,2,1);
    this.clippedQuadrics[0].position.set(-5.2,6,1.7);
    this.clippedQuadrics[0].cposition.set(-5.2,3,1.7);
    this.clippedQuadrics[0].cposition2.set(-5.2,3,1.7);
    this.clippedQuadrics[0].update();

    this.clippedQuadrics[1].type = 2;
    this.clippedQuadrics[1].solidColor.set(0.2,0.2,0.2,1);
    this.clippedQuadrics[1].shininess = 25;
    this.clippedQuadrics[1].specularColor.set(0.8,0.8,0.8);
    this.clippedQuadrics[1].makeUnitSphere();
    this.clippedQuadrics[1].position.set(-5.2,5.4,1.7);
    this.clippedQuadrics[1].cposition.set(-5.2,5.4,1.7);
    this.clippedQuadrics[1].cposition2.set(-5.2,5.4,1.7);
    this.clippedQuadrics[1].update();

    this.clippedQuadrics[2].type = 2;
    this.clippedQuadrics[2].solidColor.set(0,0,0,1);
    this.clippedQuadrics[2].makeUnitCone();
    this.clippedQuadrics[2].scale.set(1,3.5,1);
    this.clippedQuadrics[2].cscale.set(1,2,1);
    this.clippedQuadrics[2].position.set(5.2,6,1.7);
    this.clippedQuadrics[2].cposition.set(5.2,3,1.7);
    this.clippedQuadrics[2].cposition2.set(5.2,3,1.7);
    this.clippedQuadrics[2].reflectance.set(1, 1, 1);
    this.clippedQuadrics[2].intensity = 1;
    this.clippedQuadrics[2].shininess = 20;
    this.clippedQuadrics[2].specularColor.set(1,1,1);
    this.clippedQuadrics[2].update();
    
    this.clippedQuadrics[3].type = 0;
    this.clippedQuadrics[3].makeDoublePlane();
    this.clippedQuadrics[3].reflectance.set(1, 1, 1);
    this.clippedQuadrics[3].intensity = 0.3;
    this.clippedQuadrics[3].cscale.set(14,14,14);
    this.clippedQuadrics[3].cscale2.set(14,14,14);
    this.clippedQuadrics[3].update();

    this.clippedQuadrics[4].type = 1;
    this.clippedQuadrics[4].makeDoublePlane();
    this.clippedQuadrics[4].pitch = Math.PI/2;
    this.clippedQuadrics[4].cpitch = Math.PI/2;
    this.clippedQuadrics[4].cpitch2 = Math.PI/2;
    this.clippedQuadrics[4].scale.set(1,13.99999,1);
    this.clippedQuadrics[4].cscale.set(14,14,14);
    this.clippedQuadrics[4].reflectance.set(0.545, 0.271, 0.075);
    this.clippedQuadrics[4].intensity = 0.3;
    this.clippedQuadrics[4].shininess = 20;
    this.clippedQuadrics[4].specularColor.set(0.92, 0.722, 0.529);
    this.clippedQuadrics[4].update();

    this.clippedQuadrics[5].type = 1;
    this.clippedQuadrics[5].makeDoublePlane();
    this.clippedQuadrics[5].roll = Math.PI/2;
    this.clippedQuadrics[5].croll = Math.PI/2;
    this.clippedQuadrics[5].croll2 = Math.PI/2;
    this.clippedQuadrics[5].scale.set(1,13.99999,1);
    this.clippedQuadrics[5].cscale2.set(14,14,14);
    this.clippedQuadrics[5].reflectance.set(0.545, 0.271, 0.075);
    this.clippedQuadrics[5].intensity = 0.3;
    this.clippedQuadrics[5].shininess = 20;
    this.clippedQuadrics[5].specularColor.set(0.92, 0.722, 0.529);
    this.clippedQuadrics[5].update();

    this.clippedQuadrics[6].type = 2;
    this.clippedQuadrics[6].solidColor.set(0,0,0,1);
    this.clippedQuadrics[6].makeRing();
    this.clippedQuadrics[6].scale.set(1,1.3,1);
    this.clippedQuadrics[6].position.set(5.2,5.6,1.7);
    this.clippedQuadrics[6].cposition.set(5.2,5.6,1.7);
    this.clippedQuadrics[6].cposition2.set(5.2,5.6,1.7);
    this.clippedQuadrics[6].reflectance.set(1, 1, 1);
    this.clippedQuadrics[6].intensity = 1;
    this.clippedQuadrics[6].shininess = 40;
    this.clippedQuadrics[6].specularColor.set(1,1,1);
    this.clippedQuadrics[6].update();

    this.clippedQuadrics[7].type = 2;
    this.clippedQuadrics[7].solidColor.set(0,0,0,1);
    this.clippedQuadrics[7].makeUnitCylinder();
    this.clippedQuadrics[7].scale.set(0.317,0.412,1);
    this.clippedQuadrics[7].position.set(5.2,5.6,1.7);
    this.clippedQuadrics[7].cposition.set(5.2,5.6,1.7);
    this.clippedQuadrics[7].cposition2.set(5.2,5.6,1.7);
    this.clippedQuadrics[7].cscale.set(1,1,0.95);
    this.clippedQuadrics[7].reflectance.set(1, 1, 1);
    this.clippedQuadrics[7].intensity = 1;
    this.clippedQuadrics[7].shininess = 40;
    this.clippedQuadrics[7].specularColor.set(1,1,1);
    this.clippedQuadrics[7].update();

    this.clippedQuadrics[8].type = 1;
    this.clippedQuadrics[8].shininess = 20;
    this.clippedQuadrics[8].specularColor.set(0.92, 0.722, 0.529);
    this.clippedQuadrics[8].makeUnitCone();
    this.clippedQuadrics[8].scale.set(1,3.5,1);
    this.clippedQuadrics[8].cscale.set(1,2,1);
    this.clippedQuadrics[8].position.set(-1.7,6,8.7);
    this.clippedQuadrics[8].cposition.set(-1.7,3,8.7);
    this.clippedQuadrics[8].cposition2.set(-1.7,3,8.7);
    this.clippedQuadrics[8].reflectance.set(0.545, 0.271, 0.075);
    this.clippedQuadrics[8].intensity = 0.3;
    this.clippedQuadrics[8].update();

    this.clippedQuadrics[9].type = 1;
    this.clippedQuadrics[9].shininess = 30;
    this.clippedQuadrics[9].specularColor.set(0.92, 0.722, 0.529);
    this.clippedQuadrics[9].makeParaboloid();
    this.clippedQuadrics[9].scale.set(0.8,0.6,0.8);
    this.clippedQuadrics[9].cscale.set(1,0.55,1);
    this.clippedQuadrics[9].position.set(-1.7,6.3,8.7);
    this.clippedQuadrics[9].cposition.set(-1.7,6.6,8.7);
    this.clippedQuadrics[9].cposition2.set(-1.7,6.5,8.7);
    this.clippedQuadrics[9].reflectance.set(0.545, 0.271, 0.075);
    this.clippedQuadrics[9].intensity = 0.3;
    this.clippedQuadrics[9].update();

    this.clippedQuadrics[10].type = 1;
    this.clippedQuadrics[10].shininess = 40;
    this.clippedQuadrics[10].specularColor.set(0.92, 0.722, 0.529);
    this.clippedQuadrics[10].makeUnitSphere();
    this.clippedQuadrics[10].position.set(-1.7,5.4,8.7);
    this.clippedQuadrics[10].cposition.set(-1.7,5.4,8.7);
    this.clippedQuadrics[10].cposition2.set(-1.7,5.4,8.7);
    this.clippedQuadrics[10].reflectance.set(0.545, 0.271, 0.075);
    this.clippedQuadrics[10].intensity = 0.3;
    this.clippedQuadrics[10].update();

    this.clippedQuadrics[11].type = 2;
    this.clippedQuadrics[11].solidColor.set(0.2,0.2,0.2,1);
    this.clippedQuadrics[11].shininess = 25;
    this.clippedQuadrics[11].specularColor.set(0.8,0.8,0.8);
    this.clippedQuadrics[11].makeUnitCone();
    this.clippedQuadrics[11].scale.set(1,3.5,1);
    this.clippedQuadrics[11].cscale.set(1,2,1);
    this.clippedQuadrics[11].position.set(-8.7,6,8.7);
    this.clippedQuadrics[11].cposition.set(-8.7,3,8.7);
    this.clippedQuadrics[11].cposition2.set(-8.7,3,8.7);
    this.clippedQuadrics[11].update();

    this.clippedQuadrics[12].type = 2;
    this.clippedQuadrics[12].solidColor.set(0.2,0.2,0.2,1);
    this.clippedQuadrics[12].shininess = 25;
    this.clippedQuadrics[12].specularColor.set(0.8,0.8,0.8);
    this.clippedQuadrics[12].makeUnitSphere();
    this.clippedQuadrics[12].position.set(-8.7,5.4,8.7);
    this.clippedQuadrics[12].cposition.set(-8.7,5.4,8.7);
    this.clippedQuadrics[12].cposition2.set(-8.7,5.4,8.7);
    this.clippedQuadrics[12].update();

    this.clippedQuadrics[13].type = 2;
    this.clippedQuadrics[13].solidColor.set(0,0,0,1);
    this.clippedQuadrics[13].makeUnitCone();
    this.clippedQuadrics[13].scale.set(1,3.5,1);
    this.clippedQuadrics[13].cscale.set(1,2,1);
    this.clippedQuadrics[13].position.set(-1.7,6,-12.3);
    this.clippedQuadrics[13].cposition.set(-1.7,3,-12.3);
    this.clippedQuadrics[13].cposition2.set(-1.7,3,-12.3);
    this.clippedQuadrics[13].reflectance.set(1, 1, 1);
    this.clippedQuadrics[13].intensity = 1;
    this.clippedQuadrics[13].shininess = 20;
    this.clippedQuadrics[13].specularColor.set(1,1,1);
    this.clippedQuadrics[13].update();

    this.clippedQuadrics[14].type = 2;
    this.clippedQuadrics[14].solidColor.set(0,0,0,1);
    this.clippedQuadrics[14].makeRing();
    this.clippedQuadrics[14].scale.set(1,1.3,1);
    this.clippedQuadrics[14].position.set(-1.7,5.6,-12.3);
    this.clippedQuadrics[14].cposition.set(-1.7,5.6,-12.3);
    this.clippedQuadrics[14].cposition2.set(-1.7,5.6,-12.3);
    this.clippedQuadrics[14].reflectance.set(1, 1, 1);
    this.clippedQuadrics[14].intensity = 1;
    this.clippedQuadrics[14].shininess = 40;
    this.clippedQuadrics[14].specularColor.set(1,1,1);
    this.clippedQuadrics[14].update();

    this.clippedQuadrics[15].type = 2;
    this.clippedQuadrics[15].solidColor.set(0,0,0,1);
    this.clippedQuadrics[15].makeUnitCylinder();
    this.clippedQuadrics[15].scale.set(0.317,0.412,1);
    this.clippedQuadrics[15].position.set(-1.7,5.6,-12.3);
    this.clippedQuadrics[15].cposition.set(-1.7,5.6,-12.3);
    this.clippedQuadrics[15].cposition2.set(-1.7,5.6,-12.3);
    this.clippedQuadrics[15].cscale.set(1,1,0.95);
    this.clippedQuadrics[15].reflectance.set(1, 1, 1);
    this.clippedQuadrics[15].intensity = 1;
    this.clippedQuadrics[15].shininess = 40;
    this.clippedQuadrics[15].specularColor.set(1,1,1);
    this.clippedQuadrics[15].update();


    this.lights = [];
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights[0].position.set(1, 3, 1, 0).normalize();
    this.lights[0].powerDensity.set(1, 1, 0.9);

    this.lights[1].position.set(-5.2,7.5,2.3,1);
    this.lights[1].powerDensity.set(1, 0, 0);
    this.lights[2].position.set(-7,7,2.3,1);
    this.lights[2].powerDensity.set(0, 1, 0);
    this.lights[3].position.set(-3,7,2.3,1);
    this.lights[3].powerDensity.set(0, 0, 1);

    this.lights[4].position.set(-5.7,6.7,8.7,1);
    this.lights[4].powerDensity.set(1, 0, 0);
    this.lights[5].position.set(-8.7,7,8.7,1);
    this.lights[5].powerDensity.set(0, 1, 0,1);
    this.lights[6].position.set(-11.7,6.7,8.7,1);
    this.lights[6].powerDensity.set(0, 0, 1);

    this.camera = new PerspectiveCamera(...this.programs); 
    this.camera.position.set(-15,15,25);
    this.camera.pitch = -0.55;
    this.camera.yaw = -0.6;  
    this.camera.update();
    this.addComponentsAndGatherUniforms(...this.programs);

    gl.enable(gl.DEPTH_TEST);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;
    //this.time.set(t);
    this.time = t;

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.move(dt, keysPressed);
    
		this.traceQuad.draw(this, this.camera, ...this.lights, ...this.clippedQuadrics);

    const locateCircle = new Vec4(Math.sin(t),0.7,Math.cos(t),0).normalize();
    this.lights[0].position.set(locateCircle);
  }
}
