const baseUrl = '';
export default {
    CUBEMAP: {
        RIGHT: {
            img: baseUrl+"/img/Right.png",
            rotation: Math.PI / 2,
            angle: [Math.PI / 2, Math.PI / 2]
        },
        LEFT: {
            img: baseUrl+"/img/Left.png",
            rotation: -Math.PI / 2,
            angle: [Math.PI / 2, -Math.PI / 2]
        }, 
        BACK: {
            img: baseUrl+"/img/Back.png",
            rotation: Math.PI,
            angle: [Math.PI / 2, -Math.PI]
        }, 
        FRONT: {
            img: baseUrl+"/img/Front.png",
            rotation: 0,
            angle: [Math.PI / 2, 0]
        }, 
        TOP: {
            img: baseUrl+"/img/Top.png",
            rotation: 0,
            angle: [0, 0]
        }, 
        BOTTOM: {
            img: baseUrl+"/img/Bottom.png",
            rotation: -Math.PI,
            angle: [Math.PI, 0]
        }
    },
    TREE_ICON: baseUrl+"/img/model_tree.png",
    INFO_ICON: baseUrl+"/img/info.png",

    SHOW_MESH_IMG: baseUrl+"/img/show_mesh.png",
    HIDE_MESH_IMG: baseUrl+"/img/hide_mesh.png",

    HOME_IMG:baseUrl+"/img/home.png",
    MESH_EXPLODE_IMG: baseUrl+"/img/explode.png",
    MESH_CUT_IMG: baseUrl+"/img/cut_mesh.png",
    MESH_RECT_SELECT: baseUrl+"/img/rect_select.png",

    HIGHLIGHT: "#00BFFF",
    SVGNS:"http://www.w3.org/2000/svg"
}