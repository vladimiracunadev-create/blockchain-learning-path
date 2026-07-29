# 01 · Criptografía aplicada

## Objetivos

- Entender hash, preimagen, colisiones y efecto avalancha.
- Usar criptografía asimétrica y firmas sin confundir cifrado con autenticación.
- Construir y verificar una prueba de Merkle.

## Modelo mental

El hash permite detectar cambios; la firma vincula una clave con un mensaje; el árbol de Merkle resume muchos elementos y permite pruebas pequeñas. Ninguno de estos mecanismos determina por sí solo qué historial es válido: eso corresponde al consenso.

## Prácticas

```bash
pnpm lab:hash
pnpm lab:merkle
pnpm test
```

Modifica una transacción y observa cómo cambia la raíz. Luego documenta por qué guardar contraseñas con un hash rápido como SHA-256 es una mala práctica.

## Riesgos

- Reutilización o filtración de claves.
- Firmar bytes distintos de lo que la interfaz muestra.
- Mala generación de aleatoriedad.
- Confundir una dirección con una identidad legal.
