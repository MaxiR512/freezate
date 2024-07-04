"use strict";

//-------------------- Modo oscuro--------------------//
document.getElementById("btn-oscuro").addEventListener("click", modooscuro);
document.getElementById("btn-claro").addEventListener("click", modoclaro);

function modooscuro(){
    
    document.querySelector('.container').classList.toggle('modo-oscuro');
    document.getElementById("btn-claro").style.display=`block`;
    document.getElementById("btn-oscuro").style.display=`none`;

}
function modoclaro (){
    document.querySelector('.container').classList.toggle('modo-oscuro');
    document.getElementById("btn-oscuro").style.display=`block`;
    document.getElementById("btn-claro").style.display=`none`;
}
//-------------------- Menú responsive--------------------//
document.getElementById("btn-menu").addEventListener("click",mostrarbarra);

function mostrarbarra(){
    document.querySelector(".menu").classList.toggle('mostrar-menu');
}