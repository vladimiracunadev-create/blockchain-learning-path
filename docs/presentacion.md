# 🎤 Presentación del programa

> 🧭 [Volver al programa](../README.md) · [🌱 Empieza aquí](empieza-aqui.md) · [📚 Currículo](../curriculum/README.md) · [🧪 Laboratorios](../labs/CATALOG.md) · [📖 Glosario](glosario.md)

Este documento es la **fuente única** de la presentación del programa: de aquí salen,
sin escribirse dos veces, los tres formatos que se publican en cada despliegue:

| Formato | Para qué sirve | Dónde está |
|---|---|---|
| 🖥️ **Diapositivas (HTML)** | Proyectar desde el navegador, sin instalar nada | [presentacion.html](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/presentacion.html) |
| 🎞️ **Diapositivas (PDF)** | Proyectar sin conexión y repartir como material | [PRESENTACION.pdf](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/PRESENTACION.pdf) |
| 🧾 **Pauta del expositor (PDF)** | Guion hablado, tiempos, demo y anexos | [PAUTA.pdf](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/PAUTA.pdf) |

**Siete diapositivas, no más.** La muestra está pensada para exponerse de una sentada:
siete láminas con letra grande y lo esencial en pantalla, y **todo el detalle en la
pauta**, que es el documento de apoyo que lee quien expone. Si necesitas profundizar en
un punto, el sitio y el [manual completo](https://vladimiracunadev-create.github.io/blockchain-learning-path/manual/MANUAL.pdf)
están a un enlace.

**Cómo se estructura este documento.** Tiene dos clases de secciones:

- **`## N · Título` es una diapositiva.** El encabezado es su título, el cuerpo es **lo
  que se ve proyectado** (letra grande, poco texto) y la cita final (`> **Pauta · N
  min.**`) es **lo que dice quien expone** — no aparece en pantalla, solo en la pauta
  impresa. Los minutos de cada diapositiva se suman automáticamente para calcular la
  duración total de la charla.
- **`## Anexo · Título` es material del expositor.** No se proyecta nunca: se imprime al
  final de la pauta. Ahí van la comprobación previa, los recortes según el tiempo que
  tengas, las preguntas que va a hacer el público y las líneas que no se cruzan.

**Para generarlo todo desde el repositorio:**

```bash
pnpm build:presentacion
```

---

## 1 · Blockchain Learning Path

**De cero a la infraestructura financiera programable, en español.**

- 29 módulos secuenciales · 83 prácticas ejecutables · un proyecto final.
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
>
> Cierra el minuto con las dos reglas de la sesión, que ahorran interrupciones después:
> **cuánto va a durar** —treinta y cinco minutos si las das todas— y **cuándo se
> preguntan las cosas**. Si el grupo es pequeño, di que interrumpan cuando quieran; si es
> un comité o una sala grande, pide las preguntas para el final y sé fiel a eso.

## 2 · Qué enseña, y qué no

**Blockchain no es sinónimo de criptomoneda: esto enseña a decidir, no a especular.**

- Cuándo una cadena de bloques **aporta valor** y cuándo una base de datos es mejor.
- Cómo **construirla** con pruebas automatizadas, no con capturas de pantalla.
- Cómo **llevarla a una empresa**: infraestructura, costos, riesgo y cumplimiento.
- Qué cambia —y qué **no**— cuando el dinero y los valores se vuelven programables.

| Lo que hay dentro | Cuánto |
|---|---|
| Módulos secuenciales (00→28), en nueve etapas | **29** |
| Prácticas guiadas con evidencia y criterio de aceptación | **83** |
| Preguntas de autoevaluación, corregidas al instante | **117** |
| Pruebas automatizadas que la CI ejecuta en cada cambio | **327** |

> **Pauta · 6 min.** Esta lámina fija el tono de toda la charla; es la más importante de
> las siete y merece que le dediques tiempo. Es también la única que **nunca** se recorta.
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
> Cierra con la tabla, sin leerla entera. Destaca dos números. **Las 83 prácticas**,
> porque significan que nadie termina el programa habiendo solo leído: cada una declara
> qué actividad hace, qué evidencia produce y con qué criterio se acepta. Y **las 327
> pruebas automatizadas**, porque significan que el material se comprueba ejecutándolo,
> no afirmándolo. Añade que esas cifras las verifica la propia integración continua: si
> alguien añade un módulo y no actualiza el texto, la comprobación falla y no se publica.

## 3 · Los 29 módulos en nueve etapas

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
| **Analítica de datos** | 28 | Minería de datos on-chain, grafos, patrones, anomalías |

Entre el 04 y el 05 se cruza **Wallets desde cero**: uso, seguridad y recuperación.

> **Pauta · 6 min.** Este es el mapa del programa: deja que el público lo mire unos
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
> - **Analítica de datos** (28): leer la propia cadena como fuente de datos —grafos,
>   patrones y detección de anomalías— y, sobre todo, saber qué NO se puede concluir:
>   una dirección no es una persona y un patrón no es una prueba.
>
> No te saltes la línea del pie, aunque parezca menor: entre el módulo 04 y el 05 hay una
> **unidad transversal sobre wallets** —qué es, cómo se usa sin perder los fondos y qué
> hacer cuando algo sale mal— porque el punto donde más gente abandona no es la
> criptografía: es la primera vez que tiene que firmar algo de verdad.
>
> Si vas corto de tiempo, este es el punto donde recortar: da las nueve etapas en dos
> frases y salta a la lámina 4.

## 4 · Cómo se aprende: un módulo y 83 laboratorios

**Los 29 módulos tienen la misma anatomía, y ninguno se aprueba solo leyendo.**

- 🎯 **Objetivos** medibles · 🗺️ **temas** con su porqué · 🧩 **esquema visual**.
- 🧠 **Modelo mental** con su analogía y los **límites** de la analogía.
- 🔬 **Profundización** con ejemplos numéricos · ⚠️ **errores frecuentes** (síntoma → causa).
- 🧪 **Laboratorio guiado** y ⚡ **reto verificable** con criterio de aceptación.
- 🔗 **Referencias** a fuentes primarias, con enlaces vivos y comprobados cada semana.
- **83 prácticas**: 55 con verificación ejecutable (`pnpm lab:*`), el resto con rúbrica.
- Contratos con **Foundry** (fuzzing e invariantes), dApp con **viem** e indexador.

> **Pauta · 6 min.** Aquí conviene abrir un módulo real en el sitio y recorrerlo con el
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
> Cierra anunciando lo que viene: "y para que esto no se quede en una promesa, vamos a
> ejecutar dos de esas prácticas ahora mismo". Pasa a la lámina 5 **antes** de cambiar a
> la terminal, no al revés: así el público tiene los números delante mientras tú buscas
> la ventana.

## 5 · Demo en vivo: 90 segundos de terminal

**Nada de esto es una promesa: se ejecuta delante del público.**

- `pnpm lab:hash` — encadena bloques, altera un dato y **todos los siguientes quedan inválidos**.
- `pnpm lab:remesa` — desglosa comisión a comisión el costo real de enviar 200 USD.

| Remesa de 200 USD | Costo | Sobre el envío |
|---|---|---|
| Vía tradicional (cuatro comisiones) | 12.00 | **6.0 %** |
| Corredor on-chain, última milla barata | 2.80 | 1.4 % |
| Corredor on-chain, última milla cara | 13.30 | 6.7 % |

- De esos 12.00, **6.50 no se anuncian como comisión**: van en el margen de cambio.
- **El tramo que la cadena no toca —la última milla— decide el resultado.**

> **Pauta · 4 min.** Es la lámina que más convence y la que más fácil se rompe: por eso
> los números están impresos en pantalla. **Si la terminal falla, no la arregles delante
> del público** — señala la tabla, cuenta el resultado y sigue. La demo es el adorno; el
> argumento es la tabla.
>
> Elige **una** demo según a quién tengas delante, no las dos:
>
> - **Público técnico o mixto** → `pnpm lab:hash`. Treinta segundos de terminal explican
>   la inmutabilidad mejor que diez diapositivas: se ven los bloques encadenados por
>   hash, se cambia un dato de en medio y la verificación pasa a `false`. Di en voz alta
>   la conclusión, que es lo que se recuerda: nadie "borra" un bloque; lo que ocurre es
>   que **falsificarlo obliga a rehacer todo lo que viene después**.
> - **Público financiero o de negocio** → `pnpm lab:remesa`. Recorre la tabla de arriba
>   abajo. Primero el 6 %, y sobre todo la línea de los 6.50 que no se anuncian: el
>   margen de cambio es una comisión que no se llama comisión. Después las dos versiones
>   on-chain, y detente ahí — **la misma tecnología gana y pierde según la última milla**,
>   es decir, según cómo recibe el dinero quien está al otro lado.
>
> Ese contraste es el argumento honesto del programa entero, y conviene decirlo con estas
> palabras: aquí no se vende que la cadena arregle el problema, se enseña a **calcular qué
> parte arregla**. Un vendedor te habría enseñado solo la fila del 2.80.
>
> Añade que el cálculo es determinista y sin red: mismos datos, mismo resultado, sin
> claves ni fondos reales. Cualquiera puede reproducirlo después de la charla con dos
> comandos, y **eso es exactamente lo que hay que pedirles que hagan** en la lámina 7.
>
> Detalle de oficio: ejecuta las dos órdenes **antes** de que entre el público. La primera
> ejecución siempre tarda más, y ese silencio se hace largo.

## 6 · Seguridad, casos reales y por qué creerle al material

**Primero se rompe el contrato, después se arregla. Y todo se verifica solo.**

- Contratos **vulnerables a propósito**, con su exploit ejecutable y su corrección.
- Reentrada, control de acceso, desbordamiento y dependencia de oráculos, con **Slither** en la CI.
- Cuatro casos reales con las cuentas hechas: **Terra/UST**, **FTX**, **puente Ronin** y **El Salvador**.
- **327 pruebas** en cada cambio, más comprobaciones de coherencia y de enlaces vivos.
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

## 7 · Para quién es, y cómo se empieza

**Nueve rutas, un proyecto final y cuatro formatos que salen del mismo build.**

- **Rutas por perfil:** desarrollo, arquitectura, auditoría, producto, investigación, empresa, DeFi, banca y cumplimiento.
- Cada ruta termina en un **entregable de portafolio**: dApp probada, ADR, informe de auditoría, ficha de riesgo.
- **Proyecto final**: protocolo probado, dApp, datos, arquitectura, modelo de amenazas y caso de negocio.
- **Llévatelo entero**: sitio web, manual PDF de ~400 páginas, app de Windows y APK de Android, sin conexión.
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
> enlaces en pantalla mientras respondes preguntas, y ten a mano el anexo de preguntas
> frecuentes: casi todas las que te van a hacer están ahí con la respuesta ya pensada.

## Anexo · Antes de empezar: la comprobación de los diez minutos previos

Nada de esto es opcional si la charla es hoy. En orden, con el proyector ya conectado:

1. **Proyector en 16:9** y `PRESENTACION.pdf` a pantalla completa. Las láminas miden
   1280×720 px exactos: en una pantalla 4:3 saldrán con banda negra arriba y abajo, que
   es preferible a dejar que el visor las recorte.
2. **La pauta en otro sitio.** Impresa o en el segundo monitor, nunca en la pantalla que
   proyectas. Si solo tienes una pantalla, imprímela: son pocas hojas.
3. **Terminal abierta en el repositorio**, con letra grande (18 pt o más) y `pnpm install`
   ya ejecutado. Nadie lee una fuente de 11 pt desde la quinta fila.
4. **Ensaya la demo una vez**, en silencio, antes de que entre el público: `pnpm lab:hash`
   y `pnpm lab:remesa`. La primera ejecución de Node siempre tarda más, y ese silencio se
   hace eterno en público.
5. **Pestañas abiertas y en este orden**: el sitio del programa, el módulo 01, el catálogo
   de laboratorios y el caso de FTX. Cierra todo lo demás.
6. **Plan B sin wifi**: ten descargados `PRESENTACION.pdf` y `MANUAL.pdf`, y la app de
   escritorio o el APK instalados. Si la sala se queda sin red y tú sigues, acabas de
   demostrar el argumento de la lámina 7 sin decir una palabra.
7. **Silencia las notificaciones** del sistema y del móvil, y cierra el correo si vas a
   compartir pantalla.

Un último detalle que se olvida siempre: **ten el enlace del repositorio en un formato que
se pueda copiar** —un mensaje al chat de la sala, un código QR en el móvil—, porque cuando
termines te lo van a pedir y dictarlo letra a letra queda mal.

## Anexo · Si tienes más o menos tiempo

La charla completa son las siete láminas, unos **35 minutos** sin contar preguntas.
Cuando el hueco es otro, esto es lo que se hace:

| Tienes | Qué proyectas | Qué sacrificas |
|---|---|---|
| **10 min** (comité, pasillo) | 1 · 2 · 7 | La demo y el mapa; queda un solo dato: 29 módulos, 83 prácticas y todo verificado en CI |
| **20 min** | 1 · 2 · 3 (en dos frases) · 5 (solo la remesa) · 7 | La anatomía del módulo y media lámina de seguridad |
| **35 min** (completa) | Las siete, con los tiempos de esta pauta | Nada |
| **50 min** (clase) | Las siete, un módulo real abierto en el sitio y las dos demos | Nada; sobra tiempo para preguntas largas |

Reglas de recorte, por si hay que decidir en caliente:

- **La lámina 2 no se toca nunca.** Es la que fija el encuadre; sin ella la charla parece
  una promoción de criptomonedas.
- **La lámina 3 es la que mejor se comprime**: nueve etapas en dos frases y adelante.
- **Antes de quitar la demo, quita minutos de la 4.** Quien ve ejecutarse algo recuerda la
  charla; quien solo ve viñetas, no.
- Si te pasas de tiempo, **no aceleres: corta**. Salta a la lámina 7, di la acción concreta
  y deja los enlaces en pantalla. Terminar puntual es parte del argumento.

## Anexo · Las preguntas que te van a hacer

Casi todas las preguntas de una sala caen en esta lista. Las respuestas están pensadas
para decirse en voz alta, no para leerse:

| Te preguntan | Qué respondes |
|---|---|
| ¿Esto enseña a invertir o a hacer trading? | No, y es deliberado. Enseña a decidir si la tecnología aplica, a construirla con pruebas y a operarla. No hay una sola recomendación de compra en todo el material |
| ¿No estará obsoleto en seis meses? | Los fundamentos —hash, firmas, consenso, UTXO, EVM— llevan años estables. Lo que cambia rápido está fechado y con fuente, y hay un historial de cambios: el Merge, Dencun y Pectra ya están incorporados |
| ¿Cuánto tiempo lleva? | El plan es de 26 semanas a ritmo de curso, y hay una ruta rápida para quien ya programa. Nadie tiene que hacerlo entero: las rutas por perfil recortan a lo que necesitas |
| ¿Necesito saber programar? | Para los módulos 00–05, no. Desde el 06 hace falta JavaScript básico. Y hay rutas —producto, cumplimiento— que llegan al final sin escribir contratos |
| ¿Por qué en español? | Porque casi todo el material serio del área está en inglés, y eso deja fuera a mucha gente que sí puede hacer este trabajo. Los términos técnicos se mantienen en inglés y se traducen la primera vez que aparecen |
| ¿Quién garantiza que esto sigue vivo? | La integración continua: pruebas en cada cambio, enlaces externos revisados cada semana y las cifras del material comprobadas contra los archivos. Si algo se rompe, no se publica |
| ¿Puedo usarlo en mi institución o en mi empresa? | Sí, sin pedir permiso: código MIT y contenido CC BY 4.0, citando la fuente. Hay guía del instructor, syllabus, rúbricas y checklist de laboratorios |
| ¿Y la regulación de mi país? | Hay una carpeta de regulación con Chile, MiCA, Estados Unidos, LatAm y estándares internacionales, y cada afirmación declara su rango, su fuente oficial y su fecha. No sustituye a un abogado, y así está escrito |
| ¿Da certificado? | El propio repositorio genera un certificado de progreso a partir de la evidencia de los laboratorios. No es una acreditación oficial y no lo presentamos como tal |
| ¿Cuánto cuesta? | Nada. Y las obras de referencia clave tienen edición legalmente gratuita, así que se puede seguir entero sin comprar un libro |

Si te preguntan algo que no sabes, la respuesta correcta es **"no lo sé, está en el módulo
tal, te lo mando"**. En un tema con tanto vendedor, admitir un límite suma credibilidad;
improvisar una cifra la destruye para el resto de la sesión.

## Anexo · Lo que no hay que prometer

Este material se sostiene sobre lo que **no** afirma. Cuatro líneas que no se cruzan,
aunque la pregunta invite a cruzarlas:

- **Nada de rentabilidad, precios ni recomendaciones.** Ni siquiera en broma, ni siquiera
  respondiendo a "¿y tú qué comprarías?". El programa no es asesoría financiera, y decirlo
  en voz alta es parte de la charla.
- **No llames "auditados" a los contratos del curso.** Son material didáctico probado con
  Foundry y revisado con Slither; algunos son vulnerables **a propósito**. Auditar es otra
  cosa y cuesta dinero.
- **No des asesoría legal ni tributaria.** La carpeta de regulación cita norma, rango y
  fecha para que alguien informado pueda buscar; ahí termina su alcance.
- **No inventes cifras.** Las del programa están en la lámina 2 y en esta pauta. Si te
  piden una que no tienes —cuántos alumnos, cuántas horas exactas, qué salario— di que no
  la tienes.

Y una tentación que no es una promesa pero se le parece: **no vendas blockchain a quien no
la necesita**. Si alguien del público describe un problema que se resuelve con una base de
datos, díselo. Es literalmente la primera lección del módulo 00, y hacerlo en directo vale
más que las siete láminas juntas.
