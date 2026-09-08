#!/usr/bin/env node

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { classFileName } from "./curriculum-lib.mjs";

const catalog = JSON.parse(await readFile("curriculum/classes.json", "utf8"));
const pedagogy = JSON.parse(await readFile("curriculum/pedagogy.json", "utf8"));
const directories = (await readdir("curriculum", { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));

if (catalog.length !== directories.length) throw new Error("El catálogo y los mapas temáticos no coinciden.");
const allClasses = catalog.flatMap((unit, unitIndex) => unit.classes.map((item) => ({
  ...item, directory: directories[unitIndex].name
})));

function extractSection(text, heading) {
  const start = text.indexOf(heading);
  if (start === -1) return "";
  const bodyStart = text.indexOf("\n", start) + 1;
  const next = text.indexOf("\n## ", bodyStart);
  return text.slice(bodyStart, next === -1 ? text.length : next).trim();
}

const stopWords = new Set("a al ante bajo con contra de del desde durante e el en entre hacia hasta la las lo los o para por que se sin sobre su sus un una y como cuando donde qué cómo".split(" "));
function tokens(value) {
  return new Set(value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .split(/[^a-z0-9]+/).filter((word) => word.length > 3 && !stopWords.has(word)));
}
function relevance(piece, item) {
  const wanted = tokens(`${item.title} ${item.question} ${item.concepts.join(" ")}`);
  const heading = tokens(piece.split("\n")[0] ?? "");
  const body = tokens(piece);
  return [...wanted].reduce((score, word) => score + (heading.has(word) ? 5 : 0) + (body.has(word) ? 1 : 0), 0);
}
function splitFoundation(text, classes) {
  const deep = extractSection(text, "## 🔬 Profundización");
  let pieces = deep.split(/(?=^### )/m).map((part) => part.trim()).filter(Boolean);
  if (pieces.length < 2) pieces = deep.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
  const assigned = [[], []];
  for (const piece of pieces) {
    const scores = classes.map((item) => relevance(piece, item));
    assigned[scores[1] > scores[0] ? 1 : 0].push(piece);
  }
  for (const empty of [0, 1]) {
    if (assigned[empty].length) continue;
    const donor = 1 - empty;
    let bestIndex = 0;
    let bestScore = -1;
    assigned[donor].forEach((piece, index) => {
      const score = relevance(piece, classes[empty]);
      if (score > bestScore) { bestScore = score; bestIndex = index; }
    });
    assigned[empty].push(assigned[donor].splice(bestIndex, 1)[0]);
  }
  return assigned.map((parts) => parts.join("\n\n"));
}

function references(text) {
  const section = extractSection(text, "## 🔗 Referencias") || extractSection(text, "## Referencias");
  const links = section.split("\n").filter((line) => /https?:\/\//.test(line)).map((line) => {
    if (!line.startsWith("|")) return line;
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    const url = cells.find((cell) => /https?:\/\//.test(cell));
    return `- ${cells[0]} — ${url}`;
  });
  return links.join("\n");
}

function mermaidLabel(value) {
  return value.replace(/["[\]{}]/g, "").replace(/:/g, " —");
}

function visual(item, index) {
  const [a, b, c] = item.concepts.map(mermaidLabel);
  const q = mermaidLabel(item.question);
  switch (index % 6) {
    case 0: return `flowchart LR\n  Q["Pregunta<br/>${q}"] --> A["${a}"] --> B["${b}"] --> C["${c}"] --> E["Evidencia revisable"]`;
    case 1: return `flowchart TD\n  C["Caso observado"] --> O{"¿Qué sabemos?"}\n  O --> A["${a}"]\n  O --> B["${b}"]\n  A --> P["Probar: ${c}"]\n  B --> P\n  P --> L["Conclusión con límites"]`;
    case 2: return `flowchart LR\n  S["Situación inicial"] --> X["${a}"] --> Y["${b}"] --> Z["${c}"]\n  Z --> R{"¿Responde la pregunta guía?"}\n  R -->|sí, con evidencia| E["Entregable verificable"]\n  R -->|no| S`;
    case 3: return `flowchart TB\n  F["Hecho observable"] --> I["Interpretar con ${a}"]\n  I --> H["Hipótesis usando ${b}"]\n  H --> V["Verificar mediante ${c}"]\n  V --> C["Conclusión proporcional"]`;
    case 4: return `flowchart LR\n  A["${a}"] --> D{"Decisión"}\n  B["${b}"] --> D\n  C["${c}"] --> D\n  D --> P["Prueba práctica"] --> E["Evidencia revisable"]`;
    default: return `sequenceDiagram\n  participant E as Estudiante\n  participant S as Sistema\n  participant R as Revisor\n  E->>S: aplica ${a}\n  S-->>E: expone ${b}\n  E->>R: contrasta ${c}\n  R-->>E: acepta, cuestiona o pide evidencia`;
  }
}

const walletIntegration = {
  "4": "La wallet aparece desde su raíz: no es una caja que guarda monedas, sino software y procedimientos que administran claves y construyen firmas. Seed phrase, respaldo y derivación pertenecen al ciclo de vida de la clave.",
  "9": "La wallet de Bitcoin selecciona UTXO, crea salidas, calcula cambio y propone una comisión. Esas funciones sustituyen la imagen incorrecta de un saldo alojado dentro de una dirección.",
  "10": "La operación segura conecta wallet y nodo: transmitir no equivale a confirmar. La política declara qué verifica localmente y qué delega a proveedores o clientes ligeros.",
  "11": "La wallet gestiona una cuenta Ethereum y su nonce; la cuenta no vive dentro de la aplicación. Cambiar de interfaz no cambia el estado canónico, pero sí las dependencias para observarlo y transmitir.",
  "16": "La wallet es una frontera de consentimiento. Conectar, firmar un mensaje, enviar valor y aprobar tokens son actos distintos; la interfaz debe explicar los efectos presentes y futuros.",
  "53": "La custodia institucional amplía la wallet a políticas hot, warm y cold; multisig, MPC y HSM; preparación, aprobación, firma, recuperación y evidencia segregadas.",
  "54": "Wallet e identidad se relacionan con minimización: una dirección no prueba identidad civil y una credencial no debería revelar más atributos que los necesarios.",
  "59": "En un exchange custodial, un saldo de cliente puede existir sin wallet on-chain individual. Se separa la cuenta interna de las wallets operativas del custodio.",
  "60": "Direcciones, txids y modelos UTXO/cuentas enlazan retiros con operaciones reales. Una wallet agrupadora impide suponer una transacción por cliente."
};

const ethicalBoundaryIntegration = {
  "19": "El modelado de amenazas autoriza a imaginar rutas de abuso, no a ejecutarlas contra sistemas ajenos. Convierte cada escenario en un test local, una revisión o una simulación con alcance aprobado.",
  "20": "El alcance de auditoría define repositorio, commit, entorno, técnicas permitidas y canal de escalamiento. Encontrar una debilidad no amplía por sí solo esa autorización.",
  "55": "La norma aplicable, la jurisdicción y la autoridad competente deben citarse; una interpretación del estudiante no se presenta como consejo jurídico ni como orden para bloquear activos.",
  "56": "Una alerta inicia revisión proporcional. No prueba identidad, intención ni delito, y nunca debe producir automáticamente una acusación o sanción.",
  "58": "Un grafo produce relaciones técnicas e indicadores. Atribuir una persona exige evidencia externa legítima, alternativas examinadas y revisión humana autorizada.",
  "65": "Preservar y analizar no autoriza a acceder, explotar, suplantar, perseguir fondos ni publicar identidades. El expediente registra dónde termina la observación y empieza una decisión que requiere otra autoridad.",
  "66": "La gobernanza asigna quién puede contener, comunicar, reportar o solicitar una medida. El acceso técnico del investigador no sustituye esa autoridad."
};

const classExpansion = {
  "2": "### De la comparación a una decisión defendible\n\nUn ADR no premia la arquitectura más novedosa: registra el contexto, las fuerzas en tensión, la decisión y sus consecuencias. Para comparar una base administrada, una DLT permisionada y una red pública se mantienen constantes el proceso y los actores; luego se cambia una variable por vez: autoridad para corregir, visibilidad, reversibilidad, costo operativo y salida de un participante. La recomendación incluye una condición de abandono. Si el piloto no reduce el tiempo de conciliación o si la gobernanza concentra el mismo poder con mayor costo, continuar sería una decisión política, no una conclusión técnica.\n\nComunicar sin vender humo significa traducir el mecanismo. En lugar de decir «elimina confianza», indica qué tercero deja de ordenar el registro y qué nuevos supuestos aparecen en software, claves, validadores y gobierno. La audiencia puede entonces disentir del riesgo sin discutir eslóganes.",
  "10": "### Qué verifica realmente un nodo\n\nUn nodo completo recibe bloques y transacciones, ejecuta las reglas de consenso y rechaza por sí mismo lo inválido. No pregunta a un explorador cuál es el saldo: deriva el estado desde el historial que validó. Un cliente ligero reduce costo al verificar encabezados y pruebas, pero depende de pares o servidores para descubrir transacciones relevantes. Esa diferencia no vuelve inútil al cliente ligero; obliga a declarar el modelo de confianza.\n\nLa política de confirmaciones conecta amenaza y operación. Una transacción en mempool puede ser reemplazada o desaparecer; una incluida puede quedar fuera por reorganización. El riesgo depende del valor, la capacidad adversarial, la latencia tolerable y la posibilidad de revertir el servicio entregado. «Seis confirmaciones» es una decisión conservadora frecuente, no una constante que el protocolo garantice para todo pago.",
  "12": "### De calldata a efecto persistente\n\nLa ABI define cómo una intención se serializa en bytes: cuatro bytes de selector seguidos de argumentos codificados. La EVM no ve nombres de funciones; recibe esos bytes, carga opcodes y opera sobre una pila. `memory` vive durante la llamada, `storage` persiste en el estado y los logs quedan en el recibo para consumidores externos. Seguir una traza consiste en localizar dónde entró el dato, qué salto eligió el bytecode, qué slot cambió y cuánto gas consumió.\n\nUn `revert` deshace cambios de estado de la llamada, pero no devuelve el gas ya usado ni borra que la transacción fue incluida. Por eso «falló» puede significar rechazo previo, revert durante ejecución o interfaz que interpretó mal un recibo. La evidencia debe distinguir esos puntos.",
  "16": "### Consentimiento antes, durante y después de firmar\n\nConectar una wallet permite a la dApp conocer una cuenta y red; no autoriza por sí mismo a mover activos. `personal_sign`, datos tipados y una transacción ejecutable producen compromisos diferentes. La pantalla previa debe mostrar dominio o contrato, función, destinatario, activo, monto, red, comisión y permisos persistentes. En una aprobación, el riesgo relevante puede ocurrir días después cuando otro contrato usa el allowance.\n\nLa experiencia tampoco termina al pulsar confirmar. `pending`, reemplazada, incluida, revertida y final son estados distintos. Una interfaz honesta conserva el hash, detecta cambio de red o cuenta, permite reanudar seguimiento y evita celebrar éxito antes del recibo. La seguridad aquí no es un modal: es hacer visible el efecto que el usuario está autorizando.",
  "18": "### Poderes y necesidad antes de distribuir\n\nAllowance y `permit` resuelven autorización delegada, no justifican que exista un token. Antes de emitir se pregunta qué derecho representa, por qué necesita transferibilidad y qué alternativa más simple fue descartada. Después se enumeran poderes del contrato: mint, burn, pausa, bloqueo, upgrade y rescate. Un ERC correcto puede concentrar todos esos poderes en una clave.\n\nLa distribución cambia la seguridad económica. Concentración, calendarios de desbloqueo, liquidez y delegación pueden convertir una gobernanza formalmente abierta en control efectivo de pocos actores. La evidencia de utilidad no es volumen de mercado; es una función que el sistema no podría cumplir con una cuenta interna o un derecho contractual convencional.",
  "20": "### Alcance, reproducción y cierre de hallazgos\n\nUna auditoría empieza por fijar repositorio, commit, contratos, dependencias, compilador y supuestos excluidos. Sin ese corte, un informe correcto puede aplicarse a código distinto. Cada hallazgo contiene condición, recorrido explotable, impacto, severidad y prueba mínima. Herramientas estáticas amplían cobertura, pero no sustituyen revisar lógica económica, privilegios y composición.\n\nRemediar exige algo más que cambiar la línea señalada: se reproduce el exploit, se aplica el parche, se ejecuta una regresión y se busca una ruta equivalente. El cierre registra qué versión fue reexaminada y qué riesgo residual permanece. Un test verde demuestra una propiedad codificada; no demuestra que el equipo haya formulado todas las propiedades importantes.",
  "28": "### El puente como sistema de verificadores\n\nUn puente no mueve el mismo objeto entre dos estados canónicos: bloquea, quema o custodia en un lado y provoca una emisión o liberación en el otro. La pregunta de seguridad es quién acepta el mensaje y con qué prueba. Puede ser un light client, un conjunto de firmas, un oráculo o una clave administrativa; cada opción cambia el costo de falsificar, censurar o retrasar.\n\nEl modelo de amenazas sigue cinco fronteras: contrato origen, observación, transporte, verificación destino y autoridad de actualización. Replay, firma comprometida, bug de validación y upgrade malicioso producen fallas distintas. La contención define pausa, límites de retiro, demora y coordinación entre cadenas, incluyendo qué ocurre con activos envueltos cuando el respaldo queda inmovilizado.",
  "51": "### Funciones antes que instituciones\n\nEmisión crea el valor y sus derechos; negociación encuentra contrapartes y precio; compensación calcula obligaciones; una CCP puede novar y gestionar incumplimiento; el depositario mantiene el registro central o coordina tenencias; liquidación transfiere valor y dinero con finalidad. Tokenizar puede combinar componentes técnicos, pero no elimina automáticamente las funciones de riesgo, gobierno y recurso legal.\n\nPara evaluar una arquitectura, dibuja cada función y asigna responsable, activo, momento y evidencia. Si una bolsa desaparece de la interfaz, todavía debe existir formación de precio. Si se elimina una CCP, alguien conserva el riesgo bilateral. La mejora se mide en capital, liquidez, errores y tiempo, no en cantidad de intermediarios borrados del diagrama.",
  "59": "### Operación interna frente a movimiento de activos\n\nEn un CEX, casar una compra puede ser una escritura doble en el ledger: baja el saldo de un cliente y sube el de otro sin transacción blockchain. El exchange mantiene la obligación frente a ambos. Depósitos y retiros son las puertas que conectan ese libro con wallets y redes; comisiones, estados pendientes y revisiones de cumplimiento crean diferencias temporales que deben conservar trazabilidad.\n\nCEX/DEX y custodial/no custodial son ejes distintos. Un protocolo puede ejecutar on-chain pero depender de una interfaz y claves administrativas; un servicio puede enrutar a un DEX mientras custodia la clave del usuario. La clase identifica quién puede firmar, qué registro reconoce el derecho del cliente y dónde se resuelve una disputa.",
  "61": "### Tres registros que responden preguntas distintas\n\nEl ledger interno responde cuánto debe la entidad a cada cliente. La realidad operativa del exchange añade órdenes, comisiones, créditos, préstamos, garantías y activos mantenidos en terceros. El estado blockchain muestra saldos y transacciones de direcciones y contratos, pero no conoce por sí mismo la titularidad económica ni todas las obligaciones. Igualar dos cifras sin reconciliar población, activo, entidad y corte produce una coincidencia, no evidencia.\n\nLa reconstrucción empieza separada: se totaliza cada fuente sin contaminarla con ajustes de otra. Luego se crea una clave de enlace —retiro, txid, lote, dirección, activo, red y tiempo— y se documentan diferencias. La ecuación transversal es deliberadamente desigual: `Internal Ledger ≠ Exchange Reality ≠ Blockchain State`; el trabajo profesional comprueba cómo se relacionan.",
  "62": "### De la excepción al incidente\n\nConciliar no consiste en forzar que dos totales coincidan. Cada diferencia recibe identidad, importe, activo, primera aparición, edad, propietario y causa provisional. Una transacción pendiente puede ser diferencia temporal; un decimal incorrecto es error de transformación; una salida no autorizada puede ser pérdida; un archivo incompleto es limitación de evidencia. Ajustarlas todas contra una cuenta puente oculta precisamente la señal que debía investigarse.\n\nLa prioridad combina materialidad, antigüedad, exposición y posibilidad de repetición. El cierre exige evidencia de causa y corrección, no solo saldo cero. Si el problema afectó autorización o custodia, se preservan logs y se escala antes de modificar registros. La conciliación es así control detectivo y fuente de aprendizaje operacional.",
  "64": "### Qué puede concluir un encargo\n\nExistencia de activos, control de claves, integridad de pasivos, derechos, valuación y corte son afirmaciones diferentes. Una firma demuestra control de una clave en un instante, no propiedad libre de gravámenes. Una raíz compromete una población entregada, no garantiza que esté completa. Un ratio agregado depende además de precios, liquidez y haircuts. Por eso una conclusión válida nombra entidad, fecha, fuentes, procedimientos y excepciones.\n\nLa solvencia incorpora obligaciones fuera del ledger, préstamos, litigios, capital y continuidad. Una auditoría financiera trabaja con estados completos, materialidad, controles y hechos posteriores; un procedimiento acordado informa resultados sin expresar la misma opinión. El lenguaje profesional impide que marketing convierta una comprobación parcial en «empresa auditada».",
  "66": "### Gobierno que deja evidencia\n\nCustodia segura separa preparación, aprobación, firma, registro, conciliación e investigación. Ningún rol debería poder crear una orden, autorizarla, mover fondos y cerrar la excepción sin revisión independiente. Los controles preventivos incluyen límites, cuórum y allowlists; los detectivos incluyen conciliación, alertas y revisión de logs; los correctivos incluyen pausa, rotación y recuperación probada.\n\nLa gobernanza define quién cambia políticas, cómo se aprueba una emergencia y cuándo se informa a clientes, auditoría o autoridad. Cumplimiento no reemplaza seguridad y una alerta forense no prueba culpabilidad. El comité recibe evidencia con procedencia, escucha hipótesis alternativas y registra decisión, responsable, plazo y riesgo aceptado. Ese rastro permite auditar el control cuando ya pasó la presión del incidente."
};

function coreSections(item, design, foundation, index) {
  const conceptRoles = [
    "delimita qué objeto o relación estamos observando antes de sacar conclusiones",
    "explica el mecanismo que conecta la situación inicial con el cambio observable",
    "permite contrastar el resultado y formular el límite de la evidencia"
  ];
  const concepts = item.concepts.map((concept, conceptIndex) =>
    `${conceptIndex + 1}. **${concept}.** En esta clase ${conceptRoles[conceptIndex]}. Localízalo explícitamente en «${item.case}» y anota qué dato faltaría para refutar tu lectura.`
  ).join("\n");
  const wallet = walletIntegration[item.id]
    ? `\n\n### Wallets dentro del problema\n\n${walletIntegration[item.id]}` : "";
  const expansion = classExpansion[item.id] ? `\n\n${classExpansion[item.id]}` : "";
  const boundary = ethicalBoundaryIntegration[item.id]
    ? `## Límite ético y legal de esta clase\n\n${ethicalBoundaryIntegration[item.id]}\n\nAplica la guía transversal [¿Y si cruzas la línea?](../../docs/y-si-cruzas-la-linea-blockchain.md) antes de proponer una intervención.`
    : "";
  const blocks = [
    `## Punto de partida\n\n**Pregunta guía:** ${item.question}\n\n**Caso que abre la clase:** ${item.case}\n\n${design.explanation}`,
    `## Fundamentos que sostienen la respuesta\n\n${concepts}\n\n${foundation || "El material temático común aporta el contexto; aquí cada afirmación debe conectarse con la evidencia de esta clase."}${expansion}${wallet}`,
    `## Gráfico pedagógico\n\nRecorre el gráfico en voz alta: identifica supuestos, transformaciones y el punto exacto donde aparece evidencia.\n\n\`\`\`mermaid\n${visual(item, index)}\n\`\`\``,
    `## Trabajo práctico\n\n**Método propio:** ${design.method}.\n\n**Actividad:** ${item.activity}\n\nTrabaja en entorno local, regtest, signet o testnet según corresponda. Conserva entradas, comandos, salidas y bloque o instante de corte. Una captura aislada no demuestra reproducibilidad.`,
    `## Demostración de aprendizaje\n\n**Entregable:** ${item.evidence}\n\n**Comprobación formativa:** ${design.check}\n\nPara aprobar debes conectar el hecho observado con el concepto correcto, descartar al menos una interpretación alternativa y redactar una conclusión cuyo alcance no exceda la prueba.`,
    `## Errores que esta clase corrige\n\n- Tratar **${item.concepts[0]}** como una etiqueta suficiente, sin identificar actores, dato y frontera.\n- Usar **${item.concepts[1]}** como explicación aunque el caso no aporte la evidencia necesaria.\n- Dar por respondido «${item.question}» sin contrastar **${item.concepts[2]}**.\n\nVuelve al caso inicial, elige el error más peligroso y describe una comprobación concreta que lo detectaría.`
  ];
  const rotations = [
    [0, 1, 2, 3, 4, 5], [0, 2, 1, 3, 5, 4], [0, 1, 3, 2, 4, 5],
    [0, 3, 1, 2, 5, 4], [0, 2, 3, 1, 4, 5], [0, 1, 2, 4, 3, 5]
  ];
  const ordered = rotations[index % rotations.length].map((position) => blocks[position]);
  if (boundary) ordered.push(boundary);
  return ordered.join("\n\n");
}

for (const [unitIndex, directory] of directories.entries()) {
  const unit = catalog[unitIndex];
  if (unit?.unit !== directory.name.slice(0, 2) || unit.classes.length !== 2) throw new Error(`${directory.name}: catálogo inválido.`);
  const readmePath = join("curriculum", directory.name, "README.md");
  const readme = await readFile(readmePath, "utf8");
  const foundations = splitFoundation(readme, unit.classes);
  const sourceHeader = readme.match(/\*\*Fuente:\*\*\s+(.+)$/m)?.[1] ?? "bibliografía primaria del tema";
  const level = readme.match(/\*\*Nivel:\*\*\s+([^·\n]+)/)?.[1]?.trim() ?? "Progresivo";
  const refs = references(readme);

  for (const [pairIndex, item] of unit.classes.entries()) {
    const globalIndex = unitIndex * 2 + pairIndex;
    const design = pedagogy[item.id];
    if (!design) throw new Error(`${item.id}: falta diseño pedagógico propio.`);
    const previous = allClasses[globalIndex - 1];
    const next = allClasses[globalIndex + 1];
    const previousLink = previous ? `../${previous.directory}/${classFileName(previous)}` : "../../README.md";
    const nextLink = next ? `../${next.directory}/${classFileName(next)}` : "../../capstone/README.md";
    const content = `# Clase ${item.id} · ${item.title}\n\n> **Clase independiente ${item.id} de 66** · **Nivel:** ${level} · **Fuente base:** ${sourceHeader}\n>\n> [⬅️ Clase anterior](${previousLink}) · [📚 Índice de las 66 clases](../README.md) · [🗂️ Mapa del tema](README.md) · [➡️ Clase siguiente](${nextLink})\n\n${coreSections(item, design, foundations[pairIndex], globalIndex)}\n\n## Fuentes para comprobar y ampliar\n\n${refs}\n\nConsulta además la [bibliografía razonada](../../docs/bibliografia.md), que declara procedencia y uso.\n\n## Cierre de la clase\n\nResponde otra vez la pregunta guía sin mirar notas. Si tu respuesta no menciona evidencia, supuesto y límite, todavía describe el tema pero no lo domina. Continúa solo cuando otra persona pueda reproducir tu entregable.\n`;
    await writeFile(join("curriculum", directory.name, classFileName(item)), content, "utf8");
  }

  const list = unit.classes.map((item) => {
    const design = pedagogy[item.id];
    return `### [Clase ${item.id} · ${item.title}](${classFileName(item)})\n\n${item.question}\n\n**Experiencia propia:** ${design.method}. **Evidencia:** ${item.evidence}`;
  }).join("\n\n");
  const block = `<!-- clases-independientes:inicio -->\n## Las dos clases independientes de este tema\n\nEsta página conserva el mapa, los conceptos compartidos y las referencias. La enseñanza evaluable ocurre en dos documentos separados; cada uno tiene fundamento, gráfico, caso, práctica, evidencia y fuentes propios.\n\n${list}\n<!-- clases-independientes:fin -->`;
  const marker = /<!-- (?:plan-clases|clases-independientes):inicio -->[\s\S]*?<!-- (?:plan-clases|clases-independientes):fin -->/;
  if (!marker.test(readme)) throw new Error(`${readmePath}: no se encontró el bloque de clases.`);
  const updated = readme.replace(marker, block);
  if (updated !== readme) await writeFile(readmePath, updated, "utf8");
}

console.log(`Clases generadas: ${allClasses.length} documentos independientes dentro de ${catalog.length} mapas temáticos.`);
