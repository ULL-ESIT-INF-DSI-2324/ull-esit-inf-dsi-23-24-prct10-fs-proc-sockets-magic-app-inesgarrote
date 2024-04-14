import net from "net";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Obtener argumentos de la línea de comandos
const argv = yargs(hideBin(process.argv)).argv;

// Crear un socket para la conexión con el servidor
const client = new net.Socket();

// Conectar al servidor en el puerto 3000
client.connect(3000, "localhost", () => {
  console.log("Conectado al servidor");
});

// Enviar datos al servidor cuando el usuario ingrese un comando
process.stdin.on("data", (data) => {
  client.write(data.toString().trim());
});

// Manejar los datos recibidos del servidor
client.on("data", (data) => {
  console.log("Respuesta del servidor:", data.toString().trim());
});

// Manejar la conexión cerrada por el servidor
client.on("close", () => {
  console.log("Conexión cerrada");
});

// Manejar errores de conexión
client.on("error", (error) => {
  console.error("Error de conexión:", error);
});
