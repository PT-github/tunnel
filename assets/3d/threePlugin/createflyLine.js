import * as THREE from 'three';
import { LineMaterial } from "./LineMaterial";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { Line2 } from "three/examples/jsm/lines/Line2";

function createLineGeometry(positions,colors) {
    let geometry = new LineGeometry();
    geometry.setPositions(positions);
    geometry.setColors(colors);
    return geometry;
}

function createLineMesh(positions,colors,width,height){
    let geometry = createLineGeometry(positions,colors);
    let material = new LineMaterial({
      linewidth: 1,
      transparent: true,
      vertexColors: THREE.VertexColors,
    });

    material.resolution.set(width, height);

    return new Line2(geometry, material);
  }

export function createLine(points,width,height){
    var spline = new THREE.CatmullRomCurve3( points );
    var divisions = Math.round( 50 * points.length );
    var color = new THREE.Color();
    let colors = [];
    let positions = [];
    for ( var i = 0, l = divisions; i < l; i ++ ) {
        var point = spline.getPoint( i / l );
        positions.push( point.x, point.y, point.z );
        color.setRGB( 255,255,0 );
        colors.push( color.r, color.g, color.b );
    };
    return createLineMesh(positions,colors,width,height);
}