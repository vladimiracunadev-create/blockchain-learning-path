# 📁 Casos reales

> [🏠 Programa](../../README.md) · [📚 Currículo](../../curriculum/README.md) · [⚖️ Regulación](../../regulation/README.md)

Biblioteca de casos **documentados públicamente**, analizados con la misma estructura para
que se puedan comparar entre sí. No están aquí para ilustrar: están para que puedas
responder, ante un diseño nuevo, **qué control faltaba** y **en qué orden se rompió todo**.

> **Criterio de selección.** Solo casos con documentación pública abundante (resoluciones
> judiciales, informes de organismos, comunicaciones oficiales de las entidades implicadas).
> Ningún caso se presenta como éxito o fracaso absoluto sin evidencia, y **ninguna cifra se
> cita sin fuente**. Cuando el estado de un asunto sigue evolucionando, se dice.

## Estructura común

Cada caso responde, en este orden: **contexto** · **problema** · **arquitectura** ·
**economía** · **qué falló y en qué orden** · **qué control habría cambiado el resultado** ·
**regulación** · **lecciones** · **referencias**.

## Casos

| Caso | Qué enseña | Módulos |
|---|---|---|
| [Terra/UST · colapso de una stablecoin algorítmica](terra-ust.md) | La reflexividad no es un fallo de implementación: es el mecanismo | [21](../../curriculum/21-stablecoins/README.md) · [19](../../curriculum/19-defi/README.md) |
| [FTX · custodia, segregación e integración vertical](ftx-custodia.md) | La quiebra no fue tecnológica: fue de controles y de separación de funciones | [26](../../curriculum/26-custodia-identidad/README.md) · [27](../../curriculum/27-regulacion-cumplimiento/README.md) |
| [Puente Ronin · compromiso de validadores](ronin-puente.md) | Un puente es tan seguro como su cuórum, y la detección importa tanto como la prevención | [13](../../curriculum/13-interoperabilidad/README.md) · [26](../../curriculum/26-custodia-identidad/README.md) |
| [El Salvador · bitcoin de curso legal](el-salvador-bitcoin.md) | Adoptar una moneda por ley no produce adopción por uso | [20](../../curriculum/20-dinero-banca-liquidacion/README.md) · [23](../../curriculum/23-pagos-fx-onchain/README.md) |

## Cómo usarlos

1. **Antes de leer el análisis**, lee solo la sección de contexto y escribe tu hipótesis de
   qué falló. Después compárala.
2. Al diseñar un sistema, recorre los cuatro casos preguntando **"¿esto me puede pasar?"**.
   La respuesta honesta suele ser sí en al menos dos.
3. En el [capstone](../../capstone/README.md), la sección de riesgos gana mucho si cita el
   caso concreto del que procede cada control que has puesto.

## Lo que estos casos **no** demuestran

- **No demuestran que la tecnología sea insegura.** Tres de los cuatro fueron fallos de
  gobernanza, de controles operativos o de diseño económico, no de criptografía.
- **No demuestran lo contrario.** Que el registro funcionara correctamente mientras alguien
  se llevaba el dinero es exactamente el punto: la corrección técnica no es suficiente.
- **No sustituyen a un análisis propio.** Cada uno tiene contexto específico; copiar la
  conclusión sin el contexto es cómo se repiten los errores.

---

## 🧭 Navegación

[🏠 Programa](../../README.md) · [📚 Currículo](../../curriculum/README.md) · [⚖️ Regulación](../../regulation/README.md) · [🎓 Capstone](../../capstone/README.md)
