# Plantilla · Informe de auditoría

> Navegación: [Inicio](../README.md) · [Currículo](../curriculum/README.md) · [Módulo 09 · Seguridad](../curriculum/09-seguridad/README.md) · [Retos de seguridad](../security-challenges/README.md)

Plantilla profesional para redactar el informe de auditoría de tu proyecto o capstone. Copia este archivo, reemplaza los marcadores `<…>` y elimina las notas en cursiva. Un buen informe **reduce el riesgo dentro de un alcance declarado**; no promete ausencia total de vulnerabilidades.

---

## Portada

| Campo | Valor |
|---|---|
| Proyecto | `<nombre del protocolo>` |
| Alcance | `<contratos y archivos revisados>` |
| Fuera de alcance | `<lo explícitamente no revisado>` |
| Commit auditado | `<hash de git>` |
| Red / compilador | `<testnet, solc 0.8.x>` |
| Auditor(es) | `<nombre>` |
| Fechas | `<inicio – fin>` |
| Versión del informe | `<1.0>` |

## Resumen ejecutivo

*Tres a cinco frases legibles por alguien no técnico: qué se revisó, el resultado general, cuántos hallazgos por severidad y el mensaje principal.*

| Severidad | Cantidad | Corregidos | Aceptados |
|---|---|---|---|
| Crítica | 0 | 0 | 0 |
| Alta | 0 | 0 | 0 |
| Media | 0 | 0 | 0 |
| Baja | 0 | 0 | 0 |
| Informativa | 0 | 0 | 0 |

## Metodología

*Describe cómo se realizó la revisión.*

- Revisión manual línea por línea de `<archivos>`.
- Análisis estático con `<Slither / otra>`.
- Pruebas dirigidas y **fuzzing/invariantes** con Foundry sobre las propiedades críticas.
- Revisión de supuestos de confianza, privilegios administrativos y modos de falla.

## Arquitectura y confianza

*Activos, actores, privilegios, dependencias externas (oráculos, tokens) y un diagrama de componentes con límites de confianza.*

## Invariantes verificadas

| # | Invariante | Método de verificación | Estado |
|---|---|---|---|
| 1 | `<propiedad crítica>` | `<prueba de invariante / fuzz>` | `<verificada / no cubierta>` |

## Hallazgos

*Tabla resumen; luego una ficha por hallazgo.*

| ID | Título | Severidad | Estado |
|---|---|---|---|
| H-01 | `<título>` | `<Alta>` | `<Corregido>` |

### Formato de un hallazgo

**ID:** `H-01` · **Severidad:** `<Alta>` · **Estado:** `<Abierto / Corregido / Aceptado>`

- **Ubicación:** `<archivo:línea>`
- **Descripción:** *qué es y por qué es un problema.*
- **Impacto:** *qué puede lograr un atacante (fondos, control, DoS).*
- **Probabilidad:** *qué tan fácil es explotarlo y bajo qué condiciones.*
- **Prueba de concepto:** *prueba mínima que demuestra el impacto (referencia al test; no incluyas exploits listos para atacar sistemas de terceros).*
- **Recomendación:** *corrección mínima que ataca la causa raíz.*
- **Verificación:** *cómo se confirmó que la corrección cierra la falla (prueba de regresión).*

## Matriz de severidad

La severidad combina **impacto** (qué se pierde) y **probabilidad** (qué tan fácil ocurre):

| Impacto ↓ / Probabilidad → | Baja | Media | Alta |
|---|---|---|---|
| **Alto** (pérdida de fondos, control total) | Media | Alta | Crítica |
| **Medio** (bloqueo temporal, pérdida parcial) | Baja | Media | Alta |
| **Bajo** (molestia, gas, cosmético) | Informativa | Baja | Media |

## Riesgos no técnicos

*Gobernanza, dependencia de oráculos, concentración de poder, operación y respuesta ante incidentes: aspectos que ninguna corrección de código resuelve por sí sola.*

## Anexos

- **A. Herramientas y versiones** usadas (compilador, análisis estático, Foundry).
- **B. Cobertura de pruebas** y salida relevante de la suite.
- **C. Registro de correcciones**: commits que atienden cada hallazgo.

## Descargo

La revisión reduce el riesgo dentro del alcance declarado y en el commit auditado; **no garantiza la ausencia de vulnerabilidades**. Cambios posteriores al commit no están cubiertos. Este informe es material educativo del programa y no sustituye una auditoría profesional independiente.
