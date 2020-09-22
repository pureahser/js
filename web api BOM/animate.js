function animate(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        //速度是由和距离相除的值决定的，越小则起速越快
        //将步长值向上取整不出现小数问题,从而准确达到目标位置
            obj.step = (target - obj.offsetLeft) / 5;
            obj.step = obj.step > 0 ? Math.ceil(obj.step) : Math.floor(obj.step);
        //此处如是obj.offsetLeft >= target 当负值时返回时会有影响
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer);
            //回调函数写到定时器结束里面
            if(callback) {
                //验证传进来的函数实参，如果有函数就在定时器结束时调用这个函数
                callback();
            }
        }
        obj.style.left = obj.offsetLeft + obj.step +'px';
    },30);      
}