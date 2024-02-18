// borjaMontseny & AdriaChillon DAW2 M06 2024
import dic from './diccionari.js'; // Importem la variable del fitxer diccionari.js

// Funció per a comprobar la RegExp
function comprobarRegExp(regex, text, checkEx) {
    if (regex.test(text)) {
        checkEx.classList.remove('ocult');
        checkEx.classList.add('visible');
    } else {
        checkEx.classList.remove('visible');
        checkEx.classList.add('ocult');
    }
}

// Expresions Regulars
var regExpBasica = /^\w+$/;
var regExpCorreuElectronic = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
var regExpTelegon = /^(?:[9876]\d{8}|[9876]\d{2} \d{3} \d{3}|[9876]\d{1} \d{3} \d{2} \d{2})$/;

window.onload = function () {

    /* 
        1ª PART: FORMULARI 
        - Validem el formulari (utilitzant regExp) i creem l'objecte jugador
        en cas de que no hi hagin dades prèvies a LocalStorage (anterior partida)
    */


    // Definim la clase Jugador que es creará a partir del formulari
    class Jugador {
        constructor(nom, cognom, correuElectronic, telefon) {
            this.nom = nom;
            this.cognom = cognom;
            this.correuElectronic = correuElectronic;
            this.telefon = telefon;
        }

        // falta afegir dades de la partida, estadistiques etc
    }

    document.getElementById('formulariJoc').addEventListener('submit', function (event) {
        event.preventDefault();

        // Capturem els elements HTML del formulari, input i check (emoji ✔️)
        var nom = document.getElementById('nom').value;
        var checkNom = documentdocument.getElementById('checkNom');

        var cognom = document.getElementById('cognom').value;
        var checkNom = documentdocument.getElementById('checkCogom');

        var correuElectronic = document.getElementById('correuElectronic').value;
        var checkNom = documentdocument.getElementById('checkCorreuElectronic');

        var telefon = document.getElementById('telefon').value;
        var checkNom = documentdocument.getElementById('checkCorreuElectronic');

        // Validem els camps


        // Instanciem l'objecte jugador
        var jugador = new Jugador(nom, cognom, correuElectronic, telefon);

        // guardem les dades del jugador en el LocalStorage
        localStorage.setItem('jugador', JSON.stringify(jugador));

        // treiem les dades de LocalStorage
        // var retrievedJugador = JSON.parse(localStorage.getItem('jugador'));

        // Ocultar el formulari i mostrar el joc
        document.getElementById('formulari').classList.add('ocult');
        document.getElementById('joc').classList.remove('ocult');
    });
}
