# 🇺🇸 Estados Unidos · Un marco fragmentado

> [⬅️ Regulación](../README.md) · [🏠 Programa](../../README.md) · [📖 Módulo 27](../../curriculum/27-regulacion-cumplimiento/README.md)

Revisado: **2026-08-12**.

> **Descargo.** Material educativo, no asesoría legal. Esta página describe **la estructura**
> del marco estadounidense, que es lo que se mantiene estable; **no** el estado de casos,
> propuestas legislativas ni criterios concretos, que cambian y deben verificarse en la
> fuente oficial correspondiente.

Estados Unidos no tiene un reglamento integral equivalente a
[MiCA](../european-union/README.md). Tiene **varios reguladores con competencias solapadas,
a nivel federal y estatal**, y por eso la pregunta relevante no es "¿qué dice la ley?" sino
**"¿bajo qué autoridad cae cada parte de lo que hago?"**.

Entender esta fragmentación tiene valor pedagógico propio: enseña que la calificación del
instrumento, y no la tecnología, es lo que decide el régimen.

## Quién regula qué

| Autoridad | Competencia | Fuente oficial |
|---|---|---|
| **SEC** (valores) | Ofertas y negociación de instrumentos que sean valores; plataformas y custodios asociados | <https://www.sec.gov/> |
| **CFTC** (materias primas y derivados) | Mercados de derivados; fraude y manipulación en mercados al contado de materias primas | <https://www.cftc.gov/> |
| **FinCEN** (Tesoro) | Prevención de lavado; transmisores de dinero y sus deberes de registro e información | <https://www.fincen.gov/> |
| **OFAC** (Tesoro) | **Sanciones**: listas y prohibiciones de operar con personas designadas | <https://ofac.treasury.gov/> |
| **OCC / Reserva Federal / FDIC** | Actividad de bancos y su relación con activos digitales | <https://www.occ.gov/> · <https://www.federalreserve.gov/> |
| **Reguladores estatales** | Licencias de transmisión de dinero estado por estado; regímenes propios | Varía por estado |

## Los tres ejes que hay que entender

### 1 · ¿Es un valor?

La pregunta central. La doctrina estadounidense aplica un análisis funcional —conocido como
el *Howey test*, por la sentencia del Tribunal Supremo en *SEC v. W. J. Howey Co.* (1946)—
que atiende, en esencia, a si hay **inversión de dinero en una empresa común con expectativa
de beneficio derivado del esfuerzo de otros**.

Lo que importa para un ingeniero: **la calificación no depende del formato técnico del
token**, sino de cómo se ofrece, qué se promete y de quién depende el rendimiento. Un mismo
activo puede ser tratado de forma distinta según el contexto de su distribución. Los criterios
concretos y su aplicación son objeto de litigio y evolución continua: **verifica siempre el
estado actual** y no des por definitiva ninguna afirmación categórica.

### 2 · Transmisión de dinero: federal **y** estatal a la vez

Quien mueve fondos por cuenta de terceros suele quedar sujeto a:

- **Registro federal** ante FinCEN como negocio de servicios monetarios, con programa de
  prevención de lavado, identificación de clientes, conservación de registros y reportes.
- **Licencias estatales** de transmisión de dinero, **una por estado**, con requisitos y
  plazos propios.

Ese segundo punto es la particularidad estadounidense más costosa en la práctica, y la razón
por la que muchos proyectos empiezan operando solo en algunos estados.

### 3 · Sanciones: la obligación que no admite matices

Las prohibiciones de OFAC aplican **con independencia del sector y de la tecnología**.
Operar con una persona o dirección designada es una infracción por sí misma. En la práctica
esto obliga a **cribado de contrapartes** y a un procedimiento documentado, y es el punto
donde la trazabilidad de un registro público juega a favor del cumplimiento.

## Comparación con MiCA, en una línea

| | Unión Europea | Estados Unidos |
|---|---|---|
| Arquitectura | Un reglamento integral | Varios reguladores con competencias solapadas |
| Punto de entrada | Clasificar el token en tres categorías | Determinar bajo qué autoridad cae cada actividad |
| Ámbito territorial | Pasaporte en el mercado interior | Federal **más** licencia estado por estado |
| Estabilidad del criterio | Texto normativo publicado | Evolución por vía administrativa y judicial |

## Fuentes oficiales

- SEC — Comisión de Bolsa y Valores: <https://www.sec.gov/>
- CFTC — Comisión de Negociación de Futuros de Materias Primas: <https://www.cftc.gov/>
- FinCEN — Red de Represión de Delitos Financieros: <https://www.fincen.gov/>
- OFAC — Oficina de Control de Activos Extranjeros: <https://ofac.treasury.gov/>
- Reserva Federal: <https://www.federalreserve.gov/>

## Regla de mantenimiento

Este es el marco que **más rápido cambia** de todos los que cubre el programa, y por eso esta
página describe estructura y no detalle. Al revisarla: comprueba si ha habido legislación
federal nueva (que cambiaría el rango de lo aquí descrito), verifica los enlaces y **no
incorpores criterios extraídos de casos individuales sin citar la resolución**.

---

## 🧭 Navegación

[⬅️ Regulación](../README.md) · [🇪🇺 Unión Europea](../european-union/README.md) · [🌍 Comparación](../comparison/README.md) · [📖 Módulo 27](../../curriculum/27-regulacion-cumplimiento/README.md)
