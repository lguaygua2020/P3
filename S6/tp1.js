console.log("Ejecutando JS...");
//-- Declaración de variables y objetos

//-- Definir el tamaño del canvas
canvas.width = 1000;
canvas.height = 400;
//-- Obtención del canvas y de los elementos HTML a usar
const ctx = canvas.getContext("2d");

//-- Acceder al botón de disparo
const btnLanzar = document.getElementById("btnLanzar");
//-- Acceder al botón de inicio
const btnIniciar = document.getElementById("btnIniciar");

const display = document.getElementById("display");

const crono = new Crono(display);
//slider angulo
const angleSlider = document.getElementById("angleSlider");
const angleValue = document.getElementById("angleValue");

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
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

speedSlider.addEventListener("input", function() {
    let speed = parseInt(speedSlider.value); // Obtener el valor de la velocidad del slider
    speedValue.innerText = speed + " m/s"; // Mostrar el valor de la velocidad
    velp = speed; // Actualizar la velocidad del proyectil
    let angle = parseInt(angleSlider.value); // Obtener el valor del ángulo del slider
    let radians = angle * Math.PI / 180; // Convertir a radianes
    velpx = velp * Math.cos(radians); // Actualizar la componente horizontal de la velocidad
    velpy = -velp * Math.sin(radians); // Actualizar la componente vertical de la velocidad
});


//-- Coordenadas iniciales del proyectil
let xop = 5;
let yop = 345;
let xp = xop;
let yp = yop;

//-- Coordenadas iniciales del objetivo
let xomin = 100;
let xomax = 900;
let xo = getRandomXO(xomin,xomax);
let yo = 370;

//-- Dibujar el proyectil
dibujarP(xop, yop, 50, 50, "green"); // Pintar el proyectil
//-- Dibujar el objetivo
dibujarO(xo,yo); // Pintar el objetivo

//-- Velocidad del proyectil
let velp = 0;
//-- Función principal de actualización
function lanzar() 
{
  //-- Implementación del algoritmo de animación:

  //-- 1) Actualizar posición de los elementos
  let gravedad = 9.81; // Aceleración debida a la gravedad en m/s^2

    //-- Calcular el tiempo transcurrido desde el inicio del movimiento
    let tiempoTranscurrido = crono.getTime() / 1000; // Convertir milisegundos a segundos
    let radians = angleSlider * Math.PI / 180; // Convertir el ángulo a radianes
    let velpy = velp * Math.sin(radians); // Calcular la componente vertical de la velocidad

    //-- Calcular la posición horizontal
    xp = xop + velp * tiempoTranscurrido;

    //-- Calcular la posición vertical
    let altura = yop + velpy * tiempoTranscurrido + 0.5 * gravedad * tiempoTranscurrido * tiempoTranscurrido;
    yp = Math.max(altura, 0); // Asegurar que yp no sea menor que cero

  //-- 2) Borrar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //-- 3) Pintar los elementos en el canvas
  dibujarP(xp, yp, 50, 50, "blue"); // Pintar el proyectil
  dibujarO(xo,yo); // Pintar el objetivo

  //-- 4) Repetir
  requestAnimationFrame(lanzar);
}

//-- Otras funciones....

//-- Función de retrollamada del botón de disparo
btnLanzar.onclick = () => {
  console.log("Start!!");
  crono.start();
  lanzar();
}
  
//-- Función de retrollamada del botón iniciar
btnIniciar.onclick = () => {
  console.log("Reset!");
  crono.reset();
  location.reload();
}

//-- función para pintar el proyectil
function dibujarP(x,y,lx,ly,color) {

    //-- Pintando el proyectil
    ctx.beginPath();

    //-- Definir un rectángulo de dimensiones lx x ly,
    ctx.rect(x,y, lx, ly);

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
//-- Generar números aleatorios con un valor máximo
function getRandomXO(min, max) {
  let range = max - min +1;
  return Math.floor(Math.random() * range) + min;
}