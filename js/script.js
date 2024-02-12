// borjaMontseny & AdriaChillon DAW2 M06 2024

window.onload = function () {

    class jugadorInicial {
        constructor(nom, cognom, correuElectronic, telefon) {
            this.nom = nom;
            this.cognom = cognom;
            this.correuElectronic = correuElectronic;
            this.telefon = telefon;
        }
    }

    class jugadorAGuardar {
        constructor(nom, cognom, correuElectronic, telefon) {
            this.nom = nom;
            this.cognom = cognom;
            this.correuElectronic = correuElectronic;
            this.telefon = telefon;
        }
    }

    document.getElementById('formulariJoc').addEventListener('submit', function (event) {
        event.preventDefault();

        var nom = document.getElementById('nom').value;
        var cognom = document.getElementById('cognom').value;
        var correuElectronic = document.getElementById('correuElectronic').value;
        var telefon = document.getElementById('telefon').value;

        const jugador = new JugadorInicial(nom, cognom, correuElectronic, telefon);

        // guardem les dades del jugador en el LocalStorage
        localStorage.setItem('jugador', JSON.stringify(jugador));

        // treiem les dades de LocalStorage
        // var retrievedJugador = JSON.parse(localStorage.getItem('jugador'));

        // Ocultar el formulari i mostrar el joc
        document.getElementById('formulari').classList.add('ocult');
        document.getElementById('joc').classList.remove('ocult');
    });
}
