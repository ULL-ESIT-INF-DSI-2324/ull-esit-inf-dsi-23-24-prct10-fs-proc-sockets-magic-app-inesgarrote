import net from "net"; // crear el servidor tcp
import { EventEmitter } from "events"; // para manejar eventos
import chalk from "chalk"; // para dar color a los mensajes
import { Color, Tipo, Rareza, Carta } from "./carta.js";
import { Usuario } from "./usuario.js";

// Creamos una instancia de EventEmitter para manejar eventos
const eventEmitter = new EventEmitter();

// Creamos un mapa para mantener un registro de usuarios conectados
const connectedUsers = new Map<string, net.Socket>();

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

  /**
   * @brief Método para procesar los comandos recibidos del cliente
   * @param socket 
   * @param mensaje 
   */
  public procesarComando(socket: net.Socket, mensaje: string) {
    const partes = mensaje.trim().split(" ");
    const comando = partes[0].toLowerCase();
    const args = partes.slice(1);

    switch (comando) {
      case "add":
        this.agregarCarta(socket, args);
        break;
      case "list":
        this.listarCartas(socket, args);
        break;
      case "show":
        this.mostrarCarta(socket, args);
        break;
      case "update":
        this.modificarCarta(socket, args);
        break;
      case "delete":
        this.eliminarCarta(socket, args);
        break;
      default:
        this.enviarMensaje(socket, "Comando no reconocido.");
        break;
    }
  }

  /**
   * @brief Método para agregar una carta
   * @param socket 
   * @param args 
   */
  private agregarCarta(socket: net.Socket, args: string[]) {
    // Extraer los argumentos del comando
    const [usuario, id, nombre, costeMana, color, tipo, rareza, textoReglas, valorMercado, fuerza, resistencia, marcasLealtad] = args;
    const fuerzaResistencia: [number, number] | undefined = fuerza && resistencia ? [parseInt(fuerza), parseInt(resistencia)] : undefined;
    const carta = new Carta(parseInt(id), nombre, parseInt(costeMana), color as Color, tipo as Tipo, rareza as Rareza, textoReglas, parseInt(valorMercado), fuerzaResistencia, marcasLealtad ? parseInt(marcasLealtad) : undefined);
    // Obtener el usuario correspondiente
    const usuarioSocket = connectedUsers.get(usuario);
    if (usuarioSocket) {
      usuarioSocket.emit("agregarCarta", carta);
      this.enviarMensaje(socket, "Carta añadida correctamente.");
    } else {
      this.enviarMensaje(socket, "Usuario no encontrado.");
    }
  }

  /**
   * @brief Método para listar las cartas de un usuario
   * @param socket 
   * @param args 
   */
  private listarCartas(socket: net.Socket, args: string[]) {
    const [usuario] = args;
    const usuarioSocket = connectedUsers.get(usuario);
    if (usuarioSocket) {
      usuarioSocket.emit("listarCartas", usuario);
    } else {
      this.enviarMensaje(socket, "Usuario no encontrado.");
    }
  }

  /**
   * @brief Método para mostrar una carta
   * @param socket 
   * @param args 
   */
  private mostrarCarta(socket: net.Socket, args: string[]) {
    const [usuario, id] = args;
    const usuarioSocket = connectedUsers.get(usuario);
    if (usuarioSocket) {
      usuarioSocket.emit("mostrarCarta", parseInt(id));
    } else {
      this.enviarMensaje(socket, "Usuario no encontrado.");
    }
  }

  /**
   * @brief Método para modificar una carta
   * @param socket 
   * @param args 
   */
  private modificarCarta(socket: net.Socket, args: string[]) {
    const [usuario, id, nombre, costeMana, color, tipo, rareza, textoReglas, valorMercado, fuerza, resistencia, marcasLealtad] = args;
    const fuerzaResistencia: [number, number] | undefined = fuerza && resistencia ? [parseInt(fuerza), parseInt(resistencia)] : undefined;
    const carta = new Carta(parseInt(id), nombre, parseInt(costeMana), color as Color, tipo as Tipo, rareza as Rareza, textoReglas, parseInt(valorMercado), fuerzaResistencia, marcasLealtad ? parseInt(marcasLealtad) : undefined);
    const usuarioSocket = connectedUsers.get(usuario);
    if (usuarioSocket) {
      usuarioSocket.emit("modificarCarta", parseInt(id), carta);
      this.enviarMensaje(socket, "Carta modificada correctamente.");
    } else {
      this.enviarMensaje(socket, "Usuario no encontrado.");
    }
  }

  /**
   * @brief Método para eliminar una carta
   * @param socket 
   * @param args 
   */
  private eliminarCarta(socket: net.Socket, args: string[]) {
    const [usuario, id] = args;
    const usuarioSocket = connectedUsers.get(usuario);
    if (usuarioSocket) {
      usuarioSocket.emit("eliminarCarta", parseInt(id));
      this.enviarMensaje(socket, "Carta eliminada correctamente.");
    } else {
      this.enviarMensaje(socket, "Usuario no encontrado.");
    }
  }

  /**
   * @brief Método para enviar un mensaje al cliente
   * @param socket 
   * @param mensaje 
   */
  private enviarMensaje(socket: net.Socket, mensaje: string) {
    socket.write(mensaje);
  }
}

// Creamos una instancia de CartaManager
const cartaManager = new CartaManager();

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

  // Manejamos la conexión cerrada por el cliente
  socket.on("close", () => {
    if (usuario) {
      connectedUsers.delete(usuario);
      console.log(chalk.red(`Cliente ${usuario} desconectado.`));
    } else {
      console.log(chalk.red("Cliente desconectado."));
    }
  });

  // Manejamos errores de conexión
  socket.on("error", (error) => {
    console.error(chalk.red("Error de conexión:"), error);
  });
});

// Escuchamos en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(chalk.green(`Servidor escuchando en el puerto ${PORT}`));
});
