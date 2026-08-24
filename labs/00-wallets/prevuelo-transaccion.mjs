#!/usr/bin/env node
// Prevuelo de una transacción — práctica 71 (unidad transversal "Wallets desde cero").
//
// Antes de firmar, una wallet muestra una solicitud: red, origen, destino,
// contrato, función, monto, comisión y —a veces— una aprobación de tokens.
// Este laboratorio entrena el hábito de REVISAR esa pantalla contra lo que el
// usuario espera, con transacciones SIMULADAS y deterministas: no hay red, no
// hay claves y no hay fondos. Las direcciones son ficticias y educativas.
//
// Uso: pnpm lab:wallet-segura
//      node labs/00-wallets/prevuelo-transaccion.mjs

// Valor con el que muchos contratos representan una aprobación "ilimitada"
// (2**256 - 1). Verlo en un `approve` es una señal que exige justificación.
export const APROBACION_ILIMITADA = 2n ** 256n - 1n;

// --- Utilidades ---------------------------------------------------------------

// Convierte un monto en unidades mínimas (wei, satoshi, unidades de token) a
// unidades humanas usando los decimales del activo. Se opera en BigInt para no
// heredar los errores de coma flotante.
export function aUnidadesHumanas(cantidadCruda, decimales) {
  const cantidad = BigInt(cantidadCruda);
  const base = 10n ** BigInt(decimales);
  const entera = cantidad / base;
  const resto = cantidad % base;
  if (resto === 0n) return entera.toString();
  const fraccion = resto.toString().padStart(decimales, "0").replace(/0+$/, "");
  return `${entera}.${fraccion}`;
}

// Detección del patrón de "address poisoning": una dirección que COINCIDE en el
// prefijo y el sufijo con la esperada, pero difiere en el cuerpo. Es justo lo
// que explota el ataque: la wallet y el explorador abrevian "0x1234…abcd" y el
// ojo humano da por buena la impostora.
export function pareceEnvenenada(direccion, esperada, ventana = 4) {
  const a = direccion.toLowerCase();
  const b = esperada.toLowerCase();
  if (a === b) return false;
  return (
    a.length === b.length &&
    a.slice(0, 2 + ventana) === b.slice(0, 2 + ventana) &&
    a.slice(-ventana) === b.slice(-ventana)
  );
}

// --- El prevuelo ---------------------------------------------------------------
//
// `solicitud` es lo que la wallet muestra (lo que se va a firmar de verdad).
// `expectativa` es lo que el usuario cree que va a firmar.
// Devuelve la lista de controles con su veredicto: el prevuelo aprueba solo si
// TODOS los controles pasan. Un solo control en rojo basta para no firmar.
export function prevuelo(solicitud, expectativa) {
  const controles = [];
  const control = (nombre, ok, detalle) => controles.push({ control: nombre, ok, detalle });

  control(
    "red",
    solicitud.red === expectativa.red,
    `la solicitud es para ${solicitud.red} y esperabas ${expectativa.red}`
  );

  control(
    "origen",
    solicitud.origen.toLowerCase() === expectativa.origen.toLowerCase(),
    `firma la cuenta ${solicitud.origen}`
  );

  const destinoCoincide = solicitud.destino.toLowerCase() === expectativa.destino.toLowerCase();
  control("destino", destinoCoincide, `el destino es ${solicitud.destino}`);
  if (!destinoCoincide && pareceEnvenenada(solicitud.destino, expectativa.destino)) {
    control(
      "address poisoning",
      false,
      "el destino imita el principio y el final de la dirección esperada: compara la dirección COMPLETA, no la abreviatura"
    );
  }

  control(
    "contrato",
    (solicitud.contrato ?? null) === (expectativa.contrato ?? null),
    solicitud.contrato
      ? `interactúa con el contrato ${solicitud.contrato}`
      : "no interviene ningún contrato"
  );

  control(
    "función",
    (solicitud.funcion ?? "transferencia") === (expectativa.funcion ?? "transferencia"),
    `la función solicitada es ${solicitud.funcion ?? "transferencia simple"}`
  );

  control(
    "token",
    (solicitud.token ?? "nativo") === (expectativa.token ?? "nativo"),
    `el activo es ${solicitud.token ?? "el nativo de la red"}`
  );

  const montoHumano = aUnidadesHumanas(solicitud.montoCrudo, solicitud.decimales);
  control(
    "monto y decimales",
    montoHumano === expectativa.monto,
    `el monto real es ${montoHumano} (${solicitud.montoCrudo} en unidades mínimas, ${solicitud.decimales} decimales) y esperabas ${expectativa.monto}`
  );

  control(
    "comisión",
    BigInt(solicitud.comisionMaximaCruda) <= BigInt(expectativa.comisionMaximaCruda),
    `la comisión máxima es ${solicitud.comisionMaximaCruda} unidades mínimas (tu tope: ${expectativa.comisionMaximaCruda})`
  );

  if (solicitud.aprobacionCruda !== undefined) {
    const aprobacion = BigInt(solicitud.aprobacionCruda);
    const ilimitada = aprobacion === APROBACION_ILIMITADA;
    const dentroDeLoEsperado =
      expectativa.aprobacionMaximaCruda !== undefined &&
      aprobacion <= BigInt(expectativa.aprobacionMaximaCruda);
    control(
      "aprobación",
      !ilimitada && dentroDeLoEsperado,
      ilimitada
        ? "pide una aprobación ILIMITADA: quien controle ese contrato podrá mover todos tus tokens, hoy o dentro de un año"
        : `pide aprobar ${aUnidadesHumanas(aprobacion, solicitud.decimales)} y ${
            dentroDeLoEsperado ? "está dentro de lo que esperabas" : "no esperabas ninguna aprobación de ese tamaño"
          }`
    );
  } else if (expectativa.aprobacionMaximaCruda !== undefined) {
    control("aprobación", false, "esperabas una aprobación y la solicitud no la incluye: no es la operación que crees");
  }

  return controles;
}

export const veredicto = (controles) =>
  controles.every((c) => c.ok) ? "FIRMAR" : "NO FIRMAR";

// --- Escenarios deterministas ---------------------------------------------------
// Direcciones ficticias (no existen en ninguna red): sirven solo para practicar.
const YO = "0xA1b2000000000000000000000000000000000C0e";
const AMIGA = "0xB3f4000000000000000000000000000000000D1f";
const AMIGA_ENVENENADA = "0xB3f49900000000000000000000000000000e0D1f";
const CONTRATO_TOKEN = "0xC5d6000000000000000000000000000000000E2a";
const CONTRATO_DESCONOCIDO = "0xF9e8000000000000000000000000000000000A9c";

export const ESCENARIOS = [
  {
    titulo: "1 · Transferencia legítima de un token de prueba",
    solicitud: {
      red: "testnet-local",
      origen: YO,
      destino: AMIGA,
      contrato: CONTRATO_TOKEN,
      funcion: "transfer(address,uint256)",
      token: "EDU",
      montoCrudo: "1500000000000000000", // 1.5 EDU
      decimales: 18,
      comisionMaximaCruda: "21000000000000"
    },
    expectativa: {
      red: "testnet-local",
      origen: YO,
      destino: AMIGA,
      contrato: CONTRATO_TOKEN,
      funcion: "transfer(address,uint256)",
      token: "EDU",
      monto: "1.5",
      comisionMaximaCruda: "50000000000000"
    }
  },
  {
    titulo: "2 · Una dApp pide un approve ilimitado a un contrato desconocido",
    solicitud: {
      red: "testnet-local",
      origen: YO,
      destino: CONTRATO_DESCONOCIDO,
      contrato: CONTRATO_DESCONOCIDO,
      funcion: "approve(address,uint256)",
      token: "EDU",
      montoCrudo: "0",
      decimales: 18,
      comisionMaximaCruda: "21000000000000",
      aprobacionCruda: APROBACION_ILIMITADA.toString()
    },
    expectativa: {
      red: "testnet-local",
      origen: YO,
      destino: CONTRATO_TOKEN,
      contrato: CONTRATO_TOKEN,
      funcion: "approve(address,uint256)",
      token: "EDU",
      monto: "0",
      comisionMaximaCruda: "50000000000000",
      aprobacionMaximaCruda: "2000000000000000000" // esperabas aprobar como mucho 2 EDU
    }
  },
  {
    titulo: "3 · Dirección envenenada: mismo principio y mismo final, otro cuerpo",
    solicitud: {
      red: "testnet-local",
      origen: YO,
      destino: AMIGA_ENVENENADA,
      contrato: null,
      funcion: null,
      token: null,
      montoCrudo: "250000000000000000", // 0.25 del activo nativo
      decimales: 18,
      comisionMaximaCruda: "21000000000000"
    },
    expectativa: {
      red: "testnet-local",
      origen: YO,
      destino: AMIGA,
      contrato: null,
      funcion: null,
      token: null,
      monto: "0.25",
      comisionMaximaCruda: "50000000000000"
    }
  }
];

// --- Ejecución como laboratorio -------------------------------------------------
if (import.meta.url === new URL(process.argv[1], "file:").href || process.argv[1]?.endsWith("prevuelo-transaccion.mjs")) {
  console.log("🛫 Prevuelo de una transacción — simulación local, sin red, sin claves y sin fondos.\n");
  for (const { titulo, solicitud, expectativa } of ESCENARIOS) {
    console.log(`── ${titulo}`);
    const controles = prevuelo(solicitud, expectativa);
    for (const { control, ok, detalle } of controles) {
      console.log(`   ${ok ? "✅" : "❌"} ${control}: ${detalle}`);
    }
    console.log(`   → Veredicto: ${veredicto(controles)}\n`);
  }
  console.log("Criterio de aceptación: el escenario 1 termina en FIRMAR y los escenarios 2 y 3 en NO FIRMAR.");
  console.log("Teoría y checklist completo: docs/wallets-desde-cero.md");
}
