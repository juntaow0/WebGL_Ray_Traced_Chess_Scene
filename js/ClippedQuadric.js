class ClippedQuadric extends UniformProvider {
    constructor(id, ...programs) {
      super(`clippedQuadrics[${id}]`);
      this.surface = new Mat4();
      this.clipper = new Mat4();
      this.clipper2 = new Mat4();

      this.roll = 0;
      this.pitch = 0;
      this.yaw = 0;
      this.scale = new Vec3(1,1,1);
      this.position = new Vec3(0,0,0);
      this.transMat = new Mat4();

      this.croll = 0;
      this.cpitch = 0;
      this.cyaw = 0;
      this.cscale = new Vec3(1,1,1);
      this.cposition = new Vec3(0,0,0);
      this.ctransMat = new Mat4();

      this.croll2 = 0;
      this.cpitch2 = 0;
      this.cyaw2 = 0;
      this.cscale2 = new Vec3(1,1,1);
      this.cposition2 = new Vec3(0,0,0);
      this.ctransMat2 = new Mat4();
      this.addComponentsAndGatherUniforms(...programs);
    }
    makeUnitCylinder(){
      this.surface.set(1,  0,  0,  0,
                       0,  1,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  1,  0,
                       0,  0,  0, -1);
      this.clipper2.set(0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0, -1);
    }

    makeUnitSphere(){
      this.surface.set(1,  0,  0,  0,
                       0,  1,  0,  0,
                       0,  0,  1,  0,
                       0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0, -1);
      this.clipper2.set(0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0, -1);
    }

    makeUnitCone(){
      this.surface.set(1,  0,  0,  0,
                       0,  -1,  0,  0,
                       0,  0,  1,  0,
                       0,  0,  0,  0);
      this.clipper.set(0,  0,  0,  0,
                       0,  1,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0, -1);
      this.clipper2.set(0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0, 0,
                        0,  0,  0, -1);
    }

    makeParaboloid(){
      this.surface.set(1,  0,  0,  0,
                       0,  0,  0,  -0.5,
                       0,  0,  1,  0,
                       0,  -0.5, 0 , -1);
      this.clipper.set(0,  0,  0,  0,
                       0,  1,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  0, -1);
      this.clipper2.set(0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0, -1);
    }
    makeRing(){
      this.surface.set(1, 0, 0, 0,
                       0, 1, 0, 0,
                       0, 0, 1, 0,
                       0, 0, 0, -1);
      this.clipper.set(0, 0, 0, 0,
                       0, 0, 0, 0,
                       0, 0, 1, 0,
                       0, 0, 0, -0.9);
      this.clipper2.set(0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0, -1);
    }

    makeDoublePlane(){
      this.surface.set(0,  0,  0,  0,
                      0,  1,  0,  0,
                      0,  0,  0,  0,
                      0,  0,  0, -1);
      this.clipper.set(1,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0,  0,
                        0,  0,  0, -1);
      this.clipper2.set(0,  0,  0,  0,
                       0,  0,  0,  0,
                       0,  0,  1,  0,
                       0,  0,  0, -1);
    }

    updateMat(){
      this.transMat.set().
        scale(this.scale).
        rotate(this.roll).
        rotate(this.pitch,1,0,0).
        rotate(this.yaw,0,1,0).
        translate(this.position);

      this.ctransMat.set().
        scale(this.cscale).
        rotate(this.croll).
        rotate(this.cpitch,1,0,0).
        rotate(this.cyaw,0,1,0).
        translate(this.cposition);

      this.ctransMat2.set().
        scale(this.cscale2).
        rotate(this.croll2).
        rotate(this.cpitch2,1,0,0).
        rotate(this.cyaw2,0,1,0).
        translate(this.cposition2);
    }

    update(){
      this.updateMat();

      this.transMat.invert(); 
      this.surface.premul(this.transMat); 
      this.transMat.transpose(); 
      this.surface.mul(this.transMat);

      this.ctransMat.invert(); 
      this.clipper.premul(this.ctransMat); 
      this.ctransMat.transpose(); 
      this.clipper.mul(this.ctransMat);

      this.ctransMat2.invert(); 
      this.clipper2.premul(this.ctransMat2);
      this.ctransMat2.transpose(); 
      this.clipper2.mul(this.ctransMat2);
    }
}
