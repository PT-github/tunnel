import * as THREE from "three";

const fs: string = `
      uniform sampler2D texture;
      varying float opacity;
      varying vec3 vexColor;
      void main(){
          gl_FragColor = vec4(vexColor,opacity);
          gl_FragColor *= texture2D(texture,gl_PointCoord);
      }      
`;
const vs: string = `
      attribute float size;
      attribute vec4 colors;
      varying float opacity;
      varying vec3 vexColor;

      void main(){
          float min_border = 100.0;
          float max_border = 120.0;
          float max_opacity = 1.0;
          float min_opacity = 0.03;

       
          vexColor.rgb = colors.rgb;
          vexColor.r = colors.a;
          //透明度
          opacity = 1.0;
          vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
      }
`;

/**
 * 粒子飞线
 */
export default class Lines {
  //曲线
  spline: THREE.CatmullRomCurve3;
  //粒子系统
  particleSystem?: THREE.Points;
  //粒子间的总距离
  distance: number;
  points?: THREE.Vector3[];
  tween: any;
  TWEEN: any;
  line?: THREE.Line;
  vecs: THREE.Vector3[];
  scene: THREE.Scene;

  /**
   * 创建粒子系统
   * @param vecs 粒子坐标
   * @param scene 
   */
  constructor({vecs,scene}: {vecs: THREE.Vector3[];scene: THREE.Scene;}) {
    this.scene = scene;
    this.vecs = vecs;
    this.TWEEN = require('@tweenjs/tween.js');

    this.spline = new THREE.CatmullRomCurve3(vecs);
    this.distance = this.spline.getLength();
  }

  /**
   * 初始化普通飞线
   */
  initLine(color?:THREE.Color) {
    color = color||new THREE.Color(0xFFFFFF);
    const divisions:number = Math.round(50 * this.vecs.length),
          colors = [],positions = [],
          geometry = new THREE.BufferGeometry();
    for (let i = 0; i < divisions; i++) {
      positions.push(...this.spline.getPoint(i / divisions).toArray());
      colors.push(...color.toArray());
    }
    geometry.addAttribute("position",new THREE.Float32BufferAttribute(positions, 3));
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    this.line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        // vertexColors: true,
        depthTest: true,
        depthWrite: true
      })
    );

    this.scene.add(this.line);
    return this.line;
  }

  /**
   * 初始化粒子飞线
   * @param num //粒子数目
   * @param color //粒子颜色
   * @param size  //粒子大小
   */
  initParticleSystem({ num, color, size }: { num:number,color: THREE.Color; size: number }) {
    //初始化粒子
    this.points = this.spline.getPoints(num);
    const geometry = new THREE.BufferGeometry().setFromPoints(this.points),
          colorsLen = this.points.length * 4,
          number = this.points.length,
          colors = new Float32Array(colorsLen),
          sizes = new Float32Array(number);
    for (let i = 0, z = 0; i < colorsLen; i += 4, z++) {
      //color
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
      //opacity
      colors[i + 3] =(i+1) / colorsLen;
      //size从小到大
      sizes[z] = size * (z / number);
    }
    geometry.addAttribute("colors", new THREE.BufferAttribute(colors, 4));
    geometry.addAttribute("size", new THREE.BufferAttribute(sizes, 1));
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture: {
          value: new THREE.CanvasTexture(this.createSpriteCanvas(size))
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthTest: false
    });

    this.particleSystem = new THREE.Points(geometry, shaderMaterial);
    this.scene.add(this.particleSystem);
    this.startAnimation(num,geometry);

    return this.particleSystem;
  }

  //飞线动画开始
  private startAnimation(num:number,geometry:THREE.BufferGeometry) {
    const max = this.distance * 10.0 + num,
          end: number = num,
          init = { start: 0, end };
    this.tween = this.tweenAnimate({current: init, target: { start: max - end, end: max }, interval: 2000, animation: null, onUpdate: () => {
        let pointArr: number[] = [];
        let s = Math.round(init.start), e = Math.floor(init.end);
        for (let i = s; i <= e && i <= max; i++) {
          pointArr = pointArr.concat(this.spline.getPointAt(i / max).toArray());
        }
        geometry.attributes.position = new THREE.BufferAttribute(new Float32Array(pointArr), 3);
    }});
    this.tween.repeat(Infinity).start();
  }

  stop() {
    this.particleSystem && (this.particleSystem.visible = false);
    this.tween.stop();
  }

  private tweenAnimate({ current, target, interval, animation, onUpdate, complete }:
    { current: object; target: object; interval: number; animation?: any; onUpdate?: Function; complete?: Function; }){
    var animate = animation ? animation : this.TWEEN.Easing.Linear.None;
    let tween = new this.TWEEN.Tween(current).to(target, interval).easing(animate);
    onUpdate && tween.onUpdate(() => onUpdate());
    complete && tween.onComplete(() => complete());

    return tween;
  }

  //创建圆形精灵贴图
  private createSpriteCanvas(size: number) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (context != null) {
      context.fillStyle = "rgba(255,255,255,.0)";
      context.beginPath();
      context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
      context.closePath();
    }
    return canvas;
  }
}
