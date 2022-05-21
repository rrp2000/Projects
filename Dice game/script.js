function fight()
{
    var dice1 = Math.random() * 6;
dice1 = Math.floor(dice1) + 1;
var dice2 = Math.random() * 6;
dice2 = Math.floor(dice2) + 1;

//document.querySelector("#dice1")

document.getElementById("dice1").setAttribute("src",'\\image\\'+dice1+".png")
document.getElementById("dice2").setAttribute("src",'\\image\\'+dice2+".png")

if(dice1>dice2)
{
    document.querySelector("h1").innerHTML="player 1 won";
}
else
{
    document.querySelector("h1").innerHTML="player 2 won";
}
}

