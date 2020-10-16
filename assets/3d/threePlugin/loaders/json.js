/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
import * as THREE from 'three'
import {
	AdditiveBlending,
	AnimationClip,
	BackSide,
	Color,
	CustomBlending,
	DoubleSide,
	Face3,
	FaceColors,
	FileLoader,
	Geometry,
	BufferGeometry,
	Loader,
	LoaderUtils,
	MaterialLoader,
	Math as _Math,
	MirroredRepeatWrapping,
	MultiplyBlending,
	NoBlending,
	NormalBlending,
	RepeatWrapping,
	SubtractiveBlending,
	TextureLoader,
	Vector2,
	Vector3,
	Vector4,
	VertexColors
} from "three";


var LegacyJSONLoader = ( function () {

	function LegacyJSONLoader( manager ) {

		if ( typeof manager === 'boolean' ) {

			console.warn( 'THREE.JSONLoader: showStatus parameter has been removed from constructor.' );
			manager = undefined;

		}

		Loader.call( this, manager );

		this.withCredentials = false;

	}

	LegacyJSONLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

		constructor: LegacyJSONLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			var scope = this;

			var path = ( this.path === '' ) ? LoaderUtils.extractUrlBase( url ) : this.path;

			var loader = new FileLoader( this.manager );
			loader.setPath( this.path );
			loader.setWithCredentials( this.withCredentials );
			loader.load( url, function ( text ) {

				var json = JSON.parse( text );
				var metadata = json.metadata;

				if ( metadata !== undefined ) {

					var type = metadata.type;

					if ( type !== undefined ) {

						if ( type.toLowerCase() === 'object' ) {

							console.error( 'THREE.JSONLoader: ' + url + ' should be loaded with THREE.ObjectLoader instead.' );
							return;

						}

					}

				}

				var object = scope.parse( json, path );
				onLoad( object.geometry, object.materials );

			}, onProgress, onError );

		},

		parse: ( function () {

			var _BlendingMode = {
				NoBlending: NoBlending,
				NormalBlending: NormalBlending,
				AdditiveBlending: AdditiveBlending,
				SubtractiveBlending: SubtractiveBlending,
				MultiplyBlending: MultiplyBlending,
				CustomBlending: CustomBlending
			};

			var _color = new Color();
			var _textureLoader = new TextureLoader();
			var _materialLoader = new MaterialLoader();

			function initMaterials( materials, texturePath, crossOrigin, manager ) {

				var array = [];

				for ( var i = 0; i < materials.length; ++ i ) {

					array[ i ] = createMaterial( materials[ i ], texturePath, crossOrigin, manager );

				}

				return array;

			}

			function createMaterial( m, texturePath, crossOrigin, manager ) {

				// convert from old material format

				var textures = {};

				//

				var json = {
					uuid: _Math.generateUUID(),
					type: 'MeshLambertMaterial'
				};

				for ( var name in m ) {

					var value = m[ name ];

					switch ( name ) {

						case 'DbgColor':
						case 'DbgIndex':
						case 'opticalDensity':
						case 'illumination':
							break;
						case 'DbgName':
							json.name = value;
							break;
						case 'blending':
							json.blending = _BlendingMode[ value ];
							break;
						case 'colorAmbient':
						case 'mapAmbient':
							console.warn( 'THREE.LegacyJSONLoader.createMaterial:', name, 'is no longer supported.' );
							break;
						case 'colorDiffuse':
							json.color = _color.fromArray( value ).getHex();
							break;
						case 'colorSpecular':
							json.specular = _color.fromArray( value ).getHex();
							break;
						case 'colorEmissive':
							json.emissive = _color.fromArray( value ).getHex();
							break;
						case 'specularCoef':
							json.shininess = value;
							break;
						case 'shading':
							if ( value.toLowerCase() === 'basic' ) json.type = 'MeshBasicMaterial';
							if ( value.toLowerCase() === 'phong' ) json.type = 'MeshPhongMaterial';
							if ( value.toLowerCase() === 'standard' ) json.type = 'MeshStandardMaterial';
							break;
						case 'mapDiffuse':
							json.map = loadTexture( value, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapDiffuseRepeat':
						case 'mapDiffuseOffset':
						case 'mapDiffuseWrap':
						case 'mapDiffuseAnisotropy':
							break;
						case 'mapEmissive':
							json.emissiveMap = loadTexture( value, m.mapEmissiveRepeat, m.mapEmissiveOffset, m.mapEmissiveWrap, m.mapEmissiveAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapEmissiveRepeat':
						case 'mapEmissiveOffset':
						case 'mapEmissiveWrap':
						case 'mapEmissiveAnisotropy':
							break;
						case 'mapLight':
							json.lightMap = loadTexture( value, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapLightRepeat':
						case 'mapLightOffset':
						case 'mapLightWrap':
						case 'mapLightAnisotropy':
							break;
						case 'mapAO':
							json.aoMap = loadTexture( value, m.mapAORepeat, m.mapAOOffset, m.mapAOWrap, m.mapAOAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapAORepeat':
						case 'mapAOOffset':
						case 'mapAOWrap':
						case 'mapAOAnisotropy':
							break;
						case 'mapBump':
							json.bumpMap = loadTexture( value, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapBumpScale':
							json.bumpScale = value;
							break;
						case 'mapBumpRepeat':
						case 'mapBumpOffset':
						case 'mapBumpWrap':
						case 'mapBumpAnisotropy':
							break;
						case 'mapNormal':
							json.normalMap = loadTexture( value, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapNormalFactor':
							json.normalScale = value;
							break;
						case 'mapNormalRepeat':
						case 'mapNormalOffset':
						case 'mapNormalWrap':
						case 'mapNormalAnisotropy':
							break;
						case 'mapSpecular':
							json.specularMap = loadTexture( value, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapSpecularRepeat':
						case 'mapSpecularOffset':
						case 'mapSpecularWrap':
						case 'mapSpecularAnisotropy':
							break;
						case 'mapMetalness':
							json.metalnessMap = loadTexture( value, m.mapMetalnessRepeat, m.mapMetalnessOffset, m.mapMetalnessWrap, m.mapMetalnessAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapMetalnessRepeat':
						case 'mapMetalnessOffset':
						case 'mapMetalnessWrap':
						case 'mapMetalnessAnisotropy':
							break;
						case 'mapRoughness':
							json.roughnessMap = loadTexture( value, m.mapRoughnessRepeat, m.mapRoughnessOffset, m.mapRoughnessWrap, m.mapRoughnessAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapRoughnessRepeat':
						case 'mapRoughnessOffset':
						case 'mapRoughnessWrap':
						case 'mapRoughnessAnisotropy':
							break;
						case 'mapAlpha':
							json.alphaMap = loadTexture( value, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy, textures, texturePath, crossOrigin, manager );
							break;
						case 'mapAlphaRepeat':
						case 'mapAlphaOffset':
						case 'mapAlphaWrap':
						case 'mapAlphaAnisotropy':
							break;
						case 'flipSided':
							json.side = BackSide;
							break;
						case 'doubleSided':
							json.side = DoubleSide;
							break;
						case 'transparency':
							console.warn( 'THREE.LegacyJSONLoader.createMaterial: transparency has been renamed to opacity' );
							json.opacity = value;
							break;
						case 'depthTest':
						case 'depthWrite':
						case 'colorWrite':
						case 'opacity':
						case 'reflectivity':
						case 'transparent':
						case 'visible':
						case 'wireframe':
							json[ name ] = value;
							break;
						case 'vertexColors':
							if ( value === true ) json.vertexColors = VertexColors;
							if ( value === 'face' ) json.vertexColors = FaceColors;
							break;
						default:
							console.error( 'THREE.LegacyJSONLoader.createMaterial: Unsupported', name, value );
							break;

					}

				}

				if ( json.type === 'MeshBasicMaterial' ) delete json.emissive;
				if ( json.type !== 'MeshPhongMaterial' ) delete json.specular;

				if ( json.opacity < 1 ) json.transparent = true;

				_materialLoader.setTextures( textures );

				return _materialLoader.parse( json );

			}

		
			return function parse( json, v, f, uv ) {
			
			};

		} )()

	} );

	return LegacyJSONLoader;

} )();


export { LegacyJSONLoader };
