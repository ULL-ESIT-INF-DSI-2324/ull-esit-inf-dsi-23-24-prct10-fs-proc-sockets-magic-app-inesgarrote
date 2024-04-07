[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7bX30zK4)

# Práctica 10 - Aplicación cliente-servidor para coleccionistas de cartas Magic

Realizada por Inés Garrote Fontenla [alu0101512297@ull.edu.es](alu0101512297@ull.edu.es)  
Enlace al repositorio de Github asociado a la práctica   [ull-esit-inf-dsi-23-24-prct10-vscode-inesgarrote](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote.git)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote/actions/workflows/node.js.yml)

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote?branch=main)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote&metric=bugs)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote)
# Introducción

En esta práctica, se aborda la implementación de una aplicación cliente-servidor para coleccionistas de cartas Magic, extendiendo el trabajo realizado en la Práctica 9. Se desarrolla un servidor y un cliente utilizando sockets proporcionados por el módulo net de Node.js. Los usuarios interactúan exclusivamente con el cliente a través de la línea de comandos, mientras que el servidor gestiona las operaciones sobre las cartas almacenadas en ficheros JSON en el sistema de ficheros.

Se adopta una metodología de desarrollo dirigido por pruebas/comportamiento (TDD/BDD), asegurando el correcto funcionamiento del código y la robustez ante entradas no válidas. Se siguen los principios SOLID de diseño orientado a objetos para garantizar la modularidad y mantenibilidad del código.

Se incluyen flujos de trabajo de GitHub Actions para realizar pruebas en diferentes entornos con distintas versiones de Node.js, enviar datos de cobertura a Coveralls y realizar análisis de calidad y seguridad del código fuente a través de Sonar Cloud.

- Se hace uso de los paquetes yargs y chalk, similares a la Práctica 9.
- Se emplea la clase EventEmitter del módulo Events de Node.js para manejar eventos.
- Se utiliza el módulo fs de Node.js para operaciones de sistema de ficheros.
- Se implementa el módulo net de Node.js para la comunicación entre cliente y servidor.

# Desarrollo

La aplicación debe permitir la interacción simultánea de múltiples usuarios, cada uno con su propia colección de cartas. Se especifican las operaciones básicas sobre las cartas, como añadir, modificar, eliminar, listar y mostrar información detallada de una carta. Las cartas se describen mediante varios atributos, incluyendo ID, nombre, coste de maná, color, tipo, rareza, texto de reglas, etc.

## Consideraciones de Implementación:

1. Se emplea el patrón petición-respuesta, donde el cliente envía una petición al servidor, el servidor procesa la petición, envía una respuesta y luego cierra la conexión.
2. Todos los mensajes intercambiados entre cliente y servidor son representaciones JSON válidas.
3. La lógica relacionada con el sistema de ficheros reside en el servidor y se basa en el uso del API asíncrona de Node.js.
4. El cliente se encarga del procesamiento de los argumentos de línea de comandos utilizando el paquete yargs.
5. Se implementan pruebas unitarias para verificar el correcto funcionamiento del código y para manejar entradas no válidas o inesperadas.
# Ejercicio clase

# Conclusión

La práctica proporciona una oportunidad para implementar una aplicación cliente-servidor robusta, capaz de gestionar colecciones de cartas Magic de múltiples usuarios de manera eficiente y segura. La adopción de herramientas modernas y metodologías de desarrollo sólidas garantiza la calidad y fiabilidad del software desarrollado.
