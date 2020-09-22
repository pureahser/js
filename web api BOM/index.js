window.addEventListener('load', function () {
    var arrowL = document.querySelector('.arrow-l');
    var arrowR = document.querySelector('.arrow-r');
    var body = document.querySelector('body');
    var ul = document.querySelector('ul');
    var lis = ul.querySelectorAll('li');
    var ol = document.querySelector('ol');
    body.addEventListener('mouseenter', function () {
        arrowL.style.display = 'block';
        arrowR.style.display = 'block';
    })
    body.addEventListener('mouseleave', function () {
        arrowL.style.display = 'none';
        arrowR.style.display = 'none';
    })
    //声明外部变量用来记录当前持有current样式的li的序号
    var currentNum = '';
    for (var i = 0; i < lis.length; i++) {
        var li = document.createElement('li');
        li.setAttribute('index',i);
        //但是未必要按钮与图片的绑定，而是利用自定义标签的序号做运算
        ol.appendChild(li);
        // 在循环创建元素的同时绑定事件给元素——妙啊！！！
        var num = 0;
        li.addEventListener('click', function () {
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            this.className = 'current';
            var index = this.getAttribute('index');
            currentNum =  document.querySelector('.current').getAttribute('index');
            // console.log(current)
            //由于这里是ul在动不是li在动所以无法使用自定义标签,setAttribute
            var focusWidth = body.offsetWidth;
            var j = -index * focusWidth;
            // console.log(j);
            animate(ul, j);
        })
    }
    ol.children[0].className = 'current';
    var flag = true;
    //此处设置节流阀
    function SR() {
        if(flag) {
            flag = false;
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            if(num == ol.children.length - 1) {
                num = 0;
                currentNum = 0;
                var focusWidth = body.offsetWidth;
                var j = -num* focusWidth;
                animate(ul,j,function() {
                    flag = true;
                });
            } else {
                num ++;
                currentNum ++;
                var focusWidth = body.offsetWidth;
                var j = -num* focusWidth;
                animate(ul,j,function() {
                    flag = true;
                });
            }
            ol.children[currentNum].className = 'current';
        }
    }
    arrowR.addEventListener('click',function() {
        SR();
    })
    arrowL.addEventListener('click',function() {
        if(flag) {
            flag = false;
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            if(num == 0) {
                num = ol.children.length - 1;
                currentNum = ol.children.length - 1;
                var focusWidth = body.offsetWidth;
                var j = -num* focusWidth;
                animate(ul,j,function() {
                    flag = true;
                });
            } else {
                num --;
                currentNum--;
                var focusWidth = body.offsetWidth;
                var j = -num* focusWidth;
                animate(ul,j,function() {
                    flag = true;
                });
            }
            ol.children[currentNum].className = 'current';
        }
    })
    var timeR = setInterval(SR , 7000);
    document.addEventListener('mouseleave',function() {
        var timeR = setInterval(SR , 7000);
        document.addEventListener('mouseover',function() {
            clearInterval(timeR);
        })
    })
})