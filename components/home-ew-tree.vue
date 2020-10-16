<template>
    <div class="box left">
        <div class="title"><h3>隧道列表</h3><a @click="link" href="javascript:;">返回</a></div>
        <div class="l_tree_container">
            <vue-scroll :ops="ops" style="width:100%;height:calc(100% - 100px)">
                <ul v-if="model.length>0" class="l_tree">
                    <li class="l_tree_branch">
                        <template v-for="(items,j) in model">
                            <div :key="j">
                                <div class="l_tree_click"
                                     @click="toggle(j),items.flag===true?items.flag=false:items.flag=true">
                                    <button v-if="items.flag" type="button" class="l_tree_children_btn position_new">-
                                    </button>
                                    <button v-if="!items.flag" type="button" class="l_tree_children_btn position_new">
                                        +
                                    </button>
                                    <span class="l_folder l_folder_l">{{ items.label }}</span>
                                </div>
                                <ul v-if="items.flag" class="l_tree l_tree1" :class="[j==model.length-1?'last':'']">
                                    <li class="l_tree_branch">
                                        <ul class="l_tree l_tree3">
                                            <li class="l_tree_branch l_tree_branch3"
                                                v-for="(item,index) in items.children" :key="index">
                                                <div class="l_tree_click"
                                                     @click="item.flag===true?item.flag=false:item.flag=true">
                                                    <span class="l_folder l_folder3">{{item.label}}</span>
                                                    <button v-if="item.flag" type="button"
                                                            class="l_tree_children_btn position">-
                                                    </button>
                                                    <button v-if="!item.flag" type="button"
                                                            class="l_tree_children_btn position">+
                                                    </button>
                                                </div>
                                                <ul v-if="item.flag===true" class="l_tree l_tree2">
                                                    <li class="l_tree_branch l_tree_branch3"
                                                        v-for="(item_new,index_new) in item.children" :key="index_new">
                                                        <div class="l_tree_click"
                                                             @click="check(item_new,item.children)">
                                                            <span class="l_folder l_folder3">{{item_new.label}}</span>
                                                            <button type="button" class="l_tree_children_btn position">
                                                                -
                                                            </button>
                                                            <span class="current"
                                                                  :class="[item_new.check===true?'on':'']"></span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </li>
                </ul>
            </vue-scroll>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .left {
        width: 20%;
        background: url("../assets/images/left-bg.png") no-repeat top center;
        padding: 30px 0;
        background-size: 100% 100%;
    }

    .current {
        width: 27px;
        height: 27px;
        border-radius: 100%;
        text-align: center;
        line-height: 27px;
        background-image: url("../assets/images/current.png"), url("../assets/images/current2.png"), url("../assets/images/current3.png");
        background-repeat: no-repeat, no-repeat, no-repeat;
        background-position: center, center, center;
        display: inline-block;
        vertical-align: middle;
        margin-left: 10px;
        opacity: 0;
        transition: all 0.3s ease-in-out;
    }

    .on {
        opacity: 1;
    }

    h3 {
        font-size: 18px;
        color: #1E6BC8;
        text-align: center;
    }

    span {
        color: #92CCFA;
    }

    span.l_folder {
        margin-left: 30px;
    }

    .l_tree_branch3 span.l_folder {
        margin-left: 0;
    }

    .box {
        position: fixed;
        top: 50px;
        right: 10px;
        bottom: 0;
        width: 500px;
        z-index: 9999;
    }

    .title {
        overflow: hidden;
        padding: 0 30px;
    }

    .title h3 {
        float: left;
    }

    .title a {
        float: right;
    }

    .l_tree_container {
        width: 90%;
        max-height: calc(100% - 43px);
        margin: 13px;
        overflow: hidden;
        position: relative;
    }

    .l_tree_click {
        position: relative;
    }

    .l_tree {
        width: calc(100%);
        height: 100%;
        padding-left: 42px;
    }

    .l_tree_branch {
        width: 100%;
        height: 100%;
        display: block;
        padding: 13px;
        position: relative;
        cursor: pointer;
    }

    .l_tree_branch3 span.l_folder3 {
        margin-left: -10px;
    }

    .l_tree_branch .l_tree_children_btn {
        width: 24px;
        height: 24px;
        background: inherit;
        background-color: rgba(255, 255, 255, 0);
        box-sizing: border-box;
        border-width: 1px;
        border-style: solid;
        border-color: rgba(25, 141, 218, 1);
        border-radius: 4px;
        cursor: pointer;
        margin-right: 5px;
        position: relative;
        z-index: 999;
    }

    ul.l_tree:before {
        content: "";
        border-left: 1px dashed #1e6bc8;
        height: calc(100%);
        position: absolute;
        left: 10px;
        top: 0px;
    }

    ul.l_tree2:before {
        height: calc(100%);
        // top: -18px;
    }

    ul.last:before {
        display: none;
    }

    .l_tree,
    .l_tree_branch, .l_folder {
        position: relative;
    }

    span.l_folder::after {
        content: "";
        width: 20px;
        height: 0;
        border-bottom: 1px dashed #1e6bc8;
        position: absolute;
        right: calc(100% + 10px);
        top: 10px;
    }

    span.l_folder_l:last-child::after {
        content: "";
        width: 20px;
        height: 0;
        border-top: 1px dashed #1e6bc8;
        position: absolute;
        right: calc(100% + 10px);
        top: 10px;
    }

    // span.l_folder3::after {
    //     content: "";
    //     width: 24px;
    //     height: 24px;
    //     background: inherit;
    //     background-color: rgba(255, 255, 255, 0);
    //     box-sizing: border-box;
    //     border-width: 1px;
    //     border-style: solid;
    //     border-color: rgba(25, 141, 218, 1);
    //     background-color: #0d1845;
    //     border-radius: 4px;
    //     position: absolute;
    //     top: 0px;
    //     right: calc(100% + 22px);
    // }

    .l_tree_container > .l_tree::before,
    .l_tree_container > .l_tree > .l_tree_branch::after {
        display: none;
    }

    .position {
        position: absolute !important;
        left: -58px;
        background: #fff !important;
        border-color: #fff !important;
    }

    .position_new {
        background: #fff !important;
        border-color: #fff !important;
    }
</style>
<script>
    export default {
        data () {
            return {
                ops: {
                    vuescroll: {},
                    scrollPanel: {},
                    rail: {
                        keepShow: true
                    },
                    bar: {
                        hoverStyle: true,
                        onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
                        showDelay: 500,
                        keepShow: true,
                        background: '#1E6BC8',
                        opacity: 1,
                        hoverStyle: false,
                        specifyBorderRadius: false,
                        minSize: false,
                        size: '3px',
                        disable: false
                    }
                },
                current: 0.0,
                model: []
            };
        },
        watch: {
            $route (to, from) {
                this.$store.commit('setTunnelShow', 0);
            }
        },
        created () {
            this.getAllTunnelTree();

        },
        methods: {
            link () {
                this.$store.commit('setTunnelShow', 0);
            },
            getAllTunnelTree () {
                this.getRequest(`/system/tunnel/getAllTunnelTree`)
                    .then(res => {
                        console.log(res);
                        if (res.status == 200) {
                            this.model = res.data.data.rows;
                            this.model.map(item => {
                                this.$set(item, 'flag', true);
                                item.children.map(el => {
                                    this.$set(el, 'flag', true);
                                    el.children.map(element => {
                                        this.$set(element, 'check', false);
                                    });
                                });
                            });
                        }

                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            toggle: function(j) {
                console.log(j);
            },
            onItem: function(item, index, j) {
                let _this = this;
                _this.current = index + '.' + j;
                _this.$emit('onItem', index + '.' + j);
                console.log(item, index, j);
            },
            check (row, scope) {
                this.model.forEach(element => {
                    element.children.forEach(el => {
                        el.children.forEach(item => {
                            item.check = false;
                        });
                    });
                });
                row.check = true;
                this.$store.commit('setTunnelId', row.tunnelId);
                this.$router.push('/Warning?tunnelId=' + row.tunnelId);
                setTimeout(() => {
                    this.$router.go(0);
                }, 500);
            }
        }
    };
</script>