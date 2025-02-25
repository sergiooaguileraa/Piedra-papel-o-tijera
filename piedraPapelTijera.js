// Este array no se puede modificar
var posibilidades = ["piedra", "papel", "tijera"];

/* Variables y objetos globales */
var partidas = 0; //total de partidas
var partidaActual = 1;
var nombre = "";
var miMarcador = 0;
var marcadorPc = 0;
var seleccionado = posibilidades[0]; //selección del jugador por defecto
var seleccionadoPc = posibilidades[0]; //selección del PC por defecto
var ganadoresList = [];
class Ganador {
    constructor(name, choice, choicePc, resultado) {
        this.name = name;
        this.choice = choice;
        this.choicePc = choicePc;
        this.resultado = resultado; // nuevo campo para mostrar empate
    }
}

/*---------------------------------------------------------*/

/* Sección de eventos */
var botonJugar = document.getElementsByTagName("button")[0]; //captura del primer elemento botón
botonJugar.addEventListener("click", jugar, false); //escucha del evento click sobre el botón jugar
var botonYa = document.getElementsByTagName("button")[1]; //captura del segundo elemento botón
botonYa.addEventListener("click", ya, false); //escucha del evento click sobre el botón ya
for (let i = 0; i < 3; i++) {
    //añadimos eventos a las imágenes
    document
        .getElementsByTagName("img")
        [i].addEventListener("click", function () {
            seleccion(i);
        }, false);
}
document.getElementsByTagName("button")[2].addEventListener("click", reset, false);

/*----------------------------------------------------- */

/* FUNCIONES PRINCIPALES */

function jugar() {
    // función para obtener valor de los inputs y posicionar las imágenes
    nombre = document.getElementsByName("nombre")[0].value; //dato del input nombre
    partidas = parseInt(document.getElementsByName("partidas")[0].value); //dato del input partida parseado a Int
    if (/^\d/.test(nombre)) {
        // expresión regular para validar nombre
        alert("El nombre no puede empezar por un número");
        document.getElementsByName("nombre")[0].className = "fondoRojo";
    } else if (partidas <= 0) {
        alert("El número de partidas tiene que ser mayor a 0");
        document.getElementsByName("partidas")[0].className = "fondoRojo";
    } else {
        document.getElementsByName("nombre")[0].className = ""; //quitamos fondo rojo si lo tenía
        document.getElementsByName("partidas")[0].className = ""; //quitamos fondo rojo si lo tenía
        document.getElementById("actual").innerHTML = partidaActual; // cambiamos contenido html actual de 0 a 1
        document.getElementById("total").innerHTML = partidas; // cambiamos contenido html total al total de partidas
        document.getElementsByTagName("img")[0].src = "img/piedraJugador.png";
        document.getElementsByTagName("img")[1].src = "img/papelJugador.png";
        document.getElementsByTagName("img")[2].src = "img/tijeraJugador.png";
        for (let i = 0; i < 2; i++) {
            //desactivamos los 2 inputs
            document.getElementsByTagName("input")[i].disabled = true;
        }
    }
}

function ya() {
    // función para jugar contra el pc
    let random = Math.round(Math.random() * 2); //random entre 0 y 2
    seleccionadoPc = posibilidades[random]; //selección del PC al azar
    document.getElementsByTagName("img")[3].src =
        "img/" + posibilidades[random] + "Ordenador.png"; // mostramos la imagen correspondiente del PC
    setTimeout(function () {
        if (seleccionado === seleccionadoPc) {
            // EMPATE
            registrarEmpate();
        } else {
            if (seleccionado == "piedra") {
                if (seleccionadoPc == "papel") {
                    ganador(false); // gana PC
                } else {
                    ganador(true); // gana jugador
                }
            } else if (seleccionado == "papel") {
                if (seleccionadoPc == "piedra") {
                    ganador(true);
                } else {
                    ganador(false);
                }
            } else {
                // jugador escoge tijera
                if (seleccionadoPc == "piedra") {
                    ganador(false);
                } else {
                    ganador(true);
                }
            }
        }
    }, 700);
}

function seleccion(numeroImagen) {
    // función para seleccionar la imagen del jugador
    for (let i = 0; i < 3; i++) {
        if (i == numeroImagen) {
            document.getElementsByTagName("img")[i].className = "seleccionado";
            seleccionado = posibilidades[i];
        } else {
            document.getElementsByTagName("img")[i].className = "noSeleccionado";
        }
    }
}

function ganador(winner) {
    // función para actualizar marcadores y registrar victorias
    let resultado = winner ? "Victoria" : "Derrota";
    const ganador = new Ganador(
        winner ? nombre : "Máquina",
        seleccionado,
        seleccionadoPc,
        resultado
    );
    ganadoresList.push(ganador);

    if (winner) {
        miMarcador++;
    } else {
        marcadorPc++;
    }

    registrarResultado(resultado);
}

function registrarEmpate() {
    // función específica para registrar empates
    const empate = new Ganador("Empate", seleccionado, seleccionadoPc, "Empate");
    ganadoresList.push(empate);

    registrarResultado("Empate");
}

function registrarResultado(resultado) {
    // función para actualizar historial
    let lista = document.getElementById("historial");
    let linea = document.createElement("li");
    linea.innerHTML =
        partidaActual +
        ". Resultado: " +
        resultado +
        " (" +
        nombre +
        " saca: " +
        seleccionado +
        " | Máquina saca: " +
        seleccionadoPc +
        ")";
    lista.appendChild(linea);

    partidaActual++;
    if (partidaActual > partidas) {
        finalizarJuego();
    } else {
        document.getElementById("actual").innerHTML = partidaActual;
    }
}

function finalizarJuego() {
    // función para mostrar el resultado final
    if (miMarcador > marcadorPc) {
        setTimeout(function () {
            alert(
                "Juego terminado.\nEnhorabuena, has ganado! " +
                    miMarcador +
                    " vs " +
                    marcadorPc
            );
        }, 2000);
    } else if (miMarcador < marcadorPc) {
        setTimeout(function () {
            alert(
                "Juego terminado.\nLo siento, has perdido. " +
                    miMarcador +
                    " vs " +
                    marcadorPc
            );
        }, 2000);
    } else {
        setTimeout(function () {
            alert(
                "Juego terminado.\nHa sido un empate! " +
                    miMarcador +
                    " vs " +
                    marcadorPc
            );
        }, 2000);
    }
    setTimeout(function () {
        location.reload();
    }, 2500);
}

function reset() {
    // reinicia el número de partidas y marcadores
    let lista = document.getElementById("historial");
    let linea = document.createElement("li");
    linea.innerHTML = "Nueva Partida";
    lista.appendChild(linea);

    alert("Nueva partida");
    partidas = 0;
    partidaActual = 1;
    miMarcador = 0;
    marcadorPc = 0;
    document.getElementById("actual").innerHTML = partidaActual;
    document.getElementById("total").innerHTML = partidas;
    document.getElementsByTagName("img")[3].src = "img/defecto.png";
    document.getElementsByTagName("input")[1].disabled = false;
    document.getElementsByTagName("img")[0].className = "seleccionado";
    document.getElementsByTagName("img")[1].className = "noSeleccionado";
    document.getElementsByTagName("img")[2].className = "noSeleccionado";
}

