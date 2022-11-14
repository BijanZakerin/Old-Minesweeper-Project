$(document).ready(function() {
    
    $('button.start').hide();
    
    
    class Cell {
        constructor(row, column, button) {
            this.row=row;
            this.column=column;
            this.adj=[];
            this.adjBombs=0;
            this.bomb=false;
            this.revealed=false;
            this.flagged=false;
            this.button=button;
            this.clicked=false;
        }
        
    }
    var w;
    var h;
    var gArray=[];
    var flnum=0;
    var bleft=0;
    var flnum2=0;
    var tmines=0;
    var temp=[];
    var score = 0;
    var myVar;
    var highscores=[];
    var gamelost=false;
    
    function makeAdj(r,c) {
        var tadj=[];
        //top row
        if (r==0){
            if(c==0){
                tadj.push(gArray[1]);
                tadj.push(gArray[w]);
                tadj.push(gArray[w+c]);
            }
            else if(c==(w-1)){
                tadj.push(gArray[w-2]);
                tadj.push(gArray[(2*w)-2]);
                tadj.push(gArray[(2*w)-1]);
            }
            else {
                tadj.push(gArray[c+1]);
                tadj.push(gArray[c-1]);
                tadj.push(gArray[w+c]);
                tadj.push(gArray[(w+c)-1]);
                tadj.push(gArray[(w+c)+1]);
            }
        }
        //bottom row
        else if (r==(h-1)){
            if(c==0){
                tadj.push(gArray[(w*r)+1]);
                tadj.push(gArray[(w*(r-1))]);
                tadj.push(gArray[(w*(r-1))+1]);
            }
            else if(c==(w-1)) {
                tadj.push(gArray[((r*w)+c)-1]);
                tadj.push(gArray[((r-1)*w)+c]);
                tadj.push(gArray[((r-1)*w)+c-1]);
            }
            else {
                tadj.push(gArray[(w*r)+c+1]);
                tadj.push(gArray[(w*r)+c-1]);
                tadj.push(gArray[(w*(r-1))+c]);
                tadj.push(gArray[(w*(r-1))+c-1]);
                tadj.push(gArray[(w*(r-1))+c+1]);             
            }
        }
        //middle rows
        else {
            if(c==0){
                tadj.push(gArray[(w*r)+1]);
                tadj.push(gArray[(w*(r-1))]);
                tadj.push(gArray[(w*(r-1))+1]);
                tadj.push(gArray[(w*(r+1))]);
                tadj.push(gArray[(w*(r+1))+1]);
            }
            else if(c==(w-1)) {
                tadj.push(gArray[((r*w)+c)-1]);
                tadj.push(gArray[((r-1)*w)+c]);
                tadj.push(gArray[((r-1)*w)+c-1]);
                tadj.push(gArray[((r+1)*w)+c]);
                tadj.push(gArray[((r+1)*w)+c-1]);
            }
            else {
                tadj.push(gArray[(w*r)+c+1]);
                tadj.push(gArray[(w*r)+c-1]);
                tadj.push(gArray[(w*(r-1))+c]);
                tadj.push(gArray[(w*(r-1))+c-1]);
                tadj.push(gArray[(w*(r-1))+c+1]);  
                tadj.push(gArray[(w*(r+1))+c]);
                tadj.push(gArray[(w*(r+1))+c-1]);
                tadj.push(gArray[(w*(r+1))+c+1]); 
            }
            
        }
        return tadj;
    }
    
    function startGame() {
        w = document.getElementById("width").selectedIndex+8;
        h = document.getElementById('height').selectedIndex+8;
        $('.grid').html("");
        var i=0;
        var j=0;
        var k=document.getElementById('bombcount').value;
        var tempnum=(w*h)-1;
        if (k<1 || k>((w*h)-1)) {
            alert("Number of bombs must be between 1 and "+tempnum);
        } 
        else {
            for (i; i<h; i++) {
                j=0;
                for (j; j<w; j++) {
                    var q=((i*w)+j);
                    var t = $("<button id="+(q)+" class='cell' data-row="+(i)+" data-column="+(j)+"> - </button>");
                    $(t).appendTo(".grid");
                    const celldata = new Cell(i,j,t);
                    gArray.push(celldata);
                }
                $("<br>").appendTo(".grid");
            }
            $('button.start').show();
        }
    }
    
    function reveal(c,t) {
        if (!c.flagged) {
            if (!c.revealed) {
                c.revealed=true;
                if (c.bomb) {
                    t.innerHTML="X";
                    t.style.color='black';
                    t.style.backgroundColor='red';
                    clearInterval(myVar);
                    alert('You lose! Better luck next time!');
                    gamelost=true;
                    
                    
                }
                else {
                    t.innerHTML=c.adjBombs;
                    t.style.color='black';
                    if (c.adjBombs==0) {
                        for (var i=0;i<c.adj.length;i++) {
                            var q= ((c.adj[i].row)*w)+c.adj[i].column;
                            var ce = c.adj[i];
                            var bu = document.getElementById(q.toString());
                            reveal(ce,bu);
                        }
                    }
                }
            } 
        }
    }
    
    function reveal2(c,t) {
        var cadj = c.adj;
        var fNum = 0;
        for (var i=0;i<cadj.length;i++) {
            if (cadj[i].flagged) {fNum++}
        }
        if (fNum==c.adjBombs) {
            for (var i=0;i<cadj.length;i++) {
                if (!c.flagged) {
                    var qa= ((c.adj[i].row)*w)+c.adj[i].column;
                    var qt = document.getElementById(qa.toString());
                    console.log(cadj[i]);
                    console.log(qt);
                    reveal(cadj[i],qt);
                } 
            }
        }
    }
    
    function bombsLeft(bl) {
        bleft=bl-flnum2;
        document.getElementById('bl').innerHTML='Bombs left:' + bleft;
    }
    
    function count() {
        document.getElementById('timer').innerHTML='Time: '+ (score+1) + ' seconds';
        score++;
    }
    
    function updateScores(s) {
        clearInterval(myVar);
        highscores.push(s);
        highscores.sort();
        console.log(highscores);
        console.log(s);
        var ele = document.getElementById('scores');
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
        var hlist = $("<ol id='list'></ol>");
        $(hlist).appendTo('#scores');
        for (var i=0;i<highscores.length;i++) {
            if (i<=3) {
                var html = "<li>"+highscores[i]+" seconds</li>";
                $(html).appendTo('#list');
            }
        }
    }
    
    function flag(c,t) {
        if (!c.revealed) {
            if (!c.flagged) {
                c.flagged=true;
                t.innerHTML='F';
                t.style.color='black'; 
                flnum2++;
                if (c.bomb) {
                    flnum++;
                }
            }
            else {
                t.style.color='grey';
                c.flagged=false;
                flnum2--;
                if (c.bomb) {
                    flnum--;
                }
            }
        }
        
        bombsLeft(tmines);
        
        if (flnum==document.getElementById('bombcount').value) {
            var abc=0;
            for (var i=0;i<temp.length;i++) {
                if (gArray[temp[i]].flagged) {
                    abc++;
                }
            }
            if (abc==temp.length) {
                alert('You win! Score:' + score);
                updateScores(score);
            }
        }
        
        
        
    }
    


    
    //button to change the size of the board, also creates grid of buttons
    //each button has data attribute of row and column after creation
    $("button.size").click(function () {
        gArray=[];
        flnum=0;
        flnum2=0;
        bleft=0;
        tmines=0;
        startGame();
        score=0;
        clearInterval(myVar);
        
        document.getElementById('timer').innerHTML='Time: ';
        $('.grid').hide();
    });
    
    $('button.start').click(function() {
         $('.grid').show();
        //sets bombs
        var mineden=document.getElementById('bombcount').value;
        tmines=mineden;
        temp=[];
        var cells=w*h;
        for (var i=0;i<mineden;i++) {
            var t= Math.floor(Math.random() * Math.floor(cells));
            if (!temp.includes(t)) {
                temp.push(t);
            }
            else {
                i--;
            }
        }
        for (var i=0;i<temp.length;i++) {
            gArray[temp[i]].bomb=true;
        }
        //creates adj[] for each cell in array
        for (var i=0;i<h;i++) {
            for (var j=0; j<w;j++)
                gArray[(i*w)+j].adj=makeAdj(i,j);
        }
        //calc bomb count
        for (var i=0;i<gArray.length;i++) {
            var list=gArray[i].adj
            var count=0;
            for (var j=0;j<list.length;j++) {
                if (list[j].bomb) {count++};
            }
            gArray[i].adjBombs=count;
        }
        bombsLeft(tmines);
        gamelost=false;
        
        $('button.start').hide();
        
        
    });
    
    
    $(document).on('click', '.cell', function(e) {
        if (!gamelost) {
            if (score==0) {
                clearInterval(myVar);
                myVar = setInterval(count, 1000);
            }
            var row= $(this).data('row');
            var column = $(this).data('column');
            var cell = gArray[(row*w)+column];
            var test = this;    
            if (e.shiftKey) {
                flag(cell,this);
            }
            else {
                if (cell.revealed) {
                    reveal2(cell, test);
                }
                else if (!cell.revealed) {
                reveal(cell,test);
                }
            }
        }
        
    });
    
    
    
});