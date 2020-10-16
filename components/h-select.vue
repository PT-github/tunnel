<template>
    <el-select v-model="selectData" :clearable="!required" :placeholder="placeholder" :multiple="multiple"
               :filterable="filterable">
        <el-option v-for="item,index in options"
                   :key="index"
                   :label="item.name"
                   :value="item.value">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: {
            autoSelect: Boolean,    // 是否默认选中第一个
            filterable: Boolean,
            required: Boolean,
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
                    this.selectData = this.value || (this.autoSelect && this.options.length ? this.options[ 0 ].value : null);
                } else {
                    let {service, func, params} = this.ds;
                    this.$bean.makeBean(service)[ func ](params).then(res => {
                        this.options = res;
                        this.selectData = this.value || (this.autoSelect && this.options.length ? this.options[ 0 ].value : null);
                    });
                }
            }
        },
        mounted () {
            this.init();
        },
        watch: {
            'ds.params.tunnelId': {
                handler () {
                    this.init();
                }
            },
            'ds.params.leftRightFlag': {
                handler () {
                    this.init();
                }
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