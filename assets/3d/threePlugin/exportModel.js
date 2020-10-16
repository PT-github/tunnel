import { GLTFExporter } from './exporters/GLTFExporter';

function save( blob, filename ) {
    var link = document.createElement( 'a' );
    link.style.display = 'none';
    document.body.appendChild( link ); // Firefox workaround, see #6594
    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();
    document.body.removeChild(link);
}

function saveArrayBuffer( buffer, filename ) {
    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}

function saveString( text, filename ) {
    save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}


export default function exportToGLTF(scene,binary) {
    var gltfExporter = new GLTFExporter();
    var options = {
        trs: true,
        onlyVisible: true,
        truncateDrawRange:true,
        binary: binary||false,
        forceIndices: true,
        forcePowerOfTwoTextures: true
    };
    gltfExporter.parse( scene, function ( result ) {
        if ( result instanceof ArrayBuffer ) {
            saveArrayBuffer( result, 'scene.glb' );
        } else {
            var output = JSON.stringify( result, null, 2 );
            // console.log(output);
            // saveString( output, 'scene.gltf' );
        }
    }, options );
}