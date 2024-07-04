"use strict";
document.addEventListener('DOMContentLoaded',imagen_captcha);
let captchas= ["6ne3","28ivw","e5hb","jw62k","k4ez","q98p","xmqki"];
let pos=generador();

//-------------------- formulario--------------------//
document.getElementById("btn-validar").addEventListener("click", enviar)


function enviar() {
    imagen_captcha();
    
    let verificacion= document.getElementById("captcha").value;
    if(verificacion==captchas[pos]){
        document.getElementById("respuesta_captcha").innerHTML="El captcha es correcto. Muchas gracias por su aporte!!";
        document.querySelector(".envio_formulario").style.display=`flex`;
        
    }
    else {
        console.log("incorrecto");
        document.getElementById("respuesta_captcha").innerHTML="El captcha es INCORRECTO. Por favor intente nuevamente."
        document.querySelector(".envio_formulario").style.display=`none`;
        generador();
        imagen_captcha();
        console.log(generador)
        
    }
}

//-------------------- funcion para modificar imágenes del captcha--------------------//
function imagen_captcha() {
    
    document.getElementById("img-captcha").src=`./images/captcha-${captchas[pos]}.jpg`;
}

function generador(){
    let numero= Math.floor(Math.random()*7);
    return numero;
}

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
