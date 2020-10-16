import * as THREE from 'three';

export function RevitLoader(manager) {
	THREE.Loader.call(this, manager);
}

RevitLoader.prototype = Object.assign(Object.create(THREE.Loader.prototype), {
	constructor: RevitLoader,
	scene: null,
	parse: function ({ filePath, scene }) {
		this.scene = scene;
		return Promise.all(
			[
				
				new Promise(resolve => new THREE.FileLoader().setResponseType('arraybuffer').load(filePath + 'vertices.bin', data => resolve(new Float32Array(data)))),
				new Promise(resolve => new THREE.FileLoader().setResponseType('arraybuffer').load(filePath + 'faces.bin', data => resolve(new Uint32Array(data)))),
				new Promise(resolve => new THREE.FileLoader().setResponseType('arraybuffer').load(filePath + 'uvs.bin', data => resolve(new Float32Array(data)))),
				new Promise(resolve => new THREE.FileLoader().setResponseType('json').load(filePath + 'model.json', data => resolve(data))),
				// new Promise(resolve => new THREE.FileLoader().setResponseType('json').load(filePath + 'tree.bin', data => resolve(data))),
				// new Promise(resolve => new THREE.FileLoader().setResponseType('json').load(filePath + 'data.bin', data => resolve(data))),
			]
		).then(list => {
			const [v, f, uv, m] = list;
			// 615093
			console.log(m, v.length);
			let num = 0;
			m.object.children[0].children.forEach(m => {
				num += m.children.length;
			});
			console.log(num);
			let geometries = this.parseGeometriesWidthBin(m.geometries, v, f, uv);
			let materials = this.parseMaterials(m.materials, m._textures);
			let object = this.parseObject(m.object, geometries, materials);
			return new Promise(resolve => resolve({ object }));
			// return new Promise(resolve=>resolve({object,tree,data}));
		});
	},
	parseGeometriesWidthBin: function (json, v, f, uv) {
		const geometries = [];
		for (let i = 0; i < json.length; i++) {
			geometries.push(this.parseGeometry(json[i].data, v, f, uv));
		}
		return geometries;
	},
	parseGeometry(json, v, f, uv) {
		let geometry = new THREE.BufferGeometry();
		geometry.attributes.position = new THREE.BufferAttribute(v.subarray(json.v[0], json.v[1]), 3);
		geometry.setIndex(Array.from(f.subarray(json.f[0], json.f[1])));
		(json.uv) && (geometry.attributes.uv = new THREE.BufferAttribute(uv.subarray(json.uv[0], json.uv[1]), 2));
		geometry.computeVertexNormals();
		return geometry;
	},
	parseMaterials: function (json, textures) {
		var materials = [];
		if (json !== undefined) {
			var loader = new MaterialLoader();
			for (var i = 0, l = json.length; i < l; i++) {
				var data = json[i];
				materials.push(loader.parse(data, textures));
			}
		}
		return materials;
	},
	parseObject: function (data, geometries, materials) {
		var object;
		function getGeometry(name) {
			return geometries[name];
		}
		function getMaterial(name) {
			if (name === undefined) return undefined;
			if (Array.isArray(name)) {
				var array = [];
				for (var i = 0, l = name.length; i < l; i++) {
					var uuid = name[i];
					array.push(materials[uuid]);
				}
				return array;
			}
			return materials[name];
		}
		if (data.type == 2) {
			object = new THREE.Mesh(getGeometry(data.gid), getMaterial(data.mid));
		} else {
			object = new THREE.Object3D();
			object.uuid = data.uuid;
			object.name = data.name;
		}
		if (data.matrix !== undefined) {
			var matrix = new THREE.Matrix4();
			matrix.fromArray(data.matrix);
			object.applyMatrix(matrix);
			object.userData.position = new THREE.Vector3(0, 0, 0);
		} else {
			if (data.position !== undefined) object.position.fromArray(data.position);
			if (data.rotation !== undefined) object.rotation.fromArray(data.rotation);
			if (data.scale !== undefined) object.scale.fromArray(data.scale);
			if (data.quaternion !== undefined) object.quaternion.fromArray(data.quaternion);
			object.userData.position = object.position.clone();
			object.updateWorldMatrix();
		}

		// if (data.castShadow !== undefined) object.castShadow = data.castShadow;
		// if (data.receiveShadow !== undefined) object.receiveShadow = data.receiveShadow;
		// if (data.frustumCulled !== undefined) object.frustumCulled = data.frustumCulled;
		// if (data.renderOrder !== undefined) object.renderOrder = data.renderOrder;
		// if (data.userData !== undefined) object.userData = data.userData;
		if (data.children !== undefined) {
			var children = data.children;
			for (var i = 0; i < children.length; i++) {
				object.add(this.parseObject(children[i], geometries, materials));
			}
		}
		return object;
	}
});

function MaterialLoader(manager) {
	THREE.Loader.call(this, manager);
	this.textures = {};
}

MaterialLoader.prototype = Object.assign(Object.create(THREE.Loader.prototype), {
	constructor: THREE.MaterialLoader,
	load: function (url, onLoad, onProgress, onError) {
		var scope = this;
		var loader = new THREE.FileLoader(scope.manager);
		loader.setPath(scope.path);
		loader.load(url, function (text) {
			onLoad(scope.parse(JSON.parse(text)));
		}, onProgress, onError);

	},
	setTextureByBase64(base64, path) {
		let img = new Image();
		img.src = base64;
		let texture = new THREE.Texture(img);
		// var isJPEG = path.search(/\.jpe?g($|\?)/i) > 0 || path.search(/^data\:image\/jpeg/) === 0;
		// texture.format = THREE.RGBAFormat;
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.needsUpdate = true;
		texture.name = path;

		return texture;
	},
	parse: function (json, textures) {
		var material = new THREE.MeshStandardMaterial();
		if (json.color !== undefined) material.color.setHex(json.color);
		material.roughness = 0.0;
		material.metalness = 0.0;
		material.side = THREE.DoubleSide;
		// material.wireframe = true;
		if (json.transparent !== undefined) material.transparent = json.transparent;
		if (json.opacity !== undefined) material.opacity = json.opacity;
		if (json.texture != null) material.map = this.setTextureByBase64(textures[json.texture], json.texture);


		// if (json.bump_map != null) {
		// 	material.bumpMap = this.setTextureByBase64(textures[json.bump_map], json.bump_map);
		// 	material.bumpScale = .01;
		// }

		return material;
	}
});
