import threeBase from '../../assets/3d/threePlugin/threeBase';
import {
    Vector3,
    InstancedMesh,
    Object3D,
    Mesh,
    Matrix4,
    Color,
    MeshLambertMaterial,
    Euler,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    MeshStandardMaterial
} from 'three';
import data from '../../assets/3d/data';

import {OBJLoader} from '../../assets/3d/threePlugin/loaders/OBJLoader';
import {MTLLoader} from '../../assets/3d/threePlugin/loaders/MTLLoader';

export default class View extends threeBase {
    $;
    config = {
        camera: {
            fov: 45,
            near: 1,
            far: 1000000,
            position: new Vector3(-6000, 3000, 2000),
            up: new Vector3(0, 1, 0),
            lookAt: new Vector3(0, 0, 0)
        },
        bgColors: ['#ffffff', '#353535'],
        exposure: 1.5
    };
    fengji = [];
    intanceFengJi;
    intanceFengJi2;
    suidaoding;
    objects = [];
    clickobjects = [];
    canRotated = false;
    canRoateList = [];

    constructor(dom, $, infos) {
        super(dom);
        this.$ = $;
        console.log(infos);
        this.initBase();
    }

    changeLight(value) {
        if (value == '0') {
            this.currentLight.material[1].opacity = .0;
        } else {
            this.currentLight.material[1].opacity = this.$.lightInfo.brightnessVal / 100.0;
        }
    }

    resetLightInfo() {
        this.$.lightInfo = this.copyLight;
        this.currentLight.material[1].opacity = this.copyLight.brightnessVal / 100.0;
    }

    setLight(value) {
        this.currentLight.material[1].opacity = value / 100.0;
    }

    openLight(id, flag) {
        this.objects = [];
        if (flag) {
            var selectedObjs = this.findObjects('zhaoming');
            for (var i = 0; i < selectedObjs.length; i++) {
                this.objects.push(selectedObjs[i]);
            }
            this.outlinePass.selectedObjects = this.objects;
        } else {
            this.outlinePass.selectedObjects = [];
        }
    }

    fengjiAnim = () => {
        if (this.intanceFengJi != null && this.canRoateList.length > 0) {
            let instanceMatrix = new Matrix4();
            var matrix = new Matrix4();
            var rotationMatrix = new Matrix4().makeRotationX(0.5);
            for (let i = 0; i < this.$.fengjis.length; i++) {
                if (this.canRoateList.indexOf(i) >= 0) {
                    this.intanceFengJi.getMatrixAt(i, instanceMatrix);
                    matrix.multiplyMatrices(instanceMatrix, rotationMatrix);
                    this.intanceFengJi.setMatrixAt(i, matrix);
                    this.intanceFengJi.instanceMatrix.needsUpdate = true;
                }
            }
        }
    };

    async initBase() {
        super.init();
        super.setCamera(this.config.camera);
        this.initOutLine();
        super.initControls();
        this.initLight();

        for (let i = 0; i < data.length; i++) {
            this.loadObj(data[i]);
        }

        await this.setInnerCamera();
        await this.setOutCamera();
        await this.setDoor();
        await this.setFire();
        await this.setHouse();

        this.setDirection();

        this.eventList.push(this.fengjiAnim);
        this.bindClick(true);
    }

    async setHouse() {
        let {scene} = await this.loadModel('/static/models/', 'house.glb');
        scene.scale.set(70, 70, 70);
        scene.traverse(m => {
            if (m.name == 'Cube_0') {
                m.material.transparent = true;
                m.material.opacity = .3;
            }
            if (m instanceof Mesh) {
                m.material.metalness = 0.0;
                m.material.roughness = 0.0;
            }
        });
        scene.position.z += 2000;
        scene.position.x -= 2200;
        scene.rotation.y -= Math.PI / 2;
        this.clickobjects.push(scene);
        this.scene.add(scene);
    }

    async setFire() {
        let model = await this.loadModel('/static/models/', 'fire.glb');
        const fire = model.scene.children[0];
        fire.name = 'fire';
        fire.scale.set(500, 100, 500);
        fire.position.y += 200;
        fire.position.z += 500;
        fire.position.x -= 2200;
        this.clickobjects.push(fire);

        this.scene.add(fire);

        for (let i = 1; i <= 25; i++) {
            let cloned = fire.clone(true);
            cloned.position.x += 1950 * i;
            this.clickobjects.push(cloned);
            this.scene.add(cloned);
        }
    }

    async setDoor() {
        let model = await this.loadModel('/static/models/', 'door.glb');
        const door = model.scene.children[0];
        door.name = 'door';
        door.scale.set(100, 10, 100);
        door.position.z -= 500;
        door.position.x += 6000;
        this.clickobjects.push(door);
        this.scene.add(door);
    }

    async setOutCamera() {
        let model = await this.loadModel('/static/models/TV彩色固定摄像机/', '洞外.glb');
        const camera_out = model.scene.children[0];
        camera_out.scale.set(100, 100, 100);
        camera_out.position.y += 850;
        camera_out.position.x -= 2500;
        camera_out.name = 'camera';
        this.clickobjects.push(camera_out);
        this.scene.add(camera_out);
    }

    async setInnerCamera() {
        let model = await this.loadModel('/static/models/VTV车型横洞摄像机/', '洞内.glb');
        const camera_in = model.scene.children[0];
        camera_in.name = 'camera';
        camera_in.scale.set(150, 150, 150);
        camera_in.position.y += 700;
        camera_in.position.z += 350;
        this.clickobjects.push(camera_in);
        this.scene.add(camera_in);
        for (let i = 1; i <= 5; i++) {
            let clone = camera_in.clone(true);
            clone.name = 'camera';
            clone.position.x += 8000 * i;
            this.clickobjects.push(clone);
            this.scene.add(clone);
        }
    }

    setDirection() {
        let geometry = new PlaneBufferGeometry(4096, 2048);
        let material = new MeshBasicMaterial({
            map: this.loadTexture('/static/image/2.png'),
            side: 2,
            transparent: true
        });
        let direction1 = new Mesh(geometry, material);
        direction1.rotation.x -= Math.PI / 2;
        direction1.position.z -= 3500;
        direction1.position.x += 2000;
        this.scene.add(direction1);
        let direction2 = direction1.clone(true);
        direction2.material = direction2.material.clone();
        direction2.material.map = this.loadTexture('/static/image/1.png');
        direction2.position.z += 5500;
        this.scene.add(direction2);
    }

    reset() {
        (this.tweenAnimate(this.camera.position, this.config.camera.position.clone(), 1000, null, () => {
            this.controls.target = new Vector3();
            this.controls.update();
        })).start();
    }

    findObject(_objname) {
        for (let i = 0; i < this.objects.length; i++) {
            let _obj = this.objects[i];
            if (_obj.name != null && _obj.name != '') {
                if (_obj.name == _objname) {
                    return _obj;
                }
            }
        }
        return null;
    }

    findObjects(_objname) {
        let findedobj = [];
        for (let i = 0; i < this.clickobjects.length; i++) {
            let _obj = this.clickobjects[i];
            if (_obj.name != null && _obj.name != '') {
                if (_obj.name == _objname) {
                    findedobj.push(_obj);
                }
            }
        }
        return findedobj;
    }

    setCheliangLight(item) {
        let _objs1 = this.findObjects('chedaojinxing');
        let _objs2 = this.findObjects('chedaotongxing');
        if (item == 1) {
            _objs1[0].visible = !_objs1[0].visible;
            _objs2[0].visible = !_objs2[0].visible;
            _objs1[2].visible = !_objs1[2].visible;
            _objs2[2].visible = !_objs2[2].visible;
        }
        if (item == 2) {
            _objs1[1].visible = !_objs1[1].visible;
            _objs2[1].visible = !_objs2[1].visible;

            _objs1[3].visible = !_objs1[3].visible;
            _objs2[3].visible = !_objs2[3].visible;
        }

    }

    setTrafficLight(type) {
        let _obj = null;
        if (type == 1) {
            _obj = this.findObject('dengganhonglvdeng');
            if (_obj.userData.color1 == null) {
                _obj.userData.color1 = _obj.material[3].color.clone();
                _obj.material[3].color.set(0xffffff);
            } else {
                let _color1 = _obj.material[3].color.clone();
                _obj.material[3].color = _obj.userData.color1.clone();
                _obj.userData.color1 = _color1;
            }
        } else if (type == 2) {
            _obj = this.findObject('dengganhonglvdeng');
            if (_obj.userData.color2 == null) {
                _obj.userData.color2 = _obj.material[1].color.clone();
                _obj.material[1].color.set(0xffffff);
            } else {
                let _color2 = _obj.material[1].color.clone();
                _obj.material[1].color = _obj.userData.color2.clone();
                _obj.userData.color2 = _color2;
            }
        } else if (type == 3) {
            _obj = this.findObject('dengganhonglvdeng');
            if (_obj.userData.color3 == null) {
                _obj.userData.color3 = _obj.material[5].color.clone();
                _obj.material[5].color.set(0xffffff);
            } else {
                let _color3 = _obj.material[5].color.clone();
                _obj.material[5].color = _obj.userData.color3.clone();
                _obj.userData.color3 = _color3;
            }
        }

        ;
    }

    loadObj(item) {
        let mtlLoader = new MTLLoader();
        mtlLoader.setPath('/static/models/');
        mtlLoader.load(item.model + '.mtl', materials => {
            materials.preload();
            let objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('/static/models/');
            objLoader.load(item.model + '.obj', (obj) => {
                obj = obj.children[0];
                obj.scale.x = item.scale.x;
                obj.scale.y = item.scale.y;
                obj.scale.z = item.scale.z;
                obj.rotation.x = item.rotation.x;
                obj.rotation.y = item.rotation.y;
                obj.rotation.z = item.rotation.z;
                obj.position.x = item.position.x;
                obj.position.y = item.position.y;
                obj.position.z = item.position.z;
                obj.name = item.name;
                obj.visible = item.show;
                let mesh = obj;

                if (obj.name == 'fengji-shanye') {
                    obj.geometry.center();
                    this.intanceFengJi = new InstancedMesh(obj.geometry.clone(), obj.material.clone(), 84);
                    this.intanceFengJi.name = obj.name;
                    obj.position.z = -obj.position.z;
                    obj.updateWorldMatrix();
                    this.intanceFengJi.setMatrixAt(0, obj.matrix);
                    this.scene.add(this.intanceFengJi);
                    this.setFengjiX(obj, this.intanceFengJi);
                    this.clickobjects.push(this.intanceFengJi);
                } else if (obj.name == 'fengji-waikuang') {
                    obj.geometry.center();
                    this.intanceFengJi2 = new InstancedMesh(obj.geometry.clone(), obj.material.clone(), 84);
                    this.intanceFengJi2.name = obj.name;
                    obj.position.z = -obj.position.z;
                    obj.updateWorldMatrix();
                    this.intanceFengJi2.setMatrixAt(0, obj.matrix);
                    this.scene.add(this.intanceFengJi2);
                    this.setFengjiX(obj, this.intanceFengJi2);
                    this.clickobjects.push(this.intanceFengJi2);
                } else if (obj.name == 'suidaoding') {
                    obj.material.opacity = .6;
                    this.suidaoding = new InstancedMesh(obj.geometry.clone(), obj.material.clone(), 42);
                    this.suidaoding.name = obj.name;
                    obj.updateWorldMatrix();
                    this.suidaoding.setMatrixAt(0, obj.matrix);
                    this.scene.add(this.suidaoding);
                    this.setSuiDao(obj, this.suidaoding);
                } else if (item.model == 'zhaoming-liangbian') {
                    const lights = this.$.lights;

                    obj.material[1].color = new Color(0xfff000);
                    obj.material[1].emissive = new Color(0xfff000);
                    obj.material[1].transparent = true;
                    obj.material[1].depthTest = false;
                    obj.material[1].depthWrite = false;
                    // obj.position.x += 20000;

                    for (let i = 0; i < lights.length; i += 2) {
                        const m1 = lights[i]; //左
                        const m2 = lights[i + 1]; //右
                        m1.brightnessVal = Number(m1.brightnessVal);
                        m2.brightnessVal = Number(m2.brightnessVal);
                        let o1 = obj.clone(true);
                        o1.material = [
                            obj.material[0].clone(),
                            obj.material[1].clone(),
                            obj.material[2].clone()
                        ];
                        o1.material[1].opacity = m1.brightnessVal / 100.0;
                        o1.position.x = 135 * i - 2200;
                        o1.userData.info = m1;
                        this.clickobjects.push(o1);
                        this.addObject(o1);
                        let o2 = o1.clone(true);
                        o2.material = [
                            obj.material[0].clone(),
                            obj.material[1].clone(),
                            obj.material[2].clone()
                        ];
                        o2.material[1].opacity = m2.brightnessVal / 100.0;
                        o2.position.z = -o2.position.z;
                        o2.rotation.x = 0;
                        o2.userData.info = m2;
                        this.clickobjects.push(o2);
                        this.addObject(o2);
                    }
                } else if (item.model == 'zhaoming-zhongjian') {
                    this.addObject(obj);
                } else {
                    if (obj.name == 'new') {
                        obj.geometry.center();
                    }
                    this.addObject(obj);
                    //生成车道通行
                    if (item.type == 'chedaotongxing') {
                        this.clickobjects.push(obj);
                    }
                    //生成车道禁行
                    if (item.type == 'chedaojinxing') {
                        this.clickobjects.push(obj);
                    }
                }
                //生成隧道
                if (item.name == 'suidao-malu') {
                    let obj1 = obj.clone();
                    obj1.position.z = -1500;
                    let mesh1 = obj1;
                    this.addObject(mesh1);
                    for (let i = 0; i < 10; i++) {
                        let objCopy = mesh.clone();
                        objCopy.position.x = 5000 * (i + 1);
                        this.addObject(objCopy);
                        let objCopy1 = mesh1.clone();
                        objCopy1.position.x = 5000 * (i + 1);
                        this.addObject(objCopy1);
                    }
                }
                //生成马路
                if (item.type == 'malu') {
                    obj.position.x += 1500;
                    obj.scale.x = .03;
                    let obj1 = obj.clone();
                    obj1.position.z = -1500;

                    this.addObject(obj1);
                }
                //生成车
                // if (item.type == "car") {
                //     let obj1 = obj.clone();
                //     obj1.position.z = -1700;
                //     obj1.rotation.y = Math.PI;
                //     let mesh1 = obj1;
                //     this.addObject(mesh1);
                // }
                //生成限速
                if (item.type == 'xiansu') {
                    let obj1 = obj.clone();
                    obj1.position.z = -1500;
                    let mesh1 = obj1;
                    this.addObject(mesh1);
                }
                //生成车道通行
                if (item.type == 'chedaotongxing') {
                    let obj1 = obj.clone();
                    obj1.position.z = obj1.position.z - 1500;
                    let mesh1 = obj1;
                    this.addObject(mesh1);
                    this.clickobjects.push(mesh1);
                }
                //生成车道禁行
                if (item.type == 'chedaojinxing') {
                    let obj1 = obj.clone();
                    obj1.position.z = obj1.position.z - 1500;
                    let mesh1 = obj1;
                    this.clickobjects.push(mesh1);
                    this.addObject(mesh1);
                }
                //生成路灯
                if (item.type == 'denggan') {
                    let obj1 = obj.clone();
                    obj1.position.z = obj1.position.z - 2350;
                    let mesh1 = obj1;
                    obj1.rotation.y = Math.PI;
                    this.addObject(mesh1);
                }
            });
        });
    };

    setSuiDao(obj, target) {
        let transform = new Object3D();
        transform.scale.copy(obj.scale);
        let obj1 = obj.clone();
        obj1.position.z = -1500;
        transform.position.copy(obj1.position);
        transform.updateMatrix();
        target.setMatrixAt(1, transform.matrix);
        let mesh1 = obj1;
        for (let i = 1; i < 10; i++) {
            let objCopy = obj.clone();
            objCopy.position.x = 5000 * i;
            transform.position.copy(objCopy.position);
            transform.updateMatrix();
            target.setMatrixAt(i * 2, transform.matrix);

            let objCopy1 = mesh1.clone();
            objCopy1.position.x = 5000 * i;
            transform.position.copy(objCopy1.position);
            transform.updateMatrix();
            target.setMatrixAt(i * 2 + 1, transform.matrix);
        }
    }

    setFengjiX(obj, target) {
        let transform = new Object3D();
        transform.scale.copy(obj.scale);
        let obj1 = obj.clone();
        obj1.position.z = -obj1.position.z;
        transform.position.copy(obj1.position);
        transform.updateMatrix();
        target.setMatrixAt(1, transform.matrix);
        let obj2 = obj1.clone();
        obj2.position.z = obj2.position.z - 1500;
        transform.position.copy(obj2.position);
        transform.updateMatrix();
        target.setMatrixAt(2, transform.matrix);
        let obj3 = obj.clone();
        obj3.position.z = obj3.position.z - 1500;
        transform.position.copy(obj3.position);
        transform.updateMatrix();
        target.setMatrixAt(3, transform.matrix);
        for (let i = 1; i <= 3; i++) {
            let objCopy = obj.clone();
            objCopy.position.x = 10000 * i;
            transform.position.copy(objCopy.position);
            transform.updateMatrix();
            target.setMatrixAt(i * 4, transform.matrix);
            let objCopy1 = objCopy.clone();
            objCopy1.position.z = -objCopy1.position.z;
            transform.position.copy(objCopy1.position);
            transform.updateMatrix();
            target.setMatrixAt(i * 4 + 1, transform.matrix);
            //生成反方向
            let objCopy2 = objCopy.clone();
            objCopy2.position.z = objCopy2.position.z - 1500;
            transform.position.copy(objCopy2.position);
            transform.updateMatrix();
            target.setMatrixAt(i * 4 + 2, transform.matrix);
            let objCopy3 = objCopy.clone();
            objCopy3.position.z = objCopy1.position.z - 1500;
            transform.position.copy(objCopy3.position);
            transform.updateMatrix();
            target.setMatrixAt(i * 4 + 3, transform.matrix);
        }

    }

    addObject(obj) {
        this.objects.push(obj);
        this.scene.add(obj);
    };

    addFengji(obj) {
        if (obj.name == 'fengji-shanye') {
            this.fengji.push(obj);
            obj.geometry.center();
            obj.userData.anim = false;
        }
    }

    bindClick() {
        this.canvas.addEventListener('click', (e) => {
            let raycasters = this.getRaycasters(e, this.clickobjects);
            if (raycasters.length > 0) {
                const {object, point, instanceId} = raycasters[0];
                if (object.name == 'zhaoming' ||
                    object.name == 'fengji-waikuang' ||
                    object.name == 'fengji-shanye' ||
                    object.name == 'dengganlaba' ||
                    object.name == 'dengganhonglvdeng' ||
                    object.name == 'chedaotongxing' ||
                    object.name == 'chedaojinxing' ||
                    object.parent.name == 'camera' ||
                    object.parent.name == 'door' ||
                    object.parent.name == 'fire') {

                    if (object.name == 'zhaoming') {
                        this.currentLight = object;
                        this.$.lightDialog = true;
                        this.$.lightInfo = object.userData.info;
                        this.copyLight = Object.assign({}, this.$.lightInfo);

                        this.camera.lookAt(object);
                        this.controls.target = object.position.clone();
                        let end = this.getPositionBySpherical(this.camera.position, object.position.clone(), Math.PI / 2, object.rotation.x != 0 ? 0 : Math.PI, 300);
                        (this.tweenAnimate(this.camera.position, end, 1000, null, () => {
                            this.controls.update();
                        })).start();
                    }

                    if (object.parent.name == 'door') {
                        this.$.showModal = true;
                        this.$.showModalTitle = '横洞卷闸门';
                        this.$.showModalType = 8;
                        const target = object.parent.position.clone();
                        target.y += 180;
                        this.camera.lookAt(object);
                        this.controls.target = target;
                        let end = this.getPositionBySpherical(this.camera.position, target, Math.PI / 2, 0, 800);
                        (this.tweenAnimate(this.camera.position, end, 1000, null, () => {
                            this.controls.update();
                        })).start();
                    }

                    if (object.parent.name == 'fire') {
                        this.$.showModal = true;
                        this.$.showModalTitle = '火警消防';
                        this.$.showModalType = 5;
                        const target = object.parent.position.clone();
                        this.camera.lookAt(object);
                        this.controls.target = target;
                        let end = this.getPositionBySpherical(this.camera.position, target, Math.PI / 2, Math.PI, 800);
                        (this.tweenAnimate(this.camera.position, end, 1000, null, () => {
                            this.controls.update();
                        })).start();
                    }

                    if (object.parent.name == 'camera') {
                        if (object.name.indexOf('_0')) {
                            this.$.showModal = true;
                            this.$.showModalTitle = '视频监控';
                            this.$.showModalType = 19;
                        }
                        // this.$.$refs.model.type=12;
                        const target = object.parent.position.clone();
                        this.camera.lookAt(object);
                        this.controls.target = target;
                        let end = this.getPositionBySpherical(this.camera.position, target, Math.PI / 2, -Math.PI / 2, 600);
                        (this.tweenAnimate(this.camera.position, end, 1000, null, () => {
                            this.controls.update();
                        })).start();
                    }

                    if (object.name == 'fengji-waikuang' || object.name == 'fengji-shanye') {
                        if (instanceId < this.$.fengjis.length) {
                            this.$.fanDialog = true;
                            this.$.fanInfo = this.$.fengjis[instanceId];
                        }
                        let matrix = new Matrix4();
                        object.getMatrixAt(instanceId, matrix);
                        let target = new Vector3().setFromMatrixPosition(matrix.clone());
                        this.camera.lookAt(object);
                        this.controls.target = target;
                        let end = this.getPositionBySpherical(this.camera.position, target, Math.PI / 2, -Math.PI / 2, 600);
                        (this.tweenAnimate(this.camera.position, end, 1000, null, () => {
                            this.controls.update();
                        })).start();
                    }
                }
            } else {
                document.body.style.cursor = '';
            }
        });
    }
}
