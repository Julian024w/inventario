const productos = [
  { nombre: "Arroz", categoria: "Granos", precio: 4500, cantidad: 25, minimo: 10 },
  { nombre: "Aceite", categoria: "Despensa", precio: 12000, cantidad: 3, minimo: 5 },
  { nombre: "Azúcar", categoria: "Despensa", precio: 3800, cantidad: 0, minimo: 8 },
  { nombre: "Café", categoria: "Bebidas", precio: 18500, cantidad: 8, minimo: 4 },
  { nombre: "Leche", categoria: "Lácteos", precio: 4200, cantidad: 2, minimo: 6 },
  { nombre: "Panela", categoria: "Despensa", precio: 3000, cantidad: 15, minimo: 10 },
  { nombre: "Queso", categoria: "Lácteos", precio: 9800, cantidad: 4, minimo: 5 },
  { nombre: "Jugo", categoria: "Bebidas", precio: 5200, cantidad: 4, minimo: 3 }
];

const cuerpoTabla = document.getElementById("cuerpo-tabla");
const resumen = document.getElementById("resumen");
const contadorProductos = document.getElementById("contador-productos");

const formatoMoneda = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

function crearCelda(texto, clase = "") {
  const celda = document.createElement("td");
  celda.textContent = texto;

  if (clase) {
    celda.className = clase;
  }

  return celda;
}

function mostrarInventario() {
  cuerpoTabla.innerHTML = "";
  resumen.replaceChildren(resumen.querySelector("h2"));

  let totalAgotados = 0;
  let totalBajoStock = 0;
  let unidadesAPedir = 0;
  let valorInventario = 0;
  let mayorSubtotal = -1;
  let filaMayor = null;
  let nombreMayor = "";

  for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    const subtotal = producto.precio * producto.cantidad;
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(producto.nombre));

    const tdCategoria = document.createElement("td");
    const etiqueta = document.createElement("span");

    etiqueta.textContent = producto.categoria;
    etiqueta.classList.add("etiqueta");

    const coloresCategoria = {
      Granos: "#8d6e63",
      Despensa: "#6f42c1",
      Bebidas: "#0d6efd",
      "Lácteos": "#20a886"
    };

    etiqueta.style.backgroundColor =
      coloresCategoria[producto.categoria] || "gray";

    tdCategoria.appendChild(etiqueta);
    fila.appendChild(tdCategoria);

    const tdPrecio = crearCelda(formatoMoneda.format(producto.precio));

    if (producto.precio > 10000) {
      tdPrecio.style.fontWeight = "bold";
    }

    fila.appendChild(tdPrecio);

    const tdCantidad = document.createElement("td");
    const controles = document.createElement("div");
    controles.className = "cantidad-controles";

    const btnMenos = document.createElement("button");
    btnMenos.type = "button";
    btnMenos.textContent = "−";
    btnMenos.classList.add("btn", "btn-menos");
    btnMenos.setAttribute(
      "aria-label",
      `Disminuir cantidad de ${producto.nombre}`
    );
    btnMenos.disabled = producto.cantidad === 0;

    btnMenos.addEventListener("click", function () {
      if (productos[i].cantidad > 0) {
        productos[i].cantidad--;
        mostrarInventario();
      }
    });

    const numero = document.createElement("span");
    numero.className = "numero";
    numero.textContent = producto.cantidad;
    numero.setAttribute("aria-label", `${producto.cantidad} unidades`);

    const btnMas = document.createElement("button");
    btnMas.type = "button";
    btnMas.textContent = "+";
    btnMas.classList.add("btn", "btn-mas");
    btnMas.setAttribute(
      "aria-label",
      `Aumentar cantidad de ${producto.nombre}`
    );

    btnMas.addEventListener("click", function () {
      productos[i].cantidad++;
      mostrarInventario();
    });

    controles.append(btnMenos, numero, btnMas);
    tdCantidad.appendChild(controles);
    fila.appendChild(tdCantidad);
    fila.appendChild(crearCelda(producto.minimo));
    fila.appendChild(crearCelda(formatoMoneda.format(subtotal)));

    const tdEstado = document.createElement("td");
    const estado = document.createElement("span");
    estado.className = "estado";

    if (producto.cantidad === 0) {
      fila.classList.add("agotado");

      const faltan = producto.minimo;
      estado.textContent = `AGOTADO · pedir ${faltan}`;
      estado.classList.add("estado-agotado");

      totalAgotados++;
      unidadesAPedir += faltan;
    } else if (producto.cantidad < producto.minimo) {
      fila.classList.add("bajo-stock");

      const faltan = producto.minimo - producto.cantidad;
      estado.textContent = `Bajo stock · pedir ${faltan}`;
      estado.classList.add("estado-bajo");

      totalBajoStock++;
      unidadesAPedir += faltan;
    } else {
      fila.classList.add("disponible");
      estado.textContent = "OK";
      estado.classList.add("estado-ok");
    }

    tdEstado.appendChild(estado);
    fila.appendChild(tdEstado);
    cuerpoTabla.appendChild(fila);

    valorInventario += subtotal;

    if (subtotal > mayorSubtotal) {
      mayorSubtotal = subtotal;
      filaMayor = fila;
      nombreMayor = producto.nombre;
    }
  }

  if (filaMayor) {
    filaMayor.classList.add("destacado");
  }

  contadorProductos.textContent = `${productos.length} productos`;

  const datosResumen = [
    ["Productos agotados", totalAgotados],
    ["Productos con bajo stock", totalBajoStock],
    ["Unidades a pedir", unidadesAPedir],
    ["Valor total del inventario", formatoMoneda.format(valorInventario)],
    ["Mayor valor", `${nombreMayor} · ${formatoMoneda.format(mayorSubtotal)}`]
  ];

  for (const [etiqueta, valor] of datosResumen) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "dato-resumen";

    const titulo = document.createElement("span");
    titulo.textContent = etiqueta;

    const dato = document.createElement("strong");
    dato.textContent = valor;

    tarjeta.append(titulo, dato);
    resumen.appendChild(tarjeta);
  }
}

mostrarInventario();