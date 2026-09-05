---
name: hexagonal-architecture-bun-ts
description: Definir la organización arquitectónica de GitKamaji mediante Arquitectura Hexagonal (Ports & Adapters) con estructura app/ + context/, puertos como interfaces de TypeScript y dominio desacoplado de Bun, Windows y WSL.
metadata:
  origin: Custom-Bun-Hexagonal
---

# Arquitectura Hexagonal de GitKamaji

Esta skill define cómo debe organizarse arquitectónicamente todo GitKamaji. Es aplicable a:

- Código nuevo.
- Nuevas funcionalidades.
- Refactorizaciones futuras.
- Cualquier bounded context que se agregue posteriormente.

No indica qué archivo existente debe convertirse en infraestructura: el agente debe deducir la ubicación correcta de cada pieza aplicando las reglas arquitectónicas.

## Arquitectura general

GitKamaji utiliza Arquitectura Hexagonal, también conocida como Ports and Adapters. La dependencia fluye hacia el interior:

```text
Entrypoints / Adaptadores de entrada
        ↓
Application / Casos de uso
        ↓
Domain / Reglas de negocio
        ↑
Adaptadores de salida / Infraestructura
```

El dominio y la aplicación no dependen de tecnologías externas. Los adaptadores dependen de los contratos definidos por las capas internas.

La arquitectura separa tres responsabilidades:

- `domain`: reglas de negocio y modelos propios del negocio.
- `application`: casos de uso y contratos que necesita la aplicación.
- `infrastructure`: implementaciones concretas para interactuar con el sistema operativo, archivos, procesos, WSL, Git u otras tecnologías.

## Estructura obligatoria

El directorio `src/context/` debe existir desde el principio, aunque inicialmente solo haya uno o pocos bounded contexts.

La estructura general será:

```text
src/
├── app/
│   └── entrypoints/
│       ├── git.ts
│       ├── bash.ts
│       └── sh.ts
└── context/
    └── <bounded-context>/
        ├── domain/
        │   ├── entities/
        │   ├── value-objects/
        │   ├── services/
        │   └── errors/
        ├── application/
        │   ├── ports/
        │   │   ├── in/
        │   │   └── out/
        │   └── use-cases/
        └── infrastructure/
            ├── adapters/
            └── mappers/
```

El agente debe crear los bounded contexts según las necesidades reales del proyecto. Esta skill no decide de antemano cuáles existirán.

No se debe crear una estructura `features/` alternativa. La organización principal del proyecto será `app/` y `context/`.

## Responsabilidad de `app`

`src/app/` representa el arranque de la aplicación, no el dominio.

Puede contener:

- Entrypoints ejecutables.
- Lectura inicial de argumentos.
- Lectura de configuración externa.
- Creación de adaptadores concretos.
- Composición de casos de uso.
- Traducción del resultado final a un código de salida.

Cada entrypoint debe tener su propio flujo de composición:

- `git.ts` ejecuta su caso de uso correspondiente.
- `bash.ts` ejecuta su propio flujo.
- `sh.ts` ejecuta su propio flujo.

No deben tratarse como simples nombres alternativos para una misma implementación. Pueden compartir componentes cuando tengan una responsabilidad genuinamente común, pero cada entrypoint debe mantener claro qué dependencias necesita y cómo se compone.

## Puertos

Los puertos serán interfaces de TypeScript. No se deben utilizar clases abstractas como puertos:

```ts
export interface CommandExecutorPort {
  execute(command: Command): Promise<ExecutionResult>;
}
```

Los puertos son contratos arquitectónicos y la inversión de dependencias no requiere que exista un token en runtime. La composición se realiza pasando implementaciones concretas mediante constructores.

Un puerto debe ser definido por la capa que necesita una colaboración, no por el adaptador que la implementa.

### Puertos de entrada

Los puertos de entrada representan las capacidades que la aplicación ofrece:

```text
application/ports/in/
```

Normalmente los implementan los casos de uso.

### Puertos de salida

Los puertos de salida representan las dependencias que un caso de uso necesita:

```text
application/ports/out/
```

Los implementan los adaptadores de infraestructura.

Un puerto no debe exponer tipos propios de Bun, Node.js, Windows, WSL o `child_process`. Debe utilizar tipos pertenecientes al dominio o a la aplicación.

## Casos de uso

Cada caso de uso debe tener una responsabilidad clara y estar aislado de la infraestructura.

Un caso de uso puede:

- Validar una operación de aplicación.
- Coordinar entidades y servicios de dominio.
- Invocar puertos de salida.
- Devolver un resultado de aplicación.
- Propagar errores significativos.

Un caso de uso no puede:

- Leer `process.argv`.
- Leer directamente `process.env`.
- Ejecutar `child_process`.
- Usar `Bun.file`, `Bun.write` o APIs equivalentes.
- Escribir en consola.
- Instanciar adaptadores concretos.
- Invocar `process.exit()`.

## Adaptadores

Los adaptadores traducen entre el mundo externo y los contratos internos.

Los adaptadores de entrada pueden:

- Leer argumentos del proceso.
- Convertir argumentos en inputs de aplicación.
- Invocar puertos de entrada.
- Presentar resultados o errores.
- Definir el código de salida final en el límite del proceso.

Los adaptadores de salida pueden:

- Ejecutar `wsl` o `git`.
- Usar `child_process`.
- Leer y escribir archivos.
- Acceder a variables de entorno.
- Utilizar APIs de Bun o Node.js.
- Traducir datos externos a modelos internos.

Un adaptador no debe llamar directamente a otro adaptador. La comunicación debe pasar por un caso de uso o por un puerto.

## Entry points y finalización del proceso

`process.argv` debe interpretarse en los entrypoints o en los adaptadores de entrada.

El dominio y la aplicación no deben conocer el ciclo de vida del proceso.

Los casos de uso deben devolver resultados o lanzar errores. El entrypoint debe decidir cómo representar ese resultado para el proceso, preferiblemente mediante:

```ts
process.exitCode = result.exitCode;
```

`process.exit()` no debe utilizarse dentro del dominio, los casos de uso ni los adaptadores reutilizables.

## Dependencias externas

Estas APIs solo pueden aparecer en infraestructura o en el borde de la aplicación:

- `child_process`
- `fs`
- `path`
- `process.argv`
- `process.env`
- `process.exitCode`
- APIs globales de `Bun`
- APIs específicas de Windows
- Comandos o rutas específicas de WSL
- Ejecución de Git mediante procesos externos

El dominio no debe saber que GitKamaji se ejecuta sobre Windows, utiliza WSL o está construido con Bun.

## Configuración

No existe un directorio obligatorio llamado `app/config`. La regla es conceptual:

> La configuración externa se carga en el borde de la aplicación, se valida y se transforma en datos tipados antes de entrar en los casos de uso. El dominio no accede directamente a archivos, variables de entorno ni argumentos de consola.

La ubicación concreta de cada configuración dependerá de su responsabilidad:

- Configuración del arranque: `app`.
- Configuración cargada desde archivos: adaptador de infraestructura.
- Configuración que representa una regla del negocio: bounded context correspondiente.
- Configuración requerida por un caso de uso: contrato definido en `application`.

## Composición de dependencias

La inyección se realizará pasando dependencias explícitamente mediante constructores:

```ts
const executor = new WslCommandExecutor();
const useCase = new ExecuteCommandUseCase(executor);
const entrypoint = new GitEntrypoint(useCase);
```

Las implementaciones concretas solo deben crearse en `src/app/entrypoints` o en una composición claramente perteneciente a `app`.

La aplicación no debe crear sus propias dependencias.

Esta skill no incluye decisiones permanentes sobre librerías externas de inyección de dependencias.

## Bounded contexts

Un bounded context es un límite explícito dentro del cual un modelo de dominio, sus casos de uso y sus puertos son coherentes y tienen un significado único. Esta skill no decide cuáles tendrá GitKamaji: el agente los crea según las necesidades reales del proyecto.

Cada bounded context debe:

- Mantener sus propias reglas de dominio.
- Tener sus propios casos de uso.
- Definir sus propios puertos.
- Encapsular sus adaptadores.
- Evitar depender directamente de las entidades internas de otro contexto.

`shared/` no debe añadirse por defecto. Solo debe utilizarse para conceptos estables y verdaderamente compartidos.
