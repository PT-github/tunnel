<template>
    <el-radio-group v-model="radio">
        <el-radio v-for="item,index in options"
                  :key="index" :label="item.value">
            {{item.name}}
        </el-radio>
    </el-radio-group>
</template>

<script>
    export default {
        props: {
            multiple: Boolean,
            value: [ Number, String, Object, Array ],
            placeholder: String,
            ds: [ Array, Object ]
        },
        data () {
            return {
                selectData: null,
                options: []
            };
        },
        methods: {
            getSelectedName () {
                if (this.selectData !== null && this.selectData !== undefined && this.selectData !== '') {
                    return this.options.find(v => v.value === this.selectData).name;
                }
                return '';
            },
            init () {
                if (this.ds instanceof Array) {
                    this.options = this.ds;
                } else {
                    let {service, func, params} = this.ds;
                    this.$bean.makeBean(service)[ func ](params).then(res => {
                        this.options = res;
                    });
                }
            }
        },
        mounted () {
            this.init();
        },
        watch: {
            ds () {
                this.init();
            },
            value (v) {
                this.selectData = v;
            },
            selectData (v) {
                this.$emit('input', v);
            }
        }
    };
</script>

<style scoped>

</style>