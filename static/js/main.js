let seleccionado = [0, 0];
let aciertos = 0;
let intentos = 0;
let posicionTarjeta = [];
let numFilas = 3;
let numColumnas = 4;

window.onload = genera_tabla(3, 4);

function rotar(carta) {
    let gradosDiv = carta.parentNode.getAttribute("grados");;
    if (gradosDiv == 0) {
        carta.parentNode.style.transform = "rotateY(180deg)";
        carta.parentNode.setAttribute("grados", 180);
        carta.setAttribute("src", "static/img/img" + posicionTarjeta[carta.getAttribute("id") - 1] + ".jpg");
    } else {
        carta.parentNode.style.transform = "rotateY(0deg)";
        carta.parentNode.setAttribute("grados", 0);
        carta.setAttribute("src", "static/img/oculto.jpg");
    }
}

function correcto(x, y) {
    let tarjetaDiv = x.parentNode;
    tarjetaDiv.removeAttribute("onclick");
    x.removeAttribute("onclick");
    tarjetaDiv.setAttribute("style", 'pointerEvents = "none"');
    tarjetaDiv.setAttribute("style","");

    let tarjetaDiv2 = y.parentNode;
    tarjetaDiv2.removeAttribute("onclick");
    y.removeAttribute("onclick");
    tarjetaDiv2.setAttribute("style", 'pointerEvents = "none"');
}

function incorrecto(x, y) {
    rotar(x);
    rotar(y);
}

function aleatorio() {
    posicionTarjeta = [];
    for (let i = 0; i < (numFilas*numColumnas)/2; i++) {
        for (let j = 0; j < 2; j++) {
            posicionTarjeta.push(i+1);
        }
    }

    for (let i = (numColumnas*numFilas) - 1; i > 0; i--) {
        let indiceAleatorio = Math.floor(Math.random() * (i + 1));
        let temporal = posicionTarjeta[i];
        posicionTarjeta[i] = posicionTarjeta[indiceAleatorio];
        posicionTarjeta[indiceAleatorio] = temporal;
    }
}

function juego(carta) {
    if (seleccionado[0] == 0) {
        seleccionado[0] = carta;
        seleccionado[0].parentNode.setAttribute("estado", true);
        seleccionado[0].removeAttribute("onclick");
    }
    else if (seleccionado[1] == 0) {
        seleccionado[1] = carta;
        let carta1 = seleccionado[0];
        let carta2 = seleccionado[1];
        if (seleccionado[0].getAttribute("src") == seleccionado[1].getAttribute("src")) {
            aciertos++;
            document.getElementById("aciertos").innerHTML = "<p id='aciertos'>Aciertos: " + aciertos + "</p>";
            setTimeout(function () { correcto(carta1, carta2) }, 500);
        }
        else {
            setTimeout(function () { incorrecto(carta1, carta2) }, 500);
            seleccionado[0].setAttribute("onclick", "rotar(this), juego(this)");
        }
        intentos++;
        document.getElementById("intentos").innerHTML = "<p id='intentos'>Intentos: " + intentos + "</p>";
        for (let a = 0; a < seleccionado.length; a++) {
            seleccionado[a] = 0;
        }

        if (aciertos == (numColumnas*numFilas)/2) {
            on();
            empezarDetener(1);
        }
    }
}

function reiniciar() {
    seleccionado[0] = 0;
    seleccionado[1] = 0;
    aciertos = 0;
    intentos = 0;
    document.getElementById("intentos").innerHTML = "<p id='intentos'>Intentos: " + intentos + "</p>";
    document.getElementById("aciertos").innerHTML = "<p id='aciertos'>Aciertos: " + aciertos + "</p>";
    on();
    
}

function tamaño(filas,columnas) {
    numFilas = filas;
    numColumnas = columnas;
}

function genera_tabla() {
    var tabla = document.getElementById("contenedor");
    if (tabla != null) {
        var tabla = document.getElementById("contenedor");
        var padre = tabla.parentNode;
        padre.removeChild(tabla);
    }
    var contenedor = document.getElementsByClassName("tablero");
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "contenedor");

    var id = 0;
    for (let i = 0; i < numFilas; i++) {
        var tr = document.createElement("tr");
        for (let x = 0; x < numColumnas; x++) {
            id++;

            var td = document.createElement("td");

            var div = document.createElement("div");
            div.className = "card";
            div.setAttribute("grados", "0");

            var img = document.createElement("img");
            img.setAttribute("src", "static/img/oculto.jpg");
            img.setAttribute("id", id);
            img.setAttribute("onclick", "rotar(this), juego(this)");
            img.setAttribute("style","border-radius: 4px;")

            div.appendChild(img);
            td.appendChild(div);
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }

    contenedor[0].appendChild(tabla);
    aleatorio(); 
}

function on() {
    document.getElementById("jugar").style.display = "block";
    if (aciertos != (numColumnas*numFilas)/2) {
        document.getElementById("empezar").removeAttribute("class");
        document.getElementById("ganador").setAttribute("class","oculto");
    }
    else{
        document.getElementById("ganador").removeAttribute("class");
        document.getElementById("empezar").setAttribute("class","oculto");
    }
}

function off() {
    document.getElementById("jugar").style.display = "none";
}

var inicio = 0;
var timeout = 0;
function empezarDetener(elemento) {
    if (elemento == 0) {
        // empezar el cronometro
        // Obtenemos el valor actual
        inicio = vuelta = new Date().getTime();
        // iniciamos el proceso
        funcionando();
    } 
    else if(elemento == 1) {
        // detemer el cronometro
        clearTimeout(timeout);
        timeout = 0;
    }
    else{
        // parar cronometro
        document.getElementById('crono').innerHTML = "00:00:00";
        clearTimeout(timeout);
        timeout = 0;
    }
}

function funcionando() {
    // obteneos la fecha actual
    var actual = new Date().getTime();
    // obtenemos la diferencia entre la fecha actual y la de inicio
    var diff = new Date(actual - inicio);
    // mostramos la diferencia entre la fecha actual y la inicial
    var result = LeadingZero(diff.getUTCHours()) + ":" + LeadingZero(diff.getUTCMinutes()) + ":" + LeadingZero(diff.getUTCSeconds());
    document.getElementById('crono').innerHTML = result;
    // Indicamos que se ejecute esta función nuevamente dentro de 1 segundo
    timeout = setTimeout("funcionando()", 1000);
}

/* Funcion que pone un 0 delante de un valor si es necesario */
function LeadingZero(Time) {
    return (Time < 10) ? "0" + Time : + Time;
}