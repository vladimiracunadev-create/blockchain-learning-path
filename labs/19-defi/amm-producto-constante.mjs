// Creador de mercado automático de producto constante (x · y = k).
//
// Simulación determinista: sin red, sin claves, sin fondos. Todo lo que hace
// falta para entender un AMM cabe en una ecuación; lo que cuesta entender son
// sus consecuencias, y esas se ven con números.
//
// Módulo 19 · DeFi: mercados, préstamo y riesgo on-chain.
import { ejecutadoDirectamente } from "../run-directo.mjs";

/**
 * Precio marginal del pool: cuántas unidades de `y` cuesta una de `x`.
 * No es el precio al que ejecutas: es el precio de una operación infinitesimal.
 */
export function precioMarginal({ x, y }) {
  if (x <= 0 || y <= 0) throw new Error("Las reservas deben ser positivas");
  return y / x;
}

/**
 * Compra `cantidadX` unidades del activo X pagando en Y.
 *
 * La reserva de X baja, así que la de Y debe subir hasta mantener k. La comisión
 * se cobra sobre lo pagado y NO entra en la curva: es un cargo aparte, aunque el
 * panel de la interfaz los sume en un solo número.
 */
export function comprarX({ x, y, cantidadX, comision = 0.003 }) {
  if (cantidadX <= 0) throw new Error("La cantidad debe ser positiva");
  if (cantidadX >= x) throw new Error("No se puede vaciar la reserva: el precio tiende a infinito");
  const k = x * y;
  const yNuevo = k / (x - cantidadX);
  const pagoCurva = yNuevo - y;
  const comisionPagada = pagoCurva * comision;
  const precioEjecucion = (pagoCurva + comisionPagada) / cantidadX;
  const precioAntes = precioMarginal({ x, y });
  return {
    pagoCurva,
    comisionPagada,
    pagoTotal: pagoCurva + comisionPagada,
    precioAntes,
    precioEjecucion,
    // Cuánto te separa de haber comprado al precio marcado, solo por la curva.
    impactoPrecio: pagoCurva / cantidadX / precioAntes - 1,
    reservas: { x: x - cantidadX, y: yNuevo + comisionPagada }
  };
}

/**
 * Pérdida impermanente de un proveedor de liquidez cuando el precio de X pasa de
 * `precioInicial` a `precioFinal`.
 *
 * Compara el valor de la posición dentro del pool (reequilibrada por los
 * arbitrajistas) contra el valor de simplemente haber mantenido ambos activos.
 * Es la cuenta que ningún panel de rendimiento enseña.
 */
export function perdidaImpermanente({ x, y, precioFinal }) {
  const k = x * y;
  const precioInicial = precioMarginal({ x, y });
  if (precioFinal <= 0) throw new Error("El precio final debe ser positivo");
  const xFinal = Math.sqrt(k / precioFinal);
  const yFinal = k / xFinal;
  const valorEnPool = xFinal * precioFinal + yFinal;
  const valorSiMantienes = x * precioFinal + y;
  return {
    precioInicial,
    precioFinal,
    reservasFinales: { x: xFinal, y: yFinal },
    valorEnPool,
    valorSiMantienes,
    perdida: valorSiMantienes - valorEnPool,
    perdidaRelativa: valorEnPool / valorSiMantienes - 1
  };
}

/**
 * Cuántas comisiones hacen falta para compensar la pérdida impermanente.
 * Devuelve el volumen diario necesario y los días al volumen dado.
 */
export function volumenParaCompensar({ perdida, comision = 0.003, volumenDiario, cuotaDelPool = 1 }) {
  if (comision <= 0) throw new Error("La comisión debe ser positiva");
  const ingresoDiario = volumenDiario * comision * cuotaDelPool;
  if (ingresoDiario <= 0) throw new Error("El volumen debe ser positivo");
  return { ingresoDiario, dias: perdida / ingresoDiario };
}

if (ejecutadoDirectamente(import.meta.url)) {
  const pool = { x: 100, y: 200_000 }; // 100 ETH · 200 000 USDC
  console.log(`Pool: ${pool.x} ETH / ${pool.y} USDC — precio marcado: ${precioMarginal(pool)} USDC/ETH\n`);

  console.log("Impacto de la curva según el tamaño de la operación (sin comisión):");
  console.table([1, 5, 10, 25].map((cantidad) => {
    const r = comprarX({ ...pool, cantidadX: cantidad, comision: 0 });
    return {
      "compra (ETH)": cantidad,
      "pagas (USDC)": r.pagoCurva.toFixed(2),
      "precio efectivo": r.precioEjecucion.toFixed(2),
      "impacto": `${(r.impactoPrecio * 100).toFixed(2)} %`
    };
  }));

  console.log("\nDiez veces el tamaño no cuesta diez veces más: la curva no es lineal.\n");

  const proveedor = { x: 10, y: 20_000 }; // 10 ETH · 20 000 USDC = 40 000 USD
  const il = perdidaImpermanente({ ...proveedor, precioFinal: 4_000 });
  console.log("Proveedor de liquidez: 10 ETH + 20 000 USDC, el precio de ETH se duplica");
  console.table({
    "valor si no haces nada": il.valorSiMantienes.toFixed(2),
    "valor dentro del pool": il.valorEnPool.toFixed(2),
    "pérdida impermanente": il.perdida.toFixed(2),
    "en porcentaje": `${(il.perdidaRelativa * 100).toFixed(2)} %`
  });

  const compensacion = volumenParaCompensar({ perdida: il.perdida, volumenDiario: 200_000 });
  console.log(
    `\nCon 200 000 USDC de volumen diario y 0,3 % de comisión harían falta ` +
    `${compensacion.dias.toFixed(1)} días de comisiones para compensarla.`
  );
  console.log("Ganas dinero y aun así pierdes frente a no hacer nada: eso es vender volatilidad.");
}
