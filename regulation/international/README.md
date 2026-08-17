# 🌐 Estándares internacionales

> [⬅️ Regulación](../README.md) · [🏠 Programa](../../README.md) · [📖 Módulo 27](../../curriculum/27-regulacion-cumplimiento/README.md)

Revisado: **2026-08-12**.

> **Advertencia de rango, y es la más importante de esta carpeta.** Nada de lo que publican
> estos organismos es **derecho directamente aplicable** a una empresa. Son estándares y
> recomendaciones que **los Estados incorporan** a su ordenamiento; lo que obliga es la
> norma nacional resultante. Confundir ambas cosas —"el GAFI obliga a…"— es el error más
> frecuente del material del sector.

## Quién hace qué

| Organismo | Qué produce | Por qué importa aquí |
|---|---|---|
| **GAFI / FATF** | Recomendaciones contra el lavado y la financiación del terrorismo | Define *activo virtual* y *VASP*; extiende la Regla de Viaje |
| **BIS** — Banco de Pagos Internacionales | Investigación y proyectos de innovación de bancos centrales | Referencia sobre pagos, liquidación, MDBC y tokenización |
| **Comité de Basilea** (en el BIS) | Estándares prudenciales bancarios | Determina el **coste de capital** de que un banco tenga criptoactivos |
| **CPMI** (en el BIS) | Principios de infraestructuras de mercado | Los PFMI son la referencia de DvP, firmeza y gestión de riesgo |
| **IOSCO** | Estándares de mercados de valores | Protección del inversor, conflictos de interés, integridad |
| **FSB** — Consejo de Estabilidad Financiera | Recomendaciones de estabilidad y coordinación del G20 | Stablecoins globales y hoja de ruta de pagos transfronterizos |
| **FMI** y **Banco Mundial** | Análisis y datos | Dinero digital, inclusión, precios de remesas |

## GAFI: las dos ideas que hay que interiorizar

### Enfoque basado en riesgo

Los controles se asignan **en proporción al riesgo evaluado**, no de forma uniforme. Aplicar
el máximo a todos los clientes no es prudente: es caro, **excluyente** y desplaza la atención
de donde el riesgo está de verdad. Es el principio que el
[laboratorio de cumplimiento](../../labs/27-cumplimiento/riesgo-y-regla-de-viaje.mjs)
implementa de forma explícita y auditable.

### Regla de Viaje y su límite práctico

La información del ordenante y del beneficiario debe **acompañar a la transferencia** entre
proveedores de servicios, por encima de determinados umbrales que fija cada jurisdicción.

Funciona entre dos proveedores identificados. **No hay a quién enviar la información cuando
el destino es una wallet autoalojada.** Las respuestas del sector —prueba de titularidad de
la dirección, análisis de riesgo de contraparte, límites por importe— son parciales y
verificables en distinto grado. Ninguna reproduce el control que existe entre entidades, y
presentar el problema como resuelto es incorrecto.

Fuente: <https://www.fatf-gafi.org/>

## Basilea: por qué los bancos eligen depósitos tokenizados

El Comité de Basilea ha desarrollado un estándar de tratamiento prudencial de las
**exposiciones de los bancos a criptoactivos**, que los clasifica en grupos según su
naturaleza y su respaldo:

- Los **activos tradicionales tokenizados** y las stablecoins que superan condiciones
  estrictas de respaldo y redención reciben un tratamiento próximo al del activo subyacente.
- Los **criptoactivos sin respaldo** reciben el tratamiento más conservador.

Consecuencia práctica y directa: **para un banco, la diferencia entre categorías no es
doctrinal, es coste de capital**. Eso explica, mejor que ningún argumento cultural, por qué
los proyectos bancarios se concentran en depósitos tokenizados y valores tokenizados y no en
criptoactivos sin respaldo.

Fuente: <https://www.bis.org/bcbs/>

## CPMI: los principios que ordenan el módulo 25

Los *Principles for Financial Market Infrastructures* (CPMI-IOSCO) son la referencia sobre
riesgo de liquidación, **firmeza**, entrega contra pago, gestión de incumplimientos y
gobierno de una infraestructura. Cualquier diseño de mercado tokenizado serio se evalúa
contra ellos, y por eso el [módulo 25](../../curriculum/25-mercados-capitales-onchain/README.md)
los usa como rúbrica.

Fuente: <https://www.bis.org/cpmi/publ/d101.htm>

## IOSCO: el problema de la integración vertical

En el mercado tradicional, **negociar, custodiar, liquidar y hacer de creador de mercado**
son actividades separadas por norma, precisamente para evitar conflictos de interés. Muchas
plataformas de criptoactivos las concentran en una sola entidad. Esa es la preocupación
característica del trabajo de IOSCO en la materia, y ayuda a entender por qué varios
episodios de fracaso del sector tuvieron **la misma forma**.

Fuente: <https://www.iosco.org/>

## FSB: stablecoins y pagos transfronterizos

Dos líneas relevantes: recomendaciones sobre **acuerdos globales de stablecoins** —gobernanza,
redención, reservas, gestión de riesgos y cooperación transfronteriza— y la **hoja de ruta
del G20 para pagos transfronterizos**, cuyo diagnóstico de cuatro fricciones (coste,
velocidad, acceso y transparencia) se usa como rúbrica en el
[módulo 23](../../curriculum/23-pagos-fx-onchain/README.md).

Fuente: <https://www.fsb.org/>

## Cómo usar estas fuentes sin equivocarse

1. **Cita el rango.** "El GAFI recomienda…", no "el GAFI obliga a…".
2. **Busca la norma nacional.** Lo aplicable a tu proyecto es la ley del país, no el estándar.
3. **Distingue investigación de estándar.** Un documento de trabajo del BIS es análisis;
   un estándar de Basilea es otra cosa. Ambos se publican en el mismo sitio web.
4. **Los proyectos del BIS Innovation Hub son experimentos**, no infraestructuras en
   producción. Cítalos como lo que son.

## Fuentes oficiales

- GAFI/FATF: <https://www.fatf-gafi.org/>
- BIS: <https://www.bis.org/> · Innovation Hub: <https://www.bis.org/about/bisih/about.htm>
- Comité de Basilea: <https://www.bis.org/bcbs/> · CPMI: <https://www.bis.org/cpmi/index.htm>
- IOSCO: <https://www.iosco.org/>
- FSB: <https://www.fsb.org/>
- FMI: <https://www.imf.org/en/Topics/fintech> · Banco Mundial: <https://remittanceprices.worldbank.org/>

---

## 🧭 Navegación

[⬅️ Regulación](../README.md) · [🌍 Comparación](../comparison/README.md) · [🇨🇱 Chile](../chile/README.md) · [📖 Módulo 27](../../curriculum/27-regulacion-cumplimiento/README.md)
