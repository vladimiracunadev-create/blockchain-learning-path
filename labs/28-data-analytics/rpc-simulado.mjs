// Nodo simulado: una fachada con la MISMA FORMA que un JSON-RPC real, servida
// desde la cadena sintética. Sirve para que los laboratorios de adquisición
// (nivel 2) practiquen el ciclo real de extracción —paginar por rangos, guardar
// un checkpoint, reanudar, tolerar errores y detectar una reorganización— sin
// depender de una red, de una API key ni de un proveedor que cambie de formato.
//
// Qué reproduce fielmente:
//   · La consulta va por RANGOS de bloques, no "toda la cadena de una vez".
//   · Hay un límite de resultados por página (los proveedores reales lo imponen).
//   · Fallos transitorios: un nodo real devuelve errores esporádicos y hay que
//     reintentar; un extractor que no lo contempla pierde bloques en silencio.
//   · Reorganizaciones: un bloque ya leído puede quedar HUÉRFANO y ser sustituido.
//
// Qué NO reproduce (y hay que decirlo en clase): latencia real, límites de tarifa
// por contrato, diferencias entre clientes de nodo, ni la diversidad de formatos
// entre proveedores. Es un simulador pedagógico, no un cliente de producción.
//
// Módulo 28 · Blockchain Data Analytics y minería de datos on-chain.

import { cadenaCuentas, hashDe, prng, SEMILLA_POR_DEFECTO } from "./cadena-sintetica.mjs";

export class ErrorRPC extends Error {
  constructor(mensaje, codigo) {
    super(mensaje);
    this.name = "ErrorRPC";
    this.codigo = codigo;
  }
}

/**
 * Crea un nodo simulado.
 *
 * @param {object} opciones
 * @param {number} opciones.semilla         Semilla del dataset (reproducible).
 * @param {number} opciones.maximoPorPagina Tope de bloques por consulta de rango.
 * @param {number} opciones.tasaFallo       Probabilidad de fallo transitorio [0..1].
 * @param {number[]} opciones.reorganizarEn Alturas que quedarán huérfanas al
 *                                          reorganizar (ver `reorganizar()`).
 */
export function nodoSimulado({
  semilla = SEMILLA_POR_DEFECTO,
  maximoPorPagina = 10,
  tasaFallo = 0,
  reorganizarEn = []
} = {}) {
  const { bloques, verdadDeCampo } = cadenaCuentas({ semilla });
  // Copia mutable: una reorganización SUSTITUYE bloques, y el extractor tiene que
  // notarlo comparando hashes, no números.
  let cadena = bloques.map((b) => ({ ...b }));
  const huerfanos = [];
  const aleatorio = prng(semilla + 99);
  let llamadas = 0;

  const quizaFallar = (metodo) => {
    llamadas += 1;
    if (tasaFallo > 0 && aleatorio() < tasaFallo) {
      throw new ErrorRPC(`Fallo transitorio del nodo en ${metodo}: reintenta`, -32000);
    }
  };

  return {
    /** Altura de la punta de la cadena (equivalente a `eth_blockNumber`). */
    alturaActual() {
      quizaFallar("alturaActual");
      return cadena.at(-1).numero;
    },

    /** Un bloque por número (equivalente a `eth_getBlockByNumber`). */
    obtenerBloque(numero) {
      quizaFallar("obtenerBloque");
      const bloque = cadena.find((b) => b.numero === numero);
      if (!bloque) throw new ErrorRPC(`El bloque ${numero} no existe`, -32602);
      return structuredClone(bloque);
    },

    /**
     * Rango de bloques [desde, hasta]. Devuelve como mucho `maximoPorPagina`:
     * pedir más NO es un error, simplemente llega truncado — y un extractor que
     * asume que recibió todo lo que pidió se salta bloques sin enterarse.
     */
    obtenerRango(desde, hasta) {
      quizaFallar("obtenerRango");
      if (desde > hasta) throw new ErrorRPC("Rango inválido: desde > hasta", -32602);
      return cadena
        .filter((b) => b.numero >= desde && b.numero <= hasta)
        .slice(0, maximoPorPagina)
        .map((b) => structuredClone(b));
    },

    /** Logs de un rango, opcionalmente filtrados por topic0 (como `eth_getLogs`). */
    obtenerLogs({ desde, hasta, topic0 } = {}) {
      quizaFallar("obtenerLogs");
      return cadena
        .filter((b) => b.numero >= (desde ?? 0) && b.numero <= (hasta ?? Infinity))
        .flatMap((b) => b.logs)
        .filter((log) => !topic0 || log.topics[0] === topic0)
        .map((log) => structuredClone(log));
    },

    /** Una transacción por hash (equivalente a `eth_getTransactionByHash`). */
    obtenerTransaccion(hash) {
      quizaFallar("obtenerTransaccion");
      const tx = cadena.flatMap((b) => b.transacciones).find((t) => t.hash === hash);
      if (!tx) throw new ErrorRPC(`Transacción desconocida: ${hash}`, -32602);
      return structuredClone(tx);
    },

    /**
     * Mempool: transacciones vistas pero AÚN NO incluidas en un bloque. Su lectura
     * analítica es distinta de la de un bloque: lo que está en la mempool puede
     * no confirmarse nunca, o confirmarse con otro hash tras un reemplazo.
     */
    mempool() {
      quizaFallar("mempool");
      const punta = cadena.at(-1);
      return punta.transacciones.slice(0, 2).map((tx, i) => ({
        ...structuredClone(tx),
        numeroBloque: null,
        estado: "pendiente",
        vistaEnSegundos: punta.marcaTiempo + i * 3
      }));
    },

    /**
     * Provoca una reorganización: los bloques a partir de la altura indicada se
     * declaran HUÉRFANOS y se sustituyen por otros con hash distinto. Es el
     * escenario que rompe los ETL escritos con la suposición "un bloque leído es
     * definitivo": hay que comparar `hashPrevio` con el hash ya almacenado.
     */
    reorganizar(desdeAltura = reorganizarEn[0]) {
      if (desdeAltura == null) return { huerfanos: [], sustitutos: [] };
      const afectados = cadena.filter((b) => b.numero >= desdeAltura);
      huerfanos.push(...afectados.map((b) => ({ numero: b.numero, hash: b.hash })));
      let previo = cadena.find((b) => b.numero === desdeAltura - 1)?.hash ?? hashDe("0x", "genesis-reorg");
      const sustitutos = afectados.map((bloque) => {
        const nuevo = {
          ...structuredClone(bloque),
          hashPrevio: previo,
          hash: hashDe("0x", { reorg: true, numero: bloque.numero, previo }),
          // Tras la reorganización, algunas transacciones del bloque huérfano no
          // vuelven a incluirse: dar por buenas las del bloque viejo sería contar
          // dinero que nunca se movió en la cadena definitiva.
          transacciones: bloque.transacciones.slice(0, Math.max(1, bloque.transacciones.length - 1))
        };
        nuevo.logs = bloque.logs.filter((log) => nuevo.transacciones.some((t) => t.hash === log.hashTransaccion));
        previo = nuevo.hash;
        return nuevo;
      });
      cadena = [...cadena.filter((b) => b.numero < desdeAltura), ...sustitutos];
      return { huerfanos: huerfanos.map((h) => h.hash), sustitutos: sustitutos.map((s) => s.hash) };
    },

    /** Diagnóstico del simulador: cuántas llamadas se han hecho y qué se huerfanizó. */
    estadisticas() {
      return { llamadas, huerfanos: [...huerfanos], altura: cadena.at(-1).numero };
    },

    verdadDeCampo
  };
}
