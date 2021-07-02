//click延时解决方案
// 封装tap,解决click 300ms双击识别的延时问题
function tap(obj, callback) {
    var isMove = false;
    var startTime = 0;  //记录触摸时候的时间变量
    obj.addEventListener('touchstart', function (e) {
        startTime = Date.now();
    })
    obj.addEventListener('touchmove', function (e) {
        isMove = true;  // 识别移动
    })
    obj.addEventListener('touchend', function (e) {
        if (!isMove && (Date.now() - startTime) < 150) {
            callback && callback();//执行回调函数
        }
        isMove = false;     // 取反 重置
        startTime = 0;
    });
}
//调用
tap(div, function() {
    //执行代码
});