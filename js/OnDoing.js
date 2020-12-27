function onChose(j,i){
    if(!runNow)return;
    if(onMove)return;
    //alert(j+""+i);
    var CC=WhatSpace(j,i);
    if(CC==0)
    {
        onChoseS(j,i);
    }else
    {
        Log("选择了"+j+"-"+i+"  "+CC);
        onChoseC(j,i,CC);
    }

}

function cleanSt(){
    nowChoseC=[];
    cleanChose();
    moveList=[];
    eatList=[];
    OnChoseNow=false;
}
function changePlayer(){
    if (nowWho == 0) nowWho = 1;
    else nowWho = 0;
    if (nowWho == 1) {
        nowWho = 2;
        AImove();
    }
    cleanSt();
}
function showSt(j,i,t){
    nowChoseC=[];
    cleanChose();//去掉阴影
    showChose(j,i,1);//选中棋子效果
    var tmap = WhereCan(j,i,t);//返回能走的位置，分为能吃和不能吃（即敌方棋子或空）
    if(tmap!=null && tmap.length>0) {
        for(var q=0;q<tmap.length;q++){
            if(map[tmap[q][0]][tmap[q][1]]==0){
                moveList.push(tmap[q]);
            }else{
                eatList.push(tmap[q]);
            }
            showChose(tmap[q][0],tmap[q][1],tmap[q][2]+2);
        }
    }
    nowChoseC[0]=j;
    nowChoseC[1]=i;
    nowChoseC[2]=t;
    OnChoseNow=true;
}

var onMove=false;
var OnChoseNow=false;
var nowChoseC=[];
var nowWho=0;//0红 1黑
var moveList=[];
var eatList=[];

function onChoseC(j,i,t){
    if (!OnChoseNow) {
        if (nowWho == 0) {
            if (t < 0) return;
            else {
                showSt(j, i, t);
            }
        }
        else if (nowWho == 1){
            if (t > 0) return;
            else {
                showSt(j, i, t);
            }
        }
    }
    else {
        for(var q=0;q<eatList.length;q++){
            if(eatList[q][0]==j&&eatList[q][1]==i){
                //eat
                eat(nowChoseC[0],nowChoseC[1],j,i);
                break;
            }
        }
        cleanSt();
    }
}
function onChoseS(j,i){
    if(OnChoseNow){
        for(var q=0;q<moveList.length;q++){
            if(moveList[q][0]==j&&moveList[q][1]==i){
                move(nowChoseC[0],nowChoseC[1],j,i);
                break;
            }
        }
    }
    cleanSt();
}

