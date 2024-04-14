import chalk from "chalk";
import fs from "fs";
import { Color, Carta } from "./carta.js";

/*
Desarrolle el siguiente ejercicio en el repositorio de su práctica.

Durante la práctica 9, debería haber escrito métodos para añadir, modificar, borrar y actualizar la información de una carta de la colección de un usuario. Escoja alguna de esas funciones e impleméntela siguiendo el patrón callback.

Luego, sustituya la invocación de métodos del API síncrona de Node.js de gestión el sistema de ficheros, por llamadas a los métodos equivalentes del API asíncrona basada en callback.

Por último, implemente pruebas de su método asíncrono.
*/

/**
 * @brief Clase que representa a un usuario del sistema de cartas mágicas.
 * @details Un usuario tiene un nombre y una colección de cartas.
 */
export class Usuario {
  public nombre: string;
  public coleccion: Carta[];

  constructor(nombre: string) {
    this.nombre = nombre;
    this.coleccion = [];
  }

  /**
   * @brief Método que devuelve el nombre del usuario.
   * @returns
   */
  public getNombre(): string {
    return this.nombre;
  }
  /**
   * @brief Método que añade una carta a la colección del usuario.
   * @param carta
   * @returns
   */
  public agregarCarta(
    carta: Carta,
    callback: (error: Error | null) => void,
  ): void {
    this.cargarColeccion((errorCarga) => {
      if (errorCarga) {
        callback(errorCarga);
        return;
      }
      const cartaExistente = this.coleccion.find((c) => c.id === carta.id);
      if (cartaExistente) {
        const errorExistente = new Error(
          "¡Error! Ya existe una carta con ese ID en la colección.",
        );
        callback(errorExistente);
        return;
      }
      this.coleccion.push(carta);
      console.log(chalk.green("¡Carta añadida a la colección con éxito!"));
      this.guardarColeccion(callback);
    });
  }

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

  /**
   * @brief Método que elimina una carta de la colección del usuario.
   * @param id
   * @returns
   */
  public eliminarCarta(
    id: number,
    callback: (error: Error | null) => void,
  ): void {
    this.cargarColeccion((errorCarga) => {
      if (errorCarga) {
        callback(errorCarga);
        return;
      }
      const index = this.coleccion.findIndex((c) => c.id === id);
      if (index === -1) {
        const errorNoEncontrada = new Error(
          "¡Error! No se encontró ninguna carta con ese ID en la colección.",
        );
        callback(errorNoEncontrada);
        return;
      }
      this.coleccion.splice(index, 1);
      console.log(chalk.green("¡Carta eliminada con éxito!"));
      this.guardarColeccion(callback);
    });
  }

  /**
   * @brief Método que lista todas las cartas de la colección del usuario.
   * @returns
   */
  public listarCartas(callback: (error: Error | null) => void): void {
    this.cargarColeccion((errorCarga) => {
      if (errorCarga) {
        callback(errorCarga);
        return;
      }
      console.log(chalk.blue(`Cartas de ${this.nombre}:`));
      this.coleccion.forEach((carta) => {
        console.log(
          chalk.yellow(
            `ID: ${carta.id}, Nombre: ${carta.nombre}, Color: ${this.getColorString(carta.color)}`,
          ),
        );
      });
      callback(null);
    });
  }

  /**
   * @brief Método que obtiene una cadena de texto con el color de la carta.
   * @param color
   * @returns
   */
  private getColorString(color: Color): string {
    switch (color) {
      case Color.Blanco:
        return chalk.white(color);
      case Color.Azul:
        return chalk.blue(color);
      case Color.Negro:
        return chalk.black(color);
      case Color.Rojo:
        return chalk.red(color);
      case Color.Verde:
        return chalk.green(color);
      case Color.Incoloro:
        return chalk.gray(color);
      case Color.Multicolor:
        return chalk.yellow(color);
      default:
        return color;
    }
  }

  /**
   * @brief Muestra la información de una carta
   * @param id
   * @returns
   */
  public mostrarCarta(
    id: number,
    callback: (error: Error | null, carta?: Carta) => void,
  ): void {
    this.cargarColeccion((errorCarga) => {
      if (errorCarga) {
        callback(errorCarga);
        return;
      }
      const carta = this.coleccion.find((c) => c.id === id);
      if (!carta) {
        const errorNoEncontrada = new Error(
          "¡Error! No se encontró ninguna carta con ese ID en la colección.",
        );
        callback(errorNoEncontrada);
        return;
      }
      console.log(chalk.blue(`Información de la carta ID ${id}:`));
      console.log(chalk.yellow(`Nombre: ${carta.nombre}`));
      console.log(chalk.yellow(`Coste de maná: ${carta.costeMana}`));
      console.log(chalk.yellow(`Color: ${this.getColorString(carta.color)}`));
      console.log(chalk.yellow(`Tipo: ${carta.tipo}`));
      console.log(chalk.yellow(`Rareza: ${carta.rareza}`));
      console.log(chalk.yellow(`Texto de reglas: ${carta.textoReglas}`));
      if (carta.fuerzaResistencia) {
        console.log(
          chalk.yellow(
            `Fuerza/Resistencia: ${carta.fuerzaResistencia[0]}/${carta.fuerzaResistencia[1]}`,
          ),
        );
      }
      if (carta.marcasLealtad) {
        console.log(chalk.yellow(`Marcas de lealtad: ${carta.marcasLealtad}`));
      }
      console.log(chalk.yellow(`Valor de mercado: ${carta.valorMercado}`));
      callback(null, carta);
    });
  }

  /**
   * @brief Método que guarda la colección de cartas del usuario en un archivo JSON.
   * @param callback
   */
  private guardarColeccion(callback: (error: Error | null) => void): void {
    const rutaArchivo = `./src/magic/${this.nombre}_coleccion.json`;
    fs.writeFile(
      rutaArchivo,
      JSON.stringify(this.coleccion, null, 2),
      (error) => {
        if (error) {
          callback(error);
          return;
        }
        callback(null);
      },
    );
  }

  /**
   * @brief Método que carga la colección de cartas del usuario desde un archivo JSON.
   * @param callback
   */
  public cargarColeccion(callback: (error: Error | null) => void): void {
    const rutaArchivo = `./src/magic/${this.nombre}_coleccion.json`;
    fs.readFile(rutaArchivo, "utf-8", (error, data) => {
      if (error) {
        callback(error);
        return;
      }
      this.coleccion = JSON.parse(data);
      callback(null);
    });
  }
}
