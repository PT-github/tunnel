<!--设备监控，展示设备实时显示的内容-->
<template>
    <canvas ref="live"></canvas>
</template>

<script>
    export default {
        props: {
            resolutionPower: String,
            data: Object
        },
        data(){
            return {
                zr: ''
            }
        },
        computed: {
            canvasStyle () {
                let split = this.resolutionPower.split('*');
                return {
                    width: Number(split[ 0 ]),
                    height: Number(split[ 1 ])
                };
            }
        },
        mounted () {
            console.log('device-live渲染', this.resolutionPower, this.data);
            delete require.cache[ './zrender.min' ];
            let zrender = require('./zrender.min');
            if(this.zr){
                zrender.dispose(this.zr)
            }
            let {width, height} = this.canvasStyle;
            this.zr = zrender.init(this.$refs.live, {width, height});
            let {bmps, backgroundColor, point, text, fontSize, color, bold, italics, spacing} = this.data;
            this.$refs.live.style.letterSpacing = spacing + 'px'; // 在这里设置字间距
            // 背景
            this.zr.add(new zrender.Rect({shape: {width, height}, style: {fill: backgroundColor || '#000000'}}));
            // 文字
            if (text) {
                this.zr.add(new zrender.Text({
                    style: {
                        x: point.x,
                        y: point.y,
                        fontStyle: italics ? 'italic' : 'normal',
                        textFill: color,
                        fontWeight: bold ? 'bold' : 'normal',
                        fontSize: fontSize,
                        text: text.replace(/\\n/g, '\n')
                    }
                }));
            }
            if (bmps) {
                bmps.forEach(v => {
                    this.zr.add(new zrender.Image({
                        style: {
                            x: point.x,
                            y: point.y,
                            image: 'data:image/bmp;base64,' + v.bytes
                        }
                    }));
                });
            }
        }
    };
</script>

<style scoped lang='less'>
</style>