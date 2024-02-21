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

window.onload = function () {
    var joc = document.getElementById('joc');
    var panellSuperiorButtons = document.querySelectorAll(".panellSuperiorButton");
    var formulari = document.getElementById('formulari');
    var nom = document.getElementById('nom');
    var checkNom = document.getElementById('checkNom');
    var cognom = document.getElementById('cognom');
    var checkCognom = document.getElementById('checkCognom');
    var correuElectronic = document.getElementById('correuElectronic');
    var checkCorreuElectronic = document.getElementById('checkCorreuElectronic');
    var telefon = document.getElementById('telefon');
    var checkTelefon = document.getElementById('checkTelefon');

    // FORMULARI
    nom.addEventListener("input", function () {
        isNomValid = comprobarRegExp(regExpBasica, nom.value);
        if (isNomValid) {
            mostrarOAmagarElement("mostrar", checkNom);
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
            // Un cop el forumulari está validat, l'amaguem
            mostrarOAmagarElement("amagar", formulari);

            // Instanciem jugador amb les dades ja validades, i el guardem a localStorage
            var jugador = new Jugador(nom.value, cognom.value, correuElectronic.value, telefon.value, 0, 0, 0, 0);
            localStorage.setItem('jugador', JSON.stringify(jugador));
            mostrarOAmagarElement("amagar", formulari);
            mostrarOAmagarElement("mostrar", joc);
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
        button.addEventListener("click", function (event) {
            // Obtener el emoji clickeado
            // var botoClicat = button.textContent;
            var emojiClicked = button.textContent;

            // Ejecutar una función o acción basada en el emoji clickeado
            switch (emojiClicked) {
                case "📊":
                    // Estadístiques
                    Swal.fire("Estadístiques del Jugador", `
                    Nom: ${jugador.nom}
                    Cognom: ${jugador.cognom}
                    Correu Electrònic: ${jugador.correuElectronic}
                    Telèfon: ${jugador.telefon}
                    Partides Realitzades: ${jugador.partidesRealitzades}
                    Partides Guanyades: ${jugador.partidesGuanyades}
                    Millor Partida: ${jugador.millorPartida}
                    Partida Més Ràpida: ${jugador.partidaMesRapida}
                `);
                    break;
                case "🔄":
                    // Començar nova partida
                    Swal.fire({
                        icon: "question",
                        title: "Tornar a començar",
                        text: "Estàs apunt de reiniciar la partida, estàs segur?",
                        footer: '<a href="#">Desitjo reiniciar partida</a>'
                    });
                    break;
                case "❔":
                    // Guía de com jugar
                    Swal.fire({
                        title: "Com es juga?",
                        text: "Implementar guia",
                        icon: "question"
                    });
                    break;
                default:
                    break;
            }
        });
    });

}