# 📁 Casos reales

> [🏠 Programa](../../README.md) · [📚 Currículo](../../curriculum/README.md) · [⚖️ Regulación](../../regulation/README.md)

Biblioteca de casos **documentados públicamente**, analizados con la misma estructura para
que se puedan comparar entre sí. No están aquí para ilustrar: están para que puedas
responder, ante un diseño nuevo, **qué control faltaba** y **en qué orden se rompió todo**.

Antes de atribuir una dirección, intervenir un sistema o recomendar una respuesta, aplica
[¿Y si cruzas la línea?](../y-si-cruzas-la-linea-blockchain.md): una guía defensiva para
separar hecho, indicador, inferencia y alegación, preservar evidencia y reconocer cuándo
una acción requiere autoridad legal u operativa adicional.

> **Criterio de selección.** Solo casos con documentación pública abundante (resoluciones
> judiciales, informes de organismos, comunicaciones oficiales de las entidades implicadas).
> Ningún caso se presenta como éxito o fracaso absoluto sin evidencia, y **ninguna cifra se
> cita sin fuente**. Cuando el estado de un asunto sigue evolucionando, se dice.

## Estructura común

Cada caso responde, en este orden: **contexto** · **problema** · **arquitectura** ·
**economía** · **qué falló y en qué orden** · **cronología fechada** · **controles y
límites** · **regulación** · **ejercicio guiado** · **respuestas orientadoras** ·
**lecciones** · **referencias**.

## Casos

| Caso | Qué enseña | Clases |
|---|---|---|
| [Orionx · ledger, custodia y estado blockchain](orionx-descalce-custodia.md) | Un descalce en investigación exige separar registros, atribución y niveles de certeza | [59–66](../../curriculum/29-exchanges-operaciones-custodia/README.md) |
| [Terra/UST · colapso de una stablecoin algorítmica](terra-ust.md) | La reflexividad no es un fallo de implementación: es el mecanismo | [43–44](../../curriculum/21-stablecoins/README.md) · [39–40](../../curriculum/19-defi/README.md) |
| [FTX · ledger, custodia y privilegios de Alameda](ftx-custodia.md) | Inclusión de pasivos, control de activos, disponibilidad y solvencia son pruebas distintas | [53–54](../../curriculum/26-custodia-identidad/README.md) · [55–56](../../curriculum/27-regulacion-cumplimiento/README.md) |
| [Celsius · préstamo, custodia e información](celsius-prestamo-custodia.md) | La relación económica y el riesgo deben coincidir con lo comunicado al cliente | [39–40](../../curriculum/19-defi/README.md) · [53–54](../../curriculum/26-custodia-identidad/README.md) |
| [OneCoin · afirmaciones tecnológicas y evidencia](onecoin-evidencia-tecnologica.md) | Se verifican afirmaciones concretas; cadena privada, token o referidos no prueban fraude aisladamente | [55–56](../../curriculum/27-regulacion-cumplimiento/README.md) |
| [Puente Ronin · compromiso de validadores](ronin-puente.md) | Un puente es tan seguro como su cuórum, y la detección importa tanto como la prevención | [27–28](../../curriculum/13-interoperabilidad/README.md) · [53–54](../../curriculum/26-custodia-identidad/README.md) |
| [El Salvador · bitcoin de curso legal](el-salvador-bitcoin.md) | Adoptar una moneda por ley no produce adopción por uso | [41–42](../../curriculum/20-dinero-banca-liquidacion/README.md) · [47–48](../../curriculum/23-pagos-fx-onchain/README.md) |

## Comparadores financieros breves: no son incidentes blockchain

Estos dos casos no crean fichas ni unidades nuevas. Sirven para comprobar si una
explicación depende realmente de blockchain o describe un patrón financiero anterior.

| Comparador | Hechos y estado | Contraste útil | Fuentes oficiales |
|---|---|---|---|
| **Bernard Madoff / BLMIS** · EE. UU. | Madoff se declaró culpable de once delitos el 12-03-2009 y fue sentenciado a 150 años el 29-06-2009. El informe OIG documentó alertas y exámenes que no verificaron la negociación con terceros independientes. | Estados de cuenta convincentes no prueban que existan operaciones ni activos. La comprobación externa y la procedencia del rendimiento importan con o sin token. | [DOJ, expediente y estado](https://www.justice.gov/usao-sdny/programs/victim-witness-services/united-states-v-bernard-l-madoff-and-related-cases), [SEC OIG, informe 509](https://www.sec.gov/about/reports-publications/newsstudies2009oig-509pdf) |
| **AC Inversions** · Chile | La Fiscalía informó el 26-02-2018 una investigación reformalizada por estafa, infracción a la Ley de Bancos y lavado, con 3 442 víctimas individualizadas y perjuicio peritado de CLP 65 mil millones. Esa publicación describe imputaciones e investigación, no una sentencia final. | Una rentabilidad fija y pagos a clientes anteriores exigen verificar trading, cuentas, captación y origen de flujos. El patrón no necesita blockchain. | [Fiscalía de Chile, reformalización](https://www.fiscaliadechile.cl/actualidad/noticias/regionales/caso-ac-inversions-fiscalia-de-alta-complejidad-reformalizo), publicada 26-02-2018 |

**Corte y consulta:** hechos y publicaciones comprobados el **28 de septiembre de
2026**. Las cifras no se trasladan entre etapas procesales: una estimación inicial,
un peritaje de investigación y una sentencia responden preguntas distintas.

## Cómo usarlos

1. **Antes de leer el análisis**, lee solo la sección de contexto y escribe tu hipótesis de
   qué falló. Después compárala.
2. Al diseñar un sistema, recorre los siete casos preguntando **"¿esto me puede pasar?"**.
   La respuesta honesta suele ser sí en al menos dos.
3. En el [capstone](../../capstone/README.md), la sección de riesgos gana mucho si cita el
   caso concreto del que procede cada control que has puesto.

## Práctica offline · Qué demuestra cada control

No se crea otro simulador. La práctica reutiliza las interfaces y pruebas de
[`conciliar.mjs`](../../labs/30-conciliacion/conciliar.mjs) y
[`por.mjs`](../../labs/31-proof-reserves/por.mjs), con sus fixtures íntegramente
sintéticos.

```bash
pnpm lab:conciliacion
pnpm lab:por
node --test labs/30-conciliacion/conciliar.test.mjs labs/31-proof-reserves/por.test.mjs
```

### Consigna

1. Registra el corte temporal y copia la tabla de conciliación por activo.
2. Verifica la inclusión de un cliente en el árbol y explica exactamente qué conjunto
   se ha comprometido.
3. Completa esta matriz con **sí**, **no** o **requiere otra evidencia**:

| Afirmación | Conciliación | Inclusión Merkle | Control de wallet | Contrato/custodio | Auditoría de alcance definido |
|---|---|---|---|---|---|
| El saldo de C-002 está en el conjunto publicado |  |  |  |  |  |
| El conjunto contiene todos los pasivos |  |  |  |  |  |
| La entidad controla los activos on-chain declarados |  |  |  |  |  |
| Los activos están disponibles y libres de gravamen |  |  |  |  |  |
| La entidad es solvente |  |  |  |  |  |
| La publicidad al cliente es veraz |  |  |  |  |  |

4. Añade dos escenarios escritos, sin cambiar datos: un cliente omitido y un activo
   pignorado. Indica qué controles seguirían dando el mismo resultado.
5. Relaciona una limitación con FTX, Celsius, Terra, OneCoin y uno de los comparadores.

### Solución comentada y resultados esperados

- `conciliar.mjs` separa pasivos, activos en exchange y saldos on-chain; espera BTC
  con diferencia positiva de `5 000 000` de unidades mínimas, USDC en `shortfall` y
  cortes comparables en los fixtures. Detecta una diferencia por activo, no explica
  su causa ni demuestra titularidad.
- `por.mjs` produce una raíz determinista, pasivos declarados por `225 000 000`,
  activos por `230 000 000`, diferencia `5 000 000`, ratio mayor que uno y
  `covered: true`. Eso describe el snapshot de entrada, no la integridad de la
  población ni la solvencia integral.
- La inclusión de `C-002` es **sí** para el conjunto publicado. «Todos los pasivos»,
  disponibilidad, ausencia de gravámenes, solvencia y publicidad veraz requieren
  otras fuentes y procedimientos.
- Una firma de desafío puede probar control puntual de una wallet, pero contrato,
  titularidad, bloqueo, préstamo y gravamen siguen abiertos.
- Omitir un cliente puede dejar intacta la raíz publicada y mejorar falsamente el
  ratio. Pignorar un activo puede dejar intacto su saldo on-chain.

### Rúbrica (10 puntos)

| Criterio | Puntos | Evidencia de logro |
|---|---:|---|
| Reproduce ambos comandos y sus pruebas | 2 | Salidas coherentes con los fixtures, sin editar datos |
| Separa las cinco afirmaciones | 3 | No llama solvencia a inclusión, control o cobertura declarada |
| Explica límites de cada control | 2 | Identifica al menos una limitación por columna |
| Distingue estado probatorio | 2 | Separa hecho, alegación, condena y recurso |
| Protege datos y alcance | 1 | Solo usa identificadores y cifras sintéticas |

**Aprobación:** 8/10 y ningún error crítico de alcance. Es error crítico presentar
una raíz Merkle como auditoría integral, compensar déficits entre activos sin criterio
o afirmar culpabilidad a partir de una característica tecnológica.

## Lo que estos casos **no** demuestran

- **No demuestran que la tecnología sea insegura.** Los casos apuntan principalmente a
  gobernanza, controles operativos o diseño económico, no a una ruptura de la criptografía.
- **No demuestran lo contrario.** Que el registro funcionara correctamente mientras alguien
  se llevaba el dinero es exactamente el punto: la corrección técnica no es suficiente.
- **No sustituyen a un análisis propio.** Cada uno tiene contexto específico; copiar la
  conclusión sin el contexto es cómo se repiten los errores.

---

## 🧭 Navegación

[🏠 Programa](../../README.md) · [📚 Currículo](../../curriculum/README.md) · [⚖️ Regulación](../../regulation/README.md) · [🎓 Capstone](../../capstone/README.md)
