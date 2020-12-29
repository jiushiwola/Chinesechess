function LoadGround(){
    var g="";
    for(var j=0;j<10 ;j++){
        map[j]=[];
        for(var i=0;i<9 ;i++){
            map[j][i]=0;
            g+="<article class='CS' id='CS"+j+"-"+i+"' onclick='onChose("+j+","+i+")'></article>";
        }
    }
    $("#space").html(g);
    Log("完成创建场景");
}

//0空
//兵1 炮2 车3 马4 相5 士6 将7 红
//卒-1 炮-2 车-3 马-4 象-5 士-6 帅-7 黑

function getCText(j,i){
    var T=[];
    switch (map[j][i])
     {
     case (0):
        return null;
     break;
     case (1):
         T[0]="兵";
         T[1]="BR";
     break;
     case (2):
         T[0]="炮";
         T[1]="PR";
     break;
     case (3):
         T[0]="车";
         T[1]="JR";
     break;
     case (4):
         T[0]="马";
         T[1]="MR";
     break;
     case (5):
         T[0]="相";
         T[1]="XR";
     break;
     case (6):
         T[0]="士";
         T[1]="SR";
     break;
     case (7):
         T[0]="将";
         T[1]="J";
     break;
     case (-1):
         T[0]="卒";
         T[1]="BB";
     break;
     case (-2):
         T[0]="炮";
         T[1]="PB";
     break;
     case (-3):
         T[0]="车";
         T[1]="JB";
     break;
     case (-4):
         T[0]="马";
         T[1]="MB";
     break;
     case (-5):
         T[0]="象";
         T[1]="XB";
     break;
     case (-6):
         T[0]="士";
         T[1]="SB";
     break;
     case (-7):
         T[0]="帅";
         T[1]="S";
     break;
     default :
         return null;
     break;
     }
    return T;
}

function showC()
{
    for(var j=0;j<10 ;j++) {
        for (var i = 0; i < 9; i++) {
            var cla="";
            var tex="";
            var isNone=false;
            var T=getCText(j,i);
            if(T == null){
                isNone=true;
            }else{
                cla=T[1];
                tex=T[0];
            }
            if(isNone){
                continue;
            }
            $("#CS"+j+"-"+i).html(
                    "<section class='C "+cla+"'>"+tex+"</section>"
            )
        }
    }
    Log("完成显示场景");
}

//0清除 1绿色 2黄色 3红色
function showChose(j,i,t){
    var o=$("#CS"+j+"-"+i);
    if(t==0){
        o.css({
            "box-shadow": "",
            "border": ""
        });
        return;
    }
    var c="";
    switch (t){
        case 1:
            c="6bc274";
            break;
        case 2:
            c="eeb948";
            break;
        case 3:
            c="c53f46";
            break;
        default :
            break;
    }
   o.css({
        "box-shadow": "0 0 25pt #"+c,
        "border": "3px solid #"+c
    })
}

function cleanChose(){
    $(".CS").css({
        "box-shadow": "",
        "border": ""
    })
}
function move(y,x,j,i,eat){
    var lastEat = getCText(j,i);
    var lastEatVal = map[j][i];
    var lastEater = getCText(y,x);
    var lastEaterVal = map[y][x];
    onMove=true;
    if(eat==null)
        if(map[j][i]!=0){
            LogError("错误的位置");
            return;
        }
    var cla="";
    var tex="";
    var T=getCText(y,x);
    if(T == null){
        LogError("丢失棋子信息");
        return;
    }else{
        cla=T[1];
        tex=T[0];
    }
    if(eat==null)
        Log(y+"-"+x+" "+tex+" 移动到"+j+"-"+i);
    else
        Log(y+"-"+x+" "+tex+" 吃"+j+"-"+i+" "+getCText(j,i)[0]);
    map[j][i]=map[y][x];
    map[y][x]=0;
    $("#CS"+y+"-"+x).html(
        ""
    )
    $("#CS"+j+"-"+i).html(//移动目的的的棋子的transfrom从有translate到无translate，实现从出发点平滑移动到目的点的效果。
            "<section class='C "+cla+"' style='transform:translate("+(x-i)*45+"px,"+(y-j)*45+"px);'>"+tex+"</section>"
    )
    setTimeout(function(){
        $("#CS"+j+"-"+i+" section").css({
            transform:""
        })
    },10);
    setTimeout(function(){
        var lastCanEat = (eat == true ? true : false);
        var lastMoveTo = [j,i];
        var lastMoveFrom = [y,x];

        //console.log("lasteat: " + lastEat);
        lastMove.push(lastMoveFrom, lastMoveTo, lastCanEat, lastEat, lastEater, lastEatVal, lastEaterVal);
        changePlayer();
        onMove=false;
    },700);
    
}

function eat(y,x,j,i){
    onMove=true;
    $("#CS"+j+"-"+i+" section").css({
        transform:"scale(0,0)"
    })
    setTimeout(function(){
        move(y,x,j,i,true);
    },700)
}


//以下内容与悔棋相关
var lastMove = new Array();
function back() {
    if (onMove) return;
    if (nowWho != 0) return;
    if (lastMove.length == 0) {
        console.log("lastMove is empty!");
        return;
    }
    for (var t = 0; t < 2 && lastMove.length > 0; ++t) {
        var lastEaterVal = lastMove.pop();
        var lastEatVal = lastMove.pop();
        var lastEater = lastMove.pop();
        var lastEat = lastMove.pop();
        var lastCanEat = lastMove.pop();
        var lastMoveTo = lastMove.pop();
        var lastMoveFrom = lastMove.pop();
        if (lastCanEat) undoEat(lastMoveFrom, lastMoveTo, lastEat, lastEater, lastEatVal, lastEaterVal);
        else undoMove(lastMoveFrom, lastMoveTo, lastEater);
    }
    
}

function undoMove(lastMoveFrom, lastMoveTo, lastEater) {

    onMove = true;
    var y = lastMoveFrom[0];
    var x = lastMoveFrom[1];
    var j = lastMoveTo[0];
    var i = lastMoveTo[1];
    var cla, tex;
    if (lastEater != null) {
        cla = lastEater[1];
        tex = lastEater[0];
    }
    map[y][x]=map[j][i];
    map[j][i]=0;
    $("#CS"+j+"-"+i).html(
        ""
    )
    $("#CS"+y+"-"+x).html(//移动目的的的棋子的transfrom从有translate到无translate，实现从出发点平滑移动到目的点的效果。
            "<section class='C "+cla+"' style='transform:translate("+(i-x)*45+"px,"+(j-y)*45+"px);'>"+tex+"</section>"
    )
    setTimeout(function(){
        $("#CS"+y+"-"+x+" section").css({
            transform:""
        })
        onMove=false;
    },10);
    // setTimeout(function(){
        
    // },700);
}

function undoEat(lastMoveFrom, lastMoveTo, lastEat, lastEater, lastEatVal, lastEaterVal) {
    onMove = true;
    var y = lastMoveFrom[0];
    var x = lastMoveFrom[1];
    var j = lastMoveTo[0];
    var i = lastMoveTo[1];
    var cla, tex;
    if (lastEat != null) {
        cla = lastEat[1];
        tex = lastEat[0];
    }
    var cla1 = lastEater[1];
    var tex1 = lastEater[0];
    map[y][x]=lastEaterVal;
    map[j][i]=lastEatVal;
    $("#CS"+j+"-"+i).html(
        ""
    )
    $("#CS"+y+"-"+x).html(
            "<section class='C "+cla1+"' style='transform:translate("+(i-x)*45+"px,"+(j-y)*45+"px);'>"+tex1+"</section>"
    )
    $("#CS"+j+"-"+i).html(
        "<section class='C "+cla+"' >"+tex+"</section>"
    )
    setTimeout(function(){
        $("#CS"+y+"-"+x+" section").css({
            transform:""
        })
        
        onMove=false;
        
    },10);
    
}

