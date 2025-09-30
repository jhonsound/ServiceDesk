# Uso de Inteligencia Artificial en el Proyecto

Este documento centraliza la estrategia y los ejemplos concretos del uso de herramientas de Inteligencia Artificial (IA) durante el desarrollo del sistema ServiceDesk Pro. La filosofía principal ha sido emplear la IA como una **herramienta de productividad y aceleración**, no como un sustituto del razonamiento y la arquitectura de software.

## Filosofía de Uso

La IA se utilizó para:
- **Generar código boilerplate:** Creación de estructuras repetitivas en controladores, servicios y componentes.
- **Resolver problemas algorítmicos aislados:** Desarrollo de consultas de base de datos complejas o funciones de lógica de negocio específicas.
- **Asistir en el desarrollo de UI:** Creación de componentes de React basados en descripciones de alto nivel.
- **Generar datos de prueba:** Población de scripts de `seed` con datos realistas y estructurados.

Todo el código generado por IA fue **revisado, refactorizado y adaptado** por un desarrollador para asegurar que cumpliera con las convenciones del proyecto, las mejores prácticas y los requisitos de negocio.

## Ejemplos de Prompts Utilizados

A continuación, se listan algunos de los prompts que se entregaron a modelos como ChatGPT y GitHub Copilot durante el proyecto.

### Backend (NestJS & TypeORM)

1.  **Generación de Servicio con Lógica de Creación:**
    > "Generate a NestJS service with TypeORM for a 'Ticket' entity. It should have a `create` method that takes a DTO with `title`, `description`, `categoryId`, and `customFieldValues`. The method must find the category, calculate SLA target dates, and save the ticket."

2.  **Implementación de Lógica de Negocio con Bloqueo Optimista:**
    > "Generate a NestJS service method `changeStatus(ticketId, newStatus, userId, version)` for a 'Ticket' entity. It must use optimistic locking with a 'version' field. It should also check permissions from a predefined role matrix and create a `TicketHistory` record after a successful update."

3.  **Creación de Consulta Compleja para KPIs:**
    > "Generate a TypeORM Query Builder query in a NestJS service to calculate 'SLA Compliance Percentage'. I have a 'Ticket' entity and a 'TicketHistory' entity. A ticket is compliant if the timestamp of its first history entry with `new_value: 'resolved'` is less than or equal to the ticket's `sla_resolution_target` property."

### Frontend (React & Tailwind CSS)

1.  **Asistencia General:**
    - Se utilizó **GitHub Copilot** de forma extensiva para autocompletar la estructura de los componentes de React, los campos de formulario y las llamadas a servicios, acelerando significativamente el desarrollo de la interfaz.

2.  **Generación de Componente de UI (Timeline):**
    > "Generate a React component using Tailwind CSS called 'TicketTimeline' that takes an array of history events (user, action, date) and displays them as a vertical timeline."

3.  **Generación de Componente de UI (Card para KPIs):**
    > "Generate a React component with Tailwind CSS called 'KpiCard' that accepts a title, value, and description as props and displays them in a modern, clean card layout."

### Generación de Datos

1.  **Creación de Datos de Prueba (Seed):**
    > "Generate a realistic JSON array with 5 ticket categories for a software company, including SLA in hours and 2-3 custom fields for each."

## Conclusión

El uso estratégico de la IA permitió al equipo de desarrollo centrarse más en la arquitectura del sistema, la lógica de negocio de alto nivel y la experiencia de usuario, delegando tareas repetitivas y de bajo nivel a las herramientas de IA. Esto resultó en un ciclo de desarrollo más rápido y eficiente.
