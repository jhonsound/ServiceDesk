# Diagrama de Entidad-Relación de la Base de Datos

Este documento contiene el diagrama de la base de datos para ServiceDesk Pro, generado en formato Mermaid. El diagrama refleja la estructura de las entidades de TypeORM definidas en el backend.

```mermaid
erDiagram
    User {
        UUID id PK
        string name
        string email
        UserRole role
    }

    Category {
        UUID id PK
        string name
        string description
        int sla_first_response_hours
        int sla_resolution_hours
    }

    CustomField {
        UUID id PK
        string label
        FieldType type
        bool is_required
    }

    Ticket {
        UUID id PK
        string title
        string description
        TicketStatus status
        int version
        timestamp created_at
        timestamp sla_first_response_target
        timestamp sla_resolution_target
        string category_name_snapshot
    }

    TicketHistory {
        UUID id PK
        ActionType action
        string old_value
        string new_value
        string comment
        timestamp created_at
    }

    TicketCustomFieldValue {
        UUID id PK
        string value
    }

    User ||--o{ Ticket : requester
    User ||--o{ TicketHistory : user

    Category ||--o{ Ticket : category
    Category ||--|{ CustomField : "has"

    Ticket ||--|{ TicketHistory : "has"
    Ticket ||--|{ TicketCustomFieldValue : "has value for"

    CustomField ||--o{ TicketCustomFieldValue : customField

```

### Tipos de Enumeración (Enums)

- **UserRole:** `requester`, `agent`, `manager`
- **FieldType:** `text`, `textarea`, `select`
- **TicketStatus:** `open`, `in_progress`, `resolved`, `closed`
- **ActionType:** `ticket_created`, `status_change`, `comment_added`