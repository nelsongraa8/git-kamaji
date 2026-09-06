# AGENT.md — Guía para agentes de código

Instrucciones y convenciones para trabajar en este repositorio.

## ¿Qué es GitKamaji?

GitKamaji es un **traductor/proxy de Git**: permite ejecutar clientes de Git con GUI desde **Windows**, mientras que todos los comandos de Git se ejecutan realmente **dentro de una distro WSL** donde residen los proyectos.

**Objetivo:** usar tu gestor de Git favorito en Windows sin salir del ecosistema WSL, ya que sin este proxy no existe acceso directo al ejecutable `git` dentro de la distro.

## Stack técnico

| Herramienta | Versión |
| ----------- | ------- |
| Runtime     | [Bun](https://bun.sh) 1.4 |
| Lenguaje    | TypeScript (ESNext, modo estricto) |
| Target      | Binarios Windows x64 (`bun build --compile`) |

## Estructura del proyecto

```text
src/            → Todo el código fuente compilable vive aquí
tests/          → Todos los tests viven aquí
dist/           → Salida de compilación (generada, no editar ni explorar)
```

### Archivos y directorios que debes ignorar

No pierdas tiempo buscando ni leyendo lo siguiente:

- `bun.lock`
- `LICENSE`
- `README.md`
- `/dist` (artefactos compilados)

Concéntrate en `src/` y `tests/`.

## Arquitectura

El proyecto sigue una **arquitectura hexagonal** (puertos y adaptadores):

- El dominio y los casos de uso no dependen de detalles de infraestructura.
- Las dependencias apuntan siempre hacia el interior (dominio).

Al añadir código nuevo, respeta esta separación de capas.

## Convenciones de tests

1. **Object Mother:** todos los datos de prueba se crean mediante object mothers; no construyas objetos de test "a mano" dentro de cada caso.
2. **Un solo `expect` por test:** cada test debe verificar exactamente una cosa. Evita acumular múltiples `expect` en un mismo test.
3. **Un spec por archivo:** cada archivo de test debe cubrir una única unidad bajo prueba. No mezcles varias clases, casos de uso o capas en el mismo archivo.
