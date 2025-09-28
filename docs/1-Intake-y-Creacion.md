F1: Intake y Creación de Tickets por Categoría
Este documento detalla la especificación de negocio y técnica para la primera funcionalidad clave del sistema ServiceDesk Pro: la creación de tickets por parte de los usuarios.

1. Especificación de Negocio
1.1. Objetivo
Permitir que los empleados (Requesters) puedan registrar solicitudes de soporte de manera estructurada y guiada, asegurando que el equipo de soporte (Agents) reciba toda la información necesaria desde el principio y que los objetivos de servicio (SLA) se establezcan correctamente.

1.2. Historia de Usuario
Como 

Requester, quiero crear un ticket seleccionando una categoría preconfigurada por el Manager para que el sistema me solicite la información adecuada y se fijen objetivos de SLA coherentes.

1.3. Actores Involucrados

Requester (Empleado): El actor principal que crea el ticket.


Manager: El actor que pre-configura las categorías, sus campos y sus SLAs, pero no participa directamente en la creación del ticket.


1.4. Criterios de Aceptación
[ ] Las categorías, sus campos adicionales (obligatorios/opcionales) y sus SLA son gestionados exclusivamente por el 

Manager.

[ ] El 

Requester no puede crear ni editar categorías; su única interacción es seleccionarlas de una lista y completar los campos definidos.

[ ] Al seleccionar una categoría en el formulario de creación, la interfaz de usuario (UI) debe mostrar dinámicamente los campos adicionales específicos de esa categoría.

[ ] El sistema debe persistir los valores de los campos del ticket y, crucialmente, una "instantánea" de la categoría y los valores de SLA vigentes al momento de la creación.

[ ] El formulario debe tener validaciones de negocio claras y mostrar mensajes de error útiles al usuario si la información está incompleta o es incorrecta.

2. Especificación Técnica
2.1. Modelo de Datos (Entidades)
Para esta funcionalidad, se proponen las siguientes entidades en la base de datos PostgreSQL:

User: Almacena a los usuarios del sistema.

id: UUID (Primary Key)

name: string

email: string (unique)


role: enum (requester, agent, manager) 

Category: Almacena las plantillas para los tickets.

id: UUID (Primary Key)

name: string (e.g., "Falla en Pipeline", "Acceso a Repositorio")

sla_first_response_hours: integer

sla_resolution_hours: integer

CustomField: Define las plantillas para los campos dinámicos.

id: UUID (Primary Key)

category_id: FK a Category

label: string (e.g., "Nombre del Repositorio", "URL del Pipeline")

type: enum (text, textarea, select)

is_required: boolean

Ticket: El registro principal de la solicitud.

id: UUID (Primary Key)

title: string

description: text

status: enum (open, in_progress, etc.)

requester_id: FK a User

category_id: FK a Category

created_at: timestamp

sla_first_response_target: timestamp (calculado al crear)

sla_resolution_target: timestamp (calculado al crear)


category_name_snapshot: string (Instantánea del nombre de la categoría) 

TicketCustomFieldValue: Almacena los valores de los campos dinámicos para cada ticket.

id: UUID (Primary Key)

ticket_id: FK a Ticket

custom_field_id: FK a CustomField

value: text

2.2. Contratos de API (Endpoints)
La comunicación entre el Frontend (Next.js) y el Backend (NestJS) se realizará a través de los siguientes endpoints RESTful:

GET /api/categories

Descripción: Obtiene la lista de todas las categorías disponibles con sus campos personalizados para que el Requester pueda elegir una.

Respuesta Exitosa (200): [{ id, name, customFields: [{ id, label, type, is_required }] }]

POST /api/tickets

Descripción: Crea un nuevo ticket de soporte.

Cuerpo de la Petición (Body):

{
  "title": "string",
  "description": "string",
  "categoryId": "uuid",
  "customFieldValues": [
    { "customFieldId": "uuid", "value": "string" }
  ]
}

Respuesta Exitosa (201): { "id": "uuid", "message": "Ticket created successfully" }

Respuesta de Error (400): { "statusCode": 400, "message": ["title must be a string", "categoryId is required"] }

¡Excelente! Aquí tienes una propuesta completa y detallada para el documento F1-Intake-y-Creacion.md.

Este documento está diseñado para impresionar. No solo cumple con lo que piden, sino que añade detalles que demuestran un pensamiento de producto y una planificación técnica sólida. Copia y pega este contenido en tu archivo.


F1: Intake y Creación de Tickets por Categoría
Este documento detalla la especificación de negocio y técnica para la primera funcionalidad clave del sistema ServiceDesk Pro: la creación de tickets por parte de los usuarios.

1. Especificación de Negocio
1.1. Objetivo
Permitir que los empleados (Requesters) puedan registrar solicitudes de soporte de manera estructurada y guiada, asegurando que el equipo de soporte (Agents) reciba toda la información necesaria desde el principio y que los objetivos de servicio (SLA) se establezcan correctamente.

1.2. Historia de Usuario
Como 

Requester, quiero crear un ticket seleccionando una categoría preconfigurada por el Manager para que el sistema me solicite la información adecuada y se fijen objetivos de SLA coherentes.

1.3. Actores Involucrados

Requester (Empleado): El actor principal que crea el ticket.


Manager: El actor que pre-configura las categorías, sus campos y sus SLAs, pero no participa directamente en la creación del ticket.


1.4. Criterios de Aceptación
[ ] Las categorías, sus campos adicionales (obligatorios/opcionales) y sus SLA son gestionados exclusivamente por el 

Manager.

[ ] El 

Requester no puede crear ni editar categorías; su única interacción es seleccionarlas de una lista y completar los campos definidos.

[ ] Al seleccionar una categoría en el formulario de creación, la interfaz de usuario (UI) debe mostrar dinámicamente los campos adicionales específicos de esa categoría.

[ ] El sistema debe persistir los valores de los campos del ticket y, crucialmente, una "instantánea" de la categoría y los valores de SLA vigentes al momento de la creación.

[ ] El formulario debe tener validaciones de negocio claras y mostrar mensajes de error útiles al usuario si la información está incompleta o es incorrecta.

2. Especificación Técnica
2.1. Modelo de Datos (Entidades)
Para esta funcionalidad, se proponen las siguientes entidades en la base de datos PostgreSQL:

User: Almacena a los usuarios del sistema.

id: UUID (Primary Key)

name: string

email: string (unique)


role: enum (requester, agent, manager) 

Category: Almacena las plantillas para los tickets.

id: UUID (Primary Key)

name: string (e.g., "Falla en Pipeline", "Acceso a Repositorio")

sla_first_response_hours: integer

sla_resolution_hours: integer

CustomField: Define las plantillas para los campos dinámicos.

id: UUID (Primary Key)

category_id: FK a Category

label: string (e.g., "Nombre del Repositorio", "URL del Pipeline")

type: enum (text, textarea, select)

is_required: boolean

Ticket: El registro principal de la solicitud.

id: UUID (Primary Key)

title: string

description: text

status: enum (open, in_progress, etc.)

requester_id: FK a User

category_id: FK a Category

created_at: timestamp

sla_first_response_target: timestamp (calculado al crear)

sla_resolution_target: timestamp (calculado al crear)


category_name_snapshot: string (Instantánea del nombre de la categoría) 

TicketCustomFieldValue: Almacena los valores de los campos dinámicos para cada ticket.

id: UUID (Primary Key)

ticket_id: FK a Ticket

custom_field_id: FK a CustomField

value: text

2.2. Contratos de API (Endpoints)
La comunicación entre el Frontend (Next.js) y el Backend (NestJS) se realizará a través de los siguientes endpoints RESTful:

GET /api/categories

Descripción: Obtiene la lista de todas las categorías disponibles con sus campos personalizados para que el Requester pueda elegir una.

Respuesta Exitosa (200): [{ id, name, customFields: [{ id, label, type, is_required }] }]

POST /api/tickets

Descripción: Crea un nuevo ticket de soporte.

Cuerpo de la Petición (Body):

JSON

{
  "title": "string",
  "description": "string",
  "categoryId": "uuid",
  "customFieldValues": [
    { "customFieldId": "uuid", "value": "string" }
  ]
}
Respuesta Exitosa (201): { "id": "uuid", "message": "Ticket created successfully" }

Respuesta de Error (400): { "statusCode": 400, "message": ["title must be a string", "categoryId is required"] }

2.3. Lógica de Negocio Clave
Cálculo de SLA: Al momento de crear un ticket (POST /api/tickets), el backend buscará la categoría correspondiente, leerá sus sla_first_response_hours y sla_resolution_hours, y calculará las fechas objetivo (sla_first_response_target, sla_resolution_target) sumando esas horas a la fecha de creación (created_at).


Persistencia de "Snapshot": El backend copiará el nombre de la categoría en el campo category_name_snapshot del ticket para cumplir con el requerimiento de auditoría.

4. Plan de Implementación

4.1. Pasos de Desarrollo (Backend - NestJS)

[ ] Configurar la conexión a la base de datos PostgreSQL usando TypeORM.

[ ] Crear las 5 entidades (User, Category, CustomField, Ticket, TicketCustomFieldValue) con sus respectivas columnas y relaciones.

[ ] Implementar un script de 

seed para poblar la base de datos con datos de prueba realistas (3 usuarios, 4 categorías, etc.).

[ ] Crear el CategoriesModule con su servicio y controlador para el endpoint GET /api/categories.

[ ] Crear el TicketsModule con su servicio y controlador para el endpoint POST /api/tickets, incluyendo la lógica de cálculo de SLA y snapshot.

[ ] Implementar las validaciones de entrada (DTOs) para el cuerpo de la petición de creación de tickets.

4.2. Pasos de Desarrollo (Frontend - Next.js)
[ ] Crear la página /tickets/new.

[ ] Desarrollar un servicio o hook para hacer la llamada a GET /api/categories al cargar la página.

[ ] Construir el formulario utilizando 

Formik o React Hook Form para manejar el estado y la validación.

[ ] Implementar la lógica para que al seleccionar una categoría del dropdown, se rendericen los 

CustomField correspondientes de forma dinámica.

[ ] Implementar la lógica de envío del formulario al endpoint POST /api/tickets.

[ ] Diseñar y mostrar estados de carga (

loading), error y éxito para la creación del ticket.

4.3. Uso de Inteligencia Artificial (AI-USAGE)
La IA se usará como una herramienta de productividad, no como un sustituto del razonamiento.


Prompt para Boilerplate de NestJS: Se usará un prompt como: "Generate a NestJS service with TypeORM for a 'Ticket' entity. It should have a create method that takes a DTO with title, description, categoryId, and customFieldValues. The method must find the category, calculate SLA target dates, and save the ticket." La salida será revisada y ajustada.

Generación de Datos de Prueba: Se pedirá a ChatGPT generar un array de objetos JSON para el script de seed. 

"Generate a realistic JSON array with 5 ticket categories for a software company, including SLA in hours and 2-3 custom fields for each.".

Asistencia en Frontend: Se usará GitHub Copilot para autocompletar la estructura de los componentes de React y los campos del formulario, acelerando el desarrollo.

4.4. Riesgos y Mitigaciones
Riesgo: La lógica de renderizado dinámico de campos en el frontend puede volverse compleja.

Mitigación: Mantener el estado del formulario bien estructurado y crear componentes pequeños y reutilizables para cada tipo de campo (InputField, TextareaField, etc.).



