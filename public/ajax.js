var greskaPredmet = false;
var jsonPredmeti;
var jsonAktivnosti;
window.onload = function() {
    ucitajPredmete();
    ucitajAktivnosti();
}
function ucitajPredmete() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/predmeti", true);
    ajax . send () ;
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            jsonPredmeti = JSON.parse(ajax.responseText);
        }
    }
}
function ucitajAktivnosti() {
    var ajax = new XMLHttpRequest();
    ajax.open("GET", "/aktivnosti", true);
    ajax . send () ;
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status == 200) {
            jsonAktivnosti = JSON.parse(ajax.responseText);
        }
    }
}
function dodajPredmet(naziv) {
    var ajax = new XMLHttpRequest();
    ajax.open("POST", "/predmet", true);
    ajax.setRequestHeader ( "Content-Type" , "application/json" ) ;
    ajax.send("{\"naziv\":\"" + naziv + "\"}");
    ajax.onreadystatechange = function() {
        if (ajax.readyState == 4 && ajax.status != 200) {
            greskaPredmet = true;
        }
    }
}
function obrisiPredmet(naziv) {
    var ajax = new XMLHttpRequest();
    ajax.open("DELETE", "/predmet/" + naziv, true);
    ajax . send () ;
}
function dodajAktivnost() {
    var ajax = new XMLHttpRequest();

    //provjera postojanja predmeta
    var predmetPostoji = false;
    for(i = 0; i < jsonPredmeti.length; i++) {
        if(jsonPredmeti[i].naziv == document . getElementById ( 'naziv' ). value) 
        {
            predmetPostoji = true;
        }
    }
    if(!predmetPostoji) {
        dodajPredmet(document . getElementById ( 'naziv' ).value);
    }

    //dodavanje nove aktivnosti
    ajax.open("POST", "/aktivnost", true);
    ajax.setRequestHeader ( "Content-Type" , "application/json" ) ;
    var jsonString = "{\"naziv\":\"" + document . getElementById ( 'naziv' ). value + 
        "\",\"tip\":\"" + document . getElementById ( 'tip' ). value.toString() + 
        "\",\"pocetak\":" + document . getElementById ( 'pocetak' ). value.toString() + 
        ",\"kraj\":" + document . getElementById ( 'kraj' ). value.toString() + 
        ",\"dan\":\"" + document . getElementById ( 'dan' ). value.toString() +"\"}"; 
    ajax.send (jsonString);
    ajax.onreadystatechange = function() {
        if(!greskaPredmet) {
            if (ajax.readyState == 4 && ajax.status == 200) {
                if(JSON.parse(ajax.response).message == "Aktivnost nije validna!") {
                    obrisiPredmet(document . getElementById ( 'naziv' ).value);
                }
                else alert("Aktivnost dodana uspješno!");
            }
            else if (ajax.readyState == 4) {
                obrisiPredmet(document . getElementById ( 'naziv' ).value);
            }
        }
    }
}