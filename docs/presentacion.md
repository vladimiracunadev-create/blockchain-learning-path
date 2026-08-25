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

- **`## N · Título` es una diapositiva.** El encabezado es su título y el cuerpo es **lo
  que se ve proyectado** (letra grande, poco texto). La cita que la cierra
  (`> **Pauta · N min.**`) no aparece en pantalla: es el libreto, y va dividido en dos
  bloques obligatorios que **no son lo mismo y no se leen igual**:
  - **`### Guion`** — lo que se pronuncia, **palabra por palabra**. Cada párrafo es una
    intervención y se numera sola en la pauta impresa, para volver al sitio exacto
    después de levantar la vista.
  - **`### Indicaciones`** — las acotaciones de escena: qué abrir, dónde detenerse, qué
    recortar, qué no hacer. **Nada de esto se dice en voz alta.**

  Los minutos de cada diapositiva se suman automáticamente para calcular la duración
  total de la charla.
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

> **Pauta · 2 min.**
>
> ### Guion
>
> Buenos días, y gracias por el rato. Soy Vladimir Acuña, y les voy a mostrar un programa
> de formación en blockchain, en español, que está publicado y que se puede empezar a usar
> hoy mismo.
>
> La frase que lo resume es esta: lleva a una persona desde no saber qué es un hash hasta
> poder sentarse en una reunión y discutir cómo se liquida un bono tokenizado.
>
> Y antes de que nadie lo pregunte, lo aclaro yo: esto no es un curso de inversión ni de
> trading. No hay una sola recomendación de compra en todo el material. Esto es ingeniería.
>
> Son veintinueve módulos que se estudian en orden, ochenta y tres prácticas que se
> ejecutan, y un proyecto final.
>
> Está disponible en la web, en un manual en PDF, y en dos aplicaciones —una de Windows y
> una de Android— que funcionan sin conexión.
>
> Y es material abierto: el código con licencia MIT y el contenido con Creative Commons.
> Cualquiera de ustedes puede llevárselo a su aula o a su equipo sin pedirme permiso,
> citando la fuente.
>
> Vamos a estar treinta y cinco minutos.
>
> **Si el grupo es pequeño:** Interrúmpanme cuando quieran, no hace falta esperar al final.
>
> **Si es un comité o una sala grande:** Les pido que guardemos las preguntas para el
> final, así llegamos con tiempo a todo.
>
> ### Indicaciones
>
> - Si quieres añadir una línea de credenciales tuyas, va después de la intervención 1 —
>   una sola frase, y sigue. Nadie vino a oír tu currículum.
> - Elige **una** de las dos versiones finales —la 8 o la 9— y cúmplela el resto de la
>   charla. Prometer preguntas al final y luego aceptarlas a mitad rompe el tiempo.
> - Si el público es institucional, haz una pausa de medio segundo después de decir
>   "sin pedirme permiso": es el dato que les cambia la conversación.
> - No entres todavía en el mapa de módulos. Aquí solo se abre la puerta.

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

> **Pauta · 6 min.**
>
> ### Guion
>
> Empecemos por lo que más ruido hace. Cuando uno dice "blockchain", la mayoría de la
> gente piensa en el precio de una moneda. Este programa no va de eso, y quiero sacarlo
> del medio en el primer minuto.
>
> La primera pregunta que hace el programa no es "cómo se hace". Es: "¿de verdad lo
> necesito?".
>
> Y la respuesta honesta, muchas veces, es que no. Si un sistema tiene un dueño claro, si
> las partes confían entre ellas y si nadie necesita verificar nada por su cuenta, una
> base de datos de toda la vida es más barata, más rápida y más fácil de operar.
>
> Eso no es una opinión mía para quedar bien: es literalmente el módulo cero, el primero
> que hace todo el mundo.
>
> A partir de ahí, el programa hace cuatro cosas.
>
> La primera es enseñar a decidir: cuándo una cadena de bloques aporta valor y cuándo no.
>
> La segunda es enseñar a construirla, con pruebas automatizadas. No con una captura de
> pantalla de que un día funcionó.
>
> La tercera es enseñar a llevarla a una empresa: infraestructura, costos, riesgo y
> cumplimiento. Esa parte casi nunca está en los cursos.
>
> Y la cuarta es entender qué cambia —y sobre todo qué no cambia— cuando el dinero y los
> valores se vuelven programables.
>
> Sobre los números de la tabla, no los voy a leer todos. Me quedo con dos.
>
> Ochenta y tres prácticas. Eso significa que nadie termina este programa habiendo
> solamente leído. Cada práctica dice qué hay que hacer, qué evidencia hay que producir y
> con qué criterio se acepta.
>
> Y trescientas veintisiete pruebas automatizadas. Eso significa que el material se
> comprueba ejecutándolo, no afirmándolo.
>
> Y hay un detalle que para mí es lo más importante de esta lámina: esas cifras las
> verifica la propia integración continua. Si alguien añade un módulo y no actualiza este
> número, la comprobación falla y el material no se publica. El número que están viendo no
> es un número de folleto.
>
> ### Indicaciones
>
> - Esta lámina fija el tono de toda la charla. Es la más importante de las siete y la
>   única que **nunca** se recorta.
> - No leas la tabla entera. Señala solo las dos filas que vas a comentar.
> - Si alguien interrumpe preguntando por precios o por invertir, contesta con la
>   respuesta del anexo de preguntas y vuelve inmediatamente a la intervención donde
>   estabas.
> - Marca con la voz el contraste "qué cambia / qué no cambia": es la idea que sostiene la
>   segunda mitad del programa.

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

> **Pauta · 6 min.**
>
> ### Guion
>
> Este es el mapa completo. Denle unos segundos, porque es todo lo que vamos a recorrer.
>
> Veintinueve módulos, agrupados en nueve etapas, y se estudian en orden.
>
> El orden no es un capricho editorial: es una cadena de dependencias. No se puede
> entender una stablecoin sin entender antes un token, ni un token sin entender la máquina
> virtual de Ethereum, ni esa máquina sin entender firmas y hashes.
>
> Fundamentos, del uno al tres: qué es lo que hace verificable a una cadena. Hash, firmas,
> árboles de Merkle, propagación en la red y consenso. Una blockchain no es magia: es la
> composición de tres cosas que ya existían por separado.
>
> Desarrollo, del cuatro al siete: aquí se pasa de entender a construir. Bitcoin y su
> modelo de UTXO, cuentas y gas en Ethereum, contratos en Solidity probados con Foundry, y
> una aplicación que firma, envía y sabe manejar los errores.
>
> Profesional, del ocho al once: escribir contratos que otra persona pueda auditar.
> Estándares de token, seguridad, oráculos y gobernanza con retardo temporal.
>
> Avanzado, del doce al quince: qué se hace cuando una cadena sola no alcanza. Y la idea
> que me interesa que se lleven de esta etapa es que escalar no sale gratis: se paga con
> supuestos de confianza.
>
> Producción, del dieciséis al dieciocho. Esta es la etapa que casi ningún curso tiene, y
> es la que más pesa en una entrevista de trabajo. Porque la pregunta que hunde proyectos
> no es técnica: es "¿por qué esto justifica su costo y su mantenimiento durante los
> próximos cinco años?".
>
> Finanzas on-chain, del diecinueve al veinticinco: DeFi, dinero y liquidación,
> stablecoins, depósitos tokenizados y monedas digitales de banco central, pagos y cambio
> de divisas, tokenización de activos reales y mercados de capitales. Aquí es donde este
> programa se separa de la oferta habitual.
>
> Institucional, veintiséis y veintisiete: custodia, identidad digital y regulación
> comparada —Chile, Europa con MiCA, Estados Unidos, América Latina y los estándares
> internacionales—. Y una idea que atraviesa toda esta etapa: el cumplimiento no es un
> trámite que se añade al final, es una restricción de diseño.
>
> Y la novena etapa, el módulo veintiocho: leer la propia cadena como fuente de datos.
> Grafos, patrones, detección de anomalías. Y sobre todo, saber qué no se puede concluir:
> una dirección no es una persona, y un patrón no es una prueba.
>
> Me falta una línea, la de abajo, que parece menor y no lo es. Entre el módulo cuatro y
> el cinco hay una unidad sobre wallets: qué son, cómo se usan sin perder los fondos y qué
> hacer cuando algo sale mal.
>
> La puse ahí porque el punto donde más gente abandona no es la criptografía. Es la
> primera vez que tiene que firmar algo de verdad.
>
> ### Indicaciones
>
> - Después de la intervención 1, **cállate tres o cuatro segundos** y deja que lean el
>   mapa. Es la única pausa larga de la charla.
> - Una intervención por etapa y avanza. No te enredes en ninguna: cada una tiene su
>   propio módulo si alguien pregunta.
> - **Este es el punto por donde se recorta si vas corto.** Di las nueve etapas en dos
>   frases —"de fundamentos a producción, y después toda la parte financiera y
>   regulatoria"— y salta a la lámina 4.
> - Si el público es de banca o de sector público, alarga la etapa de finanzas on-chain y
>   acorta la de desarrollo. Si es técnico, al revés.

## 4 · Cómo se aprende: un módulo y 83 laboratorios

**Los 29 módulos tienen la misma anatomía, y ninguno se aprueba solo leyendo.**

- 🎯 **Objetivos** medibles · 🗺️ **temas** con su porqué · 🧩 **esquema visual**.
- 🧠 **Modelo mental** con su analogía y los **límites** de la analogía.
- 🔬 **Profundización** con ejemplos numéricos · ⚠️ **errores frecuentes** (síntoma → causa).
- 🧪 **Laboratorio guiado** y ⚡ **reto verificable** con criterio de aceptación.
- 🔗 **Referencias** a fuentes primarias, con enlaces vivos y comprobados cada semana.
- **83 prácticas**: 55 con verificación ejecutable (`pnpm lab:*`), el resto con rúbrica.
- Contratos con **Foundry** (fuzzing e invariantes), dApp con **viem** e indexador.

> **Pauta · 6 min.**
>
> ### Guion
>
> Ya vieron qué se enseña. Ahora les quiero mostrar cómo.
>
> Los veintinueve módulos tienen exactamente la misma anatomía. Uno aprende a leer uno y
> después ya sabe dónde está cada cosa en todos los demás.
>
> Objetivos medibles, los temas con su porqué, un esquema visual, y un modelo mental con
> su analogía.
>
> Y aquí me quiero detener, porque es la sección de la que estoy más orgulloso: cada
> analogía viene acompañada de otra que dice dónde deja de servir.
>
> Las analogías mal cerradas son la principal fuente de malentendidos en este campo.
> "Blockchain es como un libro contable compartido" — hasta que deja de serlo, y conviene
> saber exactamente en qué punto.
>
> Después viene la profundización, con ejemplos numéricos, y los errores frecuentes,
> escritos como síntoma y causa. No como una lista de consejos: síntoma, y causa. Que es
> como se depura de verdad.
>
> Cada módulo declara además de dónde saca lo que afirma. Y hay una comprobación
> automática que exige un mínimo de tres enlaces a fuente primaria, porque "según
> Antonopoulos", sin enlace, no significa nada.
>
> Y como varias de esas obras tienen edición legalmente gratuita, el programa se puede
> seguir entero sin comprar un solo libro.
>
> Luego están las ochenta y tres prácticas. Cincuenta y cinco se verifican solas, con un
> comando. Las demás producen una evidencia que se revisa con una rúbrica.
>
> Esa mezcla es deliberada. Hay cosas que una máquina verifica mejor que una persona: un
> hash, una invariante de un contrato. Y hay otras que exigen criterio humano, como
> justificar una decisión de arquitectura. Este programa no finge que todo se puede
> automatizar.
>
> Fíjense también en que todas las prácticas tienen una columna que dice "evidencia". Sin
> un artefacto concreto, "hice el laboratorio" no es comprobable, ni para quien estudia ni
> para quien evalúa.
>
> Y para que esto no se quede en una promesa mía, vamos a ejecutar dos de esas prácticas
> ahora mismo.
>
> ### Indicaciones
>
> - Abre un módulo real en el sitio —el 01 de criptografía sirve— y recórrelo con el
>   cursor mientras hablas las intervenciones 3 a 7.
> - Detente físicamente en dos sitios de la pantalla: **límites de la analogía** y
>   **errores frecuentes**. Son las dos secciones que venden el material.
> - Después de la intervención 12, **pasa a la lámina 5 antes de cambiar a la terminal**.
>   Así el público se queda con los números delante mientras tú buscas la ventana.
> - Si vas justo de tiempo, esta lámina admite perder dos minutos: quita las
>   intervenciones 7 y 8 (bibliografía) y no se nota.

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

> **Pauta · 4 min.**
>
> ### Guion
>
> Esto no lo tienen que creer porque yo lo diga. Lo vamos a ejecutar aquí, ahora.
>
> **Demo A · público técnico o mixto — `pnpm lab:hash`**
>
> Lo que ven aquí es una cadena de dos bloques. Cada bloque guarda el hash del bloque
> anterior; ese es todo el truco.
>
> Ahora voy a cambiar un dato de en medio... y fíjense en la última línea: la verificación
> acaba de pasar a "falso".
>
> Esto es lo que quiere decir "inmutable", y no es que no se pueda cambiar. Es que
> falsificar un bloque obliga a rehacer todos los que vienen después.
>
> **Demo B · público financiero o de negocio — `pnpm lab:remesa`**
>
> Vamos a contar cuánto cuesta de verdad enviar doscientos dólares a otro país.
>
> Por la vía tradicional: cinco dólares de comisión de envío, cinco de margen de cambio,
> uno con cincuenta de bancos intermedios y cincuenta centavos de retiro en destino. Doce
> dólares. Un seis por ciento del envío.
>
> Y de esos doce dólares, seis con cincuenta no se anuncian nunca como comisión: van
> escondidos dentro del tipo de cambio.
>
> Ahora el mismo envío por un corredor on-chain, con una última milla barata: dos con
> ochenta. Gana la cadena, y gana por mucho.
>
> Pero el mismo envío otra vez, con una última milla cara —efectivo, poca competencia en
> el país de destino—: trece con treinta. Pierde la cadena.
>
> **Cierre común a las dos demos**
>
> Y ese es el argumento honesto de todo el programa. El tramo que la cadena no toca es el
> que decide el resultado.
>
> Aquí no les estoy vendiendo que la tecnología arregle el problema. Les estoy enseñando a
> calcular qué parte arregla. Un vendedor les habría enseñado solo la fila de los dos con
> ochenta.
>
> Y esto es determinista y sin red: mismos datos, mismo resultado, sin claves y sin fondos
> reales. Lo pueden reproducir ustedes con dos comandos cuando salgan de aquí.
>
> ### Indicaciones
>
> - **Elige una sola demo**, la A o la B, según el público. No hagas las dos: no hay
>   tiempo y se diluye el remate.
> - Los números están impresos en la lámina. **Si la terminal falla, no la arregles
>   delante del público**: señala la tabla, di el cierre común y sigue. La demo es el
>   adorno; el argumento es la tabla.
> - En la demo B, apunta con el cursor a la fila de los 6.50 antes de decirlo: es la cifra
>   que la gente no había visto nunca.
> - Después del contraste 2.80 / 13.30, **haz una pausa** antes del cierre. Es el remate de
>   toda la charla.
> - Ejecuta las dos órdenes una vez **antes de que entre el público**: la primera ejecución
>   tarda más y ese silencio se hace largo.

## 6 · Seguridad, casos reales y por qué creerle al material

**Primero se rompe el contrato, después se arregla. Y todo se verifica solo.**

- Contratos **vulnerables a propósito**, con su exploit ejecutable y su corrección.
- Reentrada, control de acceso, desbordamiento y dependencia de oráculos, con **Slither** en la CI.
- Cuatro casos reales con las cuentas hechas: **Terra/UST**, **FTX**, **puente Ronin** y **El Salvador**.
- **327 pruebas** en cada cambio, más comprobaciones de coherencia y de enlaces vivos.
- Los binarios se verifican **abriéndolos y contando el contenido**: un build en verde no prueba que la app lleve el curso dentro.

> **Pauta · 6 min.**
>
> ### Guion
>
> Hay dos razones para creerle a un material como este, y las dos están en esta lámina.
>
> La primera tiene que ver con cómo se enseña seguridad aquí: primero se rompe el
> contrato, y después se arregla. En ese orden.
>
> El programa trae contratos vulnerables a propósito, cada uno con su ataque ejecutable y
> con su corrección al lado.
>
> El ejemplo clásico es la reentrada. El contrato envía los fondos antes de anotar que ya
> los envió. Y quien los recibe vuelve a entrar en la misma función antes de que el saldo
> se haya actualizado. Y otra vez. Y otra.
>
> Quien solamente leyó qué es la reentrada la reconoce en un examen. Quien la ejecutó la
> reconoce en una revisión de código a las once de la noche. No es lo mismo.
>
> Y el encuadre ético está escrito en el propio material: todo corre en local o en una red
> de pruebas. Nunca con fondos ni con claves reales.
>
> Después están los casos reales. Son cuatro, con las cuentas hechas: Terra, FTX, el
> puente de Ronin y El Salvador.
>
> Los cuatro están escritos con la misma estructura: qué se prometió, qué mecanismo falló,
> qué señales había antes, y qué decisión de diseño lo habría evitado.
>
> FTX es el que más me sirve para cerrar el argumento de la parte institucional: no cayó
> por un fallo criptográfico. Cayó por custodia y por controles internos.
>
> Y la segunda razón para creerle a este material es que se verifica solo.
>
> Trescientas veintisiete pruebas en cada cambio, comprobaciones de coherencia entre lo
> que el material dice y lo que el material tiene, y los enlaces externos revisados cada
> semana.
>
> Hay además una regla escrita en el repositorio que me gusta especialmente: una
> compilación exitosa no demuestra que el archivo contenga el material.
>
> Por eso la integración continua abre el instalador de Windows y abre el APK de Android,
> y cuenta los módulos, las páginas y las preguntas que llevan dentro. Si sale vacío, la
> publicación falla — en vez de entregarles a ustedes una aplicación que se instala, se
> abre, y está en blanco.
>
> ### Indicaciones
>
> - Con público de negocio, los casos reales son el momento en que más te van a escuchar.
>   No los aceleres aunque vayas justo.
> - Si te preguntan si los contratos del curso están auditados, la respuesta está en el
>   anexo de lo que no hay que prometer. **No improvises esa.**
> - Las intervenciones 3 a 5 admiten abrir el contrato vulnerable en pantalla si el público
>   es técnico y tienes el sitio a mano.
> - Si recortas, quita la intervención 11 y encadena la 10 con la 12 y la 13: la de los
>   binarios verificados es la que se recuerda.

## 7 · Para quién es, y cómo se empieza

**Nueve rutas, un proyecto final y cuatro formatos que salen del mismo build.**

- **Rutas por perfil:** desarrollo, arquitectura, auditoría, producto, investigación, empresa, DeFi, banca y cumplimiento.
- Cada ruta termina en un **entregable de portafolio**: dApp probada, ADR, informe de auditoría, ficha de riesgo.
- **Proyecto final**: protocolo probado, dApp, datos, arquitectura, modelo de amenazas y caso de negocio.
- **Llévatelo entero**: sitio web, manual PDF de ~400 páginas, app de Windows y APK de Android, sin conexión.
- **Empieza hoy:** abre *Empieza aquí* → haz el diagnóstico → módulo 00 y `pnpm lab:hash`.
- `github.com/vladimiracunadev-create/blockchain-learning-path`

> **Pauta · 5 min.**
>
> ### Guion
>
> Última lámina: para quién es esto, y cómo se empieza.
>
> Hay nueve rutas por perfil: desarrollo, arquitectura, auditoría, producto,
> investigación, empresa, DeFi, banca y cumplimiento.
>
> Nadie tiene que hacerlo entero. Cada ruta dice qué módulos priorizar y cuáles se pueden
> leer en diagonal.
>
> Lo que sí tienen todas las rutas es un entregable de portafolio: una aplicación probada,
> un documento de decisión de arquitectura, un informe de auditoría, una ficha de riesgo.
>
> Porque estudiar sin producir nada demostrable es tiempo que después no se puede
> acreditar delante de nadie.
>
> El proyecto final, el que cierra el programa, no pide originalidad. Pide criterio:
> decisiones justificadas y verificadas.
>
> Y tiene un requisito que incomoda a todo el mundo, que es justamente el que más enseña:
> un documento que responda "¿por qué blockchain, y qué alternativa descarté?".
>
> Si la respuesta honesta es que bastaba una base de datos, el proyecto sigue siendo
> válido. Lo que se evalúa es el razonamiento, no la tecnología elegida.
>
> Y llévenselo entero. Está el sitio web, un manual en PDF de unas cuatrocientas páginas,
> la aplicación de Windows y el APK de Android.
>
> Las aplicaciones funcionan sin conexión, que es lo que importa en un aula sin wifi o en
> el metro. Y las cuatro versiones salen de la misma compilación, así que ninguna se queda
> atrás cuando el material cambia.
>
> Una advertencia honesta antes de terminar: los binarios no están firmados con
> certificado de código, porque ese certificado cuesta cientos de dólares al año. Windows
> y Android les van a avisar de que el origen es desconocido. Por eso se publica el SHA256
> de cada archivo, para que puedan comprobar que descargaron lo que se publicó.
>
> Y cómo se empieza hoy: abren la página "Empieza aquí", hacen el diagnóstico, y entran al
> módulo cero. El primer laboratorio son dos comandos.
>
> El enlace está en pantalla y lo dejo ahí mientras respondemos preguntas.
>
> ### Indicaciones
>
> - **No enumeres las nueve rutas de corrido.** Pregunta al público a qué se dedica y
>   comenta solo las dos o tres que aparezcan.
> - Cierra con la acción concreta de la intervención 12, **no con un agradecimiento**.
> - Si están frente a un computador, pídeles que abran la página y ejecuten el primer
>   laboratorio antes de irse: quien ve funcionar algo suyo el primer día vuelve el
>   segundo.
> - Deja la lámina en pantalla durante todas las preguntas, y ten abierto el anexo de
>   preguntas frecuentes: casi todo lo que te van a preguntar está ahí con la respuesta ya
>   redactada.

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
