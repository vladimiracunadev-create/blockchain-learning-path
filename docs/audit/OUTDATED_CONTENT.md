# Auditoría · Contenido obsoleto, inconsistencias y afirmaciones sin fuente

> [⬅️ Índice de la auditoría](README.md) · [⬅️ Duplicaciones](DUPLICATIONS.md) · [➡️ Arquitectura propuesta](PROPOSED_ARCHITECTURE.md)

Se revisaron los 98 documentos Markdown previos buscando: contenido obsoleto,
enlaces rotos, cifras inconsistentes, afirmaciones sin fuente, código con malas
prácticas, conceptos financieros incorrectos y placeholders. Este es el
resultado honesto — incluido el hecho de que la mayor parte del repositorio
estaba en buen estado.

## Enlaces y estructura

**Ningún enlace local roto.** `check-repository.mjs` ya los valida en cada `pnpm
check` y el workflow `links.yml` revisa semanalmente los externos abriendo un
issue si alguno muere. No había carpetas vacías, ni `TODO` sin resolver, ni
placeholders en el contenido publicado.

## Cifras inconsistentes encontradas

| Cifra | Dónde | Problema | Corregido |
|---|---|---|---|
| "19 módulos · 50 prácticas" | pie de portada de `build-manual.mjs` | Escrita a mano; habría quedado obsoleta al añadir módulos | Sí — actualizada a la cifra real |
| `modulos.size === 19` | `apps/android/verificar-apk.mjs` | Verificador con la cifra fijada; habría hecho fallar el APK con módulos nuevos (lo cual es **correcto** por diseño) | Sí — actualizado, manteniendo la comprobación |
| "~240 enlaces externos" | README | Aproximación sin mecanismo que la sostenga | Reformulada para no dar un número que nadie recalcula |
| "120 términos" del glosario | README | Escrita a mano | Actualizada al añadir el vocabulario financiero |
| Numeración `6.` repetida | README, sección "Cómo usar el programa" | Dos ítems numerados como `6.` | Sí |

## Conceptos que la evolución tuvo que precisar

No eran errores, pero sí **imprecisiones que se vuelven errores** al entrar en
terreno financiero:

1. **"Finalidad" usada solo en sentido técnico.** El material previo la definía
   como probabilística (PoW) o económica (PoS). En banca, *finality* significa
   además **firmeza jurídica**: el momento a partir del cual la ley considera el
   pago irrevocable frente a terceros y frente a un concurso de acreedores. Son
   cosas distintas y confundirlas lleva a afirmar que "la cadena da finalidad" en
   contextos donde jurídicamente no la da. Precisado en el módulo 20 y en el
   glosario.

2. **"Liquidación" como sinónimo de "confirmación".** Una transacción confirmada
   no está necesariamente liquidada en sentido de infraestructura de mercado
   (donde liquidar implica la transferencia definitiva de ambas patas). Precisado
   en los módulos 20, 23 y 25.

3. **"Stablecoin" tratada como categoría única.** Las menciones previas no
   distinguían respaldo, emisor ni redimibilidad. Un token con paridad nominal
   puede ser un pasivo de un emisor, una posición sobrecolateralizada o un
   esquema algorítmico: el riesgo no se parece en nada. Precisado en el módulo 21.

4. **Ausencia de la distinción normativa.** Ningún documento previo distinguía
   **ley / norma / circular / guía / consulta pública / propuesta**. Es la
   distinción que evita presentar un borrador como derecho vigente. Introducida
   en el módulo 27 y aplicada en todo `regulation/`.

## Revisión de código

- **Sin secretos ni claves privadas** en el árbol (`gitleaks` en CI, más
  inspección manual de `.env.example`, que solo trae marcadores).
- Los contratos vulnerables de `security-challenges/` están **etiquetados como
  educativos** y acompañados de su corrección: es uso legítimo y así se mantiene.
- Los laboratorios apuntan a Anvil, `regtest` o testnet. **Ninguno apunta a
  mainnet por defecto.** Esta propiedad se preservó en las prácticas nuevas: los
  laboratorios financieros añadidos son **simulaciones deterministas en Node**,
  sin red, sin claves y sin fondos.

## Riesgo detectado y mitigado en el contenido nuevo

El terreno financiero-regulatorio tiene un riesgo que el técnico no tiene:
**envejece por decreto ajeno**. Un módulo sobre EVM sigue siendo válido durante
años; uno sobre MiCA o sobre la Ley 21.521 puede dejar de serlo con una norma
publicada mañana. Mitigaciones adoptadas:

- Toda afirmación regulatoria lleva **fuente oficial enlazada**.
- `regulation/` incluye una **fecha de revisión** y una regla de mantenimiento
  explícita en cada documento.
- Se describe el **mecanismo** (qué obliga un régimen de reservas, qué implica
  una autorización) por encima del **dato coyuntural** (umbrales concretos), que
  se remite a la fuente viva.
- Ninguna propuesta o consulta pública se presenta como norma vigente.

---

## 🧭 Navegación

[⬅️ Duplicaciones](DUPLICATIONS.md) · [📋 Índice](README.md) · ➡️ [Arquitectura propuesta](PROPOSED_ARCHITECTURE.md)
