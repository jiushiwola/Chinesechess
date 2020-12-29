//V2.0 alpha-beta算法，仍然假设AI是黑方
function AImove() {
    console.log("best: " + alpha_beta(1, -1e9, 1e9));
    if (AIcan_eat) {
        eat(AIfrom[0], AIfrom[1], AIto[0], AIto[1]);
    }
    else {
        move(AIfrom[0], AIfrom[1], AIto[0], AIto[1]);
    }
    
}
var AIfrom = [];
var AIto = [];
var AIcan_eat = false;
function alpha_beta(depth, alpha, beta) {
    if (depth >= 5) return evaluate(map);
    for (var j = 0; j < 10; ++j) {
        for (var i = 0; i < 9; ++i) {
            if ((depth & 1) == 1 && map[j][i] < 0 || (depth & 1) == 0 && map[j][i] > 0) {//哪些棋子能走
                //console.log(depth + " " + j + " " + i);
                var t = WhatSpace(j, i);
                var tmap = WhereCan(j,i,t);//返回能走的位置，分为能吃和不能吃（即目的棋子或空）
                //console.log("tmap.length: " + tmap.length);
                if(tmap!=null && tmap.length>0) {
                    for(var q=0;q<tmap.length;q++){
                        var dest = tmap[q];
                        var tmp = map[dest[0]][dest[1]];
                        map[dest[0]][dest[1]] = map[j][i];
                        map[j][i] = 0;
                        ret = alpha_beta(depth + 1, alpha, beta);
                        if (depth & 1 == 1) {
                            if (ret > alpha) {
                                
                                if (depth == 1) {
                                    console.log(j + '-' + i + getCText(dest[0],dest[1])[0] + "移动到 " + dest[0] + '-' + dest[1])
                                    //如果新的最好结果比原最好结果只大了5分以内，以某种概率保持原最好结果，以提高随机性
                                    if (ret - alpha < 5 && Math.random() > 0.8) {
                                        console.log("跨过最优解法");
                                        map[j][i] = map[dest[0]][dest[1]];
                                        map[dest[0]][dest[1]] = tmp;
                                        continue;
                                    }
                                    AIfrom[0] = j;
                                    AIfrom[1] = i;
                                    AIto[0] = dest[0];
                                    AIto[1] = dest[1];
                                    AIcan_eat = !(tmp == 0);
                                }
                                alpha = ret;
                            }
                            
                            //console.log(j + " " + i + " " + "alpha: " + alpha);
                        }
                        else {
                            beta = Math.min(beta, ret);
                            //console.log(j + " " + i + " " + "beta: " + beta);
                        }
                        map[j][i] = map[dest[0]][dest[1]];
                        map[dest[0]][dest[1]] = tmp;
                        if (beta <= alpha) return (depth & 1 == 1 ? alpha : beta);     
                    }
                }

            }
        }
    }
    return (depth & 1 == 1 ? alpha : beta);

}



// V1.0 贪心算法，暂时假设AI是黑方
// function AImove() {
//     var max_score = -100000000;
//     var from = [];
//     var to = [];
//     var can_eat = false;
//     for (var j = 0; j < 10; ++j) {
//         for (var i = 0; i < 9; ++i) {
//             if (map[j][i] < 0) {
//                 var t = WhatSpace(j, i);
//                 var tmap = WhereCan(j,i,t);//返回能走的位置，分为能吃和不能吃（即目的棋子或空）
//                 if(tmap!=null && tmap.length>0) {
//                     for(var q=0;q<tmap.length;q++){
//                         var dest = tmap[q];
//                         var tmp = map[dest[0]][dest[1]];
//                         map[dest[0]][dest[1]] = map[j][i];
//                         map[j][i] = 0;
//                         var score = evaluate(map);
//                         if (score > max_score) {
//                             from[0] = j;
//                             from[1] = i;
//                             to[0] = dest[0];
//                             to[1] = dest[1];
//                             max_score = score;
//                             can_eat = tmp == 0 ? false : true;
//                         }
//                         map[j][i] = map[dest[0]][dest[1]];
//                         map[dest[0]][dest[1]] = tmp;
//                     }
//                 }

//             }
//         }
//     }
//     console.log("now best: " + max_score);
//     if (can_eat) {
//         eat(from[0], from[1], to[0], to[1]);
//     }
//     else {
//         move(from[0], from[1], to[0], to[1]);
//     }
    
// }

