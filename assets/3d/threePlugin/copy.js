group.position.x -= center.x;
group.position.z -= center.z;


const m = box3.max.y;

this.camera.position.copy(new THREE.Vector3().setFromSpherical(new THREE.Spherical(
  new THREE.Vector3(0,m,m).distanceTo(group.position),
  Math.PI/4,Math.PI/4)));
this.controls.update();