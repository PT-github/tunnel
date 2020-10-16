import { TWEEN } from "./TWEEN";
import createVignetteBackground from './three-vignette-background';
import { OrbitControls } from "./OrbitControls";
import { CSS2DRenderer } from "./render/CSSRenderer"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  Raycaster, Vector2, Scene, TextureLoader, WebGLRenderer, PerspectiveCamera,
  RepeatWrapping, MeshBasicMaterial, Box3, BufferGeometry, BoxBufferGeometry, Mesh, Quaternion, Vector3,
  Spherical, BoxHelper, AmbientLight, DirectionalLight, LineBasicMaterial, LineSegments, Ray, PointLight, Color, Clock, 
} from 'three';
import {FXAAShader} from "./shaders/FXAAShader";
import {EffectComposer} from "./postprocessing/EffectComposer";
import {RenderPass} from "./postprocessing/RenderPass";
import {ShaderPass} from "./postprocessing/ShaderPass";
import {OutlinePass} from "./postprocessing/OutlinePass";
// require( 'three-instanced-mesh' )(THREE);

export default class ThreeBase {
  constructor(dom) {
    this.cubeCamera = null;
    this.cubeScene = null;
    this.canvas = null;
    this.camera = null;
    this.renderer = null;
    this.scene = new Scene();
    this.controls = null;
    this.eventList = [];
    this.pause = false;
    this.clipBox = null;
    this.boxSize = null;
    this.TWEEN = TWEEN;
    this.clock = new Clock();


    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.canvas = document.querySelector(dom);
    this.setWidthAndHeight();
  }

  initOutLine() {
    this.composer = new EffectComposer(this.renderer);
    let renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    this.outlinePass = new OutlinePass(
      new Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    this.composer.addPass(this.outlinePass);

    let onLoad = function(texture) {
      // this.outlinePass.patternTexture = texture;
      // texture.wrapS = RepeatWrapping;
      // texture.wrapT = RepeatWrapping;
    };

    this.outlinePass.visibleEdgeColor.set("#fff000");
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.edgeStrength = 1;
    this.outlinePass.edgeThickness = 1;
    this.outlinePass.pulsePeriod = 5;

    let loader = new TextureLoader();
    loader.load("images/tri_pattern.jpg", onLoad);
    this.effectFXAA = new ShaderPass(FXAAShader);
    this.effectFXAA.uniforms["resolution"].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this.effectFXAA.renderToScreen = true;
    this.composer.addPass(this.effectFXAA);
  };

  initLabelRenderer() {
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(this.width, this.height);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = 0;
    this.canvas.appendChild(this.labelRenderer.domElement);
  }

  init() {
    // this.initLabelRenderer();
    this.initRenderer();
    this.initWindowResize();
    // this.initCubeRenderer();
  }

  loadTextureWithRotation(url, rotation) {
    let t = new TextureLoader().load(url);
    t.wrapS = t.wrapT = RepeatWrapping;
    t.rotation = rotation;
    return t;
  }

  initCubeRenderer() {
    this.cubeScene = new Scene();
    let materials = [];
    Object.keys(CONSTANT.CUBEMAP).forEach(key => {
      const data = CONSTANT.CUBEMAP[key];
      let material = new MeshBasicMaterial({
        color: '#E6E6FA',
        map: this.loadTextureWithRotation(data.img, data.rotation)
      });
      material.angle = data.angle;
      materials.push(material);
    });
    const cube = new BoxBufferGeometry(40, 40, 40);
    const mesh = new Mesh(cube, materials);
    mesh.type = 'cubeBox';

    let line = new LineSegments(new EdgesGeometry(cube, 90), new LineBasicMaterial({ color: 0 }));
    line.type = 'cubeBox';
    mesh.add(line);
    this.cubeScene.add(mesh);

    this.cubeCamera = new PerspectiveCamera(45, 1.0, 1, 200);
    this.cubeCamera.position.z += 100;
  }

  initRenderer() {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    // this.renderer.physicallyCorrectLights = true;
    // this.renderer.gammaFactor = 2.2;
    // this.renderer.toneMappingExposure = 1.5;
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x08102E);

    this.canvas.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(() => {
      this.render();
    });
  }


  loadModel(path, fileName) {
    // let loading = new Loading(this.canvas);
    let fileNames = fileName.split('.');
    let suffix = fileNames[fileNames.length - 1];
    let loader = null;
    return new Promise(resolve => {
      switch (suffix.toLowerCase()) {
        case 'gltf':
        case 'glb':
          loader = new GLTFLoader().setPath(path);
          // let draco = new DRACOLoader();
          // draco.setDecoderPath('/gltf/');
          // loader.setDRACOLoader(draco);
          break;
        case 'fbx':
          loader = new FBXLoader().setPath(path);
          break;
        case 'dae':
          loader = new ColladaLoader().setPath(path);
          break;
      }
      loader.load(fileName, obj => {
        resolve(obj);
        // loading.close();
      }, ({ loaded, total }) => {
        // loading.setLoading(loaded, total);
      });
    });
  }

  initWindowResize = () => window.addEventListener("resize", () => this.resize());

  traverseMaterials(object, callback) {
    object.traverse((node) => {
      if (!node.isMesh) return;
      const materials = Array.isArray(node.material)
        ? node.material
        : [node.material];
      materials.forEach(callback);
    });
  }

  setDefaultBackground(colors) {
    this.background = createVignetteBackground({ aspect: this.camera.aspect, grainScale: 0.001, colors });
    this.scene.add(this.background);
  }

  /*
	  5____4
	1/___0/|
	| 6__|_7
  2/___3/
	0: max.x, max.y, max.z
	1: min.x, max.y, max.z
	2: min.x, min.y, max.z
	3: max.x, min.y, max.z
	4: max.x, max.y, min.z
	5: min.x, max.y, min.z
	6: min.x, min.y, min.z
	7: max.x, min.y, min.z
	*/
  setClipBox(group) {
    this.clipBox = new BoxHelper(group, CONSTANT.HIGHLIGHT);
    this.clipBox.box = new Box3().setFromObject(group);
    this.clipBox.visible = false;
    let geometry = new BufferGeometry();
    geometry.setIndex([
      0, 2, 1, 0, 2, 3,  // 前
      0, 3, 7, 0, 7, 4,  // 右
      0, 5, 1, 0, 5, 4,  // 上
      6, 1, 2, 6, 1, 5,  // 左
      6, 4, 5, 6, 4, 7,  // 后
      6, 3, 2, 6, 3, 7,  // 下
    ]);
    geometry.attributes.position = this.clipBox.geometry.attributes.position;
    this.clipBox.add(new Mesh(geometry, new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      opacity: 0.2
    })));
    const box3 = this.clipBox.box;
    box3.max.x += 1, box3.max.y += 1, box3.max.z += 1;
    box3.min.x -= 1, box3.min.y -= 1, box3.min.z -= 1;

    this.clipBox.planes = [
      new Plane(new Vector3(1, 0, 0), box3.max.x),
      new Plane(new Vector3(-1, 0, 0), box3.max.x),
      new Plane(new Vector3(0, 0, -1), box3.max.z),
      new Plane(new Vector3(0, 0, 1), box3.max.z),
      new Plane(new Vector3(0, -1, 0), box3.max.y),
      new Plane(new Vector3(0, 1, 0), box3.max.y)
    ];
    this.scene.add(this.clipBox);
  }

  makeModelToCenter(group) {
    group.position.y = 0;
    let box3 = new Box3();
    // 计算层级模型group的包围盒
    // 模型group是加载一个三维模型返回的对象，包含多个网格模型
    box3.expandByObject(group);
    // 计算一个层级模型对应包围盒的几何体中心在世界坐标中的位置
    let center = new Vector3();
    box3.getCenter(center);

    group.position.x -= center.x;
    group.position.z -= center.z;
    // group.position.y -= center.y / 2;


    this.boxSize = box3.getSize(new Vector3());

    let spherical = new Spherical(this.boxSize.length(), Math.PI / 3, 0);
    let target = new Vector3().setFromSpherical(spherical);

    this.camera.position.copy(target);

    this.controls.update();
    this.camera.originRotation = this.camera.rotation.clone();

    this.resetCameraPosition = (callback) => {
      this.controls.target = new Vector3(0, 0, 0);
      (this.tweenAnimate(this.camera.position, target, 1000, null, () => {
        this.controls.update();
      }, () => {
        this.camera.near = 1;
        this.camera.updateProjectionMatrix();
        callback && callback();
      })).start();
    };
  }

  transformSceneByAngle(phi, theta) {
    const start = [
      ...this.controls.target.toArray(),
      ...this.camera.position.toArray()
    ];
    (this.tweenAnimate(start, [
      0, 0, 0, ...new Vector3().setFromSpherical(new Spherical(this.boxSize.length() * 1.5, phi, theta)).toArray(),
    ], 800, null, () => {
      this.controls.target.set(start[0], start[1], start[2]);
      this.camera.position.set(start[3], start[4], start[5]);
      this.controls.update();
    })).start();
  }


  initLight() {
    var light = new AmbientLight(0xcccccc);
    light.position.set(0, 0, 0);
    this.scene.add(light);
    var light2 = new PointLight(0x555555);
    light2.shadow.camera.near = 1;
    light2.shadow.camera.far = 5000;
    light2.position.set(0, 350, 0);
    light2.castShadow = false; //表示这个光是可以产生阴影的
    this.scene.add(light2);
  }

  render() {
    this.eventBus();
    TWEEN.update();
    this.renderer.render(this.scene, this.camera);
    this.composer.render(this.clock.getDelta());
  }

  setWidthAndHeight() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  resize() {
    this.setWidthAndHeight();
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    // this.labelRenderer.setSize(this.width, this.height);
    // this.labelRenderer.render(this.scene, this.camera);
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
    this.render();
  }

  setCamera({ fov, near, far, position, up, lookAt }) {
    let { x, y, z } = position.clone();
    this.camera = new PerspectiveCamera(
      fov, this.width / this.height, near, far
    );
    // this.camera.castShadow = true;
    this.camera.up.set(up.x, up.y, up.z);
    this.camera.position.set(x, y, z);
    this.camera.lookAt(lookAt);

    this.scene.add(this.camera);
  }

  eventBus() {
    this.eventList.forEach(e => e());
  }

  getRaycasters(event, objects) {
    const canvas = this.renderer.domElement;
    this.mouse.x = ((event.clientX - canvas.getBoundingClientRect().left) / canvas.offsetWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - canvas.getBoundingClientRect().top) / canvas.offsetHeight) * 2 + 1;
    //通过鼠标点的位置和当前相机的矩阵计算出raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera);

    return this.raycaster.intersectObjects(objects, true);
  }

  getCubeBoxRaycasters(event) {
    const canvas = this.renderer.domElement;
    this.mouse.x = ((150 - (canvas.offsetWidth - event.clientX)) / 150) * 2 - 1;
    this.mouse.y = -(event.clientY / 150) * 2 + 1;
    //通过鼠标点的位置和当前相机的矩阵计算出raycaster
    this.raycaster.setFromCamera(this.mouse, this.cubeCamera);

    return this.raycaster.intersectObjects(this.cubeScene.children, true);
  }

  initTrackBallControls() {
    this.controls = new TrackballControls(this.camera, this.canvas);
    this.controls.rotateSpeed = 8.0;// 旋转速度
    this.controls.zoomSpeed = 1;// 缩放速度
    this.controls.panSpeed = 1;// 平controls


    // this.controls.staticMoving = true;// 静止移动，为 true 则没有惯性
    // this.controls.dynamicDampingFactor = 0.2;// 阻尼系数 越小 则滑动越大
  }

  initControls(center, callback) {
    if (!this.camera) throw Error("please init Camera first!");
    this.controls = new OrbitControls(this.camera, this.canvas, callback);
    center && (this.controls.target = new Vector3(center.x, center.y, center.z));
    //使动画循环使用时阻尼或自转 意思是否有惯性
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.5;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 100000;
    // 是否可以缩放
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 2.0;
    this.controls.keyPanSpeed = 120.0;
    this.controls.panSpeed = 2.0;
    // this.controls.minPolarAngle = -Infinity;
    this.controls.maxPolarAngle = Math.PI / 2-.1;
    //是否自动旋转
    this.controls.update();
  }

  /**
   * 获取相机到目标位置固定距离的坐标
   * @param {*} target 目标位置
   * @param {*} distance 固定距离
   */
  getPositionByDistance(target, distance) {
    var spherical = new Spherical();
    var offset = new Vector3();
    var quat = new Quaternion().setFromUnitVectors(this.camera.up, new Vector3(0, 1, 0));
    var quatInverse = quat.clone().inverse();
    offset.copy(this.camera.position).sub(target);
    // rotate offset to "y-axis-is-up" space
    offset.applyQuaternion(quat);
    // angle from z-axis around y-axis
    spherical.setFromVector3(offset);
    spherical.radius = distance;
    spherical.phi = Math.PI / 2;
    offset.setFromSpherical(spherical);
    offset.applyQuaternion(quatInverse);
    return new Vector3().copy(target).add(offset);
  }

  /**
   * 模拟球极坐标获取位置  Y轴up
   * @param {*} origin 当前物体位置
   * @param {*} target 旋转点
   * @param {*} phi 绕x轴旋转的角度
   * @param {*} theta 绕y轴旋转的角度
   * @param {*} distance 当前物体与目标间的距离
   */
  getPositionBySpherical(origin, target, phi, theta, distance) {
    var r = distance || origin.distanceTo(target);
    var x = r * Math.sin(phi) * Math.sin(theta) + target.x;
    var z = r * Math.sin(phi) * Math.cos(theta) + target.z;
    var y = r * Math.cos(phi) + target.y;
    this.controls.maxAzimuthAngle
    return { x, y, z };
  }

  /**
     * TWEEN.Easing = {
            Back: {In: ƒ, Out: ƒ, InOut: ƒ},
            Bounce: {In: ƒ, Out: ƒ, InOut: ƒ},
            Circular: {In: ƒ, Out: ƒ, InOut: ƒ},
            Cubic: {In: ƒ, Out: ƒ, InOut: ƒ},
            Elastic: {In: ƒ, Out: ƒ, InOut: ƒ},
            Exponential: {In: ƒ, Out: ƒ, InOut: ƒ},
            Linear: {None: ƒ},
            Quadratic: {In: ƒ, Out: ƒ, InOut: ƒ},
            Quartic: {In: ƒ, Out: ƒ, InOut: ƒ},
            Quintic: {In: ƒ, Out: ƒ, InOut: ƒ},
            Sinusoidal: {In: ƒ, Out: ƒ, InOut: ƒ},
        }
        TWEEN.Easing.Elastic.Out
     * @param {*} current
     * @param {*} target
     * @param {*} interval
     * @param {*} animation
     * @param {*} onUpdate
     * @param {*} complete
     */
  tweenAnimate(current, target, interval, animation, onUpdate, complete) {
    var animate = animation ? animation : TWEEN.Easing.Linear.None;
    let tween = new TWEEN.Tween(current).to(target, interval).easing(animate);
    onUpdate && tween.onUpdate(() => onUpdate());
    complete && tween.onComplete(() => complete());

    return tween;
  }

  loadTexture(url) {
    let t = new TextureLoader().load(url);
    t.wrapS = t.wrapT = RepeatWrapping;
    return t;
  }

  clearRenderer() {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement = null;
  }

  dispose() {
    this.renderer.forceContextLoss();
  }

  clean() {
    let _this = this;
    _this.scene.traverse(function (item) {
      if (item instanceof Mesh) {
        if (item.geometry) {
          item.geometry.dispose();
        }
        if (item.material) {
          if (item.material.materials) {
            item.material.materials.forEach(function (material) {
              if (material.map) {
                material.map.dispose();
              }
              material.dispose();
            });
            item.material.materials.length = 0;
          } else {
            if (item.material.map) {
              item.material.map.dispose();
            }
            item.material.dispose();
          }
        }
      }
    });
  }
}
