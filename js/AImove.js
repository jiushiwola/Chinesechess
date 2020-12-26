//暂时假设AI是黑方
function AImove() {
    var max_score = -100000000;
    var from = [];
    var to = [];
    var can_eat = false;
    for (var j = 0; j < 10; ++j) {
        for (var i = 0; i < 9; ++i) {
            if (map[j][i] < 0) {
                var t = WhatSpace(j, i);
                var tmap = WhereCan(j,i,t);//返回能走的位置，分为能吃和不能吃（即目的棋子或空）
                if(tmap!=null && tmap.length>0) {
                    for(var q=0;q<tmap.length;q++){
                        if(map[tmap[q][0]][tmap[q][1]]==0){
                            moveList.push(tmap[q]);
                        }else{
                            eatList.push(tmap[q]);
                        }
                        //showChose(tmap[q][0],tmap[q][1],tmap[q][2]+2);
                    }
                }

                for(var q=0;q<moveList.length;q++){//向可能位置移动后分数如何变化
                    map[moveList[q][0]][moveList[q][1]] = map[j][i];
                    map[j][i] = 0;
                    var score = evaluate(map);
                    console.log("score " + j + " " + i + " : " + score);
                    if (score > max_score) {
                        from[0] = j;
                        from[1] = i;
                        to[0] = moveList[q][0];
                        to[1] = moveList[q][1];
                        max_score = score;
                        can_eat = false;
                    }
                    map[j][i] = map[moveList[q][0]][moveList[q][1]];
                    map[moveList[q][0]][moveList[q][1]] = 0;
                }

                for(var q=0;q<eatList.length;q++){
                    var tmp = map[eatList[q][0]][eatList[q][1]];
                    map[eatList[q][0]][eatList[q][1]] = map[j][i];
                    map[j][i] = 0;
                    var score = evaluate(map);
                    console.log("score " + j + " " + i + " : " + score);
                    if (score > max_score) {
                        from[0] = j;
                        from[1] = i;
                        to[0] = eatList[q][0];
                        to[1] = eatList[q][1];
                        max_score = score;
                        can_eat = true;
                    }
                    map[j][i] = map[eatList[q][0]][eatList[q][1]];
                    map[eatList[q][0]][eatList[q][1]] = tmp;
                }
                moveList = [];
                eatList = [];

            }
        }
    }
    if (can_eat) {
        eat(from[0], from[1], to[0], to[1]);
    }
    else {
        move(from[0], from[1], to[0], to[1]);
    }
    
}