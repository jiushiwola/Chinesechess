//有一点需要强调：alpha-beta剪枝过程中走棋的双方可能会变化，但估分的标准一直是以黑方即AI方为准，黑方希望估值最大，红方希望估值最小。
function evaluate() {
    var score = 0;
    score += SingleChessScore();
    score += ChouJu();
    score += ShuangPao();
    return score;
}

function SingleChessScore() {
    var score = 0;
    for (var j = 0; j < 10; ++j) {
        for (var i = 0; i < 9; ++i) {
            var chess = map[j][i];
            score += SearchScoreTable(chess, j, i);
        }
    }
    return score;
}

function SearchScoreTable(chess, j, i) {
    if (chess == 0) return 0;
    if (chess < 0) {//黑方棋子
        j = 9 - j;
        i = 8 - i;
    }
    var plus = 1;
    var dd = 1;
    if (chess > 0) {//红方
        plus = -1;
        chess *= -1;
        dd = 0.5;
    }
    if (chess == -1 ) {
        return plus * Bing[j][i];
    }
    if (chess == -7) {
        return plus * Jiang[j][i] * dd;
    }
    if (chess == -5 || chess == -6) {
        return plus * Shi_Xiang[j][i];
    }
    if (chess == -4) {
        return plus * Ma[j][i];
    }
    if (chess == -3) {
        return plus * Ju[j][i];
    }
    if (chess == -2) {
        return plus * Pao[j][i];
    }

}

function ChouJu() {
    var score = 0;
    //找出所有炮和车的位置
    //找出将和帅的位置
    var Paos = [];
    var Jus = [];
    var Kings = [];
    for (var j = 0; j < 10; ++j) {
        for (var i = 0; i < 9; ++i) {
            var cur = Math.abs(map[j][i]);
            if (cur == 2) Paos.push([j,i]);
            else if (cur == 3) Jus.push([j,i]);
            else if (cur == 7) Kings.push([j,i]);
        }
    }
    //检测同行的抽车情况
    for (var a = 0; a < Paos.length; ++a) {
        var Pao = Paos[a];
        for (var b = 0; b < Jus.length; ++b) {
            var Ju = Jus[b];
            if (map[Pao[0]][Pao[1]] * map[Ju[0]][Ju[1]] < 0 || Pao[0] != Ju[0]) continue;//炮和车同色且同行
            for (var c = 0; c < Kings.length; ++c) {
                var King = Kings[c];
                if (map[Pao[0]][Pao[1]] * map[King[0]][King[1]] > 0 || Pao[0] != King[0]) continue;//炮和王不同色且同行
                if (!((Pao[1] - Ju[1]) * (King[1] - Ju[1]) < 0)) continue;
                var cnt = 0;
                if (Pao[1] < King[1]) {
                    for (var c = Pao[1] + 1; c < King[1]; ++c) {
                        if (map[Pao[0]][c] != 0) cnt++;
                    }
                }
                else {
                    for (var c = Pao[1] - 1; c > King[1]; --c) {
                        if (map[Pao[0]][c] != 0) cnt++;
                    }
                }
                if (cnt == 2) {
                    if (map[Pao[0]][Pao[1]] > 0) {
                        //console.log("检测到红方抽车 行");
                        score -= 1000;
                    }
                    else {
                        //console.log("检测到黑方抽车 行");
                        score += 70;
                    }
                }
            }
        }
    }
    //检测同列的抽车情况
    for (var a = 0; a < Paos.length; ++a) {
        var Pao = Paos[a];
        for (var b = 0; b < Jus.length; ++b) {
            var Ju = Jus[b];
            if (map[Pao[0]][Pao[1]] * map[Ju[0]][Ju[1]] < 0 || Pao[1] != Ju[1]) continue;//炮和车同色且同行
            for (var c = 0; c < Kings.length; ++c) {
                var King = Kings[c];
                if (map[Pao[0]][Pao[1]] * map[King[0]][King[1]] > 0 || Pao[1] != King[1]) continue;//炮和王不同色且同行
                if (!((Pao[0] - Ju[0]) * (King[0] - Ju[0]) < 0)) continue;
                var cnt = 0;
                if (Pao[0] < King[0]) {
                    for (var c = Pao[0] + 1; c < King[0]; ++c) {
                        if (map[c][Pao[1]] != 0) cnt++;
                    }
                }
                else {
                    for (var c = Pao[0] - 1; c > King[0]; --c) {
                        if (map[c][Pao[1]] != 0) cnt++;
                    }
                }
                if (cnt == 2) {    
                    if (map[Pao[0]][Pao[1]] > 0) {
                        //console.log("检测到红方抽车 列");
                        score -= 1000;
                    }
                    else {
                        //console.log("检测到黑方抽车 列");
                        score += 70;
                    }
                }
            }
        }
    }
    return score;

}
function ShuangPao() {
    var score = 0;
    //找出所有炮的位置
    //找出将和帅的位置
    var redPaos = [];
    var blackPaos = [];
    var Jiang = [];
    var Shuai = [];
    for (var j = 0; j < 10; ++j) {
        for (var i = 0; i < 9; ++i) {
            var cur = map[j][i];
            if (cur == 2) redPaos.push([j,i]);
            else if (cur == -2) blackPaos.push([j,i]);
            else if (cur == 7) Jiang = [j,i];
            else if (cur == -7) Shuai = [j,i];
        }
    }
    //只检测更常见的在列上重炮将军
    //console.log(Shuai);
    if (redPaos.length == 2 && redPaos[0][1] == redPaos[1][1] && redPaos[0][1] == Shuai[1]) {
        var cnt = 0;
        for (var t = Math.max(redPaos[0][0], redPaos[1][0]) - 1; t > Shuai[0]; --t) {
            if (map[t][redPaos[0][1]] != 0) cnt++;
        }
        if (cnt == 1) {
            console.log("检测到双炮将");
            score -= 1500;
        }
    }
    if (blackPaos.length == 2 && blackPaos[0][1] == blackPaos[1][1] && blackPaos[0][1] == Jiang[1]) {
        var cnt = 0;
        for (var t = Math.min(blackPaos[0][0], blackPaos[1][0]) + 1; t < Jiang[0]; ++t) {
            if (map[t][blackPaos[0][1]] != 0) cnt++;
        }
        if (cnt == 1) {
            console.log("检测到双炮将");
            score += 500;
        }
    }

    return score;
}

var Bing = [
    [9,  9,  9, 11, 13, 11,  9,  9,  9],
    [19, 24, 34, 42, 44, 42, 34, 24, 19],
    [19, 24, 32, 37, 37, 37, 32, 24, 19],
    [19, 23, 27, 29, 30, 29, 27, 23, 19],
    [14, 18, 20, 27, 29, 27, 20, 18, 14],
    [7,  0, 13,  0, 16,  0, 13,  0,  7],
    [7,  0,  7,  0, 15,  0,  7,  0,  7],
    [0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0],
    [0,  0,  0,  0,  0,  0,  0,  0,  0]
];

var Jiang = [
    [0,  0,  0,  12000,  12000,  12000,  0,  0,  0],  
    [0,  0,  0,  12000,  12000,  12000,  0,  0,  0],  
    [0,  0,  0,  12000,  12000,  12000,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  9900,  9900,  9900,  0,  0,  0],
    [0,  0,  0,  9930,  9950,  9930,  0,  0,  0],
    [0,  0,  0, 9950, 10000, 9950,  0,  0,  0]
];

var Shi_Xiang = [
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [0,  0, 20,  0,  0,  0, 20,  0,  0],  
    [0,  0,  0,  0,  0,  0,  0,  0,  0],  
    [18,  0,  0, 20, 23, 20,  0,  0, 18],  
    [0,  0,  0,  0, 23,  0,  0,  0,  0],  
    [0,  0, 20, 20,  0, 20, 20,  0,  0] 
];
  

var Ma = [
    [90, 90, 90, 96, 90, 96, 90, 90, 90],
    [90, 96,103, 97, 94, 97,103, 96, 90],
    [92, 98, 99,103, 99,103, 99, 98, 92],
    [93,108,100,107,100,107,100,108, 93],
    [90,100, 99,103,104,103, 99,100, 90],
    [90, 98,101,102,103,102,101, 98, 90],
    [92, 94, 98, 95, 98, 95, 98, 94, 92],
    [90, 92, 95, 95, 92, 95, 95, 92, 90],
    [85, 90, 92, 93, 78, 93, 92, 90, 85],
    [88, 50, 90, 88, 90, 88, 90, 50, 88]//马的两个初始位置权值设小一点，防止AI的炮“盲目攻击马”
];

var Ju = [
    [206,208,207,213,214,213,207,208,206],  
    [206,212,209,216,233,216,209,212,206],  
    [206,208,207,214,216,214,207,208,206],  
    [206,213,213,216,216,216,213,213,206],  
    [208,211,211,214,215,214,211,211,208],  
    [208,212,212,214,215,214,212,212,208],  
    [204,209,204,212,214,212,204,209,204],  
    [198,208,204,212,212,212,204,208,198],  
    [200,208,206,212,200,212,206,208,200],  
    [194,206,204,212,200,212,204,206,194] 
];
  

var Pao = [
    [100,100, 96, 91, 90, 91, 96,100,100],
    [98, 98, 96, 92, 89, 92, 96, 98, 98],
    [97, 97, 96, 91, 92, 91, 96, 97, 97],
    [96, 99, 99, 98,100, 98, 99, 99, 96],
    [96, 96, 96, 96,100, 96, 96, 96, 96],
    [95, 96, 99, 96,100, 96, 99, 96, 95],
    [96, 96, 96, 96, 96, 96, 96, 96, 96],
    [97, 96,100, 99,101, 99,100, 96, 97],
    [96, 97, 98, 98, 98, 98, 98, 97, 96],
    [96, 96, 97, 99, 99, 99, 97, 96, 96],
];