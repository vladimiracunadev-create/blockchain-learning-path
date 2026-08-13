# 🇨🇱 Chile · Marco regulatorio de activos digitales y finanzas abiertas

> [⬅️ Regulación](../README.md) · [🏠 Programa](../../README.md) · [📖 Módulo 27](../../curriculum/27-regulacion-cumplimiento/README.md)

Revisado: **2026-08-12**.

> **Descargo.** Material **educativo**, no asesoría legal, tributaria ni regulatoria. Las
> obligaciones concretas dependen de la actividad, del instrumento y de los hechos. Verifica
> siempre en la fuente oficial vigente antes de decidir.

📄 **Documento complementario.** La vertiente **tributaria y de prevención**, con el detalle
de SII y UAF, vive en
[`docs/chile-regulacion-tributacion.md`](../../docs/chile-regulacion-tributacion.md). Esta
página **no lo duplica**: añade el Sistema de Finanzas Abiertas, el estado del trabajo sobre
MDBC y la lectura por rango normativo.

## Los cinco organismos y qué hace cada uno

| Organismo | Competencia relevante | Fuente oficial |
|---|---|---|
| **CMF** — Comisión para el Mercado Financiero | Supervisión de servicios financieros de la Ley Fintech, registro de prestadores, mercado de valores, Sistema de Finanzas Abiertas | <https://www.cmfchile.cl/> |
| **Banco Central de Chile** | Sistemas de pago, política monetaria, cambio internacional; análisis sobre MDBC | <https://www.bcentral.cl/> |
| **UAF** — Unidad de Análisis Financiero | Prevención de lavado de activos y financiamiento del terrorismo; sujetos obligados y reporte de operaciones sospechosas | <https://www.uaf.cl/> |
| **SII** — Servicio de Impuestos Internos | Tratamiento tributario de las operaciones con criptoactivos | <https://www.sii.cl/> |
| **SERNAC** | Protección de los derechos del consumidor en la comercialización | <https://www.sernac.cl/> |

## Ley 21.521 (Ley Fintech) — **rango: ley**

Norma central del marco chileno. Define un conjunto de **servicios financieros** sujetos a
inscripción en un registro y a supervisión de la CMF, e instaura el **Sistema de Finanzas
Abiertas**.

Texto oficial: [Biblioteca del Congreso Nacional — Ley Chile](https://www.bcn.cl/leychile).
Información de implementación y registro: [CMF](https://www.cmfchile.cl/).

### Qué aporta, en términos de mecanismo

1. **Regula actividades, no tecnología.** Lo relevante es qué haces —intermediar, custodiar,
   asesorar, operar una plataforma— con independencia de si usas una cadena de bloques.
2. **Registro y autorización.** Las entidades que prestan los servicios definidos deben
   inscribirse y cumplir requisitos de organización, gestión de riesgos y conducta,
   proporcionales a la actividad.
3. **Sistema de Finanzas Abiertas.** Marco para que, **con consentimiento del cliente**,
   proveedores autorizados accedan a información financiera e inicien pagos.

> **Cómo citarla bien.** La ley existe y está vigente; su **desarrollo normativo** (normas de
> carácter general, plazos de implementación, anexos técnicos) es materia de la CMF y **ha
> ido publicándose por etapas**. Consulta el estado vigente en la CMF antes de afirmar qué
> obligación aplica hoy a un servicio concreto.

## Sistema de Finanzas Abiertas — qué es y qué **no** es

**No es blockchain.** Es un marco de **interfaces de programación (API) y consentimiento**
sobre el sistema financiero existente. Se estudia en este programa porque es la otra vía por
la que una aplicación puede operar sobre dinero del usuario, y confundirla con el control de
llaves es un error grave de diseño y de comunicación.

| | Finanzas abiertas | Wallet de autocustodia |
|---|---|---|
| Qué autoriza | Acceso a datos o **iniciación de un pago en tu nombre** | Control directo del activo |
| Quién ejecuta | Una entidad supervisada | Tú, con tu clave |
| Revocable | **Sí**, el consentimiento se retira | No: la firma es irreversible |
| Si algo sale mal | Hay entidad responsable y vía de reclamación | No hay a quién reclamar |
| Alcance | Cuentas y pagos del sistema financiero | Activos en la cadena |

Piezas del modelo: **participantes** (proveedores de información, de servicios de iniciación
de pagos y proveedores de cuentas), **consentimiento** explícito, informado, con finalidad y
plazo, y **seguridad** de las interfaces. El detalle técnico y los plazos se publican en la
normativa e instrucciones de la CMF.

## MDBC — Moneda Digital de Banco Central

El **Banco Central de Chile** ha trabajado públicamente sobre la eventual emisión de una
MDBC, publicando documentos de análisis y abriendo el asunto a discusión.

> **La forma correcta de citarlo:** el Banco Central **ha analizado** la eventual emisión de
> una MDBC y ha publicado documentos sobre ello. **No se ha adoptado una decisión de
> emitir**, y **no existe una MDBC chilena en circulación**. Estado vigente en
> <https://www.bcentral.cl/>.

Presentar ese análisis como decisión adoptada, o describir características de "la MDBC
chilena" como si existiera, es exactamente el tipo de afirmación que este programa prohíbe.
El [laboratorio del módulo 22](../../labs/22-cbdc-mercado-tokenizado/README.md) es una
**simulación educativa** y así está etiquetado: no reproduce ningún sistema del Banco Central.

## Prevención de lavado y tributación

Ambas materias tienen su desarrollo, con fuentes y cuadros, en
[`docs/chile-regulacion-tributacion.md`](../../docs/chile-regulacion-tributacion.md). En
resumen y sin duplicar:

- **UAF**: determinadas actividades quedan como **sujetos obligados**, con deberes de
  identificación de clientes, conservación de registros y reporte de operaciones
  sospechosas. Los estándares del [GAFI](../international/README.md) son la referencia
  internacional que orienta el marco.
- **SII**: las ganancias por enajenación de criptoactivos pueden constituir renta afecta.
  El tratamiento depende de la operación y del contribuyente; consulta la normativa e
  instrucciones vigentes del SII.

## Las cinco preguntas, aplicadas a Chile

| Pregunta | Dónde buscar la respuesta |
|---|---|
| ¿Qué actividad realizo? | Catálogo de servicios de la Ley 21.521 y normativa de la CMF |
| ¿Qué instrumento manejo? | ¿Es un valor? Entonces aplica normativa de mercado de valores, no solo la Ley Fintech |
| ¿A quién me dirijo? | Público general activa protección al consumidor (SERNAC) y normas de comercialización |
| ¿Dónde están mis clientes? | Dirigirse a residentes en Chile suele bastar para quedar sujeto |
| ¿Qué riesgo genero? | Obligaciones ante UAF; riesgo de mercado y conducta ante CMF |

## Regla de mantenimiento

Revisa esta página **al menos una vez al año** y siempre que la CMF o el Banco Central
publiquen normativa relevante. Al actualizar: cambia la fecha de revisión, verifica cada
enlace, y **si una consulta pública se convirtió en norma, cambia su rango** — no basta con
retocar el texto.

## Fuentes oficiales

- Biblioteca del Congreso Nacional — textos legales vigentes: <https://www.bcn.cl/leychile>
- CMF — normativa, registro de prestadores e implementación Fintech: <https://www.cmfchile.cl/>
- Banco Central de Chile — sistemas de pago, publicaciones y MDBC: <https://www.bcentral.cl/>
- UAF — prevención de lavado de activos: <https://www.uaf.cl/>
- SII — normativa tributaria: <https://www.sii.cl/>

---

## 🧭 Navegación

[⬅️ Regulación](../README.md) · [🌍 Comparación](../comparison/README.md) · [📖 Módulo 27](../../curriculum/27-regulacion-cumplimiento/README.md) · [🏠 Programa](../../README.md)
