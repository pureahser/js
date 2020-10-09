var that;
    class Tab {
    constructor(id) {           //此处id实参是 #tab
        //获取元素
        that = this;
        this.main = document.querySelector(id);
        this.ul = this.main.querySelector('nav ul:first-child');
        this.tabscon = this.main.querySelector('.tabscon');
        this.updateNode();
        this.add = this.main.querySelector('#add');
        this.init();
    }
    //动态添加元素所以需要重新获取对应元素
    updateNode() {
        this.lis = this.main.querySelectorAll('li');
        this.sections = this.main.querySelectorAll('section');
        this.deles = this.main.querySelectorAll('.dele');       //删除按钮也需要更新声明
        this.spans = this.main.querySelectorAll('nav li span:first-child');
    }
    init() {
        this.updateNode();
        // init 初始化操作，让相关元素绑定事件
        this.add.onclick = this.addTab;
        for(var i = 0; i < this.lis.length; i++) {
            this.lis[i].index = i;      //此处index代表创建li的索引号
            this.lis[i].onclick = this.toggleTab;
            this.deles[i].onclick = this.removeTab;
            this.spans[i].ondblclick = this.editTab;
            this.sections[i].ondblclick = this.editTab;
        }
    }
    //清除选中状态的css
    clearClass() {
        for(var i = 0; i < this.lis.length; i++) {
            this.lis[i].className = '';
            this.sections[i].className = '';
        }
    }   
    //1. 切换功能
    toggleTab() { 
        that.clearClass();
        this.className = 'liActive';
        that.sections[this.index].className = 'conative';
    }
    //2. 添加功能
    addTab() {
        that.clearClass();
        //创建li元素和section元素
        var li = '<li><span>新选项卡</span><button class="dele">X</button></li>'
        var section = '<section><div class="content">新记录</div></section>'
        //将两元素追加到对应父元素内
        that.ul.insertAdjacentHTML('beforeend',li);
        that.tabscon.insertAdjacentHTML('beforeend',section);
        that.init();            //在添加元素后再重新初始化元素及其绑定事件
    }
    //3. 删除功能
    removeTab(e) {
        e.stopPropagation();    //阻止冒泡 防止触发li 的切换点击事件
        var index = this.parentNode.index;
        console.log(index);
        that.lis[index].remove();
        that.sections[index].remove();
        that.init();
        if(document.querySelector('.liActive')) return;
        //当我们删除了选中状态的li时，让它前一个li处于选定状态
        index--;
        //手动调用点击事件
        that.lis[index] && that.lis[index].click();     //如果这个元素为真则调用事件
    }
    //4. 修改功能
    editTab() {
        var str = this.innerHTML;
        //禁止双击选中文字
        window.getSelection? window.getSelection().removeAllRanges():document.getSelection.empty();
        this.innerHTML = '<input type="text" class="tt"/>';
        var input = this.children[0];
        input.value = str;
        input.select();     //让文字处于选定状态
        //当我们离开文本框就把文本框的值给span
        input.onblur = function() {
            this.value =='' ? this.value = str : this.parentNode.innerHTML = this.value;
        }
        input.onkeyup = function(e) {
            if(e.keyCOCde === 13) {
                this.blur();
            }
        }  
    }
}
new Tab('#tab');        //实参