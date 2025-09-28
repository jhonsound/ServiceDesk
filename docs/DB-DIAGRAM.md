erDiagram
    User {
        UUID id PK
        string name
        string email
        enum role
    }
    Category {
        UUID id PK
        string name
        int sla_first_response_hours
        int sla_resolution_hours
    }
    CustomField {
        UUID id PK
        string label
        enum type
        bool is_required
    }
    Ticket {
        UUID id PK
        string title
        text description
        enum status
        timestamp created_at
        timestamp sla_first_response_target
        timestamp sla_resolution_target
        string category_name_snapshot
    }
    TicketCustomFieldValue {
        UUID id PK
        text value
    }

    User ||--o{ Ticket : "creates"}
    Category ||--o{ Ticket : "classifies"}
    Category ||--|{ CustomField : "defines"}
    Ticket ||--|{ TicketCustomFieldValue : "has"}
    CustomField ||--o{ TicketCustomFieldValue : "is instance of"}