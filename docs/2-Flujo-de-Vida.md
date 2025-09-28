F2: Flujo de Vida, Permisos por Rol y Auditoría
Este documento detalla la especificación de negocio y técnica para la segunda funcionalidad clave: la gestión del ciclo de vida de un ticket, el control de acceso basado en roles y el registro de un historial de auditoría.

1. Especificación de Negocio
1.1. Objetivo
Implementar un sistema robusto que permita a los Agents y Managers gestionar el progreso de los tickets a través de un ciclo de vida definido. El sistema debe garantizar que solo los usuarios autorizados puedan realizar ciertas acciones y mantener un registro inmutable de todas las actividades importantes para futuras consultas y análisis.

1.2. Historia de Usuario
Como 

Agent/Manager, quiero operar el ciclo de vida del ticket y ver la bitácora de actividad para comprender qué ocurrió y por quién. 

1.3. Actores Involucrados
Agent: El actor principal que atiende y resuelve los tickets.

Manager: Supervisa la operación, puede intervenir en los tickets y necesita visibilidad del historial.

Requester: Aunque no es el actor principal de la historia, interactúa con el ciclo de vida al reabrir o cerrar tickets resueltos.

1.4. Flujo de Estados (Ciclo de Vida)
Se define el siguiente conjunto de estados y transiciones para un ticket:

Abierto (Open): Estado inicial. El ticket espera ser asignado o tomado por un Agent.

En Progreso (In Progress): Un Agent está trabajando activamente en la solución.

Resuelto (Resolved): El Agent considera que la solicitud ha sido completada. Se espera la confirmación del Requester.

Cerrado (Closed): El Requester ha confirmado la solución o ha pasado un tiempo definido sin respuesta. El ticket se archiva.

1.5. Matriz de Permisos por Rol
La siguiente tabla define qué rol puede ejecutar qué transición o acción clave:

Acción	Requester	Agent	Manager
Ver sus tickets	✅	N/A	N/A
Ver TODOS los tickets	❌	✅	✅
Tomar ticket (Open -> In Progress)	❌	✅	✅
Resolver ticket (In Progress -> Resolved)	❌	✅	✅
Reabrir ticket (Resolved -> In Progress)	✅	❌	✅
Cerrar ticket (Resolved -> Closed)	✅	✅	✅
Añadir comentarios	✅	✅	✅
1.6. Criterios de Aceptación
[ ] El sistema implementa un conjunto coherente de estados y transiciones para los tickets (Open, In Progress, Resolved, Closed).

[ ] Se aplican reglas estrictas basadas en roles para determinar qué usuario puede ejecutar qué transición de estado.

[ ] Todas las acciones clave (cambios de estado, asignaciones, comentarios) generan un registro en una bitácora de auditoría consultable.

[ ] El sistema de auditoría registra quién realizó la acción, qué acción fue y cuándo ocurrió.

[ ] Se implementa un mecanismo básico de manejo de concurrencia para prevenir que dos usuarios modifiquen el mismo ticket simultáneamente y se sobrescriban los datos silenciosamente.

2. Especificación Técnica
2.1. Modelo de Datos (Nuevas Entidades y Modificaciones)
Modificación a la entidad Ticket:

Se añade una columna version: number. Se inicializa en 1 y se incrementa en cada actualización para el bloqueo optimista.

Nueva entidad TicketHistory:

id: UUID (Primary Key)

ticket_id: FK a Ticket

user_id: FK a User (el autor del cambio)

action: enum (STATUS_CHANGE, COMMENT_ADDED, TICKET_CREATED)

old_value: string (nullable)

new_value: string (nullable)

comment: text (nullable, para cuando la acción es añadir un comentario)

created_at: timestamp

2.2. Contratos de API (Endpoints)
Se añadirán los siguientes endpoints para gestionar el ciclo de vida y la visualización de tickets:

GET /api/tickets

Descripción: Obtiene una lista paginada de tickets. Se pueden añadir filtros por estado o requester.

Respuesta Exitosa (200): [{ id, title, status, requester: { name }, created_at }]

GET /api/tickets/:id

Descripción: Obtiene los detalles completos de un solo ticket, incluyendo su historial de auditoría.

Respuesta Exitosa (200): { id, title, description, status, ..., history: [{ user: { name }, action, old_value, new_value, created_at }] }

PATCH /api/tickets/:id/status

Descripción: Cambia el estado de un ticket. Implementa la lógica de permisos y concurrencia.

Cuerpo de la Petición (Body): { "newStatus": "in_progress", "version": 1 }

Respuesta Exitosa (200): El ticket actualizado.

Respuesta de Error (403 Forbidden): Si el usuario no tiene permisos para la transición.

Respuesta de Error (409 Conflict): Si la version no coincide (conflicto de concurrencia).

2.3. Lógica de Negocio Clave
Manejo de Concurrencia (Bloqueo Optimista):

Cualquier endpoint que modifique un ticket (ej: PATCH /.../status) debe recibir la version actual del ticket desde el frontend.

El servicio de backend, dentro de una transacción de base de datos, buscará el ticket y comparará su version con la recibida.

Si coinciden, procede con la actualización e incrementa la version en 1.

Si no coinciden, aborta la transacción y devuelve un error 409 Conflict.

Sistema de Auditoría:

Cualquier método del servicio que realice una acción significativa (crear ticket, cambiar estado) debe también crear y guardar un registro en la entidad TicketHistory.

Este registro contendrá el ID del usuario que realiza la acción (obtenido de la sesión de autenticación), la acción realizada y los valores relevantes.

3. Diagramas
3.1. Diagrama de Flujo de Estados
Fragmento de código

stateDiagram-v2
    [*] --> Open
    Open --> In_Progress: Agent/Manager toma ticket
    In_Progress --> Resolved: Agent/Manager resuelve
    Resolved --> In_Progress: Requester/Manager reabre
    Resolved --> Closed: Requester/Agent/Manager cierra
    Closed --> [*]
3.2. Diagrama de Entidad-Relación (ERD) - Actualizado
Fragmento de código

erDiagram
    User {
        UUID id PK
        string name
        enum role
    }
    Ticket {
        UUID id PK
        string title
        enum status
        int version
    }
    TicketHistory {
        UUID id PK
        enum action
        string old_value
        string new_value
        timestamp created_at
    }

    User ||--o{ Ticket : "creates"
    User ||--o{ TicketHistory : "performs"
    Ticket ||--|{ TicketHistory : "has"
    %% --- Relaciones de F1 ---
    Category ||--o{ Ticket : "classifies"
    Ticket ||--|{ TicketCustomFieldValue : "has"
    CustomField ||--o{ TicketCustomFieldValue : "is instance of"
4. Plan de Implementación
4.1. Pasos de Desarrollo (Backend)
[ ] Modificar la entidad Ticket para añadir la columna version.

[ ] Crear la nueva entidad TicketHistory y su relación con Ticket y User.

[ ] Actualizar el script de seed para que los tickets se creen con version: 1.

[ ] Implementar el TicketHistoryService para encapsular la lógica de creación de registros de auditoría.

[ ] En el TicketsService, implementar la lógica de bloqueo optimista en todos los métodos de actualización.

[ ] En el TicketsService, implementar la lógica de permisos basada en roles para las transiciones de estado.

[ ] Crear/actualizar los controladores y DTOs para los nuevos endpoints (GET /tickets, GET /tickets/:id, PATCH /.../status).

4.2. Pasos de Desarrollo (Frontend)
[ ] Crear una nueva página en /tickets para mostrar la lista de tickets.

[ ] Crear una página dinámica en /tickets/[id] para mostrar los detalles de un ticket.

[ ] En la página de detalles, desarrollar un componente para renderizar la TicketHistory a modo de línea de tiempo o lista de actividades.

[ ] En la página de detalles, mostrar botones de acción (Resolver, Cerrar, etc.) condicionalmente, basándose en el rol del usuario (simulado por ahora) y el estado actual del ticket.

[ ] Implementar las llamadas a la API para las acciones, enviando la version del ticket y manejando los posibles errores de concurrencia (409) mostrando un mensaje al usuario.

4.3. Uso de Inteligencia Artificial (AI-USAGE)
Prompt para Lógica de Negocio: "Generate a NestJS service method changeStatus(ticketId, newStatus, userId, version) for a 'Ticket' entity. It must use optimistic locking with a 'version' field. It should also check permissions from a predefined role matrix and create a TicketHistory record after a successful update."

Prompt para Componente de UI: "Generate a React component using Tailwind CSS called 'TicketTimeline' that takes an array of history events (user, action, date) and displays them as a vertical timeline."