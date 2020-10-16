class Test{
    
  createSphere({ x, y, z }) {
    let sphere = new THREE.PlaneGeometry(80, 80);
    let material = new THREE.MeshBasicMaterial({
      map: this.loadTexture("/static/img/ball.png"),
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    let mesh = new THREE.Mesh(sphere, material);
    mesh.position.set(x, y, z);
    mesh.rotation.x += Math.PI / 2;
    return mesh;
  }

  createGeometry(vecs, width) {
    let points = [], indices = [], vertices = [], uvs = [];
    for (let i = 0; i < vecs.length - 1; i++) {
      points.push(
        ...new THREE.LineCurve3(vecs[i], vecs[i + 1]).getPoints(
          vecs[i].distanceTo(vecs[i + 1]) / 4)
      );
    }

    for (let i = 0; i < points.length - 1; i++) {
      const array = points[i].toArray();
      if (
        Math.abs(points[i + 1].x - points[i].x) <
        Math.abs(points[i + 1].z - points[i].z)
      ) {
        array[0] -= width;
        vertices = vertices.concat(array);
        array[0] += width * 2;
        vertices = vertices.concat(array);
      } else {
        array[2] -= width;
        vertices = vertices.concat(array);
        array[2] += width * 2;
        vertices = vertices.concat(array);
      }
    }

    for (let i = 0, j = 1, k = 0; i < vertices.length; i += 3, j++ , uvs.push(k, j % 2), k += j % 2 == 0);
    for (let i = 0, j = 0; i < vertices.length, j < vertices.length - 6; i += 2, j += 6)
      indices.push(i + 2, i, i + 3, i, i + 1, i + 3);

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.addAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    this.texture = new THREE.TextureLoader().load("/static/img/line.png");
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    let mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  createTube(vecs) {
    let curveLine = new THREE.CatmullRomCurve3(vecs);

    let tube = new THREE.TubeGeometry(curveLine, 100, 0.7, 3, false);
    tube.verticesNeedUpdate = true;
    this.texture = new THREE.TextureLoader().load("/static/img/line.png");
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.x = 50;
    // this.texture.anisotropy = 16;
    // this.texture.offset.y = -0.5;
    var material = new THREE.MeshStandardMaterial({
      map: this.texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
      roughness: 0.0,
      metalness: 0.0
    });
    var mesh = new THREE.Mesh(tube, material);
    this.scene.add(mesh);
  }
}