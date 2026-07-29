# 07 · Aplicaciones descentralizadas

> **Nivel:** Intermedio-Avanzado · ⏱️ **Duración estimada:** 150 min · **Fuente:** documentación de ethereum.org y de viem
> [⬅️ Currículo](../README.md) · [📚 Bibliografía](../../docs/bibliografia.md)

---

## 🎯 Objetivos

- Describir las partes de una dApp: interfaz, proveedor RPC, wallet, contratos, indexación y servicios externos.
- Distinguir lecturas públicas de escrituras firmadas y cuándo cada una requiere una wallet.
- Simular una transacción antes de enviarla para anticipar su efecto y sus fallos.
- Interpretar los estados de una transacción: pending, confirmed, replaced y reverted.
- Construir una interfaz que muestre contrato, red, valor y efecto esperado antes de pedir la firma.

## 📚 Resultados de aprendizaje

Al finalizar, el estudiante podrá:

1. **Diagramar** el flujo de datos de una dApp y ubicar dónde vive la fuente de verdad.
2. **Separar** llamadas de solo lectura de transacciones que modifican estado.
3. **Simular** una operación con una llamada previa antes de solicitar la firma.
4. **Mostrar** al usuario el efecto esperado, la red y el contrato antes de firmar.
5. **Gestionar** decimales, unidades y approvals con una UX que evite errores.
6. **Mitigar** la dependencia de un RPC no confiable mediante redundancia y verificación.

## 🗺️ Temas

| # | Tema | Por qué importa |
|---|---|---|
| 1 | Anatomía de una dApp | La interfaz no es fuente de verdad; el estado vive en la cadena. |
| 2 | Conexión y cambio de red | Firmar en la red equivocada arruina la operación. |
| 3 | Lectura vs. escritura | Diferencia lo gratuito y sin riesgo de lo que gasta y compromete. |
| 4 | Simulación previa | Anticipa reverts y efectos antes de gastar gas. |
| 5 | Estados de transacción | Permite dar feedback honesto y manejar reemplazos. |
| 6 | Decimales y approvals | Un error de unidades o un approval abierto expone fondos. |
| 7 | RPC no confiable | Un proveedor único puede mentir o caerse; la redundancia protege. |
| 8 | Firmas legibles (EIP-712) | Muestran al usuario qué está firmando en lenguaje comprensible. |

## 🧠 Modelo mental

Piensa en la dApp como el mostrador de un banco y en la blockchain como la bóveda del fondo. El cajero (la interfaz) te enseña saldos y formularios, pero no guarda el dinero: solo transmite tus órdenes firmadas a la bóveda, donde ocurre lo real. Si el cajero muestra una cifra bonita pero la bóveda dice otra cosa, la bóveda siempre gana. Antes de firmar, un buen mostrador te lee en voz alta a quién pagas, cuánto y en qué red.

La analogía tiene un límite importante: en la banca tradicional confías en una sola sucursal, mientras que aquí el "cajero" consulta a través de un proveedor RPC que podría estar equivocado o ser malicioso. Por eso la interfaz debe tratar sus propios datos como provisionales, simular antes de enviar y, cuando importa, contrastar con más de una fuente en lugar de creer ciegamente a un único RPC.

## 📖 Conceptos y definiciones

- **Proveedor RPC**: servicio que la dApp consulta para leer estado y difundir transacciones; puede ser no confiable.
- **Lectura pública**: consulta de solo lectura que no cuesta gas ni requiere firma, por ejemplo un `eth_call`.
- **Escritura firmada**: transacción que modifica estado, requiere firma de la wallet y consume gas.
- **Simulación**: ejecución previa (mediante `eth_call` o simulate) que predice el resultado sin enviarlo.
- **Estado pending**: transacción difundida y aún no incluida en un bloque.
- **Estado replaced**: transacción sustituida por otra con el mismo nonce y mayor comisión.
- **Estado reverted**: transacción incluida pero cuya ejecución falló y deshizo sus efectos.
- **Approval**: permiso que autoriza a un contrato a mover tus tokens; un límite abierto es un riesgo.
- **Decimales y unidades**: los tokens usan enteros escalados; confundir unidades altera el monto real.
- **EIP-712**: estándar de firma de datos estructurados que hace legible para el usuario qué está firmando.

## 🧪 Laboratorio guiado

1. Levanta el panel del repositorio para navegar los recursos del curso.

```bash
pnpm serve
```

2. Compila la aplicación web del repositorio, ubicada en `apps/community-funding-web`.

```bash
pnpm build:web
```

3. En la interfaz del Vault construida con TypeScript y viem, conecta una wallet y verifica la red activa.
4. Realiza una lectura pública del estado del contrato y muéstrala sin pedir firma.
5. Simula una escritura y presenta al usuario contrato, red, valor y efecto esperado antes de firmar.
6. Provoca un caso de revert en la simulación y confirma que la interfaz lo comunica con claridad.

## 📝 Reto verificable

Entrega una interfaz para el Vault que, antes de solicitar cualquier firma, muestre la dirección del contrato, la red, el valor y el efecto esperado, y que simule la operación previamente.

**Criterio de aceptación:** la interfaz bloquea la firma si la red no coincide, muestra el efecto simulado con unidades correctas y comunica explícitamente los estados pending, confirmed y reverted.

## ⚠️ Errores frecuentes

| Síntoma | Causa y cómo comprobarlo |
|---|---|
| La UI muestra un saldo que la cadena desmiente | Tratas la interfaz como fuente de verdad; relee el estado desde el RPC. |
| El usuario firma en la red equivocada | No validas chain id antes de firmar; bloquea la acción hasta cambiar de red. |
| El monto enviado es mil veces mayor | Confundiste decimales/unidades; convierte con la función adecuada y verifica. |
| Approval deja fondos expuestos | Autorizaste un límite abierto; usa montos acotados y revócalos tras usarlos. |
| La transacción "desaparece" | Fue replaced por mismo nonce y mayor fee; sigue el nonce, no solo el hash. |

## 🛡️ Seguridad y ética

- Trabaja en local o testnet; nunca uses fondos ni claves reales en los laboratorios.
- Simula siempre antes de enviar y muestra el efecto esperado antes de pedir la firma.
- No confíes en un único RPC: contrasta datos críticos y prevé su indisponibilidad.
- Prefiere firmas legibles con EIP-712 para que el usuario entienda qué autoriza.
- Evita approvals ilimitados y explica sus riesgos; las condiciones de red cambian, consúltalo en vivo.

## 🔗 Referencias

- Documentación de ethereum.org sobre dApps — <https://ethereum.org/developers/docs/dapps/>
- Documentación de viem, guías de clientes y acciones — <https://viem.sh/>
- Documentación de wagmi, hooks para interfaces React — <https://wagmi.sh/>
- Fuente primaria: EIP-712, firma de datos estructurados — <https://eips.ethereum.org/EIPS/eip-712>

## ✅ Criterio de dominio

- Explicas por qué la interfaz no es fuente de verdad y dónde vive el estado real.
- Muestras contrato, red, valor y efecto esperado antes de solicitar una firma.
- Manejas los estados de una transacción y justificas la redundancia de RPC.

---

## 🧭 Navegación

⬅️ [Módulo 06 · Solidity y Foundry](../06-solidity-foundry/README.md) · [📚 Índice del currículo](../README.md) · ➡️ [Módulo 08 · Tokens y estándares](../08-tokens/README.md)
