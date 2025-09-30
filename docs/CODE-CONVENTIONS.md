# Code Conventions

Este documento establece las convenciones de código y las mejores prácticas a seguir en el proyecto ServiceDesk Pro. El objetivo es mantener un código base consistente, legible y de alta calidad que facilite la colaboración y el mantenimiento.

## Principios Generales

- **Consistencia:** Sigue los patrones y el estilo del código existente. Antes de introducir una nueva librería o patrón, verifica si ya existe una convención en el proyecto.
- **Claridad sobre Brevedad:** Escribe código que sea fácil de entender. Nombres de variables y funciones descriptivos son más importantes que líneas de código cortas.
- **Sigue las Guías Oficiales:** Adhiérete a las mejores prácticas recomendadas por las tecnologías principales del proyecto: [NestJS](https://docs.nestjs.com/introduction) y [Next.js](https://nextjs.org/docs).

## Formateo y Calidad de Código

El proyecto está configurado con herramientas para automatizar el formato y el análisis estático del código. Es obligatorio usarlas antes de integrar cambios.

- **Prettier:** Se utiliza para el formateo automático del código. Asegura un estilo visual uniforme en todo el proyecto.
- **ESLint:** Se utiliza para identificar y corregir problemas de calidad de código, posibles errores y adherencia a las buenas prácticas.

**Antes de cada commit, ejecuta los siguientes comandos:**

```bash
# En el directorio /backend o /frontend

# Para formatear el código
pnpm format

# Para revisar la calidad del código
pnpm lint
```

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo | Notas |
| :--- | :--- | :--- | :--- |
| Variables y Funciones | `camelCase` | `const ticketService = new TicketService();` | |
| Clases, Interfaces, Enums y Tipos | `PascalCase` | `class Ticket { ... }`, `interface UserProfile { ... }` | |
| Archivos (General) | `kebab-case` | `auth.service.ts`, `create-ticket.dto.ts` | |
| Archivos (Componentes React) | `PascalCase` | `TicketDetailView.tsx` | Los archivos de componentes son la excepción a la regla `kebab-case`. |
| Miembros Privados | `camelCase` | `private calculateSla() { ... }` | Usa la palabra clave `private` de TypeScript. No uses prefijos como `_`. |

## TypeScript Best Practices

- **Tipado Explícito:** Evita el uso de `any`. Siempre que sea posible, define interfaces, tipos o usa los tipos inferidos por el compilador.
- **Interfaces vs. Tipos:**
    - Usa `interface` para definir la forma de objetos y para APIs públicas (ej. props de componentes, DTOs).
    - Usa `type` para tipos de utilidad, uniones, intersecciones, etc.
- **Módulos:** Utiliza siempre los módulos de ES6 (`import` / `export`).
- **Asincronía:** Prefiere `async/await` sobre el encadenamiento de promesas (`.then()`) para operaciones asíncronas, ya que mejora la legibilidad.

## Convenciones de Backend (NestJS)

- **Arquitectura:** Sigue la arquitectura modular estándar de NestJS. La lógica de negocio debe residir en los **Services**, los endpoints en los **Controllers**, y la definición de los módulos en los archivos `*.module.ts`.
- **DTOs (Data Transfer Objects):** Toda la data que entra o sale de la API debe ser validada a través de DTOs que usen `class-validator`.
- **Inyección de Dependencias:** Utiliza el sistema de inyección de dependencias de NestJS. No instancies clases manualmente si pueden ser inyectadas.

## Convenciones de Frontend (Next.js / React)

- **Componentes:** Prefiere **componentes funcionales** con **Hooks** sobre los componentes de clase.
- **Estado:**
    - Para estado local, usa `useState`.
    - Para lógica de estado compleja, usa `useReducer`.
    - Para estado global compartido, usa `useContext` (como se ve en `AuthContext`).
- **Llamadas a API:** Centraliza toda la lógica de comunicación con el backend en el directorio `src/services/api.ts` o hooks personalizados (`useSWR`, `useQuery`) para mantener los componentes limpios.
- **Estructura de Archivos:** Sigue la estructura existente. Los componentes reutilizables van en `src/components`, las páginas en `src/app`, y los estilos globales en `src/app/globals.css`.

## Mensajes de Commit

Se recomienda seguir la especificación de [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Esto facilita la lectura del historial y abre la puerta a la generación automática de changelogs.

**Formato:** `<tipo>(<ámbito opcional>): <descripción>`

- **Tipos comunes:**
    - `feat`: Una nueva funcionalidad.
    - `fix`: Una corrección de bug.
    - `docs`: Cambios en la documentación.
    - `style`: Cambios que no afectan el significado del código (formato, etc.).
    - `refactor`: Un cambio de código que no corrige un bug ni añade una funcionalidad.
    - `test`: Añadir o corregir tests.

**Ejemplo:**

```
feat(tickets): add optimistic locking to status updates
```
