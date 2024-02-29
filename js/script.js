// Importamos el diccionario de palabras
import dic from './diccionari.js';

class Jugador {
    constructor(nom, cognom, correuElectronic, telefon) {
        this.nom = nom;
        this.cognom = cognom;
        this.correuElectronic = correuElectronic;
        this.telefon = telefon;
        this.partidesRealitzades = 0;
        this.partidesGuanyades = 0;
        this.millorPartida = Infinity; // Usaremos esta variable para almacenar el menor número de intentos con los que el jugador ha ganado.
        this.partidaMesRapida = Infinity; // Almacenará el tiempo más rápido en segundos en que el jugador ha ganado.
    }
}

let jugador = JSON.parse(localStorage.getItem('jugador')) || null;
const modal = new bootstrap.Modal(document.getElementById("modalForm"), {
    keyboard: false
});
let juegoIniciado = false;
let paraulaSecreta = '';
let intents = 0;
let iniciPartida = null;
const maxIntents = 6;
let juegoFinalizado = false;

document.addEventListener('DOMContentLoaded', iniciar);

function iniciar() {
    cargarJugadorLocalStorage();
    configurarEventListeners();
    if (jugador) {
        mostrarOAmagarElement('mostrar', document.getElementById('joc'));
        iniciarJoc(); // Inicia el juego automáticamente si hay datos de jugador
    } else {
        mostrarForm(); // Muestra el formulario si no hay datos de jugador
    }
}

function cargarJugadorLocalStorage() {
    if (jugador) {
        mostrarOAmagarElement('mostrar', document.getElementById('joc'));
    }
}

function configurarEventListeners() {
    document.getElementById('gameStartButton').addEventListener('click', validarFormulari);
    document.querySelectorAll('.panellSuperiorButton').forEach(button => {
        const accion = button.textContent;
        button.addEventListener('click', () => {
            if (accion === '🔄') iniciarJoc();
            else if (accion === '📊') mostrarEstadistiques();
            else if (accion === '❔') mostrarAjuda();
        });
    });
    document.querySelectorAll('#teclat button').forEach(tecla => tecla.addEventListener('click', manejarTeclaVirtual));
    document.addEventListener('keydown', manejarTeclaFisica);
}

function mostrarForm() {
    if (!jugador) modal.show();
}

function mostrarOAmagarElement(accio, element) {
    element.classList.toggle("ocult", accio === "amagar");
    element.classList.toggle("visible", accio === "mostrar");
}

function validarFormulari(event) {
    event.preventDefault();
    const nom = document.getElementById('nom').value.trim();
    const cognom = document.getElementById('cognom').value.trim();
    const correuElectronic = document.getElementById('correuElectronic').value.trim();
    const telefon = document.getElementById('telefon').value.trim();

    if (nom && cognom && validarEmail(correuElectronic) && validarTelefon(telefon)) {
        jugador = new Jugador(nom, cognom, correuElectronic, telefon);
        localStorage.setItem('jugador', JSON.stringify(jugador));
        modal.hide();
        iniciarJoc();
    } else {
        Swal.fire('Error', 'Comprova que tots els camps estiguin correctament omplerts.', 'error');
    }
}

function validarEmail(email) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

function validarTelefon(telefon) {
    const regex = /^(?:[9876]\d{8}|[9876]\d{2} \d{3} \d{3}|[9876]\d{1} \d{3} \d{2} \d{2})$/;
    return regex.test(telefon);
}

function iniciarJoc() {
    paraulaSecreta = escollirParaulaSecreta();
    console.log(paraulaSecreta);
    intents = 0;
    juegoFinalizado = false;
    juegoIniciado = true; // El juego comienza aquí
    iniciPartida = new Date();
    prepararUIPerNouJoc();
    mostrarOAmagarElement('mostrar', document.getElementById('joc'));
    // Habilitar teclas
    document.querySelectorAll('#teclat button').forEach(tecla => {
        tecla.disabled = false;
    });
}

function escollirParaulaSecreta() {
    // Asegurándonos de que solo seleccionamos palabras de 5 letras.
    let palabrasDeCincoLetras = dic.filter(palabra => palabra.length === 5);
    const indexAleatori = Math.floor(Math.random() * palabrasDeCincoLetras.length);
    return palabrasDeCincoLetras[indexAleatori].toUpperCase();
}

function prepararUIPerNouJoc() {
    document.querySelectorAll('.celda').forEach(celda => {
        celda.textContent = '';
        celda.className = 'celda';
    });
    document.querySelectorAll('#teclat button').forEach(tecla => {
        tecla.disabled = false;
        tecla.className = '';
    });
}

function manejarTeclaVirtual(event) {
    if (!juegoFinalizado && juegoIniciado) {
        const tecla = event.target.textContent;
        if (tecla === '←') borrarUltimaLletra();
        else afegirLletra(tecla);
    }
}

function manejarTeclaFisica(event) {
    if (!juegoFinalizado && juegoIniciado) {
        if (event.key === 'Backspace') {
            borrarUltimaLletra();
        } else if (/^[a-zA-ZçÇ]$/.test(event.key)) {
            afegirLletra(event.key.toUpperCase());
        } else if (event.key === 'Enter') {
            event.preventDefault(); // Previene el comportamiento predeterminado del evento
            event.stopPropagation(); // Detiene la propagación del evento
            comprovarIntent();
        }
    }
}


function afegirLletra(lletra) {
    if (intents < maxIntents) {
        const filaActual = document.getElementById(`paraula${intents + 1}`);
        const celdasLliures = Array.from(filaActual.querySelectorAll('.celda')).filter(celda => !celda.textContent);
        if (celdasLliures.length > 0) celdasLliures[0].textContent = lletra;
    }
}

function borrarUltimaLletra() {
    const filaActual = document.getElementById(`paraula${intents + 1}`);
    const celdasOcupadas = Array.from(filaActual.querySelectorAll('.celda')).filter(celda => celda.textContent);
    if (celdasOcupadas.length > 0) celdasOcupadas[celdasOcupadas.length - 1].textContent = '';
}

function comprovarIntent() {
    if (intents < maxIntents && !juegoFinalizado) {
        const filaActual = document.getElementById(`paraula${intents + 1}`);
        const paraulaIntroduida = Array.from(filaActual.querySelectorAll('.celda')).map(celda => celda.textContent).join('');

        if (paraulaIntroduida.length === 5) {
            if (dic.includes(paraulaIntroduida.toLowerCase())) {
                marcarCeldas(filaActual, paraulaIntroduida);
                intents++;

                if (paraulaIntroduida.toUpperCase() === paraulaSecreta) {
                    finalitzarJoc(true);
                } else if (intents >= maxIntents) {
                    finalitzarJoc(false);
                }
            } else {
                Swal.fire({
                    title: 'Palabra incorrecta',
                    text: 'La palabra ingresada no es correcta o no está en el diccionario.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'La palabra debe tener 5 letras.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    }
}

function marcarCeldas(filaActual, paraulaIntroduida) {
    Array.from(filaActual.querySelectorAll('.celda')).forEach((celda, index) => {
        const lletra = celda.textContent.toUpperCase();
        if (paraulaSecreta[index] === lletra) celda.classList.add('correcte');
        else if (paraulaSecreta.includes(lletra)) celda.classList.add('presente');
        else celda.classList.add('absent');
    });
}

function finalitzarJoc(guanyat) {
    const tempsPartida = ((new Date()) - iniciPartida) / 1000;
    jugador.partidesRealitzades++;
    juegoFinalizado = true;
    juegoIniciado = false;

    if (guanyat) {
        jugador.partidesGuanyades++;

        // Actualiza si es el menor número de intentos para ganar
        if (intents < jugador.millorPartida || jugador.millorPartida === Infinity) {
            jugador.millorPartida = intents;
        }

        // Actualiza si es el tiempo más rápido para ganar
        if (tempsPartida < jugador.partidaMesRapida || jugador.partidaMesRapida === Infinity) {
            jugador.partidaMesRapida = tempsPartida;
        }

        Swal.fire({
            title: '¡Enhorabuena!',
            text: `¡Has ganado! La palabra era "${paraulaSecreta}" y has tardado ${tempsPartida.toFixed(2)} segundos.`,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    } else {
        Swal.fire({
            title: '¡Oh, no!',
            text: `Has perdido. La palabra era "${paraulaSecreta}".`,
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
    // Deshabilitar todas las teclas al finalizar el juego
    document.querySelectorAll('#teclat button').forEach(tecla => {
        tecla.disabled = true;
    });

    localStorage.setItem('jugador', JSON.stringify(jugador)); // Guardar el estado actualizado en localStorage
    document.querySelectorAll('#teclat button').forEach(tecla => tecla.disabled = true);
}

function mostrarEstadistiques() {
    Swal.fire({
        title: 'Estadístiques',
        html: `
            Nom: ${jugador.nom}<br>
            Cognom: ${jugador.cognom}<br>
            Correu Electrònic: ${jugador.correuElectronic}<br>
            Telèfon: ${jugador.telefon}<br>
            Partides Realitzades: ${jugador.partidesRealitzades}<br>
            Partides Guanyades: ${jugador.partidesGuanyades}<br>
            Millor Partida (en intents): ${jugador.millorPartida === Infinity ? 'N/A' : jugador.millorPartida}<br>
            Partida Més Ràpida (en segons): ${jugador.partidaMesRapida === Infinity ? 'N/A' : jugador.partidaMesRapida.toFixed(2)}<br>`,
        icon: 'info'
    });
}

function mostrarAjuda() {
    Swal.fire({
        title: 'Com jugar al WordleIBC?',
        html: `Endevina la paraula oculta en 6 intents. Cada intent ha de ser una paraula vàlida de 5 lletres. Després de cada intent, el color de les lletres canviarà per mostrar com de prop estàs de la paraula correcta.<br><br>
               <b>Exemples:</b><br>
               Si la lletra està en la paraula i en la posició correcta, es tornarà <span class="correcte">verda</span>.<br>
               Si la lletra està en la paraula però en una posició incorrecta, es tornarà <span class="presente">groc</span>.<br>
               Si la lletra no està en la paraula, es tornarà <span class="absent">gris</span>.<br><br>
               Utilitza el teclat per introduir els teus intents. Pots reiniciar el joc en qualsevol moment prement el botó de reiniciar.`,
        icon: 'info'
    });
}
