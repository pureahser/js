function animateT(obj,target,callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        obj.step = (target - obj.pageYOffset)/5;
        obj.step = obj.step > 0 ? Math.ceil(obj.step) : Math.floor(obj.step);
        if (obj.pageYOffset == target) {
            clearInterval(obj.timer);
            if(callback) {
                callback();
            }
        }
        console.log(obj.pageYOffset + obj.step);
        obj.scroll(0,obj.pageYOffset + obj.step);
        //这里由于是页面上下滑动所以要用页面的滑动值来做(页面超出值)，
        //页面的滑动公式没有等号，与赋值样式不同
    },30);
}