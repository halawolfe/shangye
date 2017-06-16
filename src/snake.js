/**
 * Created by asusa on 2017/3/7.
 */
window.onload=function(){
    var gridPanel=document.getElementById("gridPanel");
    var gridPanelWidth=window.screen.availWidth-10;
    if(gridPanelWidth<616){
        $("#gridPanel").css("width",gridPanelWidth);
        $("#gridPanel").css("height",gridPanelWidth);
    }
    var cn=18;var rn=18;
    for(var r=0;r<rn;r++){
        for(var c=0;c<cn;c++){
            //gridPanel.innerHTML+="<div id='g'"+r+c+ "class='grid'></div>";
            var div=document.createElement("div");
            r1=r<10?"0"+r:r;
            c1=c<10?"0"+c:c;
            div.id="g"+r1+c1;
            div.className="grid";
            gridPanel.appendChild(div);
            if(gridPanelWidth<616){
                $(".grid").css("width",gridPanelWidth/18*0.9);
                $(".grid").css("height", gridPanelWidth/18*0.9);
                $(".grid").css("margin-top",gridPanelWidth/18*0.1);
                $(".grid").css("margin-left",gridPanelWidth/18*0.1);
            }
        }
    }
}
game={
    cn:18,
    rn:18,
    data:[],
    state:0,
    RUNNING:1,
    PAUSE:2,
    GAMEOVER:0,
    snakeBody:[],
    timer:null,
    interval:800,
    order:[],
    time:0,
    time1:0,
    score:0,
    type:0,
    common:1,
    checkpoints:2,
    barrier:3,
    point:0,
    success:false,
    interval2:[800,700,650,600,550,500,450,400,350,300,250,200,150],
    startx:0,
    starty:0,
    endx:0,
    endy:0,
    start:function(){
        this.state=this.RUNNING;
        var d1=document.getElementById("gameOver");
        d1.style.display="none";
        //清除分数
        this.score=0;
        var score=document.getElementById("score");
        score=this.score;
        //清除蛇身数组
        this.snakeBody.length=0;
        //清除order数组
        this.order.length=0;
        //清除定时器
        clearInterval(this.timer);
        this.timer=null;
        //重新加载interval
        if(this.type==this.common||this.type==this.barrier){
            this.interval=800;
        }else if(this.type==this.checkpoints){
            this.interval=this.interval2[this.point];
        }
        this.initialData();
        this.renewData();
        this.firstBody();
        if(this.type==this.barrier){
            //躲避模式绘出障碍！！！
            this.wall(this.point*2+1);
        }
        this.timer=setInterval(function(){
            game.move();
            game.paintBody();
        },this.interval);
        document.onkeydown=function(){
            var e=window.event||arguments[0];
            switch(e.keyCode){
                case 37:
                    e.preventDefault();
                    game.moveL();
                    break;
                case 39:
                    e.preventDefault();
                    game.moveR();
                    break;
                case 38:
                    e.preventDefault();
                    game.moveUp();
                    break;
                case 40:
                    e.preventDefault();
                    game.moveDown();
                    break;
                case 32:
                    e.preventDefault();
                    game.pause();
                    break;
            }
        }
        document.addEventListener("touchstart",function(event){
            //event.preventDefault();
            game.startx=event.touches[0].pageX;
            game.starty=event.touches[0].pageY;
        });
        document.addEventListener("touchend",function(event){
            //event.preventDefault();
            game.endx=event.changedTouches[0].pageX;
            game.endy=event.changedTouches[0].pageY;

            var deltax=game.endx-game.startx;
            var deltay=game.endy-game.starty;
            if(Math.abs(deltax)<0.1*(window.screen.availWidth-10)&&Math.abs(deltay)<0.1*(window.screen.availWidth-10))
                return;
            if(Math.abs(deltax)>=Math.abs(deltay)){
                if(deltax>0){
                    game.moveR();
                }else{
                    game.moveL();
                }
            }else{
                if(deltay>0){
                    game.moveDown();
                }else{
                    game.moveUp();
                }
            }
        });
    },
    initialData:function(){
        for(var i= 0;i<this.rn;i++){
            this.data[i]=[];
            for(var j=0;j<this.cn;j++){
                this.data[i][j]=0;
            }
        }
    },
    wall:function(number){
       for(var i=0;i<number;i++){
           var n=4;
           var n1=parseInt(Math.random()*n+1);
           switch(n1){
               case 1:
                   this.wall1();
                   break;
               case 2:
                   this.wall2();
                   break;
               case 3:
                   this.wall3();
                   break;
               case 4:
                   this.wall4();
                   break;
               case 5:
                   this.wall5();
                   break;
               default:
                   break;
           }
        }
        //绘出障碍
        for(var i=0;i<this.rn;i++) {
            for (var j = 0; j < this.cn; j++) {
                if (this.data[i][j] == 3) {
                    i1 = i < 10 ? "0" + i : i;
                    j1 = j < 10 ? "0" + j : j;
                    var div = document.getElementById("g" + i1 + j1);
                    div.className = "grid barrier";
                }
            }
        }

    },
    randomRn:function(){
        var rn1=parseInt(Math.random()*this.rn);
        return rn1;
    },
    randomCn:function(){
        var cn1=parseInt(Math.random()*this.cn);
        return cn1;
    },
    wall1:function(){
        while(true){
            var rn=this.randomRn();
            var cn=this.randomCn();
            if(rn+1<this.rn){
                if(this.data[rn][cn]!=3&&this.data[rn+1][cn]!=3
                    &&this.data[rn][cn]!=1&&this.data[rn+1][cn]!=1){
                    this.data[rn][cn]=3;
                    this.data[rn+1][cn]=3;
                    break;
                }
            }
        }
    },
    wall2:function(){
        while(true) {
            var rn = this.randomRn();
            var cn = this.randomCn();
            if(cn+1<this.cn){
                if(this.data[rn][cn]!=3&&this.data[rn][cn+1]!=3
                    &&this.data[rn][cn]!=1&&this.data[rn][cn+1]!=1){
                    this.data[rn][cn]=3;
                    this.data[rn][cn+1]=3;
                    break;
                }
            }
        }
    },
    wall3:function(){
        while(true) {
            var rn = this.randomRn();
            var cn = this.randomCn();
            if(cn+2<this.cn){
                if(this.data[rn][cn]!=3&&this.data[rn][cn+1]!=3&&this.data[rn][cn+2]!=3
                    &&this.data[rn][cn]!=1&&this.data[rn][cn+1]!=1&&this.data[rn][cn+2]!=1){
                    this.data[rn][cn]=3;
                    this.data[rn][cn+1]=3;
                    this.data[rn][cn+2]=3;
                    break;
                }
            }
        }
    },
    wall4:function(){
        while(true) {
            var rn = this.randomRn();
            var cn = this.randomCn();
            if(rn+2<this.rn){
                if(this.data[rn][cn]!=3&&this.data[rn+1][cn]!=3&&this.data[rn+2][cn]!=3
                    &&this.data[rn][cn]!=1&&this.data[rn+1][cn]!=1&&this.data[rn+2][cn]!=1){
                    this.data[rn][cn]=3;
                    this.data[rn+1][cn]=3;
                    this.data[rn+2][cn]=3;
                    break;
                }
            }
        }
    },
    wall5:function(){
        while(true) {
            var rn = this.randomRn();
            var cn = this.randomCn();
            if(cn+2<this.cn&&rn+2<this.rn){
                if(this.data[rn][cn]!=3&&this.data[rn+1][cn]!=3&&this.data[rn+2][cn]!=3
                    &&this.data[rn][cn+1]!=3&&this.data[rn][cn+2]!=3
                    &&this.data[rn][cn]!=1&&this.data[rn+1][cn]!=1&&this.data[rn+2][cn]!=1
                    &&this.data[rn][cn+1]!=1&&this.data[rn][cn+2]!=1){
                    this.data[rn][cn]=3;
                    this.data[rn+1][cn]=3;
                    this.data[rn+2][cn]=3;
                    break;
                }
            }
        }
    },
    renewData:function(){
        for(var i= 0;i<this.rn;i++){
            for(var j=0;j<this.cn;j++){
                if(this.data[i][j]!=2&&this.data[i][j]!=3){
                    this.data[i][j]=0;
                    i1=i<10?"0"+i:i;
                    j1=j<10?"0"+j:j;
                    var div=document.getElementById("g"+i1+j1);
                    div.className="grid";
                }
            }
        }
    },
    firstBody:function(){
        this.data[7][7]=1;
        this.data[8][7]=1;
        this.data[9][7]=1;
        this.snakeBody.push([7,7],[8,7],[9,7]);
    },
    paintBody:function(){
        //绘出蛇身
        for(var i=0;i<this.rn;i++){
            for(var j=0;j<this.cn;j++){
                if(this.data[i][j]==1){
                    i1=i<10?"0"+i:i;
                    j1=j<10?"0"+j:j;
                    var div=document.getElementById("g"+i1+j1);
                    div.className="grid block";
                }
            }
        }
        //更新分数
        var score=document.getElementById("score");
        score.innerHTML=this.score;
    },
    move:function(){
        //是否躲避模式
        if(this.type==this.barrier){
            if(this.state==this.RUNNING){
                if(this.snakeBody.length==50){
                    this.point++;
                    //清除定时器
                    clearInterval(this.timer);
                    this.timer=null;
                    //弹出框
                    var barrier=document.getElementById("barrier");
                    barrier.style.display="block";
                    var pass2=document.getElementById("pass2");
                    pass2.innerHTML="通过第"+this.point+"关";
                }
            }
        }
        //是否过关模式
        if(this.type==this.checkpoints){
            //是否游戏进行中
            if(this.state==this.RUNNING){
                //蛇身达到一定长度
                if(this.snakeBody.length==50){
                    this.point++;
                    //是否成功通过过关模式
                    if(this.point>this.interval2.length-1){
                        clearInterval(this.timer);
                        this.timer=null;
                        this.state=this.GAMEOVER;
                        var good=document.getElementById("good");
                        good.style.display="block";
                        var finalScore1=document.getElementById("finalScore1");
                        finalScore1.innerHTML=this.score;
                        this.success=true;
                    }else{
                        //否则进入下一关
                        //清除定时器
                        clearInterval(this.timer);
                        this.timer=null;
                        //弹出框
                        var checkpoints=document.getElementById("checkpoints");
                        checkpoints.style.display="block";
                        var pass=document.getElementById("pass");
                        pass.innerHTML="通过第"+this.point+"关";
                    }
                }
            }
        }
        //是否游戏进行中
        if(this.state==this.RUNNING){
            //普通模式是否通关！
            if(this.type==this.common){
                if(this.isFull()){
                    clearInterval(this.timer);
                    this.timer=null;
                    this.state=this.GAMEOVER;
                    var good=document.getElementById("good");
                    good.style.display="block";
                    var finalScore1=document.getElementById("finalScore1");
                    finalScore1.innerHTML=this.score;
                    this.success=true;
                }
            }
            var rn1=this.snakeBody[0][0];
            var cn1=this.snakeBody[0][1];
            var rn2=this.snakeBody[1][0];
            var cn2=this.snakeBody[1][1];
            //没有指令时的自行移动
            if(this.order.length==0){
                var head=[];
                if(cn1==cn2){
                    head=rn1<rn2?[rn1-1,cn1]:[rn1+1,cn1];
                }else{
                    head=cn1<cn2?[rn1,cn1-1]:[rn1,cn1+1];
                }
                //验证再向前走是否会撞墙或撞自己或撞到障碍
                if(!this.isHit(head[0],head[1])&&this.data[head[0]][head[1]]!=1&&this.data[head[0]][head[1]]!=3){
                    this.snakeBody.unshift(head);
                    //前方是否有食物
                    if(this.isFood(head[0],head[1])){
                        this.data[head[0]][head[1]]=1;
                        this.score+=10;
                    }else{
                        this.snakeBody.pop();
                    }
                }else{
                    this.state=this.GAMEOVER;
                }
            }else{
                //取出指令数值中第一个指令，判断实现移动方向
                var od=this.order.shift();
                if(od=="left"){
                    //判断能否向左运动
                    if(!(rn1==rn2&&cn1>cn2)) {
                        //验证再向前走是否会撞墙或撞自己或撞到障碍
                        if(!this.isHit(rn1,cn1-1)&&this.data[rn1][cn1-1]!=1&&this.data[rn1][cn1-1]!=3){
                            this.snakeBody.unshift([rn1,cn1-1]);
                            //前方是否有食物
                            if(this.isFood(rn1,cn1-1)){
                                this.data[rn1][cn1-1]=1;
                                this.score+=10;
                            }else{
                                this.snakeBody.pop();
                            }
                        }else{
                            this.state=this.GAMEOVER;
                        }
                    }
                }else if(od=="right"){
                    if(!(rn1==rn2&&cn1<cn2)){
                        if(!this.isHit(rn1,cn1+1)&&this.data[rn1][cn1+1]!=1&&this.data[rn1][cn1+1]!=3){
                            this.snakeBody.unshift([rn1,cn1+1]);
                            if(this.isFood(rn1,cn1+1)){
                                this.data[rn1][cn1+1]=1;
                                this.score+=10;
                            }else{
                                this.snakeBody.pop();
                            }
                        }else{
                            this.state=this.GAMEOVER;
                        }
                    }
                }else if(od=="up"){
                    if(!(cn1==cn2&&rn1>rn2)){
                        if(!this.isHit(rn1-1,cn1)&&this.data[rn1-1][cn1]!=1&&this.data[rn1-1][cn1]!=3){
                            this.snakeBody.unshift([rn1-1,cn1]);
                            if(this.isFood(rn1-1,cn1)){
                                this.data[rn1-1][cn1]=1;
                                this.score+=10;
                            }else{
                                this.snakeBody.pop();
                            }
                        }else{
                            this.state=this.GAMEOVER;
                        }
                    }
                }else if(od=="down"){
                    if(!(cn1==cn2&&rn1<rn2)){
                        if(!this.isHit(rn1+1,cn1)&&this.data[rn1+1][cn1]!=1&&this.data[rn1+1][cn1]!=3){
                            this.snakeBody.unshift([rn1+1,cn1]);
                            if(this.isFood(rn1+1,cn1)){
                                this.data[rn1+1][cn1]=1;
                                this.score+=10;
                            }else{
                                this.snakeBody.pop();
                            }
                        }else{
                            this.state=this.GAMEOVER;
                         }
                    }
                }
            }
            //更新数据
            this.renewData();
            for(var i=0;i<this.snakeBody.length;i++){
                var rn=this.snakeBody[i][0];
                var cn=this.snakeBody[i][1];
                this.data[rn][cn]=1;
            }
            //绘出食物
            this.randomFood();
            //隔段时间加快速度
            //普通模式和躲避模式过段时间加快速度
            if(this.type==this.common||this.type==this.barrier){
                this.speed();
            }

            console.log(this.interval);
        }else if(this.state==this.PAUSE){
           this.order.length=0;
        }else{
            if(!this.success){
                this.gameOver();
            }
        }
    },
    isHit:function(rn,cn){
        if(rn==-1||rn==this.rn||cn==-1||cn==this.cn){
            return true;
        }
        return false;
    },
    moveL:function(){
        //添加指令到order数组
        this.order.push("left");
    },
    moveR:function(){
        this.order.push("right");
    },
    moveUp:function(){
        this.order.push("up");
    },
    moveDown:function(){
        this.order.push("down");
    },
    randomFood:function(){
        if(!this.isHit()){
            this.time++;
            if(this.time%5==0){
                while(true){
                    var rn=parseInt(Math.random()*this.rn);
                    var cn=parseInt(Math.random()*this.cn);
                    if(this.data[rn][cn]==0) {
                        this.data[rn][cn]=2;
                        rn1=rn<10?"0"+rn:rn;
                        cn1=cn<10?"0"+cn:cn;
                        var div=document.getElementById("g"+rn1+cn1);
                        div.className="grid food";
                        break;
                    }
                }
            }
        }
    },
    isFood:function(rn,cn){
        //食物标记为2
        if(this.data[rn][cn]==2){
            return true;
        }
        return false;
    },
    gameOver:function(){
        clearInterval(this.timer);
        this.timer=null;
        this.state=this.GAMEOVER;
        var d1=document.getElementById("gameOver");
        d1.style.display="block";
        var finalScore=document.getElementById("finalScore");
        finalScore.innerHTML=this.score;
    },
    pause:function(){
        this.state=this.PAUSE;
        var d2=document.getElementById("pause");
        d2.style.display="block";
        var pauseScore=document.getElementById("pauseScore");
        pauseScore.innerHTML=this.score;
    },
    cancelPause:function(){
        this.state=this.RUNNING;
        var d2=document.getElementById("pause");
        d2.style.display="none";
    },
    //过一段时间加快速度
    speed:function(){
        this.time1++;
        if(this.time1%30==0){
            if(this.interval>200){
                this.interval-=50;
                //清除定时器，重新加载定时器
                clearInterval(this.timer);
                this.timer=null;
                this.timer=setInterval(function(){
                    game.move();
                    game.paintBody();
                },this.interval);
            }
        }
    },
    common:function(){
        this.type=this.common;
        var model=document.getElementById("model");
        model.style.display="none";
        //清除关数
        this.point=0;
        //重新定义success
        this.success=false;
        this.start();
    },
    checkpoints:function(){
        this.type=this.checkpoints;
        var model=document.getElementById("model");
        model.style.display="none";
        //清除关数
        this.point=0;
        //重新定义success
        this.success=false;
        this.start();
    },
    barrier:function(){
        this.type=this.barrier;
        var model=document.getElementById("model");
        model.style.display="none";
        //清除关数
        this.point=0;
        //重新定义success
        this.success=false;
        this.start();
    },
    nextPoint:function(){
        //隐藏弹出框
        var checkpoints=document.getElementById("checkpoints");
        checkpoints.style.display="none";
        this.start();
    },
    nextBarrier:function(){
        //隐藏弹出框
        var barrier=document.getElementById("barrier");
        barrier.style.display="none";
        this.start();
    },
    isFull:function(){
        for(var i=0;i<this.rn;i++){
            for(var j=0;j<this.cn;j++){
                if(this.data[i][j]!=1){
                    return false;
                }
            }
        }
        return true;
    },
    model:function(){
        var good=document.getElementById("good");
        good.style.display="none";
        var gameOver=document.getElementById("gameOver");
        gameOver.style.display="none";
        var mod=document.getElementById("model");
        mod.style.display="block";
    },

}
