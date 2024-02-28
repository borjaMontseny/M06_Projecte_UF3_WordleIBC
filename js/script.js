// Borja Montseny & Adria Chillon DAW2 M06 2024

import dic from './diccionari.js'; // Importem la variable del fitxer diccionari.js

class Jugador {
    constructor(nom, cognom, correuElectronic, telefon, partidesRealitzades, partidesGuanyades, millorPartida, partidaMesRapida) {
        this.nom = nom;
        this.cognom = cognom;
        this.correuElectronic = correuElectronic;
        this.telefon = telefon;
        this.partidesRealitzades = partidesRealitzades;
        this.partidesGuanyades = partidesGuanyades;
        this.millorPartida = millorPartida;
        this.partidaMesRapida = partidaMesRapida;
    }
}

var modal =  new bootstrap.Modal(document.getElementById("modalForm"));

function mostrarForm() {
   modal.show();
}

function mostrarOAmagarElement(accio, element) {
    switch (accio) {
        case "amagar":
            element.classList.remove("visible");
            element.classList.add("ocult");
            break;
        case "mostrar":
            element.classList.remove("ocult");
            element.classList.add("visible");
            break;
        default:
            break;
    }
}

function comprobarRegExp(regex, text) {
    return regex.test(text);
}

var isNomValid = false;
var isCognomValid = false;
var isCorreuElectronicValid = false;
var isTelefonValid = false;

var regExpBasica = /^\w+$/;
var regExpCorreuElectronic = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
var regExpTelefon = /^(?:[9876]\d{8}|[9876]\d{2} \d{3} \d{3}|[9876]\d{1} \d{3} \d{2} \d{2})$/;

var joc = document.getElementById('joc');
var panellSuperiorButtons = document.querySelectorAll(".panellSuperiorButton");
var nom = document.getElementById('nom');
var checkNom = document.getElementById('checkNom');
var cognom = document.getElementById('cognom');
var checkCognom = document.getElementById('checkCognom');
var correuElectronic = document.getElementById('correuElectronic');
var checkCorreuElectronic = document.getElementById('checkCorreuElectronic');
var telefon = document.getElementById('telefon');
var checkTelefon = document.getElementById('checkTelefon');
var jugador = new Jugador(nom.value, cognom.value, correuElectronic.value, telefon.value, 0, 0, 0, 0);

// Verificar si ya hay datos en localStorage para la clave "jugador"
if (!localStorage.getItem("jugador")) {
    // Si no hay datos guardados, mostrar el formulario
    mostrarForm();
} else {
    // Si ya hay datos guardados, mostrar el juego directamente
    joc.classList.remove('ocult');
    joc.classList.add('visible');
}


// FORMULARI
nom.addEventListener("input", function () {
    isNomValid = comprobarRegExp(regExpBasica, nom.value);
    if (isNomValid) {
        mostrarOAmagarElement("mostrar", checkNom);
    } else {
        joc.classList.remove('ocult');
        joc.classList.add('visible');
    }
});

cognom.addEventListener("input", function () {
    isCognomValid = comprobarRegExp(regExpBasica, cognom.value);
    if (isCognomValid) {
        mostrarOAmagarElement("mostrar", checkCognom);
    }
});

correuElectronic.addEventListener("input", function () {
    isCorreuElectronicValid = comprobarRegExp(regExpCorreuElectronic, correuElectronic.value);
    if (isCorreuElectronicValid) {
        mostrarOAmagarElement("mostrar", checkCorreuElectronic);
    }
});

telefon.addEventListener("input", function () {
    isTelefonValid = comprobarRegExp(regExpTelefon, telefon.value);
    if (isTelefonValid) {
        mostrarOAmagarElement("mostrar", checkTelefon);
    }
})

document.getElementById('gameStartButton').addEventListener('click', function (event) {
    event.preventDefault();

    if (isNomValid && isCognomValid && isCorreuElectronicValid && isTelefonValid) {
        // Instanciem jugador amb les dades ja validades, i el guardem a localStorage
        jugador = new Jugador(nom.value, cognom.value, correuElectronic.value, telefon.value, 0, 0, 0, 0);
        localStorage.setItem('jugador', JSON.stringify(jugador));
        modal.hide();
        joc.classList.remove('ocult');
        joc.classList.add('visible');
    } else {
        // Utiliza SweetAlert2 para mostrar el mensaje de error
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Valida tots els camps per a començar la partida',
        });
    }
});

// JOC:
// Panell Superior
panellSuperiorButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        // Obtener el emoji clickeado
        var emojiClicked = button.textContent;

        // Ejecutar una función o acción basada en el emoji clickeado
        switch (emojiClicked) {
            case "📊":
                // Estadístiques
                Swal.fire({
                    title: "Estadístiques",
                    html: "Nom: " + jugador.nom + "<br>" +
                          "Cognom: " + jugador.cognom + "<br>" +
                          "Correu Electrònic: " + jugador.correuElectronic + "<br>" +
                          "Telèfon: " + jugador.telefon + "<br>" +
                          "Partides Realitzades: " + jugador.partidesRealitzades + "<br>" +
                          "Partides Guanyades: " + jugador.partidesGuanyades + "<br>" +
                          "Millor Partida: " + jugador.millorPartida + "<br>" +
                          "Partida Més Ràpida: " + jugador.partidaMesRapida + "<br>"
                });
                
                break;
            case "🔄":
                //reinciarPartida();
                break;
            case "❔":
                // Guía de com jugar
                Swal.fire({
                    title: "Com jugar al WordleIBC?",
                    html: "<p>Endevina el wordle <b>WORDLE</b> en 6 intents. <br><br> Has d'introduir paraules de 5 lletres <u>que \
                    existeixin</u> i fer clic a ENTER (↵).<br><br> Després de cada intent, el color de les lletres canviarà per indicar l'evolució de la partida. <br><br>\
                    No es tenen en compte els accents a l'hora d'introduir paraules. <br><br>Es poden repetir lletres. <br><br> Exemples:<br><br> \
                    <h6><span id='p'>P</span>ILOT</h6> <p>La lletra <b>P</b> es troba en lloc correcte de la paraula.</p> \
                    <h6>DO<span id='t'>T</span>ZE</h6> <p>La paraula té la lletra <b>T</b> però en un altre lloc.</p> \
                    <h6>MAGI<span id='c'>C</span></h6> <p>La paraula no conté la lletra <b>C</b>.</p>",
                    icon: "info"
                });
                break;
            default:
                break;
        }
    });
});