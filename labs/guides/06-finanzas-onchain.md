# Guías 51–70 · Finanzas on-chain, institucional y regulación

Este cuaderno cubre la etapa que va del mercado sin intermediario a la infraestructura financiera: DeFi, dinero y liquidación, stablecoins, depósitos tokenizados y MDBC, pagos y FX, tokenización, mercados de capitales, custodia, identidad y cumplimiento. Acompaña a los módulos [19](../../curriculum/19-defi/README.md)–[27](../../curriculum/27-regulacion-cumplimiento/README.md).

> [⬅️ Cuaderno de laboratorios](README.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md)

Todas las prácticas de este bloque son **simulaciones locales**: sin red, sin claves y sin fondos. Estudiar un mercado no exige operar en él, y estudiar cumplimiento no exige tratar datos personales reales.

| # | Práctica | Tipo | Comando/entrega |
|---:|---|---|---|
| 51 | Curva, impacto y deslizamiento en un AMM | auto | `pnpm lab:amm` |
| 52 | Pérdida impermanente y su compensación | auto | `pnpm lab:amm` |
| 53 | Factor de salud y precio de liquidación | auto | `pnpm lab:prestamo` |
| 54 | Ficha de riesgo de un protocolo DeFi | informe | seis riesgos con evidencia |
| 55 | Compensación frente a liquidación bruta | cálculo | neteo + exposición |
| 56 | El circuito de tu propio pago | mapa | iniciación → firmeza |
| 57 | Las siete formas de dinero digital | matriz | emisor, riesgo, programabilidad |
| 58 | Colateral, paridad y desanclaje | auto | `pnpm lab:peg` |
| 59 | Ficha comparada de dos stablecoins | informe | modelo, reservas, redención |
| 60 | Opciones de diseño de una MDBC | documento | privacidad, límites, offline |
| 61 | Coste real de una remesa | auto | `pnpm lab:remesa` |
| 62 | Pago contra pago atómico | auto | `pnpm lab:pvp` |
| 63 | Análisis de un corredor de pagos | informe | cuatro fricciones del G20 |
| 64 | Mapa de la junta off-chain / on-chain | informe | cinco puntos de fallo |
| 65 | Memorando de tokenización | documento | derechos, SPV, estándar, redención |
| 66 | Entrega contra pago y coste de liquidez | auto | `pnpm lab:dvp` |
| 67 | Ciclo de vida de un bono tokenizado | auto | `pnpm lab:bono` |
| 68 | Mercado tokenizado en contratos | auto | `forge test` en `labs/22-cbdc-mercado-tokenizado` |
| 69 | Política de custodia M-de-N | auto | `pnpm lab:quorum` |
| 70 | Cribado por riesgo y Regla de Viaje | auto | `pnpm lab:cumplimiento` |

## 51 · Curva, impacto y deslizamiento en un AMM

- **Objetivo:** separar el coste de la curva del coste de la comisión.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:amm` sobre el pool de 100 ETH / 200 000 USDC.
  2. Comprueba que comprar 1 ETH cuesta 2 020,20 USDC por la curva, no 2 000.
  3. Repite con 10 ETH y observa que diez veces el tamaño cuesta once veces el sobrecoste.
- **Salida esperada:** tabla con pago, precio efectivo e impacto para 1, 5, 10 y 25 ETH.
- **Criterio de aceptación:** explicas por qué el impacto no es lineal y qué implica para una orden institucional.
- **Error común:** llamar «comisión» al impacto de la curva → son dos costes distintos y solo uno depende del protocolo.

## 52 · Pérdida impermanente y su compensación

- **Objetivo:** demostrar con números que proveer liquidez puede rendir menos que no hacer nada.
- **Cómo se resuelve:**
  1. En la salida de `pnpm lab:amm`, compara el valor en el pool (56 568,54) con el de mantener (60 000).
  2. Calcula cuántos días de comisiones al volumen dado compensan esos 3 431,46.
  3. Baja la comisión de 0,3 % a 0,05 % y recalcula: el número de días es la respuesta honesta a «¿me conviene?».
- **Salida esperada:** pérdida de 3 431,46 (5,72 %) y los días necesarios para compensarla.
- **Criterio de aceptación:** enuncias que proveer liquidez es vender volatilidad y lo justificas con las cifras.
- **Error común:** mirar el APY sin restar la pérdida impermanente → se informa de una sola pata de la operación.

## 53 · Factor de salud y precio de liquidación

- **Objetivo:** derivar la única cifra que hay que vigilar en una posición colateralizada.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:prestamo`: 1 ETH a 2 000, deuda 1 200, umbral 80 %.
  2. Verifica factor de salud 1,333 y precio de liquidación 1 500.
  3. Repite con la deuda máxima (LTV 75 %) y observa que el precio de liquidación queda a un 6,25 % del actual.
- **Salida esperada:** tabla de salud por precio y desglose de una liquidación al 50 % con bonificación.
- **Criterio de aceptación:** calculas a mano el precio de liquidación de una posición nueva y coincide con el laboratorio.
- **Error común:** pedir el máximo posible → la posición nace liquidable ante el primer movimiento adverso.

## 54 · Ficha de riesgo de un protocolo DeFi

- **Objetivo:** evaluar un protocolo por sus riesgos estructurales y no por su rendimiento anunciado.
- **Cómo se resuelve:**
  1. Elige un protocolo real y documentado; identifica qué función de mercado sustituye.
  2. Cubre los seis riesgos: contrato, oráculo, gobernanza, liquidez, mercado y dependencias.
  3. Para cada uno, cita **dónde se comprueba**: dirección del contrato, timelock, fuente del oráculo, documentación.
- **Estructura de la respuesta:** ficha con mecanismo, seis riesgos con evidencia y el cálculo de liquidación de un ejemplo.
- **Criterio de aceptación:** ninguna cifra de rendimiento se presenta como esperable y todo control cita su evidencia.
- **Error común:** usar el TVL como medida de seguridad → mide tamaño y sube solo con el precio de lo depositado.

## 55 · Compensación frente a liquidación bruta

- **Objetivo:** ver el intercambio entre liquidez y riesgo en su forma pura.
- **Cómo se resuelve:**
  1. Con los cuatro pagos del módulo 20 (A→B 100, B→A 80, B→C 50, C→A 30), calcula el bruto total y las posiciones netas.
  2. Cuantifica la liquidez que ahorra el neteo frente a liquidar bruto.
  3. Responde por escrito: si B falla justo antes de liquidar, ¿qué operaciones se deshacen y quién asume la pérdida?
- **Estructura de la respuesta:** tabla de posiciones netas, ahorro de liquidez y análisis del fallo de un participante.
- **Criterio de aceptación:** identificas que el ahorro se paga con exposición y sitúas la ventana exacta.
- **Error común:** usar *clearing* y *settlement* como sinónimos → compensar calcula, liquidar mueve.

## 56 · El circuito de tu propio pago

- **Objetivo:** localizar el momento real de la firmeza frente al momento en que la creíste.
- **Cómo se resuelve:**
  1. Toma una transferencia propia (sin datos personales) y sitúa iniciación, validación, envío, compensación, liquidación y abono.
  2. Marca en qué punto **tú** diste el pago por definitivo y en qué punto lo fue.
  3. Identifica de quién es el pasivo en cada tramo del circuito.
- **Estructura de la respuesta:** diagrama del circuito con pasivos por tramo y las dos marcas de firmeza.
- **Criterio de aceptación:** distingues finalidad técnica, económica y jurídica sin mezclarlas.
- **Error común:** atribuir la demora a «tecnología antigua» → la causa son ventanas de firmeza, liquidez y cumplimiento.

## 57 · Las siete formas de dinero digital

- **Objetivo:** construir la matriz que ordena todo el bloque financiero.
- **Cómo se resuelve:**
  1. Filas: efectivo, reservas, depósito, depósito tokenizado, dinero electrónico, stablecoin y MDBC.
  2. Columnas: emisor, de quién es el pasivo, quién puede tenerlo, disponibilidad horaria, programabilidad y qué pasa si el emisor quiebra.
  3. Añade una fila de conclusiones: qué formas mantienen la singularidad del dinero y por qué.
- **Estructura de la respuesta:** matriz completa de 7 × 6 con la fila de conclusiones.
- **Criterio de aceptación:** ningún emisor está mal atribuido y explicas por qué dos stablecoins distintas no cotizan a la par entre sí.
- **Error común:** tratar depósito, dinero electrónico y stablecoin como equivalentes → valen lo mismo, el riesgo no se parece.

## 58 · Colateral, paridad y desanclaje

- **Objetivo:** demostrar que la paridad la sostiene la redención, no el respaldo.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:peg`: 2 ETH a 2 000, ratio mínimo 150 %, emisión 2 000 → liquidación en 1 500.
  2. Compara los dos escenarios de arbitraje con un descuento del 2 %: redención abierta y suspendida.
  3. Observa la cobertura de una reserva del 100 % con un tramo inaccesible.
- **Salida esperada:** el precio vuelve a la par solo en el escenario con redención abierta.
- **Criterio de aceptación:** explicas por qué un respaldo íntegro puede no evitar un desanclaje.
- **Error común:** confundir liquidez del pool con respaldo → en tensión, la liquidez se retira primero.

## 59 · Ficha comparada de dos stablecoins

- **Objetivo:** evaluar emisores con documentación pública, no con material promocional.
- **Cómo se resuelve:**
  1. Elige dos stablecoins reales de modelos distintos y clasifícalas en los tres ejes.
  2. Documenta emisión y redención indicando **quién** puede ejercerla.
  3. Analiza composición y custodia de reservas, y el tipo y frecuencia del informe de respaldo.
- **Estructura de la respuesta:** ficha comparada con los diez riesgos y un escenario de tensión paso a paso.
- **Criterio de aceptación:** distingues atestación de auditoría, citas la fecha de consulta y ninguna se presenta como libre de riesgo.
- **Error común:** aceptar «respaldada 1:1» como conclusión → el ratio no dice composición, custodio ni plazo.

## 60 · Opciones de diseño de una MDBC

- **Objetivo:** enfrentar las tres tensiones de una moneda digital minorista.
- **Cómo se resuelve:**
  1. Define el país hipotético: bancarización, calidad de los pagos instantáneos, cobertura de red.
  2. Elige modelo (cuenta o token), arquitectura de distribución y privacidad graduada con umbrales.
  3. Fija un límite de tenencia y **calcula** qué porcentaje de los depósitos podría migrar en el peor caso.
- **Estructura de la respuesta:** documento de opciones con diseño offline y una sección de objeciones a tu propia propuesta.
- **Criterio de aceptación:** cada decisión nombra la tensión que resuelve y la que empeora; el límite va con su cuenta.
- **Error común:** prometer pagos sin conexión sin límites → la ventana de doble gasto se acota, no se elimina.

## 61 · Coste real de una remesa

- **Objetivo:** aplicar la descomposición completa del coste puerta a puerta.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:remesa`: 200 USD, comisión 5, margen 2,5 %, intermediarios 1,5, retirada 0,5 → 12 USD (6 %).
  2. Compara con un corredor on-chain de última milla barata y con otro de última milla cara.
  3. Calcula el prefondeo: 10 M al 6 % entre 500 000 operaciones = 1,20 por operación.
- **Salida esperada:** el corredor on-chain pierde cuando la rampa de salida es cara.
- **Criterio de aceptación:** identificas el punto en que se invierte el resultado y explicas por qué.
- **Error común:** comparar solo la comisión explícita → el margen de cambio suele ser mayor y no se anuncia.

## 62 · Pago contra pago atómico

- **Objetivo:** demostrar que la atomicidad elimina el riesgo de principal.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:pvp` y observa la liquidación secuencial con fallo tras la primera pata: pérdida del importe íntegro.
  2. Recorre los tres finales atómicos: ambas patas, falta una, plazo vencido.
  3. Comprueba qué ocurre cuando una pata está fuera del entorno de ejecución.
- **Salida esperada:** pérdida de principal 0 en los tres finales atómicos; imposible con una pata fuera.
- **Criterio de aceptación:** explicas por qué el riesgo Herstatt desaparece por construcción y bajo qué condición.
- **Error común:** afirmar «atómico luego firme» → la atomicidad es técnica, la firmeza la da la norma.

## 63 · Análisis de un corredor de pagos

- **Objetivo:** evaluar una vía on-chain contra las cuatro fricciones del G20, sin favoritismos.
- **Cómo se resuelve:**
  1. Elige dos países y dibuja ambos flujos con todos los intermediarios.
  2. Construye la tabla de costes con las cuatro componentes y el prefondeo estimado.
  3. Marca los tiempos por tramo y señala el cuello de botella real.
- **Estructura de la respuesta:** análisis con evaluación contra las cuatro fricciones y sección de riesgos.
- **Criterio de aceptación:** identificas al menos una fricción que la vía on-chain **no** mejora y condicionas la recomendación a volumen y liquidez.
- **Error común:** omitir la última milla → es el tramo que decide en corredores pequeños.

## 64 · Mapa de la junta off-chain / on-chain

- **Objetivo:** localizar dónde vive de verdad el riesgo de un activo tokenizado.
- **Cómo se resuelve:**
  1. Elige un activo (factura, plaza de aparcamiento, fondo monetario).
  2. Completa los cinco puntos de fallo: titularidad, custodia, atestación, servicio y ejecución.
  3. Para cada uno indica quién lo cubre, con qué documento se acredita y qué pasa si esa parte desaparece.
- **Estructura de la respuesta:** tabla de cinco filas con responsable, evidencia y plan de contingencia.
- **Criterio de aceptación:** reconoces que ninguno de los cinco lo resuelve un contrato inteligente.
- **Error común:** decir «tokenizamos el inmueble» → se tokeniza un derecho, no una cosa.

## 65 · Memorando de tokenización

- **Objetivo:** escribir la estructura que hace que el token signifique algo.
- **Cómo se resuelve:**
  1. Descompón el activo en derechos económicos y decide cuáles viajan al token.
  2. Propón el envoltorio jurídico y responde qué ocurre si el registro oficial y la cadena divergen.
  3. Elige estándar (ERC-20, ERC-1400, ERC-3643) listando las restricciones de transferencia necesarias.
- **Estructura de la respuesta:** memorando con servicio del activo, política de valoración, redención e incumplimiento.
- **Criterio de aceptación:** identificas quién ejecuta en caso de impago, incluyes gestor sustituto y no afirmas que tokenizar cree liquidez.
- **Error común:** desplegar un ERC-20 para un valor → transferencia libre es incumplimiento por diseño.

## 66 · Entrega contra pago y coste de liquidez

- **Objetivo:** cuantificar lo que la liquidación atómica compra y lo que cuesta.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:dvp`: exposición de T+0, T+1 y T+2 sobre 500 M diarios.
  2. Recorre los tres finales del DvP y comprueba que un fallo deja el estado intacto.
  3. Compara liquidez bruta y neteada al 92 %: multiplicador × 12,5.
- **Salida esperada:** 1 000 M de exposición con T+2; 500 M de liquidez con liquidación atómica frente a 40 M con neteo.
- **Criterio de aceptación:** enuncias el intercambio (riesgo de contraparte por liquidez) con las tres cifras.
- **Error común:** presentar la atomicidad como estrictamente mejor que T+2 → suprime el neteo.

## 67 · Ciclo de vida de un bono tokenizado

- **Objetivo:** recorrer emisión, cupones, amortización y las dos restricciones reales.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:bono`: nominal 1 000, cupón 4 % semestral, 3 años, 100 000 títulos.
  2. Observa el reparto con retención distinta por residencia y por qué se liquida fuera de la cadena.
  3. Compara reparto activo y patrón de reclamación según el número de titulares.
- **Salida esperada:** cupón de 20 por título, seis pagos, amortización solo en el último.
- **Criterio de aceptación:** justificas cuándo hace falta el patrón de reclamación con la cuenta de gas.
- **Error común:** iterar sobre miles de titulares → puede no caber en un bloque.

## 68 · Mercado tokenizado en contratos

- **Objetivo:** comprobar en Solidity lo que los módulos 22, 24 y 25 afirman.
- **Cómo se resuelve:**
  1. `cd labs/22-cbdc-mercado-tokenizado && forge install foundry-rs/forge-std && forge test -vv`.
  2. Lee el README del laboratorio: qué representa cada contrato y, sobre todo, qué **no** representa.
  3. Localiza las dos pruebas clave: falta la pata de dinero y falta la de valores.
- **Salida esperada:** 18 pruebas en verde, incluida la invariante de conservación con 1 000 ejecuciones de fuzzing.
- **Criterio de aceptación:** explicas por qué el estado queda intacto cuando falla una de las dos patas.
- **Error común:** creer que la simulación reproduce un sistema real → es una maqueta docente y así está etiquetada.

## 69 · Política de custodia M-de-N

- **Objetivo:** diseñar un cuórum que resista compromiso **y** pérdida.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:quorum` y compara 1 de 3, 2 de 3, 3 de 5, 4 de 5, 5 de 5 y 5 de 7.
  2. Comprueba que 3 de 5 → 4 de 5 duplica la resistencia al ataque pagándola con congelación, y que 3 de 5 → 5 de 7 la duplica sin ese coste.
  3. Diseña escalones por importe con destinos permitidos y retardo temporal.
- **Salida esperada:** tabla de tolerancias y escenarios donde los fondos quedan congelados.
- **Criterio de aceptación:** tu política sobrevive al compromiso de un firmante **y** a la pérdida de otro.
- **Error común:** contar llaves en vez de organizaciones → cinco claves de un mismo administrador son una llave con copias.

## 70 · Cribado por riesgo y Regla de Viaje

- **Objetivo:** aplicar el enfoque basado en riesgo y encontrar el límite de la Regla de Viaje.
- **Cómo se resuelve:**
  1. Ejecuta `pnpm lab:cumplimiento` sobre las cuatro operaciones de ejemplo.
  2. Observa cómo los controles crecen con el nivel de riesgo en vez de aplicarse igual a todos.
  3. Compara el destino «proveedor registrado» con «wallet autoalojada»: cambia el flujo porque no hay receptor.
- **Salida esperada:** niveles bajo, medio y alto con controles distintos; operación detenida cuando la contraparte no está identificada.
- **Criterio de aceptación:** explicas por qué aplicar el control máximo a todos contradice el enfoque basado en riesgo.
- **Error común:** presentar la Regla de Viaje como resuelta para wallets autoalojadas → los controles son parciales.

---

## 🧭 Navegación

[⬅️ Guías 41–50](05-advanced-capstone.md) · [🧪 Catálogo](../CATALOG.md) · [📚 Currículo](../../curriculum/README.md) · [🏠 Programa](../../README.md)
