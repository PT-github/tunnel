import Vue from 'vue';
Vue.directive('drag', {
    bind(el, binding, vnode, oldVnode) {
        var oDiv = el;
        oDiv.onmousedown = function (event) {
          //  alert(1)
          if(event.button==0){//判断是否点击鼠标左键  
            var gapX=event.clientX;
            var  startx = el.scrollLeft;  // scroll的初始位置

            //movemove事件必须绑定到$(document)上，鼠标移动是在整个屏幕上的  
            // $(document).bind("mousemove",move);  
            // //此处的$(document)可以改为obj  
            // $(document).bind("mouseup",stop);                           
        }  
        //return false;//阻止默认事件或冒泡  
            // var disX = ev.clientX - oDiv.offsetLeft;
            // var disY = ev.clientY - oDiv.offsetTop;
            document.onmousemove = function (ev) {
                var left = ev.clientX-gapX;
                // var t = ev.clientY - disY;
                //console.log(l)        
                oDiv.scrollLeft=(startx-left )  
                // oDiv.style.left = l + '      ';
                // oDiv.style.top = t + 'px';
            };
            document.onmouseup = function () {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }
});