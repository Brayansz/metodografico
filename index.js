let ggbApp = new GGBApplet(
  {
    appName: "graphing",
    width: 800,
    height: 600,
    showToolBar: false,
    showAlgebraInput: false,
    showMenuBar: false,
    appletOnLoad: function (api) {
      window.ggbApi = api;
    },
  },
  true
);

window.addEventListener("load", function () {
  ggbApp.inject("ggb-element");
});

function graficarFunciones() {
  let funcionesInput = document.getElementById("funciones-input").value;
  let funciones = funcionesInput.split(",").map(function (funcion) {
    return funcion.trim();
  });

  window.ggbApi.evalCommand("DeleteAll()"); // Eliminar todos los gráficos anteriores
  funciones.forEach(function (funcion, index) {
    let ecuacion = funcion.replace(/<=|>=|<|>/g, "=");
    window.ggbApi.evalCommand("f" + (index + 1) + ": " + ecuacion);
  });

  setTimeout(function () {
    let intersecciones = encontrarIntersecciones();
    mostrarIntersecciones(intersecciones);
  }, 1000); // Esperar a que las funciones se grafiquen
}

function encontrarIntersecciones() {
  let intersecciones = [];
  let numFunciones = window.ggbApi.getObjectNumber();
  for (let i = 1; i <= numFunciones; i++) {
    for (let j = i + 1; j <= numFunciones; j++) {
      let puntos = window.ggbApi.evalCommandGetLabels(
        "Intersect(f" + i + ", f" + j + ")"
      );
      if (puntos) {
        puntos.split(",").forEach(function (punto) {
          intersecciones.push(punto.trim());
        });
      }
    }
  }
  return intersecciones;
}
let listica = [];
function mostrarIntersecciones(intersecciones) {
  let lista = document.getElementById("intersection-list");
  lista.innerHTML = ""; // Limpiar la lista de intersecciones
  intersecciones.forEach(function (punto) {
    let coords = window.ggbApi
      .getValueString(punto)
      .match(/\(([^)]+)\)/)[1]
      .split(",");
    let x = parseFloat(coords[0]);
    let y = parseFloat(coords[1]);
    let listItem = document.createElement("li");
    listItem.textContent = punto + ": (" + x + ", " + y + ")";
    let point = {
      x: x,
      y: y,
    };
    listica.push(point);
    lista.appendChild(listItem);
  });
}

let desigualdades;
function generarArrayecuaciones() {
  desigualdades = document.getElementById("funciones-input").value.split(", ");
  return desigualdades;
}

let maxValor;
let mejorPunto = null;

function maximizar() {
  let mejorPunto = null;
  maxValor = -Infinity;
  generarArrayecuaciones();
  let funcionObjetivoInput = document.getElementById("objetivo-input").value;
  let resultadofinal = document.getElementById("resultados");
  listica.forEach((punto, i) => {
    let cumpleTodas = desigualdades.every((funcion) => {
      let funcionReemplazada = funcion
        .replace(/x/g, punto.x)
        .replace(/y/g, punto.y);
      return eval(funcionReemplazada);
    });
    if (cumpleTodas) {
      let funcionObjetivoReemplazada = funcionObjetivoInput
        .replace(/x/g, punto.x)
        .replace(/y/g, punto.y);
      let valor = eval(funcionObjetivoReemplazada);
      if (valor > maxValor) {
        maxValor = valor;
        mejorPunto = punto;
      }
      console.log(
        `Punto ${i + 1}: {x: ${punto.x}, y: ${
          punto.y
        }} cumple todas las condiciones.`
      );
    } else {
      console.log("No hay puntos");
    }
  });
  if (mejorPunto != null) {
    resultadofinal.innerText = `El punto que maximiza la función objetivo es {x: ${mejorPunto.x}, y: ${mejorPunto.y}} con un valor de ${maxValor}.`;
  } else {
    resultadofinal.innerText = "No se encontro ninguna solucion optima";
  }
}

function minimizar() {
  let mejorPunto = null;
  maxValor = Infinity;
  generarArrayecuaciones();
  let funcionObjetivoInput = document.getElementById("objetivo-input").value;
  let resultadofinal = document.getElementById("resultados");
  listica.forEach((punto, i) => {
    let cumpleTodas = desigualdades.every((funcion) => {
      let funcionReemplazada = funcion
        .replace(/x/g, punto.x)
        .replace(/y/g, punto.y);
      return eval(funcionReemplazada);
    });
    if (cumpleTodas) {
      let funcionObjetivoReemplazada = funcionObjetivoInput
        .replace(/x/g, punto.x)
        .replace(/y/g, punto.y);
      let valor = eval(funcionObjetivoReemplazada);
      if (valor < maxValor) {
        maxValor = valor;
        mejorPunto = punto;
      }
      console.log(
        `Punto ${i + 1}: {x: ${punto.x}, y: ${
          punto.y
        }} cumple todas las condiciones.`
      );
    } else {
      console.log("No hay puntos");
    }
  });
  if (mejorPunto != null) {
    resultadofinal.innerText = `El punto que minimiza la función objetivo es {x: ${mejorPunto.x}, y: ${mejorPunto.y}} con un valor de ${maxValor}.`;
  } else {
    resultadofinal.innerText = "No se encontro ninguna solucion optima";
  }
}
