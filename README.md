[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/7bX30zK4)

# Práctica 10 - Aplicación cliente-servidor para coleccionistas de cartas Magic

Realizada por Inés Garrote Fontenla [alu0101512297@ull.edu.es](alu0101512297@ull.edu.es)  
Enlace al repositorio de Github asociado a la práctica [ull-esit-inf-dsi-23-24-prct10-vscode-inesgarrote](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-inesgarrote.git)

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

Para realizar lo anterior, en primer lugar se modicaron los métodos de la clase Usuario, para que implementasen el patrón de CallBack. Por ejemplo, aqui tenemos el metodo modificar carta:

```typescript
   /**
   * @brief Método que modifica una carta de la colección del usuario.
   * @param id
   * @param nuevaCarta
   * @param callback
   * @returns
   */
  public modificarCarta(
    id: number,
    nuevaCarta: Carta,
    callback: (error: Error | null) => void,
  ): void {
    this.cargarColeccion((error) => {
      if (error) {
        callback(error);
        return;
      }
      const index = this.coleccion.findIndex((c) => c.id === id);
      if (index === -1) {
        const notFoundError = new Error(
          "¡Error! No se encontró ninguna carta con ese ID en la colección.",
        );
        callback(notFoundError);
        return;
      }
      this.coleccion[index] = nuevaCarta;
      this.guardarColeccion((error) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null);
      });
    });
  }
```

**Parámetros de la función**: La función modificarCarta recibe tres parámetros:

 - id: El identificador de la carta que se desea modificar.
 - nuevaCarta: La nueva información de la carta que se utilizará para actualizarla en la colección.
 - callback: Una función de devolución de llamada que será invocada una vez que la operación de     modificación se complete, ya sea con éxito o con error. Esta función toma un parámetro que indica si ocurrió un error (Error | null).

**Operación asincrona**: Dentro de la función modificarCarta, se llama al método cargarColeccion. Esta es una operación asincrona que carga la colección de cartas del usuario desde un archivo. Se proporciona un callback a cargarColeccion, que será invocado una vez que la operación de carga se complete.

**Manejo de errores**: Si hay un error al cargar la colección, se llama al callback de la función modificarCarta con el error correspondiente y se termina la ejecución de la función.

**Modificación de la carta**: Si la carga de la colección se realiza con éxito, se busca la carta en la colección utilizando el id proporcionado. Si se encuentra la carta, se actualiza con la nueva información (nuevaCarta).

**Guardado de la colección**: Después de actualizar la carta en la colección, se llama al método guardarColeccion. Al igual que cargarColeccion, esta es una operación asincrónica que guarda la colección modificada en un archivo. Se proporciona un callback a guardarColeccion, que será invocado una vez que la operación de guardado se complete.

**Llamada al callback principal**: Dentro del callback de guardarColeccion, se verifica si ocurrió algún error. Si es así, se llama al callback principal de la función modificarCarta con el error correspondiente. Si la operación se realizó con éxito, se llama al callback principal con null, indicando que la operación de modificación se completó correctamente.

Después, en el servidor se implementaron los siguientes elementos claves:

**Clase CartaManager**:
```typescript
/**
 * @brief Clase CartaManager
 * @details Clase para gestionar las operaciones de las cartas
 */
class CartaManager extends EventEmitter {
  /**
   * @brief Constructor de la clase CartaManager
   * @details Constructor de la clase CartaManager
   */
  constructor() {
    super();
  }
```
- Esta clase extiende EventEmitter y se encarga de gestionar las operaciones relacionadas con las cartas, como agregar, listar, mostrar, modificar y eliminar cartas.  
- Cada método de esta clase recibe un objeto net.Socket (que representa al cliente) y un array de argumentos que contiene los datos necesarios para realizar la operación correspondiente.

**Creación del servidor TCP**:

```typescript
// Creamos el servidor
const server = net.createServer((socket) => {
  console.log(chalk.green("Cliente conectado."));
  let usuario: string | undefined;

  // Manejamos los datos recibidos del cliente
  socket.on("data", (data) => {
    const mensaje = data.toString().trim();
    console.log(chalk.yellow("Mensaje recibido del cliente:"), mensaje);

    if (!usuario) {
      usuario = mensaje;
      connectedUsers.set(usuario, socket);
      socket.write(`Bienvenido, ${usuario}!\n`);
      return;
    }

    // Procesamos el comando recibido
    cartaManager.procesarComando(socket, mensaje);
  });
  ```

- Se crea el servidor mediante net.createServer().
- Cuando se establece una conexión con un cliente, se ejecuta una función de devolución de llamada que recibe un objeto net.Socket representando al cliente.
- En esta función de devolución de llamada, se inicializa una variable usuario que almacenará el nombre del usuario conectado.

**Manejo de eventos del cliente**:

- Cuando se recibe un mensaje del cliente a través del evento "data" del socket, se procesa el mensaje y se decide si se trata del nombre de usuario o de un comando relacionado con las cartas.
- Si es el nombre de usuario, se almacena en la variable usuario y se agrega al mapa connectedUsers.
- Si es un comando, se pasa al método procesarComando() de CartaManager para su procesamiento.

**Manejo de desconexión del cliente**:

- Cuando se cierra la conexión con el cliente a través del evento "close" del socket, se elimina el usuario del mapa connectedUsers y se muestra un mensaje en la consola indicando que el cliente se ha desconectado.

**Manejo de errores**:

- Se añade un manejador de eventos para el evento "error" del socket, que muestra un mensaje en la consola en caso de error de conexión.

**Inicio del servidor**:

- El servidor comienza a escuchar en el puerto 3000 mediante server.listen().
- Cuando el servidor está escuchando, se muestra un mensaje en la consola indicando el puerto en el que está escuchando.

En en el fichero del cliente, se implentaron los siguientes conceptos claves:
```typescript
// Obtener argumentos de la línea de comandos
const argv = yargs(hideBin(process.argv)).argv;
```
**Obtención de argumentos de la línea de comandos**:

Se utiliza yargs para procesar los argumentos de la línea de comandos y se almacenan en argv.
  
```typescript
// Crear un socket para la conexión con el servidor
const client = new net.Socket();
```

**Creación del socket del cliente**:

Se crea un nuevo socket TCP para la conexión con el servidor mediante net.Socket().

```typescript
// Conectar al servidor en el puerto 3000
client.connect(3000, "localhost", () => {
  console.log("Conectado al servidor");
});
```
**Conexión al servidor**:

El cliente se conecta al servidor en el puerto 3000 en localhost mediante client.connect().

```typescript
// Enviar datos al servidor cuando el usuario ingrese un comando
process.stdin.on("data", (data) => {
  client.write(data.toString().trim());
});
```
**Envío de datos al servidor**:

Se utiliza process.stdin.on("data") para escuchar la entrada de datos desde la línea de comandos.
Cuando el usuario ingresa un comando y presiona Enter, los datos se envían al servidor utilizando client.write().

```typescript
// Manejar los datos recibidos del servidor
client.on("data", (data) => {
  console.log("Respuesta del servidor:", data.toString().trim());
});
```
**Manejo de datos recibidos del servidor**:

Se utiliza client.on("data") para manejar los datos recibidos del servidor.
Cuando se recibe un mensaje del servidor, se muestra en la consola.

```typescript
// Manejar la conexión cerrada por el servidor
client.on("close", () => {
  console.log("Conexión cerrada");
});
```
**Manejo de conexión cerrada por el servidor**:

Se utiliza client.on("close") para manejar el evento de conexión cerrada por el servidor.
Cuando se cierra la conexión, se muestra un mensaje en la consola.

```typescript
// Manejar errores de conexión
client.on("error", (error) => {
  console.error("Error de conexión:", error);
});
```
**Manejo de errores de conexión**:
Se utiliza client.on("error") para manejar los errores de conexión.
Si se produce un error durante la conexión, se muestra un mensaje en la consola.
# Ejercicio clase

Durante la sesión de prácticas se planteó modificar una función para implementarla siguiendo el patrón de callback. Después, se sustituyó la invocación de métodos del API síncrona de Node.js de gestión el sistema de ficheros, por llamadas a los métodos equivalentes del API asíncrona basada en callback. Tambíen había que realizar pruebas del método asíncrono.

Modifiqué el método modificar carta, al añadir el patrón callback a este método tuve que mofidicar otros tambíen, como el método añadir carta, eliminar carta, listar cartas y mostrar carta, guardar coleccióm y cargar colección.

Tuve un error, porque solo tuve en cuenta los mensaje de error, pero no los mensajes de éxito. Por último, no me dió tiempo a realizar las pruebas de los métodos asíncronos.



# Conclusión

La práctica proporciona una oportunidad para implementar una aplicación cliente-servidor robusta, capaz de gestionar colecciones de cartas Magic de múltiples usuarios de manera eficiente y segura. La adopción de herramientas modernas y metodologías de desarrollo sólidas garantiza la calidad y fiabilidad del software desarrollado.
