# 🎤 Presentación del programa

> 🧭 [Volver al programa](../README.md) · [🌱 Empieza aquí](empieza-aqui.md) · [📚 Currículo](../curriculum/README.md) · [🧪 Laboratorios](../labs/CATALOG.md) · [📖 Glosario](glosario.md)

Este documento es la **fuente única** de la presentación del programa: de aquí salen,
sin escribirse dos veces, los tres formatos que se publican en cada despliegue:

| Formato | Para qué sirve | Dónde está |
|---|---|---|
| 🖥️ **Diapositivas (HTML)** | Proyectar desde el navegador, sin instalar nada | [presentacion.html](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/presentacion.html) |
| 🎞️ **Diapositivas (PDF)** | Proyectar sin conexión y repartir como material | [PRESENTACION.pdf](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/PRESENTACION.pdf) |
| 🧾 **Pauta del expositor (PDF)** | Guion hablado, tiempos y qué se ve en pantalla | [PAUTA.pdf](https://vladimiracunadev-create.github.io/blockchain-learning-path/presentacion/PAUTA.pdf) |

**Cómo se estructura cada diapositiva.** Cada sección numerada de abajo es una
diapositiva: el encabezado es su título, el cuerpo es **lo que se ve proyectado**
(letra grande, poco texto) y la cita final (`> **Pauta · N min.**`) es **lo que dice
quien expone** — no aparece en pantalla, solo en la pauta impresa. Los minutos de cada
diapositiva se suman automáticamente para calcular la duración total de la charla.

**Para generarlo todo desde el repositorio:**

```bash
pnpm build:presentacion
```

**Cómo usarla en una muestra de 45 minutos.** Proyecta el PDF a pantalla completa,
lleva la pauta impresa o en un segundo monitor, y reserva las dos últimas diapositivas
para preguntas. Si dispones de menos tiempo, el recorte natural es agrupar las etapas
(diapositivas 6 a 12) en una sola pasada por el mapa de la diapositiva 4.

---

## 1 · Blockchain Learning Path

**De cero a la infraestructura financiera programable, en español.**

- 28 módulos secuenciales · 70 prácticas ejecutables · un proyecto final.
- Criptografía, Bitcoin, Ethereum, contratos, seguridad, producción, dinero y regulación.
- Todo el material es **abierto**: código MIT, contenido CC BY 4.0.

> **Pauta · 1 min.** Preséntate y presenta el programa en una frase: es una ruta de
> aprendizaje completa, en español, que lleva a alguien desde no saber qué es un hash
> hasta poder discutir cómo se liquida un bono tokenizado. Aclara desde el principio el
> encuadre: no es un curso de inversión ni de trading, es ingeniería. Dilo tú antes de
> que alguien lo pregunte.

## 2 · Blockchain no es sinónimo de criptomoneda

**El programa enseña a decidir, no a especular.**

- Cuándo una cadena de bloques **aporta valor** y cuándo una base de datos es mejor.
- Cómo **construirla** con pruebas automatizadas, no con capturas de pantalla.
- Cómo **llevarla a una empresa**: infraestructura, costos, riesgo y cumplimiento.
- Qué cambia —y qué **no** cambia— cuando el dinero y los valores se vuelven programables.

> **Pauta · 2 min.** Esta es la diapositiva que fija el tono de toda la charla. La
> mayoría del público llega con el ruido del precio de las monedas; hay que sacarlo de
> ahí en el primer minuto. Usa el ejemplo del módulo 00: si el sistema tiene un dueño
> claro, confianza entre partes y nadie necesita verificar nada por su cuenta, una base
> de datos tradicional es más barata, más rápida y más fácil de operar. La primera
> pregunta del programa no es "cómo", es "¿lo necesito?".

## 3 · Las cifras del programa

**Lo que hay dentro, en números verificables.**

| Qué | Cuánto | Dónde |
|---|---|---|
| Módulos secuenciales (00→27) | **28** | Currículo |
| Prácticas guiadas con evidencia | **70** | Catálogo de laboratorios |
| Pruebas automatizadas en CI | **186** | 148 de Node + 38 de Foundry |
| Documentos de industria | **6** | Cómo se construye y se vende esto |
| Decisiones de arquitectura (ADR) | **6** | Plantillas reutilizables |
| Manual completo en PDF | **~520 págs.** | Se genera en cada publicación |

> **Pauta · 2 min.** No leas la tabla en voz alta: destaca dos cifras. Las 70 prácticas,
> porque significan que nadie termina el programa habiendo solo leído; y las 186 pruebas
> automatizadas, porque significan que el material se comprueba ejecutándolo, no
> afirmándolo. Menciona que todas estas cifras las verifica la integración continua: si
> alguien añade un módulo y no actualiza el texto, la comprobación falla y no se publica.

## 4 · Ocho etapas, un solo camino

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

> **Pauta · 3 min.** Este es el mapa al que vas a volver varias veces; deja que el
> público lo mire unos segundos en silencio. Explica la lógica del orden: no se puede
> entender una stablecoin sin entender un token, ni un token sin entender la EVM, ni la
> EVM sin entender firmas y hashes. La progresión no es un capricho editorial, es una
> cadena de dependencias. Y remata: al final de las ocho etapas hay un proyecto final
> que las integra todas.

## 5 · Cómo es un módulo por dentro

**Los 28 módulos tienen la misma anatomía. Siempre.**

- 🎯 **Objetivos** medibles y **resultados de aprendizaje** verificables.
- 🗺️ **Temas** con su porqué y **conceptos** con definición.
- 🧩 **Esquema visual** en Mermaid y 🧠 **modelo mental** con los **límites** de la analogía.
- 🔬 **Profundización** con ejemplos numéricos y casos reales.
- 🧪 **Laboratorio guiado** y ⚡ **reto verificable** con criterio de aceptación.
- ⚠️ **Errores frecuentes** (síntoma → causa) y 🛡️ **seguridad y ética**.
- 🔗 **Referencias** a fuentes primarias, con enlaces vivos.

> **Pauta · 3 min.** Aquí conviene abrir un módulo real en el sitio y recorrerlo con el
> cursor mientras hablas: entra al 01 de criptografía. Detente en dos secciones. La de
> "límites de la analogía", porque las analogías mal cerradas son la principal fuente de
> malentendidos en este campo; y la de "errores frecuentes", escrita como síntoma →
> causa, que es como se depura de verdad. Menciona que cada módulo declara su fuente
> bibliográfica y que una comprobación automática exige un mínimo de tres enlaces a
> fuente primaria: sin eso, "según el libro tal" no significa nada.

## 6 · Fundamentos · módulos 01 a 03

**Qué hace verificable a una cadena.**

- **01 · Criptografía aplicada** — hash, firmas, árboles de Merkle, gestión de claves.
- **02 · Sistemas distribuidos y redes P2P** — propagación, particiones, teorema CAP.
- **03 · Consenso** — prueba de trabajo, prueba de participación, finalidad, BFT.

**Se practica ejecutando:** `pnpm lab:hash`, `pnpm lab:merkle`, `pnpm lab:pow`, `pnpm lab:p2p`, `pnpm lab:particion`.

> **Pauta · 3 min.** El mensaje de esta etapa: una blockchain no es mágica, es la
> composición de tres cosas que ya existían por separado. Si tienes proyector y ganas,
> ejecuta en vivo `pnpm lab:hash`: se ve una cadena de bloques encadenada por hashes,
> se altera un dato de un bloque intermedio y todos los siguientes quedan inválidos.
> Treinta segundos de terminal explican la inmutabilidad mejor que diez diapositivas.

## 7 · Desarrollo · módulos 04 a 07

**De leer una cadena a escribir en ella.**

- **04 · Bitcoin** — UTXO, script, comisiones, selección de monedas.
- **05 · Ethereum y EVM** — cuentas, gas, ABI, almacenamiento, ciclo de una transacción.
- **06 · Solidity y Foundry** — contratos con pruebas unitarias, fuzzing e invariantes.
- **07 · dApps** — firmar, enviar, esperar confirmación y manejar los estados de error.

**Se practica construyendo:** un vault en Solidity probado con Foundry y una dApp con viem/TypeScript.

> **Pauta · 3 min.** Marca aquí el salto de nivel: se pasa de entender a construir. Dos
> ideas que valen por toda la etapa. Primera: en la EVM, los decimales no existen — se
> trabaja con enteros y unidades mínimas, y ese es el origen de una parte enorme de los
> errores de principiante; el laboratorio `pnpm lab:montos` está dedicado a eso.
> Segunda: en Foundry, el fuzzing prueba una propiedad con miles de entradas aleatorias,
> así que las pruebas dejan de ser tres ejemplos escogidos por quien programó.

## 8 · Profesional · módulos 08 a 11

**Escribir contratos que otros pueden auditar.**

- **08 · Tokens y estándares** — ERC-20, ERC-721, ERC-1155 y por qué existe cada uno.
- **09 · Seguridad y auditoría** — reentrada, control de acceso, oráculos manipulables.
- **10 · Oráculos, almacenamiento e indexación** — el dato externo y su cadena de confianza.
- **11 · DAO y gobernanza** — votación, quórum, timelock y captura de la gobernanza.

**Se practica atacando:** contratos vulnerables a propósito, su explotación y su corrección.

> **Pauta · 3 min.** El corazón de la etapa es el módulo 09. Explica el patrón
> checks-effects-interactions con el ejemplo de la reentrada: el contrato envía fondos
> antes de anotar que ya los envió, y quien recibe vuelve a entrar en la misma función
> antes de que el saldo se actualice. En el repositorio hay contratos vulnerables con su
> exploit y su corrección, ambos ejecutables con pruebas. Es la diferencia entre saber
> el nombre de una vulnerabilidad y haberla visto vaciar un contrato en tu terminal.

## 9 · Avanzado · módulos 12 a 15

**Cuando una cadena sola no alcanza.**

- **12 · Escalabilidad y capas 2** — rollups optimistas y de validez, disponibilidad de datos.
- **13 · Interoperabilidad** — puentes, mensajería entre cadenas y su modelo de confianza.
- **14 · Privacidad y zero knowledge** — probar sin revelar; qué se puede y qué no.
- **15 · Arquitectura avanzada** — cuentas abstractas, MEV, diseño de sistemas completos.

> **Pauta · 2 min.** La idea que hay que dejar clara: escalar no es gratis, se paga con
> supuestos de confianza. Un rollup optimista es barato porque asume que alguien vigila
> y presenta pruebas de fraude a tiempo; un puente es cómodo hasta que su comité de
> firmas es el punto único de fallo. Si alguien pregunta por ZK, la respuesta corta del
> módulo 14: sirve para demostrar que un cálculo se hizo bien sin mostrar los datos, y
> su costo real está en generar la prueba, no en verificarla.

## 10 · Producción · módulos 16 a 18

**Llevarlo a una organización de verdad.**

- **16 · Infraestructura y operación de nodos** — disponibilidad, monitoreo, respaldo, costos.
- **17 · Blockchain en la empresa** — caso de negocio, alternativas descartadas, viabilidad.
- **18 · Implementación end-to-end** — del piloto a producción, con documento de arquitectura.

> **Pauta · 2 min.** Esta es la etapa que casi ningún curso tiene y la que más peso
> tiene en una entrevista de trabajo. Insiste en el módulo 17: la pregunta que hunde
> proyectos no es técnica, es "¿por qué esto justifica su costo y su mantenimiento
> durante cinco años?". El programa obliga a responderla por escrito, en formato ADR,
> incluyendo qué alternativa se descartó y por qué.

## 11 · Finanzas on-chain · módulos 19 a 25

**Qué cambia cuando el dinero es programable.**

- **19 · DeFi** — mercados automáticos, préstamo, factor de salud y liquidaciones.
- **20 · Dinero, banca y liquidación** — qué es liquidar y por qué la firmeza importa.
- **21 · Stablecoins** — colateral, paridad y los mecanismos que fallaron.
- **22 · Depósitos tokenizados y MDBC/CBDC** — dinero de banco central y comercial.
- **23 · Pagos, cross-border y FX** — costo real de una remesa, pago contra pago atómico.
- **24 · Tokenización y RWA** — el activo del mundo real y su vínculo legal.
- **25 · Mercados de capitales on-chain** — entrega contra pago, ciclo de vida de un bono.

> **Pauta · 3 min.** Aquí es donde el programa se separa de la oferta habitual. Elige
> un solo laboratorio y cuéntalo con números: `pnpm lab:remesa` compara el costo de
> enviar dinero por la vía tradicional y on-chain, comisión a comisión, y
> `pnpm lab:pvp` muestra por qué una liquidación atómica elimina el riesgo de que una
> pata del intercambio se cumpla y la otra no. Ese riesgo tiene nombre propio en la
> banca y siglos de historia; el módulo 20 lo explica antes de proponer la solución.

## 12 · Institucional · módulos 26 y 27

**Custodia y cumplimiento desde el primer día.**

- **26 · Custodia, wallets institucionales e identidad digital** — multifirma, MPC, políticas de cuórum.
- **27 · Regulación y cumplimiento** — riesgo, regla del viaje, y qué exige cada jurisdicción.
- **Marcos comparados:** Chile, Unión Europea (MiCA), Estados Unidos, América Latina y estándares internacionales.

> **Pauta · 2 min.** El argumento: el cumplimiento no es un trámite que se añade al
> final, es una restricción de diseño que cambia la arquitectura. Si tu sistema debe
> poder congelar un activo o identificar a las partes, eso se decide antes de escribir
> el primer contrato, no después. Menciona el caso FTX, que está documentado en el
> repositorio: no cayó por un fallo criptográfico, cayó por custodia y controles.

## 13 · 70 prácticas, todas con evidencia

**Nadie termina el programa habiendo solo leído.**

- Cada práctica declara **actividad**, **evidencia** que produce y **criterio de aceptación**.
- Las marcadas **auto** traen verificación ejecutable (`pnpm lab:*` o `node --test`).
- El resto produce un entregable revisable con rúbrica: un ADR, un informe, un diagrama.
- Contratos con **Foundry**: vault, protocolos, token, oráculo y gobernador con timelock.
- dApp con **viem/TypeScript** e indexador de eventos con checkpoint.

> **Pauta · 3 min.** Explica por qué existe la columna "evidencia": sin un artefacto
> concreto, "hice el laboratorio" no es comprobable ni por el alumno ni por un
> evaluador. Y aclara la mezcla deliberada de prácticas automáticas y con rúbrica: hay
> cosas que una máquina verifica mejor —un hash, una invariante— y otras que exigen
> criterio humano, como justificar una decisión de arquitectura. El programa no finge
> que todo se puede automatizar.

## 14 · Seguridad: primero se rompe, después se arregla

**Se aprende explotando el contrato, no leyendo sobre la vulnerabilidad.**

- Contratos vulnerables a propósito, con su **exploit ejecutable** y su **corrección**.
- Reentrada, control de acceso, desbordamiento, dependencia de oráculos, y más.
- Análisis estático con **Slither** ejecutado en la integración continua.
- Plantilla de **informe de auditoría** y modelo de amenazas para el proyecto final.

> **Pauta · 2 min.** Insiste en el orden: primero el exploit, después el arreglo.
> Alguien que solo leyó qué es la reentrada la reconoce en un examen; quien la ejecutó
> la reconoce en una revisión de código a las once de la noche. Aclara también el
> encuadre ético, que está en el material: todo corre en local o en testnet, nunca con
> fondos ni claves reales.

## 15 · Casos reales, con las cuentas hechas

**Cuatro fracasos y una decisión de país, documentados.**

- **Terra/UST** — cómo una paridad algorítmica se desarma en días.
- **FTX** — qué falla cuando la custodia y los controles internos no existen.
- **Puente Ronin** — el comité de firmas como punto único de fallo.
- **El Salvador y bitcoin** — una decisión soberana y sus efectos medibles.

> **Pauta · 2 min.** Estos casos son la vacuna contra el entusiasmo sin fricción. Cada
> uno está escrito con la misma estructura: qué se prometió, qué mecanismo falló, qué
> señales había antes y qué decisión de diseño lo habría evitado. Si tienes público de
> negocio, este es el momento de la charla en que te van a escuchar con más atención.

## 16 · Nueve rutas según a qué te dedicas

**El mismo material, distintos recorridos.**

| Perfil | Entregable de portafolio |
|---|---|
| Desarrollo | dApp integral probada con Foundry |
| Arquitectura | ADR de plataforma con sus trade-offs |
| Auditoría y seguridad | Informe estilo auditoría |
| Producto y negocio | Validación de caso y tokenomics |
| Investigación | Réplica comentada de un paper |
| Empresa y consultoría | Diseño de red permisionada con ADR |
| Finanzas on-chain | Ficha de riesgo de un protocolo, con cálculos |
| Banca y activos digitales | Arquitectura de un mercado de bonos tokenizados |
| Cumplimiento y regulación | Análisis regulatorio en dos jurisdicciones |

> **Pauta · 2 min.** No leas las nueve. Pregunta al público a qué se dedica y comenta
> las dos o tres rutas que aparezcan. El punto importante es el de la derecha: cada ruta
> termina en un artefacto que se puede enseñar en una entrevista. Estudiar sin producir
> nada demostrable es tiempo que no se puede acreditar después.

## 17 · El material se verifica solo

**Un curso también se degrada. Aquí hay guardias que lo impiden.**

- **186 pruebas** automatizadas en cada cambio: laboratorios de Node y contratos de Foundry.
- Comprobaciones de coherencia: módulos encadenados, glosario enlazado, fuentes con URL viva.
- Revisión semanal de **enlaces externos**: si una fuente oficial muere, se abre una incidencia.
- Los binarios se verifican **abriéndolos y contando el contenido**: un build en verde no prueba que la app lleve el curso dentro.

> **Pauta · 2 min.** Esta diapositiva es el argumento de confianza, y es el que más
> distingue al programa de un PDF publicado una vez. Cuenta la regla explícita del
> repositorio: una compilación exitosa no demuestra que el artefacto contenga el
> material, así que la integración continua abre el instalador y el APK y cuenta los
> módulos, las páginas y las preguntas que llevan dentro. Si sale vacío, la publicación
> falla en vez de entregar algo que se instala y abre en blanco.

## 18 · Proyecto final y evaluación

**La prueba de que se aprendió.**

- Un protocolo pequeño, **desplegable y probado**, que integra todas las etapas.
- Requiere: contratos con pruebas e invariantes, interfaz, estrategia de datos, documento de arquitectura, modelo de amenazas, estimación de gas y caso de negocio.
- **Autoevaluación** por módulo con explicación de cada respuesta.
- **Diagnóstico** inicial para saber por dónde entrar, y certificado al terminar.

> **Pauta · 2 min.** Subraya que el proyecto final no pide originalidad, pide criterio:
> decisiones justificadas y verificadas. Y menciona el requisito que más incomoda y más
> enseña — el ADR que responde "¿por qué blockchain, y qué alternativa descarté?". Si la
> respuesta honesta es que una base de datos bastaba, el proyecto sigue siendo válido:
> lo que se evalúa es el razonamiento.

## 19 · Llévatelo entero, funciona sin conexión

**Cuatro formatos que salen del mismo build.**

| Formato | Qué es |
|---|---|
| 🌐 **Sitio web** | Todo el material con buscador, progreso y autoevaluación |
| 📕 **Manual PDF** | ~520 páginas: currículo, laboratorios, regulación y anexos |
| 🖥️ **Windows** | Instalador o portable, con el curso dentro |
| 📱 **Android** | APK con el curso dentro, para estudiar sin datos |

- Código **MIT**, contenido **CC BY 4.0**: se puede usar en un aula sin pedir permiso.
- Los binarios **no están firmados**: compara el SHA256 publicado antes de ejecutarlos.

> **Pauta · 2 min.** El argumento de accesibilidad: las apps funcionan sin conexión, lo
> que importa de verdad en un aula sin wifi o en el metro. Las cuatro versiones salen
> del mismo build, así que ninguna se queda atrás. Y sé transparente con lo de la firma
> de código: los binarios no están firmados porque el certificado cuesta cientos de
> dólares al año, así que Windows y Android van a avisar del origen desconocido; por eso
> se publica el checksum.

## 20 · Empieza hoy

**Tres pasos, quince minutos.**

1. Abre **Empieza aquí**: qué necesitas, qué instalar y en qué momento.
2. Haz el **diagnóstico** para saber por dónde entrar.
3. Estudia el **módulo 00** y ejecuta tu primer laboratorio: `pnpm lab:hash`.

**Sitio:** `vladimiracunadev-create.github.io/blockchain-learning-path`
**Repositorio:** `github.com/vladimiracunadev-create/blockchain-learning-path`

> **Pauta · 2 min.** Cierra con una acción concreta, no con un agradecimiento. Si el
> público está frente a un computador, que abran la página de entrada ahí mismo y
> ejecuten el primer laboratorio antes de irse: quien ve funcionar algo suyo en el
> primer día vuelve al segundo. Deja los dos enlaces en pantalla mientras respondes
> preguntas.
