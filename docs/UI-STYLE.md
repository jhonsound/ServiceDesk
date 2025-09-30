# Guía de Estilo de la UI: ServiceDesk Pro

## 1. Filosofía de Diseño

La interfaz de ServiceDesk Pro se ha diseñado siguiendo una filosofía de **minimalismo funcional y claridad profesional**. El objetivo es proporcionar una experiencia de usuario que sea intuitiva, eficiente y visualmente agradable, permitiendo a los usuarios (Requesters, Agents, Managers) concentrarse en sus tareas sin distracciones.

La UI está pensada para ser densa en información pero fácil de navegar, reduciendo la carga cognitiva y asegurando que las acciones clave sean siempre accesibles.

## 2. Inspiración Principal

Nuestra inspiración proviene de las interfaces de herramientas de desarrollo y plataformas SaaS modernas, que han perfeccionado el arte de presentar información compleja de manera limpia y ordenada.

-   **Vercel Dashboard:** La inspiración principal para nuestra paleta de colores de tema oscuro, el uso de tipografía moderna (`Geist`) y el diseño general de alto contraste. La plataforma de Vercel es un ejemplo de cómo una interfaz puede ser a la vez estéticamente agradable y extremadamente funcional.

-   **Linear:** De Linear tomamos la inspiración de una estética minimalista y la eficiencia. Aunque no implementamos todos sus atajos de teclado, su enfoque en la velocidad y la eliminación de elementos superfluos guio nuestras decisiones de diseño.

-   **GitHub:** Su diseño, especialmente en modo oscuro, es un referente en cómo estructurar la información y las interacciones en una aplicación técnica. La claridad de sus formularios y la consistencia de sus componentes son un pilar de la usabilidad.

## 3. Paleta de Colores

Se optó por un **tema oscuro monocromático** para reducir la fatiga visual en usos prolongados y para dar un aspecto profesional y enfocado.

-   **Fondo Principal (`#1a1a1a`):** Un gris casi negro que sirve como lienzo principal, permitiendo que el contenido destaque.
-   **Fondo de Componentes (`#242424`):** Un gris ligeramente más claro para contenedores como la barra lateral y las tarjetas (`Card`), creando una sutil sensación de profundidad y separación jerárquica.
-   **Colores de Acento y Texto:** Se utilizan tonos de blanco y gris claro (`foreground`, `primary-foreground`) para el texto y los elementos interactivos, garantizando una alta legibilidad. Los colores de acento (para estados de error, éxito, etc.) se usan con moderación para dirigir la atención del usuario solo cuando es necesario.

## 4. Tipografía

-   **Fuente Principal:** `Geist Sans`. Se eligió la tipografía de Vercel por su excelente legibilidad en pantalla, su aspecto moderno y su neutralidad, lo que la hace perfecta para una interfaz de aplicación profesional.
-   **Fuente Monoespaciada:** `Geist Mono` se utiliza en áreas donde se podría mostrar código o datos tabulares que requieran alineación precisa.

## 5. Componentes y Sistema de Diseño

-   **Librería de Componentes:** La UI está construida sobre **`shadcn/ui`**. Esta elección es fundamental, ya que nos proporciona un conjunto de componentes reutilizables, accesibles y personalizables (botones, tarjetas, inputs, etc.) que garantizan una consistencia visual y funcional en toda la aplicación.
-   **Iconografía:** Utilizamos **`lucide-react`**, una librería de iconos limpia y consistente cuyo estilo de línea fina complementa perfectamente la estética minimalista y profesional de la interfaz.
