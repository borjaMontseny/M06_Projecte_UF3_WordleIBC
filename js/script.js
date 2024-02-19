// borjaMontseny & AdriaChillon DAW2 M06 2024
import dic from './diccionari.js'; // Importem la variable del fitxer diccionari.js

// Definim la clase Jugador que es creará a partir del formulari
// TODO: Comprobar si a LocalStorage ja hi existeix un jugador
class Jugador {
    // Constructor per si es el primer cop que juguem:
    constructor(nom, cognom, correuElectronic, telefon) {
        this.nom = nom;
        this.cognom = cognom;
        this.correuElectronic = correuElectronic;
        this.telefon = telefon;
    }

    // falta afegir dades de la partida, estadistiques etc
}

// Funció per a comprobar la RegExp
function comprobarRegExp(regex, text, checkEx) {
    console.log(regex, text, checkEx, regex.test(text));
    if (regex.test(text)) {
        checkEx.classList.remove('ocult');
        checkEx.classList.add('visible');
    } else {
        checkEx.classList.remove('visible');
        checkEx.classList.add('ocult');
    }
}

// Expresions Regulars
var regExpBasica = /^\w+$/; // Per a nom i cognom
var regExpCorreuElectronic = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
var regExpTelegon = /^(?:[9876]\d{8}|[9876]\d{2} \d{3} \d{3}|[9876]\d{1} \d{3} \d{2} \d{2})$/;

// Carrega la web
window.onload = function () {

    /* 
        1ª PART: FORMULARI 
        - Validem el formulari (utilitzant regExp) i creem l'objecte jugador
        en cas de que no hi hagin dades prèvies a LocalStorage (anterior partida)
    */

    // Capturem els elements HTML del formulari, input i check (emoji ✔️)
    var nom = document.getElementById('nom');
    var valorNom = nom.value;
    var checkNom = document.getElementById('checkNom');

    var cognom = document.getElementById('cognom');
    var valorCognom = document.getElementById('cognom').value;
    var checkCognom = document.getElementById('checkCogom');

    var correuElectronic = document.getElementById('correuElectronic').value;
    var checkCorreuElectronic = document.getElementById('checkCorreuElectronic');

    var telefon = document.getElementById('telefon').value;
    var checkTelefon = document.getElementById('checkCorreuElectronic');

    // Validem els camps
    // Nom:
    nom.addEventListener("input", function () {
        comprobarRegExp(regExpBasica, nom.value, checkNom);
    });

    // se validan los campos, se instancia jugador, se guarda en localStorage, y desaparece el formulario
    document.getElementById('formulariJoc').addEventListener('submit', function (event) {
        event.preventDefault();

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
