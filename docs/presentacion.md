# 🎤 Presentación del programa

> 🧭 [Volver al programa](../README.md) · [🌱 Empieza aquí](empieza-aqui.md) · [📚 Currículo](../curriculum/README.md) · [🧪 Laboratorios](../labs/CATALOG.md) · [📖 Glosario](glosario.md)

Este documento es la **fuente única** de la presentación del programa: de aquí salen,
sin escribirse dos veces, los tres formatos que se publican en cada despliegue:

| Formato | Para qué sirve | Dónde está |
|---|---|---|
| 🖥️ **Diapositivas (HTML)** | Proyectar desde el navegador, sin instalar nada | [presentacion.html](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/presentacion.html) |
| 🎞️ **Diapositivas (PDF)** | Proyectar sin conexión y repartir como material | [PRESENTACION.pdf](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/PRESENTACION.pdf) |
| 🧾 **Pauta del expositor (PDF)** | Guion hablado, tiempos y qué se ve en pantalla | [PAUTA.pdf](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/PAUTA.pdf) |

**Seis diapositivas, no más.** La muestra está pensada para exponerse en media hora:
seis láminas con letra grande y lo esencial en pantalla, y **todo el detalle en la
pauta**, que es el documento de apoyo que lee quien expone. Si necesitas profundizar en
un punto, el sitio y el [manual completo](https://vladimiracunadev-create.github.io/blockchain-learning-path/manual/MANUAL.pdf)
están a un enlace.

**Cómo se estructura cada diapositiva.** Cada sección numerada de abajo es una
diapositiva: el encabezado es su título, el cuerpo es **lo que se ve proyectado**
(letra grande, poco texto) y la cita final (`> **Pauta · N min.**`) es **lo que dice
quien expone** — no aparece en pantalla, solo en la pauta impresa. Los minutos de cada
diapositiva se suman automáticamente para calcular la duración total de la charla.

**Para generarlo todo desde el repositorio:**

```bash
pnpm build:presentacion
```

---

## 1 · Blockchain Learning Path

**De cero a la infraestructura financiera programable, en español.**

- 28 módulos secuenciales · 71 prácticas ejecutables · un proyecto final.
- Criptografía, Bitcoin, Ethereum, contratos, seguridad, producción, dinero y regulación.
- Web, manual en PDF y apps que **funcionan sin conexión**.
- Material **abierto**: código MIT, contenido CC BY 4.0.

> **Pauta · 2 min.** Preséntate y presenta el programa en una frase: es una ruta de
> aprendizaje completa, en español, que lleva a alguien desde no saber qué es un hash
> hasta poder discutir cómo se liquida un bono tokenizado. Aclara desde el principio el
> encuadre, antes de que alguien lo pregunte: **no es un curso de inversión ni de
> trading, es ingeniería**. Y menciona la licencia ya aquí: cualquiera puede usar esto
> en un aula sin pedir permiso, citando la fuente. Si el público es institucional, ese
> dato cambia la conversación desde el primer minuto.

## 2 · Qué enseña, y qué no

**Blockchain no es sinónimo de criptomoneda: esto enseña a decidir, no a especular.**

- Cuándo una cadena de bloques **aporta valor** y cuándo una base de datos es mejor.
- Cómo **construirla** con pruebas automatizadas, no con capturas de pantalla.
- Cómo **llevarla a una empresa**: infraestructura, costos, riesgo y cumplimiento.
- Qué cambia —y qué **no**— cuando el dinero y los valores se vuelven programables.

| Lo que hay dentro | Cuánto |
|---|---|
| Módulos secuenciales (00→27), en ocho etapas | **28** |
| Prácticas guiadas con evidencia y criterio de aceptación | **70** |
| Pruebas automatizadas que la CI ejecuta en cada cambio | **196** |

> **Pauta · 6 min.** Esta lámina fija el tono de toda la charla; es la más importante
> de las seis y merece que le dediques tiempo.
>
> Empieza por el encuadre. La mayoría del público llega con el ruido del precio de las
> monedas: hay que sacarlo de ahí en el primer minuto. Usa el ejemplo del módulo 00 —si
> el sistema tiene un dueño claro, hay confianza entre las partes y nadie necesita
> verificar nada por su cuenta, una base de datos tradicional es más barata, más rápida
> y más fácil de operar. La primera pregunta del programa no es "cómo", es "¿lo
> necesito?".
>
> Después baja a los cuatro puntos: decidir, construir, operar y entender el dinero
> programable. Ese es el arco completo, y es lo que separa este material de un curso de
> Solidity.
>
> Cierra con la tabla, sin leerla entera. Destaca dos números. **Las 71 prácticas**,
> porque significan que nadie termina el programa habiendo solo leído: cada una declara
> qué actividad hace, qué evidencia produce y con qué criterio se acepta. Y **las 196
> pruebas automatizadas**, porque significan que el material se comprueba ejecutándolo,
> no afirmándolo. Añade que esas cifras las verifica la propia integración continua: si
> alguien añade un módulo y no actualiza el texto, la comprobación falla y no se publica.

## 3 · Los 28 módulos en ocho etapas

**Cada módulo asume el anterior. Se estudian en orden.**

| Etapa | Módulos | Foco |
|---|---|---|
| **Orientación** | 00 | ¿Necesito blockchain? |
| **Fundamentos** | 01–03 | Criptografía, redes P2P, consenso |
| **Desarrollo** | 04–07 | Bitcoin, EVM, Solidity, dApps |
| **Profesional** | 08–11 | Tokens, seguridad, oráculos, DAO |
| **Avanzado** | 12–15 | L2, interoperabilidad, ZK, arquitectura |
| **Producción** | 16–18 | Infraestructura, empresa, implementación |
| **Finanzas on-chain** | 19–25 | DeFi, dinero, stablecoins, MDBC, pagos, tokenización |
| **Institucional** | 26–27 | Custodia, identidad digital, regulación |

> **Pauta · 7 min.** Este es el mapa del programa: deja que el público lo mire unos
> segundos en silencio antes de hablar.
>
> Explica primero la lógica del orden. No se puede entender una stablecoin sin entender
> un token, ni un token sin entender la EVM, ni la EVM sin entender firmas y hashes. La
> progresión no es un capricho editorial, es una cadena de dependencias, y por eso los
> módulos se enlazan uno al siguiente.
>
> Después recorre las etapas de arriba abajo, una frase por cada una:
>
> - **Fundamentos** (01–03): qué hace verificable a una cadena. Hash, firmas, Merkle,
>   propagación en red y consenso. Una blockchain no es mágica: es la composición de
>   tres cosas que ya existían por separado.
> - **Desarrollo** (04–07): el salto de entender a construir. UTXO en Bitcoin, cuentas y
>   gas en la EVM, contratos en Solidity probados con Foundry, y una dApp que firma,
>   envía y maneja los errores.
> - **Profesional** (08–11): escribir contratos que otros pueden auditar — estándares de
>   token, seguridad, oráculos y gobernanza con timelock.
> - **Avanzado** (12–15): cuando una cadena sola no alcanza. La idea que hay que dejar
>   clara es que **escalar no es gratis: se paga con supuestos de confianza**.
> - **Producción** (16–18): la etapa que casi ningún curso tiene y la que más pesa en una
>   entrevista. La pregunta que hunde proyectos no es técnica: "¿por qué esto justifica
>   su costo y su mantenimiento durante cinco años?".
> - **Finanzas on-chain** (19–25): DeFi, dinero y liquidación, stablecoins, depósitos
>   tokenizados y MDBC, pagos y FX, tokenización de activos reales y mercados de
>   capitales. Aquí es donde el programa se separa de la oferta habitual.
> - **Institucional** (26–27): custodia, identidad y regulación comparada —Chile, MiCA,
>   Estados Unidos, América Latina y estándares internacionales—. El cumplimiento no es
>   un trámite que se añade al final: es una restricción de diseño.
>
> Si vas corto de tiempo, este es el punto donde recortar: da las ocho etapas en dos
> frases y salta a la lámina 4.

## 4 · Cómo se aprende: un módulo y 70 laboratorios

**Los 28 módulos tienen la misma anatomía, y ninguno se aprueba solo leyendo.**

- 🎯 **Objetivos** medibles · 🗺️ **temas** con su porqué · 🧩 **esquema visual**.
- 🧠 **Modelo mental** con su analogía y los **límites** de la analogía.
- 🔬 **Profundización** con ejemplos numéricos · ⚠️ **errores frecuentes** (síntoma → causa).
- 🧪 **Laboratorio guiado** y ⚡ **reto verificable** con criterio de aceptación.
- 🔗 **Referencias** a fuentes primarias, con enlaces vivos y comprobados cada semana.
- **71 prácticas**: 43 con verificación ejecutable (`pnpm lab:*`), el resto con rúbrica.
- Contratos con **Foundry** (fuzzing e invariantes), dApp con **viem** e indexador.

> **Pauta · 7 min.** Aquí conviene abrir un módulo real en el sitio y recorrerlo con el
> cursor mientras hablas —el 01 de criptografía sirve—.
>
> Detente en dos secciones. La de **límites de la analogía**, porque las analogías mal
> cerradas son la principal fuente de malentendidos en este campo. Y la de **errores
> frecuentes**, escrita como síntoma → causa, que es como se depura de verdad.
>
> Menciona que cada módulo declara su fuente bibliográfica y que una comprobación
> automática exige un mínimo de tres enlaces a fuente primaria: sin eso, "según
> Antonopoulos" no significa nada. Las obras clave tienen edición legalmente gratuita,
> así que el programa se puede seguir sin comprar un solo libro.
>
> Sobre los laboratorios, explica por qué existe la columna **evidencia**: sin un
> artefacto concreto, "hice el laboratorio" no es comprobable ni por el alumno ni por un
> evaluador. Y aclara la mezcla deliberada: hay cosas que una máquina verifica mejor —un
> hash, una invariante— y otras que exigen criterio humano, como justificar una decisión
> de arquitectura. El programa no finge que todo se puede automatizar.
>
> Si tienes proyector y ganas, ejecuta uno en vivo. `pnpm lab:hash` encadena bloques por
> hash, altera un dato intermedio y deja inválidos todos los siguientes: treinta segundos
> de terminal explican la inmutabilidad mejor que diez diapositivas. Si el público es
> financiero, usa `pnpm lab:remesa`, que compara comisión a comisión el costo real de
> una remesa tradicional y una on-chain.

## 5 · Seguridad, casos reales y por qué creerle al material

**Primero se rompe el contrato, después se arregla. Y todo se verifica solo.**

- Contratos **vulnerables a propósito**, con su exploit ejecutable y su corrección.
- Reentrada, control de acceso, desbordamiento y dependencia de oráculos, con **Slither** en la CI.
- Cuatro casos reales con las cuentas hechas: **Terra/UST**, **FTX**, **puente Ronin** y **El Salvador**.
- **196 pruebas** en cada cambio, más comprobaciones de coherencia y de enlaces vivos.
- Los binarios se verifican **abriéndolos y contando el contenido**: un build en verde no prueba que la app lleve el curso dentro.

> **Pauta · 6 min.** Dos mensajes, y los dos importan.
>
> El primero es el orden de la seguridad: **primero el exploit, después el arreglo**.
> Quien solo leyó qué es la reentrada la reconoce en un examen; quien la ejecutó la
> reconoce en una revisión de código a las once de la noche. Explica el patrón con el
> ejemplo clásico: el contrato envía los fondos antes de anotar que ya los envió, y quien
> recibe vuelve a entrar en la misma función antes de que el saldo se actualice. Aclara
> el encuadre ético, que está escrito en el material: todo corre en local o en testnet,
> nunca con fondos ni claves reales.
>
> Los casos reales son la vacuna contra el entusiasmo sin fricción, y con público de
> negocio son el momento en que más te van a escuchar. Cada uno está escrito con la misma
> estructura: qué se prometió, qué mecanismo falló, qué señales había antes y qué decisión
> de diseño lo habría evitado. FTX es el más útil para cerrar el argumento del módulo 26:
> no cayó por un fallo criptográfico, cayó por custodia y controles.
>
> El segundo mensaje es el de confianza, y es el que distingue esto de un PDF publicado
> una vez. Cuenta la regla explícita del repositorio: **una compilación exitosa no
> demuestra que el artefacto contenga el material**, así que la integración continua abre
> el instalador y el APK y cuenta los módulos, las páginas y las preguntas que llevan
> dentro. Si sale vacío, la publicación falla en vez de entregar algo que se instala y
> abre en blanco.

## 6 · Para quién es, y cómo se empieza

**Nueve rutas, un proyecto final y cuatro formatos que salen del mismo build.**

- **Rutas por perfil:** desarrollo, arquitectura, auditoría, producto, investigación, empresa, DeFi, banca y cumplimiento.
- Cada ruta termina en un **entregable de portafolio**: dApp probada, ADR, informe de auditoría, ficha de riesgo.
- **Proyecto final**: protocolo probado, dApp, datos, arquitectura, modelo de amenazas y caso de negocio.
- **Llévatelo entero**: sitio web, manual PDF de ~385 páginas, app de Windows y APK de Android, sin conexión.
- **Empieza hoy:** abre *Empieza aquí* → haz el diagnóstico → módulo 00 y `pnpm lab:hash`.
- `github.com/vladimiracunadev-create/blockchain-learning-path`

> **Pauta · 5 min.** No enumeres las nueve rutas: pregunta al público a qué se dedica y
> comenta las dos o tres que aparezcan. El punto importante es el entregable — estudiar
> sin producir nada demostrable es tiempo que después no se puede acreditar.
>
> Del proyecto final subraya que no pide originalidad, pide criterio: decisiones
> justificadas y verificadas. Menciona el requisito que más incomoda y más enseña, el ADR
> que responde "¿por qué blockchain, y qué alternativa descarté?". Si la respuesta honesta
> es que bastaba una base de datos, el proyecto sigue siendo válido: lo que se evalúa es
> el razonamiento.
>
> Sobre los formatos, el argumento es la accesibilidad: las apps funcionan sin conexión,
> que es lo que importa en un aula sin wifi o en el metro, y las cuatro versiones salen
> del mismo build, así que ninguna se queda atrás. Sé transparente con la firma de código:
> los binarios no están firmados porque el certificado cuesta cientos de dólares al año,
> así que Windows y Android avisarán del origen desconocido; por eso se publica el SHA256.
>
> Cierra con una acción concreta, no con un agradecimiento. Si el público está frente a un
> computador, que abran la página de entrada ahí mismo y ejecuten el primer laboratorio
> antes de irse: quien ve funcionar algo suyo el primer día vuelve el segundo. Deja los
> enlaces en pantalla mientras respondes preguntas.
