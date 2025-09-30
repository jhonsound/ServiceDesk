# F3: SLA, Dashboard y Alertas

Este documento detalla la especificación de negocio y técnica para la tercera funcionalidad clave: la monitorización de SLAs, la presentación de KPIs en un dashboard y la generación de alertas visuales.

## 1. Especificación de Negocio

### 1.1. Objetivo
Proveer al rol de **Manager** una vista rápida y consolidada sobre la salud de la operación de soporte. Esto se logra a través de un mini-dashboard con los indicadores más importantes y alertas visuales que resalten los tickets que requieren atención urgente por incumplimiento de SLA.

### 1.2. Historia de Usuario
> Como **Manager**, quiero ver el cumplimiento de SLA y recibir alertas cuando un ticket esté en riesgo o incumplido, además de un mini-dashboard para lectura rápida de la operación.

### 1.3. Actores Involucrados
- **Manager:** El consumidor principal de esta funcionalidad.
- **Agent:** Se beneficia de las alertas visuales para priorizar su trabajo.

### 1.4. KPIs Definidos para el Mini-Dashboard
Se han definido los siguientes 3 KPIs para una lectura rápida de la operación:

1.  **Tickets Totales Abiertos:**
    - **Descripción:** Número total de tickets cuyo estado es `open` o `in_progress`.
    - **Propósito:** Mide la carga de trabajo activa y pendiente del equipo de soporte.

2.  **Tickets Creados (Últimos 7 días):**
    - **Descripción:** Número total de tickets creados en los últimos 7 días.
    - **Propósito:** Mide el volumen de solicitudes entrantes recientes, ayudando a identificar tendencias.

3.  **Cumplimiento de SLA de Resolución (%):**
    - **Descripción:** Porcentaje de tickets resueltos dentro de su tiempo objetivo.
    - **Fórmula:** `(Total de tickets resueltos a tiempo / Total de tickets resueltos) * 100`.
    - **Definiciones:**
        - Un "ticket resuelto" es todo ticket en estado `resolved` o `closed`.
        - Un "ticket resuelto a tiempo" es un ticket resuelto cuya fecha de cambio a estado `resolved` fue anterior o igual a su `sla_resolution_target`.

### 1.5. Estrategia de Alertas por Incumplimiento de SLA
Para que los tickets incumplidos sean fácilmente identificables, se implementará el siguiente sistema de alertas visuales:

- **Lógica de Detección:** Un ticket se considera "incumplido" si cumple con **todas** las siguientes condiciones:
    1.  Su estado actual **no** es `resolved` y **no** es `closed`.
    2.  La fecha y hora actual es **posterior** a la fecha guardada en su campo `sla_resolution_target`.

- **Visualización:**
    - **Vista de Lista (`/tickets`):** Se mostrará un ícono de advertencia ⚠️ junto al estado del ticket.
    - **Vista de Detalle (`/tickets/[id]`):** Se mostrará un banner prominente en la parte superior de la página con el mensaje: "Atención: El SLA de resolución ha sido incumplido."

### 1.6. Criterios de Aceptación
- [ ] El sistema calcula y muestra las fechas objetivo de resolución en cada ticket.
- [ ] Se genera una alerta visual y el ticket se resalta cuando se incumple un SLA.
- [ ] Un mini-dashboard muestra al menos 3 KPIs, incluyendo tickets creados recientemente y porcentaje de cumplimiento.
- [ ] La estrategia de cálculo de KPIs y SLAs está justificada y documentada.

## 2. Especificación Técnica

### 2.1. Estrategia de Cálculo Justificada
La estrategia de cálculo combina eficiencia y datos en tiempo real:

- **On-Write (Al escribir):** Las fechas objetivo de SLA (`sla_first_response_target` y `sla_resolution_target`) se calculan **una sola vez** en el momento de la creación del ticket. Esto es extremadamente eficiente, ya que evita recálculos constantes.
- **On-Read (Al leer):** Tanto los KPIs del dashboard como la comprobación de si un ticket individual ha incumplido su SLA se calculan **en el momento de la solicitud (on-demand)**. Esto garantiza que los datos presentados sean siempre 100% actuales, sin la complejidad de requerir jobs o tareas programadas.

### 2.2. Contratos de API (Endpoints)
Se creará un nuevo endpoint para servir los datos del dashboard:

- **GET /api/dashboard/kpis**
    - **Descripción:** Obtiene los 3 KPIs definidos. No requiere autenticación de rol Manager para simplificar la prueba, pero se anota que en producción estaría protegido.
    - **Respuesta Exitosa (200):**
      ```json
      {
        "openTickets": 15,
        "ticketsInLast7Days": 42,
        "slaCompliancePercentage": 92.5
      }
      ```

### 2.3. Lógica de Negocio Clave (Backend)
El servicio `DashboardService` ejecutará las siguientes consultas:

- **Open Tickets:**
  ```sql
  COUNT(*) FROM tickets WHERE status IN ('open', 'in_progress');
  ```
- **Tickets in Last 7 Days:**
  ```sql
  COUNT(*) FROM tickets WHERE created_at >= NOW() - INTERVAL '7 days';
  ```
- **SLA Compliance:** Este es el más complejo.
    1. Obtener todos los tickets `resolved` o `closed`.
    2. Para cada uno, buscar en `TicketHistory` el primer registro donde `new_value` fue `resolved`.
    3. Comparar el `created_at` de ese registro de historial con el `sla_resolution_target` del ticket.
    4. Calcular el porcentaje.

### 2.4. Lógica de Visualización (Frontend)
La detección de incumplimiento en los componentes de React se basará en esta lógica:

```javascript
const isBreached = ticket.status !== 'resolved' &&
                   ticket.status !== 'closed' &&
                   new Date() > new Date(ticket.sla_resolution_target);
```

La variable `isBreached` controlará si se muestra o no la alerta visual.

## 3. Diagramas

### 3.1. Mockup de Interfaz (UI)
Se propone la siguiente disposición para los nuevos elementos:

- **Mini-Dashboard:** Se ubicará en la parte superior de la página de lista de tickets (`/tickets`), mostrando 3 tarjetas, una por cada KPI.
- **Alerta en Lista:**
  `[ID] [Título] [⚠️ En Progreso] [Solicitante] [Fecha]`
- **Alerta en Detalle:** Un banner rojo sobre el título del ticket.

## 4. Plan de Implementación

### 4.1. Pasos de Desarrollo (Backend)
- [ ] Crear un nuevo `DashboardModule` con su `DashboardController` y `DashboardService`.
- [ ] En `DashboardService`, implementar los métodos para calcular cada uno de los 3 KPIs mediante consultas con el Query Builder de TypeORM o SQL crudo.
- [ ] Exponer los resultados a través del endpoint `GET /api/dashboard/kpis`.

### 4.2. Pasos de Desarrollo (Frontend)
- [ ] Crear un nuevo componente `Dashboard.tsx` que haga la llamada al endpoint de KPIs y muestre los datos en tarjetas.
- [ ] Integrar el componente `Dashboard.tsx` en la parte superior de la página `app/tickets/page.tsx`.
- [ ] Modificar el renderizado de la tabla en `app/tickets/page.tsx` para incluir la lógica de `isBreached` y mostrar el ícono de alerta.
- [ ] Modificar el componente `TicketDetailView.tsx` para incluir la lógica de `isBreached` y mostrar el banner de alerta.

### 4.3. Uso de Inteligencia Artificial (AI-USAGE)
- **Prompt para Backend:** `"Generate a TypeORM Query Builder query in a NestJS service to calculate 'SLA Compliance Percentage'. I have a 'Ticket' entity and a 'TicketHistory' entity. A ticket is compliant if the timestamp of its first history entry with new_value: 'resolved' is less than or equal to the ticket's sla_resolution_target property."`
- **Prompt para Frontend:** `"Generate a React component with Tailwind CSS called 'KpiCard' that accepts a title, value, and description as props and displays them in a modern, clean card layout."`