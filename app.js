// Lógica del juego "Amigo Secreto"
// Autor: ChatGPT — 2025
// Características:
//  - Agregar nombres sin duplicados ni vacíos
//  - Mostrar la lista de participantes
//  - Sortear emparejamientos sin auto‑asignaciones (derangement)
//  - Mostrar el resultado en pantalla
//  - Accesible y sencillo: Enter añade; mensajes claros

const input = document.getElementById('amigo');
const listaEl = document.getElementById('listaAmigos');
const resultadoEl = document.getElementById('resultado');

/** Estado en memoria */
const amigos = [];

/** Renderiza la lista de nombres en <ul id="listaAmigos"> */
function renderLista() {
  listaEl.innerHTML = '';
  amigos.forEach((nombre, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${nombre}`;
    listaEl.appendChild(li);
  });
}

/** Limpia y anuncia mensajes en el <ul id="resultado"> */
function anunciar(mensaje) {
  resultadoEl.innerHTML = '';
  const li = document.createElement('li');
  li.textContent = mensaje;
  resultadoEl.appendChild(li);
}

/** Añadir amigo desde el input */
function agregarAmigo() {
  const nombre = (input.value || '').trim();
  if (!nombre) {
    anunciar('Escribe un nombre válido.');
    input.focus();
    return;
  }
  // Evitar duplicados (insensible a mayúsculas/minúsculas)
  const existe = amigos.some(n => n.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    anunciar(`"${nombre}" ya está en la lista.`);
    input.select();
    return;
  }
  amigos.push(nombre);
  renderLista();
  anunciar(`${nombre} añadido.`);
  input.value = '';
  input.focus();
}

/** Sortea emparejamientos sin auto‑asignación */
function sortearAmigo() {
  resultadoEl.innerHTML = '';

  if (amigos.length < 2) {
    anunciar('Agrega al menos 2 participantes para sortear.');
    return;
  }

  const asignaciones = derangement(amigos);

  // Imprimir resultados
  asignaciones.forEach(([dador, receptor]) => {
    const li = document.createElement('li');
    li.textContent = `${dador} → ${receptor}`;
    resultadoEl.appendChild(li);
  });
}

/**
 * Genera un derangement (nadie se asigna a sí mismo).
 * Estrategia: barajar receptores y corregir puntos fijos con un swap circular.
 * Retorna pares [dador, receptor]
 */
function derangement(lista) {
  const dadores = [...lista];
  const receptores = shuffle([...lista]);

  for (let i = 0; i < dadores.length; i++) {
    if (dadores[i] === receptores[i]) {
      const j = (i + 1) % dadores.length;
      // Intercambiar con el siguiente (circular) para romper el punto fijo
      [receptores[i], receptores[j]] = [receptores[j], receptores[i]];
    }
  }
  return dadores.map((d, i) => [d, receptores[i]]);
}

/** Baraja in-place (Fisher–Yates) y devuelve el arreglo */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Soporte: Enter para añadir
input?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') agregarAmigo();
});

// Exponer funciones al ámbito global para los botones inline del HTML
window.agregarAmigo = agregarAmigo;
window.sortearAmigo = sortearAmigo;
