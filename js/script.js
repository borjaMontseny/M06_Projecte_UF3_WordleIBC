// borjaMontseny & AdriaChillon DAW2 M06 2024

window.onload = function () {

    // Jugador que es crea al formulari
    class Jugador {
        constructor(nom, cognom, correuElectronic, telefon) {
            this.nom = nom;
            this.cognom = cognom;
            this.correuElectronic = correuElectronic;
            this.telefon = telefon;
        }

        // falta un constructor amb les dades de la partida, estadistiques etc. sino per defecte serien 0 al constructor de adalt
    }

    document.getElementById('formulariJoc').addEventListener('submit', function (event) {
        event.preventDefault();

        var nom = document.getElementById('nom').value;
        var cognom = document.getElementById('cognom').value;
        var correuElectronic = document.getElementById('correuElectronic').value;
        var telefon = document.getElementById('telefon').value;

        const jugador = new Jugador(nom, cognom, correuElectronic, telefon);

        // guardem les dades del jugador en el LocalStorage
        localStorage.setItem('jugador', JSON.stringify(jugador));

        // treiem les dades de LocalStorage
        // var retrievedJugador = JSON.parse(localStorage.getItem('jugador'));

        // Ocultar el formulari i mostrar el joc
        document.getElementById('formulari').classList.add('ocult');
        document.getElementById('joc').classList.remove('ocult');
    });
}
