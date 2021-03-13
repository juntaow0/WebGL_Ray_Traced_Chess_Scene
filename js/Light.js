class Light extends UniformProvider {
    constructor(id, ...programs) {
      super(`lights[${id}]`);
      //this.position = new Vec4();  // should be added
      //this.powerDensity = new Vec3(); // by reflection
      //this.isSpotlight = 0;
      //this.spotDir = new Vec3();
      //this.cutOff = 0;

      this.addComponentsAndGatherUniforms(...programs);
    }
}
