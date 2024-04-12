//-- Elementos del DOM
const canvas = document.getElementById("ctiro");
const perro = new Image();

//-- Acceder al botón de disparo
const btnLanzar = document.getElementById("btnLanzar");

//-- Acceder al botón de iniciar
const btnIniciar = document.getElementById("btnIniciar");

//--Acceder al display
const display = document.getElementById("display");

// Acceder al elemento de deslizador de ángulo
let angulo = document.getElementById("angulo");

// Acceder al elemento de deslizador de velocidad
let velocidad = document.getElementById("velocidad");

const crono = new Crono(display);
//-- Sonidos
//-- Crear los elementos de sonido
const rebote_sound = new Audio('rebote.mp3');

canvas.width = 800;
canvas.height = 400;

//-- Obtener el contexto del canvas 2d
const ctx = canvas.getContext("2d");


//-- Coordenadas iniciales del proyectil
let xop = 5;
let yop = 340;
let xp = xop;
let yp = yop;

//-- Coordenadas iniciales del objetivo
let xomin = 200;
let xomax = 770;
let xo = getRandomXO(xomin,xomax);
let yo = 370;


//-- Dibujar el proyectil
dibujarP(xop, yop, 50, 50, "green"); // Pintar el proyectil

//-- Dibujbar el objetivo
dibujarO(xo,yo); // Pintar el objetivo
//-- Velocidad del proyectil
let velpx = 5;
let velpy = 1;

  
  //slider angulo
const angleSlider = document.getElementById("angleSlider");
const angleValue = document.getElementById("angulo");

angleSlider.addEventListener("input", function() {
  let angle = parseInt(angleSlider.value); // Obtener el valor del ángulo del slider
  angleValue.innerText = angle + "°"; // Mostrar el valor del ángulo
  let radians = angle * Math.PI / 180; // Convertir a radianes
  let speed = parseInt(speedSlider.value); // Obtener el valor de la velocidad del slider
  speedValue.innerText = speed + " m/s"; // Mostrar el valor de la velocidad

  //-- Calcular las componentes horizontal y vertical de la velocidad inicial
  velpx = speed * Math.cos(radians); // Componente horizontal
  velpy = -speed * Math.sin(radians); // Componente vertical (negativa para que el proyectil se eleve inicialmente)
});
//slider velocidad
const speedSlider = document.getElementById("velocidadSlider");
const speedValue = document.getElementById("velocidad");

speedSlider.addEventListener("input", function() {
    let speed = parseInt(speedSlider.value); // Obtener el valor de la velocidad del slider
    speedValue.innerText = speed + " m/s"; // Mostrar el valor de la velocidad
    velp = speed; // Actualizar la velocidad del proyectil
    let angle = parseInt(angleSlider.value); // Obtener el valor del ángulo del slider
    let radians = angle * Math.PI / 180; // Convertir a radianes
    velpx = velp * Math.cos(radians); // Actualizar la componente horizontal de la velocidad
    velpy = -velp * Math.sin(radians); // Actualizar la componente vertical de la velocidad
});


//-- Función principal de actualización
function lanzar() 
{
  //-- Implementación del algoritmo de animación:

    //-- 1) Actualizar posición de los elementos
    function actualizarPosicion(tiempoTranscurrido) {
      xp = xop + velpx * tiempoTranscurrido;
      yp = yop + velpy * tiempoTranscurrido + 0.5 * 9.8 * tiempoTranscurrido * tiempoTranscurrido; // Incorpora la aceleración debida a la gravedad
      return  { x: xp, y: yp };;
  }

    //-- Condición de rebote en extremos verticales del canvas
    if (xp < 0 || xp >= (canvas.width - 25) ) {
        bound_sound();
        velpx = -velpx;
    }
    function verificarColision() {
      if (Math.abs(xp - xo) < 25 && Math.abs(yp - yo) < 25) {
          dibujarP(xp, yp, 50, 50, "yellow");
      } else {
          dibujarP(xp, yp, 50, 50, "red");
      }
  }
  function animar() {
    let tiempoTranscurrido = crono.getTime() / 1000; // Convertir milisegundos a segundos

    let { x, y } = actualizarPosicion(tiempoTranscurrido);
    if (y <= 10) {
        y = 10; // Establece el límite en y = 5
    }else {
    // Borrar y dibujar en el siguiente cuadro de animación
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarP(x, y, 50, 50, "red");
    dibujarO(xo, yo);

    // Continuar la animación si el proyectil no ha alcanzado y = 5
    requestAnimationFrame(animar);
}
}
  // Iniciar la animación
  animar();
  
  //-- 4) Repetir
  requestAnimationFrame(lanzar);
}

function bound_sound() {

    rebote_sound.currentTime = 0;
    rebote_sound.play();
}

//-- función para pintar el proyectil
function dibujarP(x,y,lx,ly,color) {

    //-- Pintando el proyectil
    ctx.beginPath();

    //-- Definir un rectángulo de dimensiones lx x ly,
    ctx.rect(x, y, lx, ly);

    //-- Color de relleno del rectángulo
    ctx.fillStyle = color;

    //-- Mostrar el relleno
    ctx.fill();

    //-- Mostrar el trazo del rectángulo
    ctx.stroke();

    ctx.closePath();
}

//-- función para pintar el objetivo
function dibujarO(x,y) {

    //-- Pintando el objetivo
    ctx.beginPath();

    //-- Dibujar un circulo: coordenadas x,y del centro
    //-- Radio, Angulo inicial y angulo final
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'red';

    //-- Dibujar el relleno
    ctx.fill()    

    //-- Dibujar el trazo
    ctx.stroke();

    ctx.closePath();
}

//-- Función de retrollamada del botón de disparo
btnLanzar.onclick = () => {
    crono.start();

    lanzar();
}

//-- Función de retrollamada del botón de inicio
btnIniciar.onclick = () => {

    //-- Reinicio
    crono.reset();

    location.reload();

    //-- Dibujar el proyectil
    dibujarP(xop, yop, 50, 50, "green"); // Pintar el proyectil


}
//-- Generar números aleatorios con un valor máximo
function getRandomXO(min, max) {
  let range = max - min +1;
  return Math.floor(Math.random() * range) + min;
}

