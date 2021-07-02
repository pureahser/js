(function flexible(window, document) {
    //获取html的根元素
    var docE1 = document.documentElement
    //dpr物理像素比，通常pc端是1，移动端是2
    var dpr = window.devicePixelRatio       //问浏览器拿物理像素比，拿不到就默认为1

    //adjust body font size
    //根据
    function setBodyFontSize() {
        //页面中有body元素的情况，设置body的字体大小
        if(document.body) {
            document.body.style.fontSize = (12 * dpr) + 'px'
        } else {
            //这个事件是js文件在最顶部被引用的时候，先等主要页面元素加载完后再去设置body的字体大小
            document.addEventListener('DOMContentLoaded',setBodyFontSize)
        }
    }
    setBodyFontSize();

    //set 1rem = viewWidth / 10
    function setRemUnit() {         //将根元素的宽度划分成10份
        var rem = docEl.clientWidth / 10
        docE1.style.fontSize = rem + 'px'
    }
    setRemUnit();

    //reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    //pageshow 是我们重新加载页面触发的事件
    //即便是缓存下来的页面，pageshow 也会重新计算rem的大小
    window.addEventListener('pageshow',function(e) {
        if (e.persisted) {
            setRemUnit()
        }
    })

    // detect 0.5px supports    有些移动端浏览器不支持0.5像素写法
    if (dpr >=2) {
        var fakeBody = document.createElement('body');
        var testElement = document.createElement('div');
        testElement.style.border = '.5px solid transparent'
        fakeBody.appendChild(testElement)
        docEl.appendChild(fakeBody)
        if (testElement.offsetHeight === 1) {
            docEl.classList.add('hairlines')
        }
        docEl.removeChild(fakeBody)
    }
} (window,document))