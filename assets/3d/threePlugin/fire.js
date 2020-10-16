import "three/examples/js/objects/Fire";

export default function(type) {
  var plane = new THREE.PlaneBufferGeometry(200, 240);
  var fire = new THREE.Fire(plane, {
    textureWidth: 128,
    textureHeight: 128,
    debug: false
  });
  fire.rotation.x = -Math.PI / 2;
  fire.rotation.z = Math.PI;
  var params = {};
  params.Campfire = function() {
    params.color1 = 0xffffff;
    params.color2 = 0xffa000;
    params.color3 = 0x000000;
    params.windX = 0.0;
    params.windY = 0.75;
    params.colorBias = 0.8;
    params.burnRate = 0.3;
    params.diffuse = 1.33;
    params.viscosity = 0.25;
    params.expansion = -0.25;
    params.swirl = 150.0;
    params.drag = 0.35;
    params.airSpeed = 12.0;
    params.speed = 600.0;
    params.massConservation = false;

    Object.keys(params).forEach(key => {
      if (key != "Campfire") {
        if (key.indexOf("color") >= 0 && key != "colorBias") {
          fire[key].set(params[key]);
        } else {
          fire[key] = params[key];
        }
      }
    });
  };

  params.Smoke = function() {
    params.color1 = 0xd2d2d2;
    params.color2 = 0xd7d7d7;
    params.color3 = 0x000000;
    params.windX = -0.05;
    params.windY = 0.15;
    params.colorBias = 0.95;
    params.burnRate = 0.0;
    params.diffuse = 1.5;
    params.viscosity = 0.25;
    params.expansion = 0.2;
    params.swirl = 3.75;
    params.drag = 0.4;
    params.airSpeed = 18.0;
    params.speed = 500.0;
    params.massConservation = false;
    Object.keys(params).forEach(key => {
      if (key != "Smoke") {
        if (key.indexOf("color") >= 0 && key != "colorBias") {
          fire[key].set(params[key]);
        } else {
          fire[key] = params[key];
        }
      }
    });
  };
  fire.clearSources();
  fire.addSource(0.5, 0.1, 0.1, 1.0, 0.0, 1.0);
  if (type == 0) {
    params.Campfire();
  } else {
    params.Smoke();
  }
  return fire;
}
