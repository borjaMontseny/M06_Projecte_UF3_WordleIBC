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
    var formulari = document.getElementById('formulari');
    var nom = document.getElementById('nom');
    var checkNom = document.getElementById('checkNom');
    var cognom = document.getElementById('cognom');
    var checkCognom = document.getElementById('checkCognom');
    var correuElectronic = document.getElementById('correuElectronic');
    var checkCorreuElectronic = document.getElementById('checkCorreuElectronic');
    var telefon = document.getElementById('telefon');
    var checkTelefon = document.getElementById('checkTelefon');

    nom.addEventListener("input", function () {
        isNomValid = comprobarRegExp(regExpBasica, nom.value);
        mostrarOAmagarElement(isNomValid, checkNom);
    });

    cognom.addEventListener("input", function () {
        isCognomValid = comprobarRegExp(regExpBasica, cognom.value);
        mostrarOAmagarElement(isCognomValid, checkCognom);
    });

    correuElectronic.addEventListener("input", function () {
        isCorreuElectronicValid = comprobarRegExp(regExpCorreuElectronic, correuElectronic.value);
        mostrarOAmagarElement(isCorreuElectronicValid, checkCorreuElectronic);
    });

    telefon.addEventListener("input", function () {
        isTelefonValid = comprobarRegExp(regExpTelefon, telefon.value);
        mostrarOAmagarElement(isTelefonValid, checkTelefon);
    })

    document.getElementById('formulariJoc').addEventListener('submit', function (event) {
        event.preventDefault();

        if (isNomValid && isCognomValid && isCorreuElectronicValid && isTelefonValid) {
            mostrarOAmagarElement("amagar", formulari);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Valida tots els camps per a començar la partida',
            });
        }

        var jugador = new Jugador(nom.value, cognom.value, correuElectronic.value, telefon.value, 0, 0, 0, 0);
        localStorage.setItem('jugador', JSON.stringify(jugador));
        mostrarOAmagarElement("amagar", formulari);
        mostrarOAmagarElement("mostrar", joc);
    });
}