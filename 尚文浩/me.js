// JavaScript Document
! function () {
    //创建canvas元素，并设置canvas元素的id
    var canvas = document.createElement("canvas"),
    attr = getAttr(),
    canva_id = "c_n" + attr.length,
    context = canvas.getContext("2d"),
    
    animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
        window.setTimeout(i, 1000 / 45)
    },
    random = Math.random,
    mouse = {
        x: null,
        y: null,
        max: 20000
    },
    circles = [];//存放小方块

    //设置创建的canvas的相关属性
    canvas.id = canva_id;
    canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + attr.z + ";opacity:" + attr.opacity;
    //将canvas元素添加到body元素中
    document.getElementsByTagName("body")[0].appendChild(canvas);
    //该函数设置了canvas元素的width属性和height属性
    getWindowWH(); 
    //onresize 事件会在窗口或框架被调整大小时发生
    //此处即为当窗口大小改变时，重新获取窗口的宽高和设置canvas元素的宽高
    window.onresize = getWindowWH;

    function getAttr() {
        var i = document.getElementsByTagName("script"),
            w = i.length,
            v = i[w - 1];//v为最后一个script元素，即引用了本文件的script元素
     
        return {
            length: w,
            z: v.getAttribute("zIndex") || -1,
            opacity: v.getAttribute("opacity") || 0.5,
            color: v.getAttribute("color") || "0,0,0",
            count: v.getAttribute("count") || 99
        }
    }

    function getWindowWH() {
        W = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, 
        H = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }

    function draw() {
        context.clearRect(0, 0, W, H);
        var w = [mouse].concat(circles);//连接(合并)鼠标小方块数组和其他小方块数组
        var x, v, A, B, z, y;


        //circle属性表：x，y，xa，ya，max
        circles.forEach(function (i) {
            i.x += i.xa;
            i.y += i.ya;

            // 控制小方块移动方向
            // 当小方块达到窗口边界时，反向移动
            i.xa = i.xa * (i.x > W || i.x < 0 ? -1 : 1);
            i.ya = i.ya * (i.y > H || i.y < 0 ? -1 : 1);

            //前两个参数为矩形左上角的x，y坐标，后两个分别为宽度和高度
            //绘制小方块
            context.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);

            //遍历w中所有元素
            for (v = 0; v < w.length; v++) {
                //以下代码利用x小方块来限制i小方块
                x = w[v];
                //如果x与i不是同一个对象实例且x的xy坐标存在
                if (i !== x && null !== x.x && null !== x.y) {
                    B = i.x - x.x;//i和x的x坐标差
                    z = i.y - x.y;//i和x的y坐标差
                    y = B * B + z * z;//斜边平方
                    
                    if(y < x.max){
                        //使i小方块受鼠标小方块束缚，即如果i小方块与鼠标小方块距离过大，i小方块会被鼠标小方块束缚
                        if(x === mouse && y > x.max/2){
                            i.x -= 0.03 * B;
                            i.y -= 0.03 * z;
                        }
                       
                        A = (x.max - y) / x.max;
                        context.beginPath();
                        //设置画笔的画线的粗细与两个小方块的距离相关，范围0-0.5，两个小方块距离越远画线越细，达到max时画线消失
                        context.lineWidth = A / 2; 
                        //设置画笔的画线颜色为s.c即画布颜色，透明度为(A+0.2)即两个小方块距离越远画线越淡
                        context.strokeStyle = "rgba(" + attr.color + "," + (A + 0.2) + ")"; 
                        //设置画笔的笔触为i小方块
                        context.moveTo(i.x, i.y);
                        //使画笔的笔触移动到x小方块
                        context.lineTo(x.x, x.y);
                        //完成画线的绘制，即绘制连接小方块的线 
                        context.stroke();
                    }
                }
            }
            //把i小方块从w数组中去掉
            //防止两个小方块重复连线
            w.splice(w.indexOf(i), 1);
        });
        
        
        //窗口没激活时，动画将停止，省计算资源;
        animation(draw);
       
    
    }



    
    //获取鼠标所在坐标
    window.onmousemove = function (i) {
        i = i || window.event; 
        mouse.x = i.clientX; 
        mouse.y = i.clientY;
    }

    window.onmouseout = function () {
        mouse.x = null;
        mouse.y = null;
    }

    for(let p = 0; p < attr.count; p ++){    
        var circle_x = random() * W,//横坐标
            circle_y = random() * H,//纵坐标
            circle_xa = 2 * random() - 1,//x轴位移
            circle_ya = 2 * random() - 1;//y轴位移
        circles.push({
            x: circle_x,
            y: circle_y,
            xa: circle_xa,
            ya: circle_ya,
            max: 6000
        })
    }

    //此处是等待0.1秒后，执行一次b()
    setTimeout(function () {
        draw();
    }, 100)

}();