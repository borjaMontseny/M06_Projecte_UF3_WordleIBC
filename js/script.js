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
        this.millorPartida = Infinity; // Menor número de intentos con los que el jugador ha ganado.
        this.partidaMesRapida = Infinity; // Tiempo más rápido en segundos en que el jugador ha ganado.
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
        iniciarJoc();
    } else {
        mostrarForm();
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
    juegoIniciado = true;
    iniciPartida = new Date();
    prepararUIPerNouJoc();
    mostrarOAmagarElement('mostrar', document.getElementById('joc'));
    document.querySelectorAll('#teclat button').forEach(tecla => {
        tecla.disabled = false;
    });
}

function escollirParaulaSecreta() {
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
            event.preventDefault();
            event.stopPropagation();
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
    const tempsPartida = ((new Date()) - iniciPartida) / 1000; // Tiempo en segundos
    jugador.partidesRealitzades++;

    if (guanyat) {
        jugador.partidesGuanyades++;
        // Actualizar si es la mejor partida (menor número de intentos)
        if (jugador.millorPartida === Infinity || intents < jugador.millorPartida) {
            jugador.millorPartida = intents;
        }

        // Actualizar si es la partida más rápida
        if (jugador.partidaMesRapida === Infinity || tempsPartida < jugador.partidaMesRapida) {
            jugador.partidaMesRapida = tempsPartida;
        }

        Swal.fire({
            title: 'Enhorabona!',
            text: `Has guanyat en ${intents} intents i el teu temps ha estat de ${tempsPartida.toFixed(2)} segons.`,
            icon: 'success',
            confirmButtonText: 'Ok'
        });
    } else {
        // Aquesta és la part afegida per mostrar el missatge de derrota
        Swal.fire({
            title: 'Has perdut',
            html: `No has aconseguit endevinar la paraula: "${paraulaSecreta}".<br><br> Més sort a la pròxima vegada!`,
            icon: 'error',
            confirmButtonText: 'Ok'
            });
    }

    juegoFinalizado = true;
    juegoIniciado = false;

    // Aquí es crucial guardar el estado actualizado en localStorage
    localStorage.setItem('jugador', JSON.stringify(jugador));

    // Deshabilitar teclas, etc.
}

function mostrarEstadistiques() {
    // Asegurarse de cargar los datos más recientes del jugador desde localStorage
    actualizarDatosJugadorDesdeLocalStorage();

    const partidaMesRapidaFormatted = jugador.partidaMesRapida !== Infinity && jugador.partidaMesRapida != null ? jugador.partidaMesRapida.toFixed(2) : 'N/D';

    Swal.fire({
        title: 'Estadístiques',
        html: `
            Nom i Cognoms: ${jugador.nom} ${jugador.cognom}<br><br>
            Correu Electrònic: ${jugador.correuElectronic}<br><br>
            Telèfon: ${jugador.telefon}<br><br>
            Partides Realitzades: ${jugador.partidesRealitzades}<br><br>
            Partides Guanyades: ${jugador.partidesGuanyades}<br><br>
            Millor Partida (en intents): ${jugador.millorPartida !== Infinity ? jugador.millorPartida : 'N/D'}<br><br>
            Partida Més Ràpida (en segons): ${partidaMesRapidaFormatted}<br>`,
        icon: 'info'
    });
}

function actualizarDatosJugadorDesdeLocalStorage() {
    const datosJugador = localStorage.getItem('jugador');
    if (datosJugador) {
        jugador = JSON.parse(datosJugador);
    }
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
