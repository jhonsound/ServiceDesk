# Diagrama de Entidad-Relación de la Base de Datos

Este documento contiene el diagrama de la base de datos para ServiceDesk Pro, generado en formato Mermaid a partir de las entidades de TypeORM del backend.

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email
        string role
    }

    Category {
        string id PK
        string name
        string description
        int sla_first_response_hours
        int sla_resolution_hours
    }

    CustomField {
        string id PK
        string label
        string type
        bool is_required
        string category_id FK
    }

    Ticket {
        string id PK
        string title
        string description
        string status
        datetime created_at
        datetime sla_resolution_target
        string requester_id FK
        string category_id FK
    }

    TicketHistory {
        string id PK
        string action
        string comment
        datetime created_at
        string ticket_id FK
        string user_id FK
    }

    TicketCustomFieldValue {
        string id PK
        string value
        string ticket_id FK
        string customField_id FK
    }

    User ||--o{ Ticket : "requests"
    Category ||--o{ Ticket : "contains"
    Category ||--o{ CustomField : "defines"
    Ticket ||--o{ TicketHistory : "has"
    User ||--o{ TicketHistory : "performs"
    Ticket ||--o{ TicketCustomFieldValue : "has"
    CustomField ||--o{ TicketCustomFieldValue : "is"
```
