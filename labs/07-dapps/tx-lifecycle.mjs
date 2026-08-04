// Práctica 31 — Estados de una transacción.
//
// La máquina de estados que toda dApp necesita y casi ninguna implementa
// completa. El error habitual es tratar "enviada" como "hecha": el usuario ve un
// tick verde, la transacción revierte, y el saldo que muestra la interfaz nunca
// existió.
//
// Aquí la máquina es código ejecutable: cada transición está permitida o no, y
// cada estado dice qué debe mostrarse. Si tu interfaz llega a un estado sin saber
// qué hacer, es un bug, no un caso raro.
//
// Uso: node labs/07-dapps/tx-lifecycle.mjs
import { ejecutadoDirectamente } from "../run-directo.mjs";

export const ESTADOS = {
  simulando: {
    descripcion: "Se ejecuta eth_call con el mismo calldata, sin enviar nada",
    interfaz: "Deshabilitar el botón. Nada que firmar todavía",
    final: false
  },
  simulacionFallida: {
    descripcion: "La simulación revirtió: enviarla costaría gas para nada",
    interfaz: "Mostrar el motivo del revert y NO pedir la firma",
    final: true
  },
  esperandoFirma: {
    descripcion: "La wallet tiene la petición; decide la persona",
    interfaz: "Indicar que hay que confirmar en la wallet, con opción de cancelar",
    final: false
  },
  rechazada: {
    descripcion: "La persona rechazó la firma",
    interfaz: "Volver al estado inicial sin error alarmante: es una decisión válida",
    final: true
  },
  pendiente: {
    descripcion: "Difundida al mempool, todavía sin bloque",
    interfaz: "Mostrar el hash, permitir acelerar o cancelar. NUNCA decir 'completado'",
    final: false
  },
  confirmada: {
    descripcion: "Incluida en un bloque con status = 1",
    interfaz: "Releer el estado desde el RPC antes de mostrar el resultado",
    final: true
  },
  revertida: {
    descripcion: "Incluida en un bloque con status = 0: se pagó el gas y no pasó nada",
    interfaz: "Decir que se cobró y no tuvo efecto. Ocultarlo hace que el cobro parezca un robo",
    final: true
  },
  reemplazada: {
    descripcion: "Otra transacción con el mismo nonce y más comisión ocupó su lugar",
    interfaz: "Seguir el NONCE, no el hash; si no, la transacción 'desaparece'",
    final: true
  },
  descartada: {
    descripcion: "El mempool la expulsó por antigüedad o por subir el mínimo",
    interfaz: "Ofrecer reenviar. No se quedará pendiente para siempre",
    final: true
  }
};

// Solo estas transiciones son posibles. Todo lo demás es un bug de la interfaz.
const TRANSICIONES = {
  simulando: ["esperandoFirma", "simulacionFallida"],
  simulacionFallida: [],
  esperandoFirma: ["pendiente", "rechazada"],
  rechazada: [],
  pendiente: ["confirmada", "revertida", "reemplazada", "descartada"],
  confirmada: [],
  revertida: [],
  reemplazada: [],
  descartada: []
};

export function transicionesPosibles(estado) {
  if (!(estado in TRANSICIONES)) throw new Error(`Estado desconocido: ${estado}`);
  return TRANSICIONES[estado];
}

export function puedeTransicionar(desde, hasta) {
  return transicionesPosibles(desde).includes(hasta);
}

export function esFinal(estado) {
  if (!(estado in ESTADOS)) throw new Error(`Estado desconocido: ${estado}`);
  return ESTADOS[estado].final;
}

// Aplica una secuencia de transiciones y falla en la primera imposible. Es la
// prueba de que un flujo concreto de la interfaz es coherente.
export function seguirFlujo(secuencia) {
  if (secuencia.length === 0) throw new Error("La secuencia está vacía");
  const [inicio, ...resto] = secuencia;
  if (inicio !== "simulando") throw new Error("Todo flujo empieza simulando: firmar a ciegas cuesta gas");

  let actual = inicio;
  for (const siguiente of resto) {
    if (!puedeTransicionar(actual, siguiente)) {
      throw new Error(`Transición imposible: ${actual} → ${siguiente}`);
    }
    actual = siguiente;
  }
  return { estadoFinal: actual, terminado: esFinal(actual) };
}

if (ejecutadoDirectamente(import.meta.url)) {
  console.log("Estados y qué debe mostrar la interfaz en cada uno:\n");
  for (const [nombre, info] of Object.entries(ESTADOS)) {
    console.log(`${info.final ? "■" : "▸"} ${nombre}`);
    console.log(`   ${info.descripcion}`);
    console.log(`   → ${info.interfaz}\n`);
  }

  console.log("Flujo feliz:", seguirFlujo(["simulando", "esperandoFirma", "pendiente", "confirmada"]));
  console.log("Sustituida:", seguirFlujo(["simulando", "esperandoFirma", "pendiente", "reemplazada"]));
  try {
    seguirFlujo(["simulando", "pendiente"]);
  } catch (error) {
    console.log("\nRechazado correctamente:", error.message);
    console.log("(no se puede difundir algo que nadie firmó)");
  }
}
