# Caso · El Salvador: bitcoin de curso legal

> [⬅️ Casos reales](README.md) · [📖 Módulo 20 · Dinero y liquidación](../../curriculum/20-dinero-banca-liquidacion/README.md) · [🏠 Programa](../../README.md)

**Cuándo:** desde septiembre de 2021. **Qué:** El Salvador otorgó por ley curso legal a
bitcoin, junto al dólar estadounidense que ya usaba, y desplegó una billetera estatal.

> **Cómo hay que leer este caso.** No es un éxito ni un fracaso absoluto, y presentarlo como
> cualquiera de las dos cosas exige evidencia que no existe. Aquí se separan **la decisión
> jurídica**, **la infraestructura desplegada**, **la adopción observada** y **la posición de
> los organismos multilaterales**, porque son cuatro cosas distintas que suelen mezclarse.
>
> El marco legal **ha sido modificado desde su aprobación**. Verifica el estado vigente en
> las fuentes oficiales antes de afirmar qué rige hoy.

## Las cuatro capas del caso

### 1 · La decisión jurídica

La ley otorgó a bitcoin **curso legal**, una condición que en la práctica implicaba
obligaciones de aceptación por parte de los agentes económicos, junto con la dolarización
preexistente. Es una decisión sin precedentes: ningún país había otorgado curso legal a un
criptoactivo.

El marco fue **reformado posteriormente**, en el contexto de un acuerdo con el Fondo
Monetario Internacional, en el sentido de hacer **voluntaria** la aceptación. Consulta el
estado vigente en el [Banco Central de Reserva](https://www.bcr.gob.sv/) y en las
publicaciones del [FMI](https://www.imf.org/) sobre el país.

### 2 · La infraestructura

Se desplegó una **billetera estatal** con incentivo de alta, con la intención declarada de
facilitar pagos y **remesas** —una partida de peso considerable en la economía salvadoreña— y
de ampliar el acceso a servicios financieros de población no bancarizada.

Merece atención técnica un punto que suele omitirse: **la billetera operaba con custodia**,
de modo que buena parte de la experiencia de usuario no involucraba autocustodia. La
propiedad de "ser tu propio banco" no formaba parte del despliegue mayoritario.

### 3 · La adopción observada

Los estudios disponibles —académicos y de organismos— coinciden en un patrón: **alta descarga
inicial impulsada por el incentivo y uso recurrente considerablemente menor**, con el uso
concentrado en un subconjunto de la población. El envío de remesas por esta vía representó
una fracción pequeña del total.

Ese contraste entre alta y uso es la lección más transferible del caso, y no es específica de
las criptomonedas: **un incentivo de alta produce altas, no hábitos**.

### 4 · La posición de los organismos

El **FMI** ha expresado en sus comunicaciones sobre el país preocupaciones relativas a
estabilidad, protección al consumidor e integridad financiera asociadas al uso de bitcoin
como moneda de curso legal, y la cuestión ha formado parte de las conversaciones sobre
programas de financiamiento. Consulta sus documentos de país para la posición vigente.

## Qué enseña sobre dinero

Es el caso que mejor ilustra el
[módulo 20](../../curriculum/20-dinero-banca-liquidacion/README.md), porque somete las tres
funciones del dinero a una prueba real:

| Función | Qué pasó |
|---|---|
| **Medio de pago** | Legalmente habilitado; el uso recurrente fue limitado |
| **Unidad de cuenta** | Los precios siguieron expresándose en dólares |
| **Depósito de valor** | La volatilidad es incompatible con un salario o un ahorro pequeño |

Y añade una lección que solo se ve con un caso real: **el curso legal es una condición
jurídica, no una condición de uso**. Una ley puede obligar a aceptar; no puede hacer que la
gente quiera cobrar en un activo cuyo valor cambia entre el cobro y el gasto. Cuando el dinero
que se recibe hay que convertirlo inmediatamente, el instrumento funciona como **raíl de
pago**, no como moneda — y evaluarlo como raíl da un análisis mucho más útil.

## Sobre remesas

El argumento de partida —abaratar remesas— es correcto en su diagnóstico:
[los corredores de remesas son caros](../../curriculum/23-pagos-fx-onchain/README.md), y buena
parte del coste no es la comisión anunciada sino el margen de cambio y la última milla.

Y es justamente la **última milla** lo que este caso ilumina: convertir a efectivo en destino
sigue teniendo un coste, y la red de puntos de conversión sigue siendo un negocio local. El
laboratorio `pnpm lab:remesa` permite comprobar numéricamente el punto en que una rampa de
salida cara **anula** el ahorro del tramo de liquidación.

## Lecciones

1. **Curso legal ≠ adopción.** La ley determina qué se puede exigir; no determina qué usa la
   gente.
2. **Los incentivos de alta miden altas.** Cualquier métrica de adopción basada en descargas
   es, en el mejor caso, incompleta.
3. **La volatilidad es el obstáculo, no la tecnología.** El mismo raíl con un activo estable
   plantea preguntas distintas — y es la dirección que ha tomado la mayor parte del sector.
4. **Una billetera custodiada estatal es un custodio.** Se le aplican todas las preguntas del
   [módulo 26](../../curriculum/26-custodia-identidad/README.md).
5. **Los marcos jurídicos excepcionales se revisan.** El de este caso ya se modificó; citarlo
   sin comprobar el estado vigente produce afirmaciones falsas.

## Referencias

- Banco Central de Reserva de El Salvador: <https://www.bcr.gob.sv/>
- Fondo Monetario Internacional — documentos de país: <https://www.imf.org/en/Countries/SLV>
- Banco Mundial — precios de remesas: <https://remittanceprices.worldbank.org/>
- BIS — investigación sobre adopción de criptoactivos y pagos: <https://www.bis.org/>
- Módulos del programa: [20 · Dinero y liquidación](../../curriculum/20-dinero-banca-liquidacion/README.md) · [23 · Pagos y FX](../../curriculum/23-pagos-fx-onchain/README.md)

---

## 🧭 Navegación

[⬅️ Casos reales](README.md) · [📖 Módulo 20](../../curriculum/20-dinero-banca-liquidacion/README.md) · [🏠 Programa](../../README.md)
