Brain Board
brain board es un mini panel de tareas hecho en react.  
sirve para crear, ver y organizar tareas por fecha, prioridad y estado.

1. Requisitos
- node.js 18 o superior
- npm o yarn
- navegador moderno

2. Cómo correr el proyecto

1. clona el repositorio
(git clone https://github.com/AjoseLopeZzz/BrainBoard.git)
2. entra a la carpeta del proyecto
(cd BrainBoard)
3. instala dependencias:
(npm install
npm install react-icons
npm install react-chartjs-2 chart.js
npm install react-router-dom)
4. inicia el servidor
(npm run dev)
5. abre la url que muestre vite
(normalmente `http://localhost:5173`)

3. Estructura básica del proyecto

brainboard-react/
│
├── public/                   # archivos estáticos accesibles desde el navegador
│   ├── BrainBoard.svg        }
│   └── vite.svg             
│
├── src/                      # todo el código fuente
│   │
│   ├── assets/               # imágenes, íconos y recursos generales
│   │   └── (imágenes varias)
│   │
│   ├── components/           # componentes pequeños y reutilizables
│   │   │
│   │   ├── Calendar/         # componentes del calendario y gantt
│   │   │   ├── Calendar.css
│   │   │   ├── Calendar.jsx
│   │   │   ├── Gantt.jsx
│   │   │   ├── PopupCalendar.css
│   │   │   └── PopupCalendar.jsx
│   │   │
│   │   ├── Charts/           # gráficas (Chart.js)
│   │   │   ├── PriorityChart.jsx
│   │   │   └── StatusChart.jsx
│   │   │
│   │   ├── Header/           # header superior
│   │   │   ├── Header.css
│   │   │   └── Header.jsx
│   │   │
│   │   ├── Modal/            # ventanas para crear/editar tareas
│   │   │   ├── CreateTaskModal.jsx
│   │   │   ├── EditTaskModal.jsx
│   │   │   └── Modal.css
│   │   │
│   │   ├── Sidebar/          # menú lateral de navegación
│   │   │   ├── Sidebar.css
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── TaskCard/         # tarjetas individuales de tarea (versión móvil)
│   │       ├── TaskCard.css
│   │       └── TaskCard.jsx
│   │
│   ├── context/              # estado global del proyecto
│   │   └── useTasks.js       # lógica de tareas (crear, editar, borrar, filtrar)
│   │
│   ├── hooks/                # hooks personalizados si se necesitan
│   │   └── (vacío o en uso)
│   │
│   ├── pages/                # páginas completas de la app
│   │   ├── Backlog.css
│   │   ├── Backlog.jsx       # página para ver todas las tareas
│   │   ├── CalendarPage.css
│   │   ├── CalendarPage.jsx  # página del calendario y vista gantt
│   │   ├── Dashboard.css
│   │   ├── Dashboard.jsx     # vista principal con métricas
│   │   ├── Kanban.css
│   │   └── Kanban.jsx        # vista tipo tablero kanban
│   │
│   ├── styles/               # estilos globales del proyecto
│   │   ├── globals.css
│   │   └── variables.css
│   │
│   ├── test/                 # archivos de prueba o ejemplos
│   │   └── Example.jsx
│   │
│   ├── utils/                # funciones pequeñas de apoyo
│   │   ├── date.js           # manejo de fechas
│   │   ├── filters.js        # filtros comunes
│   │   └── storage.js        # manejo de localStorage
│   │
│   ├── App.css               # estilos del componente App
│   ├── App.jsx               # componente base o raiz
│   ├── index.css             # estilos base
│   ├── main.jsx              # punto de entrada de la app
│   └── router.jsx            # rutas de la aplicación
│
├── .gitignore
├── eslint.config.js
└── index.html

5. Funcionalidades

5.1. Dashboard
muestra resumen de:
  * total de tareas
  * tareas completadas
  * tareas pendientes
  * tareas en progreso
  * porcentaje de avance
  
* gráficas:
  * distribución por estado
  * distribución por prioridad
  
* filtros:
  * vista por día, semana o mes
  
* tabla:
  * nombre
  * descripción
  * prioridad
  * estado
  * fecha inicio
  * fecha fin
  * menú de opciones (editar, eliminar)
  
* Responsive:
  * acordeón por tarea con toda la info
  * botones redondos para editar y eliminar
  
* tareas vencidas:
  * si `endDate` < hoy y la tarea no está completada
  * se marca visualmente como vencida (fondo y bordes rojos, texto más fuerte)

5.2. Backlog
* lista completa de todas las tareas (no solo la fecha seleccionada)

* filtros:
  * buscador por nombre y descripción
  * filtro por prioridad
  * filtro por estado
  
* ordenamiento por columnas:
  * nombre
  * descripción
  * prioridad
  * estado
  * inicio
  * final
  
* paginación:
  * muestra bloques de 10 tareas
  * botones “anterior” / “siguiente”-
  
* panel lateral de detalle:
  * ver y editar nombre
  * descripción
  * prioridad
  * estado
  * fecha inicio
  * fecha final
  * botón para guardar cambios
  
* Responsive:
  * tarjetas con nombre, descripción, prioridad, estado e inicio/final
  * iconos de editar y eliminar
  
* tareas vencidas:
  * se marcan como vencidas con estilos rojos (tabla y tarjetas)
  
5.3. Crear, editar y eliminar tareas

* crear tarea:
  * desde botón “crear nueva tarea” (dashboard) o “+ crear tarea” (backlog)
  
  * se abre modal:
    * título
    * descripción
    * prioridad
    * estado
    * fecha inicio (con popup de calendario)
    * fecha final (con popup de calendario)
    
  * valida:
    * título no vacío
    * fechas presentes
    * fecha final ≥ fecha inicio
    
* editar tarea:
  * desde menú (tres puntos) o icono de editar
  * se usa `EditTaskModal` en dashboard
  * en backlog se edita en el panel lateral
  
* eliminar tarea:
  * botón eliminar
  * en dashboard se muestra confirmación (`confirm`)
  * en backlog elimina directo esa tarea
  * se actualiza `localStorage`

5.4. Persistencia

* todas las tareas se guardan en `localStorage`

* el contexto `TasksContext`:
  * lee del storage al iniciar
  * escribe de nuevo cuando cambian las tareas
  
* también se guarda:
  * fecha seleccionada del calendario
  * vista seleccionada (día / semana / mes)

6. Uso rápido

1. abre la url
2. ve al dashboard
3. crea algunas tareas con distintas prioridades, fechas y estados
4. mira el resumen y las gráficas
5. cambia la vista (día / semana / mes)
6. abre el backlog y filtra por prioridad o estado
7. prueba el buscador con palabras del nombre o descripción
8. cambia fechas para que algunas tareas queden vencidas y revisa el estilo rojo

7. Preguntas teóricas (respuestas cortas)

7.1. diferencia entre props y state
props:
  * vienen de fuera del componente (padre → hijo)
  * el componente no debería modificarlas
  * sirven para configurar o pasar datos
  
state:
  * vive dentro del componente
  * el componente lo puede cambiar con `setState` / `useState`
  * sirve para manejar cambios internos (formularios, filtros, etc.)

7.2. SSR, CSR y SSG

CSR (client side rendering)
  - el servidor manda un html casi vacío + js.
  - el navegador arma la vista con react en el cliente.
  - es lo típico de vite + react.

SSR (server side rendering)
  - el servidor genera el html completo en cada petición.
  - la página se ve antes de que cargue todo el js.

SG (static site generation)
  - el html se genera una vez en build.
  - después se sirve como archivos estáticos.

en este proyecto se usa CSR.

7.3. importancia del responsive
* la gente entra desde celular, tablet y pc
* si la interfaz no se adapta, se ve cortada o incómoda
* responsive evita scroll raro, textos pequeños y botones imposibles de tocar
* también ayuda a que el producto se vea más profesional

7.4. beneficios de una buena estructura de componentes
* puedes reutilizar partes (modales, tarjetas, tablas)
* el código se entiende mejor por archivo y por responsabilidad
* es más fácil cambiar una cosa sin romper todo
* se vuelve más simple hacer mantenimiento y agregar features

7.5. persistencia entre frontend y backend

en este proyecto solo uso `localStorage`, pero en un sistema real:
* el frontend manda los cambios al backend con peticiones http (fetch / axios)
* el backend guarda en una base de datos
* al cargar la app, el frontend pide las tareas al backend

* ideas básicas:
  * endpoints tipo `/tasks` (GET, POST, PUT, DELETE)
  * manejar errores y estados de carga
  * opcional: usar tokens para auth

7.6. optimizar una app con muchas tareas (ej. 1000+)

algunas ideas simples:
* paginación o scroll infinito (no mostrar las 1000 de golpe)
* filtros y búsqueda para reducir lo que se muestra

* evitar renders innecesarios:

  * usar `React.memo` o `useMemo` para listas grandes
* **virtualización de listas** (ej. `react-window`) si la lista crece mucho
* mover cálculos pesados fuera del render (por ejemplo, precalcular estadísticas)

en este proyecto ya se usa paginación en backlog y filtros.

7.7. patrón de diseño usado

se puede ver algo parecido a:

* “container + presentational”** (o smart / dumb components)
  * los pages (`Dashboard`, `Backlog`) son los “container”:
    * manejan estado, filtros y lógica
    
  * los componentes (`CreateTaskModal`, `StatusChart`, etc.) son “presentational”:
    * reciben props y solo muestran datos o disparan callbacks
    
* también hay algo de “context pattern”:
  * `TasksContext` centraliza el estado global de tareas
  * cualquier vista puede leer o cambiar tareas sin pasar props en cascada

