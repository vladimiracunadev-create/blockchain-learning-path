// Práctica 10 — Partición y reconciliación.
//
// Qué pasa cuando la red se corta en dos mitades que no se ven, cada una sigue
// aceptando bloques, y luego el enlace vuelve. La pregunta que responde: al
// reconectar, ¿qué historia sobrevive y qué transacciones se pierden?
//
// Es la demostración ejecutable del teorema CAP del módulo 02: durante la
// partición, seguir aceptando escrituras (disponibilidad) tiene un precio, y ese
// precio se paga al reconciliar.
//
// Uso: node labs/02-consensus/partition-reconciliation.mjs
import { ejecutadoDirectamente } from "../run-directo.mjs";

export function crearCadena(nombre) {
  return { nombre, bloques: [{ altura: 0, id: "genesis", trabajo: 0, transacciones: [] }] };
}

export function altura(cadena) {
  return cadena.bloques.at(-1).altura;
}

// El trabajo acumulado —no la longitud— es lo que decide qué cadena gana.
// Distinguirlo importa: una cadena más larga con bloques fáciles puede tener
// menos trabajo que una más corta con bloques difíciles.
export function trabajoAcumulado(cadena) {
  return cadena.bloques.reduce((suma, b) => suma + b.trabajo, 0);
}

export function minar(cadena, { id, transacciones = [], trabajo = 1 }) {
  cadena.bloques.push({ altura: altura(cadena) + 1, id, trabajo, transacciones });
  return cadena;
}

// Al reconectar, cada lado aplica la MISMA regla: quedarse con la cadena de más
// trabajo acumulado. No hay negociación ni votación; por eso ambos lados llegan
// al mismo resultado sin hablarse.
export function reconciliar(cadenaA, cadenaB) {
  const trabajoA = trabajoAcumulado(cadenaA);
  const trabajoB = trabajoAcumulado(cadenaB);
  // Empate: gana A por convención estable, para que el ejercicio sea reproducible.
  const ganadora = trabajoA >= trabajoB ? cadenaA : cadenaB;
  const perdedora = ganadora === cadenaA ? cadenaB : cadenaA;

  // El punto de divergencia es el último bloque que ambas compartían.
  let comun = 0;
  while (
    comun + 1 < Math.min(cadenaA.bloques.length, cadenaB.bloques.length) &&
    cadenaA.bloques[comun + 1].id === cadenaB.bloques[comun + 1].id
  ) {
    comun += 1;
  }

  const descartados = perdedora.bloques.slice(comun + 1);
  const enGanadora = new Set(ganadora.bloques.slice(comun + 1).flatMap((b) => b.transacciones));

  // Transacción huérfana: iba en un bloque descartado y NO está en la cadena que
  // ganó. Para quien la envió, sencillamente dejó de haber ocurrido.
  const huerfanas = descartados
    .flatMap((b) => b.transacciones)
    .filter((tx) => !enGanadora.has(tx));

  return {
    ganadora: ganadora.nombre,
    trabajo: { [cadenaA.nombre]: trabajoA, [cadenaB.nombre]: trabajoB },
    alturaComun: comun,
    bloquesDescartados: descartados.map((b) => b.id),
    transaccionesHuerfanas: huerfanas
  };
}

if (ejecutadoDirectamente(import.meta.url)) {
  // Antes del corte, ambos lados comparten historia.
  const izquierda = crearCadena("lado-izquierdo");
  minar(izquierda, { id: "b1", transacciones: ["alice→bob"] });
  const derecha = structuredClone(izquierda);
  derecha.nombre = "lado-derecho";

  console.log("— Se corta el enlace: cada lado sigue minando por su cuenta —");
  minar(izquierda, { id: "izq-b2", transacciones: ["carol→dave"], trabajo: 1 });
  minar(izquierda, { id: "izq-b3", transacciones: ["dave→erin"], trabajo: 1 });
  minar(derecha, { id: "der-b2", transacciones: ["carol→frank"], trabajo: 4 });

  console.log(`${izquierda.nombre}: altura ${altura(izquierda)}, trabajo ${trabajoAcumulado(izquierda)}`);
  console.log(`${derecha.nombre}: altura ${altura(derecha)}, trabajo ${trabajoAcumulado(derecha)}`);

  console.log("\n— Vuelve el enlace —");
  console.log(reconciliar(izquierda, derecha));
  console.log(
    "\nLa cadena MÁS CORTA gana porque acumuló más trabajo, y 'carol→dave' se queda huérfana:",
    "\npara quien la envió, nunca ocurrió — aunque llegó a tener confirmaciones."
  );
}
