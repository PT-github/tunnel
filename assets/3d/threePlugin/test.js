import ThreeBase from "../js/threePlugin/threeBase";
import { Line2 } from '../js/threePlugin/lines/Line2';
import { LineMaterial } from '../js/threePlugin/lines/LineMaterial';
import { LineGeometry } from '../js/threePlugin/lines/LineGeometry';
import { CSS2DObject } from '../js/threePlugin/render/CSSRenderer';

import { Vector3, Mesh, MeshBasicMaterial, Line, BufferGeometry, Box3, Shape, ShapeGeometry, CircleGeometry, Spherical, LineBasicMaterial, BufferAttribute, AxesHelper, GridHelper, PlaneGeometry, DoubleSide, CanvasTexture, RepeatWrapping, CircleBufferGeometry, LineSegments, Matrix4, LineDashedMaterial, MathUtils, Geometry } from 'three';
import { Vector2 } from "three/build/three.module";

const pointMaterial = new MeshBasicMaterial({
  color: 0xfff000,
  depthTest: false,
  depthWrite: false,
  transparent: true,
  side: 2
});

export default class View extends ThreeBase {
  config = {
    camera: {
      fov: 45,
      near: 0.00001,
      far: 10000,
      position: new Vector3(0, 1600, 0),
      up: new Vector3(0, 1, 0),
      lookAt: new Vector3(0, 0, 0)
    },
    bgColors: ["#ffffff", "#353535"],
    exposure: 1.5
  };

  constructor(dom, $) {
    super(dom);
    this.$ = $;
    this.objects = [];
    this.box = new Vector3(0, 0, 0);
    this.initBase();
  }

  createCanvasTexture(width, height) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "rgba(70,130,80,1)";
    ctx.fillRect(0, 0, width, height)

    const step = 100;
    for (let i = 0; i <= width; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      if (i == height) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000000'; //线的颜色
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff'; //线的颜色
      }
      ctx.stroke();
      ctx.closePath();
    }

    for (let i = 0; i <= height; i += step) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      if (i == height / 2) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000000'; //线的颜色
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff'; //线的颜色
      }

      ctx.stroke();
      ctx.closePath();
    }

    return canvas;
  }

  initBase() {
    super.init();
    super.setCamera(this.config.camera);
    super.initControls(this.center);
    this.initPaintCanvas();
    this.initLight();

    this.controls.maxAzimuthAngle = 0;
    this.controls.maxPolarAngle = 0;
    this.controls.enableRotate = false;
    this.controls.update();
  }

  initPaintCanvas() {
    document.body.style.cursor = 'pointer';
    const width = 8000, height = 4000;
    let texture = new CanvasTexture(this.createCanvasTexture(width, height));
    texture.wrapS = texture.wrapT = RepeatWrapping;
    let plane = new PlaneGeometry(width, height);
    let material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide
    });
    let mesh = new Mesh(plane, material);
    mesh.rotation.x -= Math.PI / 2;
    this.scene.add(mesh);
    this.bindClick([mesh]);
  }

  reDrawCircle(circle, p1, p2) {
    let [line, label, polygon, polygon2] = circle.children;
    let shape = new Shape()
      .moveTo(0, 0)
      .absarc(0, 0, p1.distanceTo(p2), 0, Math.PI * 2, false);
    shape.autoClose = true;
    let geometry = circle.geometry;
    let ps = new BufferGeometry().setFromPoints(shape.getPoints(200));
    geometry.setPositions(ps.attributes.position.array);
    circle.geometry = geometry;
    circle.computeLineDistances();



    let t = new Vector3().subVectors(p2.clone(), p1.clone());
    let angle = t.clone().normalize().angleTo(new Vector3(1,0,0));
    let km;
    if(t.z>0){ //一二象限
      km = Math.PI/2-angle;
    }else{ //三四象限
      km = Math.PI/2+angle;
    }

    let points = this.getInnerCutPoints(t,p1.distanceTo(p2), circle.edge, km);
    let geometry2 = new BufferGeometry();
    geometry2.attributes.position = new BufferAttribute(new Float32Array(points), 3);
    polygon.geometry = geometry2;
    polygon.visible = false

    let x = Math.PI/circle.edge;
    if(t.z>0){ //一二象限
      km = Math.PI/2-angle+x;
    }else{ //三四象限
      km = Math.PI/2+angle-x;
    }

    let points2 = this.getOutCutPoints(t,p1.distanceTo(p2), circle.edge, km);
    let geometry3 = new BufferGeometry();
    geometry3.attributes.position = new BufferAttribute(new Float32Array(points2), 3);
    polygon2.geometry = geometry3;
    polygon2.children.forEach((m,i)=>{
      if(m.userData.type = 'hollow'){
        let index = (i+1)*3;
        m.position.set(points2[index-3],points2[index-2],points2[index-1]);
        m.rotation.x = Math.PI/2;
      }
    });

    let line_geometry = new BufferGeometry();
    line_geometry.attributes.position = new BufferAttribute(new Float32Array([
      0, 0, 0, t.x, t.y, t.z
    ]), 3);
    line.geometry = line_geometry;
    label.element.innerHTML = p1.distanceTo(p2).toFixed(3);
    let k = t.multiplyScalar(.5);
    k.y = -k.z; //y轴必须有值
    label.position.copy(k);
  }

  radius_line(p1, p2) {
    let geometry = new BufferGeometry();
    let t = new Vector3().subVectors(p2.clone(), p1.clone());
    geometry.attributes.position = new BufferAttribute(new Float32Array([
      0,0,0, t.x, 0, t.z
    ]), 3);
    let material = new LineBasicMaterial({
      color: 0xffffff,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    let line = new Line(geometry, material);
    line.rotation.x += Math.PI / 2;

    return line;
  }

  drawCircle(point, radius) {
    let { x, y, z } = point;
    let shape = new Shape()
      .moveTo(x, z)
      .absarc(x, z, radius, 0, Math.PI * 2, false);
    shape.autoClose = true;
    let ps = new BufferGeometry().setFromPoints(shape.getPoints(200));
    let geometryPoints = new LineGeometry();
    geometryPoints.setPositions(ps.attributes.position.array);
    this.matLine = new LineMaterial({
      color: 0x72CFF9,
      linewidth:1.5,
      resolution:new Vector2(this.width,this.height),
      dashed:true,
      dashSize: 10,
      gapSize: 10
    });

    let circle = new Line2(geometryPoints,this.matLine);
    circle.computeLineDistances();

    // let circle = new Line(geometryPoints, new LineDashedMaterial({
    //   color: 0x72CFF9,
    //   side:2,
    //   linewidth: 1,
    //   dashSize: 10,
    //   gapSize: 10
    // }));
    circle.position.set(x, y, z);
    circle.rotation.x -= Math.PI / 2;
    let radius_line = this.radius_line(point, point);

    circle.add(radius_line);
    this.scene.add(circle);

    this.createRadiusLabel(circle, point);
    this.createPolygon(circle, point, 0, Math.round(Math.random() * 10 + 3, 0));
    this.createPicMesh(circle,"/centerPoint.png",20,20);

    return circle;
  }

  createPicMesh(mesh,url,width,height,color){
    let centerPointer = new PlaneGeometry(width,height);
    let material = new MeshBasicMaterial({
      color:color||0xffffff,
      map:this.loadTexture(url),
      side:2,
      transparent:true
    });
    let centerPointerMesh = new Mesh(centerPointer,material);
    mesh.add(centerPointerMesh);
    return mesh;
  }



  getInnerCutPoints(p,radius, edge, angle) {
    let points = [p.x,p.y,p.z]
    let step = Math.PI * 2.0 / edge;
    for (let i = 0; i < edge-1; i++) {
      angle += step;
      points.push(
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius
      );
    };
    points.push(p.x,p.y,p.z);
    return points;
  }

  getOutCutPoints(p,radius, edge, angle) {
    let points = []
    let step = Math.PI * 2.0 / edge;
    radius = 1 / Math.cos(step / 2) * radius;
    let angles = angle;
    for (let i = 0; i < edge; i++) {
      points.push(
        Math.sin(angles) * radius,
        0,
        Math.cos(angles) * radius
      );
      angles += step;
    };
    points.push(points[0],points[1],points[2]);
    return points;
  }

  createPolygon(circle, point, radius, edge = 5) {
    let t = new Vector3().subVectors(point.clone(), point.clone());
    let angle = t.clone().normalize().angleTo(new Vector3(1,0,0));
    if(t.z>0){ //一二象限
      angle = Math.PI/2-angle;
    }else{ //三四象限
      angle = Math.PI/2+angle;
    }
    let points = this.getInnerCutPoints(t,radius, edge,angle);
    let geometry = new BufferGeometry();
    geometry.attributes.position = new BufferAttribute(new Float32Array(points), 3);
    let material = new LineBasicMaterial({
      color: 0x72CFF9,
      side:2,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    let polygon = new Line(geometry, material);
    polygon.rotation.x += Math.PI / 2;
    circle.add(polygon);
    circle.polygon = polygon;
    circle.edge = edge;

    let points2 = this.getOutCutPoints(t,radius,edge,angle);    
    let geometry2 = new BufferGeometry();
    geometry2.attributes.position = new BufferAttribute(new Float32Array(points2), 3);
    let material2 = new LineBasicMaterial({
      color: 0x72CFF9,
      side:2,      
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    let polygon2 = new Line(geometry2, material2);
    polygon2.rotation.x = Math.PI / 2;
    circle.add(polygon2);
    circle.polygon2 = polygon2;

    this.createHollowPointer(polygon2,points2);
  }

  createHollowPointer(mesh,points){
    for (let i = 0; i < points.length; i+=3) {
      let m = this.createPicMesh(mesh,"/hollowPoint.png",12,12,null);
      // console.log(m);
      m.position.set(
        points[i],
        points[i+1],
        points[i+2]
      );
      m.userData.type = 'hollow';
    }
  }

  createRadiusLabel(circle, point) {
    let dom = document.getElementById("length_label").cloneNode(true);
    dom.innerHTML = point.distanceTo(point);
    let pointLabel = new CSS2DObject(dom);
    pointLabel.position.copy(new Vector3());
    circle.add(pointLabel);
    circle.label = pointLabel;
  }

  drawRegularPolygon(type) {
    let circle;
    this.canvas.onmousedown = ex => {
      if (circle) {
        circle.remove(circle.label);
        this.scene.remove(circle);
        circle = null;
        console.log('clear');
      }
      let raycasters = this.getRaycasters(ex, this.scene.children);
      if (raycasters.length > 0) {
        const { point } = raycasters[0];
        circle = this.drawCircle(point, 0);
        this.canvas.onmousemove = ey => {
          let move_raycasters = this.getRaycasters(ey, this.scene.children);
          if (move_raycasters.length > 0) {
            let end_point = move_raycasters[move_raycasters.length - 1].point;
            this.reDrawCircle(circle, point, end_point);
          }
        }
      }
    }
  }

  bindClick(objects) {
    this.canvas.addEventListener("mousedown", e => {
      let raycasters = this.getRaycasters(e, objects);
      if (raycasters.length > 0) {
        const { object, point } = raycasters[0];
      }
    });
  }
}
