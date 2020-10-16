<template>
    <div>
        <template v-if="buttonOnly">
            <uploader :options="options" class="uploader-button"
                      :file-status-text="statusText"
                      :autoStart="false"
                      @file-complete="onFileComplete"
                      @file-success="onFileSuccess"
                      @file-added="filesAdded">
                <!-- 默认 `false`, 如果设为 `true`，则代表一次只能选择一个文件。 -->
                <uploader-btn :single="single" :attrs="attrs">选择附件</uploader-btn>
            </uploader>
        </template>
        <template v-else>
            <uploader :options="options" class="uploader-example"
                      :file-status-text="statusText"
                      :autoStart="false"
                      @file-complete="onFileComplete"
                      @file-success="onFileSuccess"
                      @file-added="filesAdded">
                <!-- 不支持 HTML5 File API 的时候会显示。 uploader-unsupport -->
                <uploader-unsupport></uploader-unsupport>
                <!-- 拖拽上传区域 -->
                <uploader-drop>
                    <!-- 默认 `false`, 如果设为 `true`，则代表一次只能选择一个文件。 -->
                    <uploader-btn :single="single" :attrs="attrs">选择附件</uploader-btn>
                </uploader-drop>
                <!-- 文件、文件夹列表 -->
                <uploader-list v-show="showUpload"></uploader-list>
            </uploader>
        </template>
    </div>
</template>

<script>
    import SparkMD5 from 'spark-md5';

    export default {
        props: {
            buttonOnly: Boolean,    // 是否只展示上传按钮
            busType: {  // 业务类型
                type: String,
                default: () => {
                    return 'test';
                }
            },
            single: {  // 文件是否单选
                type: Boolean,
                default: () => {
                    return false;
                }
            },
            path:{ // 返回值是否显示路劲默认显示文件ID
              type: Boolean,
                default: () => {
                    return false;
                }
            },
            showUpload:{  // 是否上传完后显示
              type: Boolean,
                default: () => {
                    return true;
                }
            }
        },
        data () {
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let currentDay = date.getFullYear() + (month + '').padStart(2, '0') + +(day + '').padStart(2, '0');
            return {
                // options API https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
                options: {
                    //  上传得接口地址
                    target: Context.$config.baseUrl + '/tunnel/rest/file/' + (this.path?'commonUploadFileReturnPath':'chunkUploadFileReturnId'),
                    // 是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等，默认 true
                    testChunks: false,
                    // 进度回调间隔，默认是 500。
                    progressCallbacksInterval: 800,
                    headers: {//设置header
                        jwt: this.$store.state.myUserInfo.jwt
                    },
                    //  参数
                    query: {
                        busType: this.busType,
                        uploadDate: currentDay
                    }
                },
                // 添加到 input 元素上的额外属性。
                attrs: {
                    accept: '*'
                },
                statusText: {
                    success: '上传成功',
                    error: '出错了',
                    uploading: '上传中',
                    paused: '暂停中',
                    waiting: '等待中'
                },
                fileId: [],
                returnFile: {
                  name: "",
                  path:""
                }
            };
        },
        mounted () {
            // console.log(this.$store.state.myUserInfo.jwt)
        },
        methods: {
            // 所有文件上传完的回调
            onFileComplete (message) {
                let data = {};
                this.path?(data=this.returnFile):(data=this.fileId);
                this.$emit('uploadOver', data);
            },
            // 单个文件上传完的回调
            onFileSuccess (rootFile, file, response, chunk) {
                if(this.path&&response){
                  this.returnFile.path = JSON.parse(response).data;
                }else{
                  this.fileId.push(response);
                }
                console.log('单个文件上传完的回调', response);
                // this.$emit("uploadOver",this.md5)
            },
            //  （保证上传文件的完整性和一致性）
            computeMD5 (file) {
                this.returnFile.name = file.name;
                this.$ctx.showLoading('正在校验文件MD5...');
                let fileReader = new FileReader();
                let time = new Date().getTime();
                let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                let currentChunk = 0;
                const chunkSize = 10 * 1024 * 1000;
                let chunks = Math.ceil(file.size / chunkSize);
                let spark = new SparkMD5.ArrayBuffer();
                file.pause();
                loadNext();
                fileReader.onload = (e => {
                    spark.append(e.target.result);
                    if (currentChunk < chunks) {
                        currentChunk++;
                        loadNext();
                        this.$nextTick(() => {
                            console.log('校验MD5 ' + ((currentChunk / chunks) * 100).toFixed(0) + '%');
                        });
                    } else {
                        let md5 = spark.end();
                        this.$ctx.hideLoading();
                        this.computeMD5Success(md5, file);
                        console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
                    }
                });
                fileReader.onerror = function() {
                    this.$ctx.toastError(`文件${file.name}读取出错，请检查该文件`);
                    this.$ctx.hideLoading();
                    file.cancel();
                };

                function loadNext () {
                    let start = currentChunk * chunkSize;
                    let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                    fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
                }
            },

            computeMD5Success (md5, file) {
                file.uniqueIdentifier = md5;//把md5值作为文件的识别码
                file.resume();//开始上传
            },
            filesAdded (file, event) {
                //大小判断
                // const isLt100M = file.size / 1024 / 1024 < 10;
                this.computeMD5(file);
            }
        }
    };
</script>

<style lang="less" scoped>
    .uploader-button {
        font-size: 12px;
    }

    .uploader-example {
        width: 90%;
        padding: 15px;
        font-size: 12px;
        box-shadow: 0 0 10px rgba(0, 0, 0, .4);
    }

    .uploader-example .uploader-btn {
        margin-right: 4px;
    }

    .uploader-example .uploader-list {
        max-height: 440px;
        overflow: auto;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>