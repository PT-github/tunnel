// 名字和编码对应
const cityMaps = {
    // =========hunan============== 
    '湖南省': '430000',
    '长沙市': '430100',
    '株洲市': '430200',
    '湘潭市': '430300',
    '衡阳市': '430400',
    '邵阳市': '430500',
    '岳阳市': '430600',
    '常德市': '430700',
    '张家界市': '430800',
    '益阳市': '430900',
    '郴州市': '431000',
    '永州市': '431100',
    '怀化市': '431200',
    '娄底市': '431300',
    '湘西土家族苗族自治州': '433100',
    // =========jiangsu============== 
    "江苏": "320000",
    "南京市": "320100",
    "无锡市": "320200",
    "徐州市": "320300",
    "常州市": "320400",
    "苏州市": "320500",
    "南通市": "320600",
    "连云港市": "320700",
    "淮安市": "320800",
    "盐城市": "320900",
    "扬州市": "321000",
    "镇江市": "321100",
    "泰州市": "321200",
    "宿迁市": "321300"
};
const cityOptionName = {
    '430000': '湖南高速',
    '430100': '长沙分公司',
    '430200': '株洲分公司',
    '430300': '湘潭分公司',
    '430400': '衡阳分公司',
    '430500': '邵阳分公司',
    '430600': '岳阳分公司',
    '430700': '常德分公司',
    '430800': '张家界分公司',
    '430900': '益阳分公司',
    '431000': '郴州分公司',
    '431100': '永州分公司',
    '431200': '怀化分公司',
    '431300': '娄底分公司',
    '433100': '湘西分公司',
    // ==========江苏=============
    "320000": "江苏高速",
    "320100": "南京",
    "320200": "无锡",
    "320300": "徐州",
    "320400": "常州",
    "320500": "苏州",
    "320600": "南通",
    "320700": "连云港",
    "320800": "淮安",
    "320900": "盐城",
    "321000": "扬州",
    "321100": "镇江",
    "321200": "泰州",
    "321300": "宿迁"
}
const provinceArr = ["320000", "430000", 'jiangsu', 'hunan']
const provinceMap = {
    320000: "江苏",
    430000: "湖南",
}
export default {
    cityMaps,
    provinceMap,
    provinceArr,
    cityOptionName
}