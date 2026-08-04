# 🌱 Empieza aquí (si no sabes nada de blockchain)

> [⬅️ Volver al programa](../README.md) · [📖 Glosario](glosario.md) · [📚 Currículo](../curriculum/README.md)

Esta página es para quien abre el repositorio y piensa *"esto parece enorme y no
entiendo la mitad de las palabras"*. Es una reacción razonable. Aquí está el orden
en que conviene mirarlo.

**Regla número uno: no tienes que entenderlo todo hoy.** El programa está pensado
para 26 semanas. Si intentas leerlo de corrido te vas a atascar, y el atasco no
significa que no sirvas para esto: significa que te saltaste el andamio.

## ¿Esto es para mí?

| Tu situación | Respuesta honesta |
|---|---|
| Sé programar (cualquier lenguaje) | Sí. Es el perfil para el que está escrito |
| Nunca he programado | Sí para los módulos 00–03 y 17, que son conceptuales. Para los demás necesitarás aprender programación en paralelo: sin eso, los laboratorios serán copiar y pegar |
| Quiero invertir en criptomonedas | **No.** Este programa enseña la tecnología, no a especular. No encontrarás recomendaciones de inversión y es deliberado |
| Soy de negocio, no técnico | Sí, por otra puerta: [módulo 00](../curriculum/00-orientacion/README.md), [módulo 17](../curriculum/17-blockchain-en-la-empresa/README.md), la [sección de industria](../industria/README.md) y [cómo explicarlo a no técnicos](explicar-blockchain-a-no-tecnicos.md) |

## Lo primero: cuatro palabras que se confunden siempre

Antes de empezar, distingue esto. Es el 80 % de la confusión inicial:

- **Blockchain** — la *tecnología*: un registro compartido que muchas máquinas mantienen a la vez y que nadie puede reescribir a solas.
- **Criptomoneda** — un *uso* de esa tecnología: dinero digital nativo de una red concreta (bitcoin en Bitcoin, ether en Ethereum).
- **Token** — algo que alguien crea *encima* de una red existente, con un programa. No es la moneda nativa de la red.
- **Contrato inteligente** — un *programa* que se ejecuta en la red y aplica reglas sin que nadie pueda pararlo a mitad.

Blockchain **no** es sinónimo de criptomoneda, igual que "base de datos" no es sinónimo de "banco".

El resto del vocabulario está en el [glosario](glosario.md), con 120 términos.
No lo leas entero: consúltalo cuando una palabra te frene.

## Qué necesitas instalar (y cuándo)

No instales nada todavía. Cada cosa se necesita en un momento distinto:

| Cuándo | Qué | Para qué |
|---|---|---|
| Módulo 00 | Nada | Es lectura y una decisión razonada |
| Módulo 01 | [Node.js 22+](https://nodejs.org/) | Ejecutar los primeros laboratorios |
| Módulo 06 | [Foundry](https://book.getfoundry.sh/getting-started/installation) | Escribir y probar contratos |
| Módulo 07 | Una wallet de navegador, **en red de prueba** | Interactuar con una dApp |

¿No quieres instalar nada? Abre el repositorio en **GitHub Codespaces**: viene con
todo listo. O usa la [app de escritorio](../apps/desktop/README.md) o la
[app Android](../apps/android/README.md) para leer el curso sin conexión.

> ⚠️ **Nunca uses una wallet con dinero real** para los ejercicios. Todo el
> programa funciona en redes de prueba, donde el dinero no vale nada. Es lo que
> permite equivocarse sin consecuencias, que es como se aprende esto.

## Cómo se lee un módulo

Cada uno tiene la misma estructura. No se lee de arriba abajo de una sentada:

1. **🎯 Objetivos** — mira qué vas a poder hacer al terminar.
2. **🧠 Modelo mental** — la analogía. Empieza aquí si el tema es nuevo.
3. **📖 Conceptos** — el vocabulario del módulo. Vuelve aquí cuando algo no encaje.
4. **🔬 Profundización** — el detalle. Viene en capas: la idea en llano, el
   cálculo trabajado, y un bloque plegable **🎓 Si ya dominas esto** que puedes
   saltarte sin perder nada.
5. **🧪 Laboratorio** — hazlo. Leer sobre criptografía no enseña criptografía.
6. **⚠️ Errores frecuentes** — léelo *antes* de atascarte, no después.
7. **🧠 Autoevaluación** — cuatro preguntas al final. Cada opción incorrecta es un
   error frecuente real: si fallas, la explicación te dice qué releer.

Al pie de cada módulo hay enlaces al **anterior** y al **siguiente**. El orden
importa: cada módulo asume el anterior.

## Cuando te atasques

Te vas a atascar. Es parte del proceso, y hay un orden para salir:

1. **Relee los Conceptos del módulo.** La mayoría de los atascos son una palabra que creías entender.
2. **Busca el término en el [glosario](glosario.md).**
3. **Mira los Errores frecuentes** del módulo: la tabla está ordenada por síntoma, así que busca lo que te pasa a ti.
4. **Ejecuta el laboratorio y cambia un número.** Ver qué se rompe enseña más que leer la explicación otra vez.
5. **Vuelve al módulo anterior.** Un atasco persistente casi siempre es un hueco en lo previo, no en lo actual.
6. **[Abre un issue](https://github.com/vladimiracunadev-create/blockchain-learning-path/issues).** Si algo está mal explicado, es un fallo del material y arreglarlo ayuda a quien venga detrás.

## Cuánto tiempo lleva

| Ritmo | Dedicación | Duración |
|---|---|---|
| Recomendado | 6–10 h/semana | [26 semanas](../ROADMAP.md) |
| Intensivo (solo si ya programas bien) | 15–20 h/semana | [8 semanas](ruta-rapida.md) |
| Solo entender de qué va | — | Módulos 00 a 03, unas 6 horas |

## Cinco cosas que conviene saber desde el principio

1. **La mayoría de las veces, la respuesta correcta es "no uses blockchain".** El módulo 00 te enseña a llegar a esa conclusión con argumentos. No es cinismo: es criterio profesional.
2. **Lo irreversible es irreversible.** No hay servicio de atención al cliente ni botón de deshacer. Por eso el programa insiste tanto en probar antes.
3. **Nadie sabe todo esto.** El campo mezcla criptografía, sistemas distribuidos, economía y derecho. Quien afirme dominarlo entero, desconfía.
4. **El material puede quedar obsoleto.** El ecosistema cambia rápido; por eso cada afirmación lleva su fuente enlazada y hay que contrastarla. Cómo se valida está explicado en la [bibliografía](bibliografia.md#-cómo-se-valida-este-contenido-y-qué-no-garantiza).
5. **Si alguien te promete rentabilidad, no es tecnología: es una venta.** Este programa no te va a hacer rico; te va a enseñar a construir y a decidir.

## Siguiente paso

👉 **[Módulo 00 · Orientación](../curriculum/00-orientacion/README.md)** — empieza por aquí.

Si prefieres ver primero el mapa completo: [currículo](../curriculum/README.md) ·
[roadmap de 26 semanas](../ROADMAP.md) · [rutas por perfil](../learning-paths/README.md).

---

> [⬅️ Volver al programa](../README.md) · [📖 Glosario](glosario.md) · [📚 Currículo](../curriculum/README.md)
