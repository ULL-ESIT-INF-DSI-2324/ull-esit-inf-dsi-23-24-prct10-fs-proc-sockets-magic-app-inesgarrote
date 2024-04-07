import chalk from "chalk";
import fs from "fs";
import { Color, Carta } from "./carta.js";

/**
 * @brief Clase que representa a un usuario del sistema de cartas mágicas.
 * @details Un usuario tiene un nombre y una colección de cartas.
 */
export class Usuario {
  public  nombre: string;
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
  public agregarCarta(carta: Carta): void {
    this.cargarColeccion();
    const cartaExistente = this.coleccion.find((c) => c.id === carta.id);
    if (cartaExistente) {
      console.log(
        chalk.red("¡Error! Ya existe una carta con ese ID en la colección."),
      );
      return;
    }
    this.coleccion.push(carta);
    console.log(chalk.green("¡Carta añadida a la colección con éxito!"));
    this.guardarColeccion();
  }

  /**
   * @brief Método que modifica una carta de la colección del usuario.
   * @param id
   * @param nuevaCarta
   * @returns
   */
  public modificarCarta(id: number, nuevaCarta: Carta): void {
    this.cargarColeccion();
    const index = this.coleccion.findIndex((c) => c.id === id);
    if (index === -1) {
      console.log(
        chalk.red(
          "¡Error! No se encontró ninguna carta con ese ID en la colección.",
        ),
      );
      return;
    }
    this.coleccion[index] = nuevaCarta;
    console.log(chalk.green("¡Carta modificada con éxito!"));
    this.guardarColeccion();
  }

  /**
   * @brief Método que elimina una carta de la colección del usuario.
   * @param id
   * @returns
   */
  public eliminarCarta(id: number): void {
    this.cargarColeccion();
    const index = this.coleccion.findIndex((c) => c.id === id);
    if (index === -1) {
      console.log(
        chalk.red(
          "¡Error! No se encontró ninguna carta con ese ID en la colección.",
        ),
      );
      return;
    }
    this.coleccion.splice(index, 1); // Eliminar 1 elemento en la posición index
    console.log(chalk.green("¡Carta eliminada con éxito!"));
    this.guardarColeccion();
  }

   
    /**
     * @brief Método que lista todas las cartas de la colección del usuario.
     * @returns
     */
  public listarCartas(): void {
    this.cargarColeccion();
    console.log(chalk.blue(`Cartas de ${this.nombre}:`));
    this.coleccion.forEach(carta => {
      console.log(chalk.yellow(`ID: ${carta.id}, Nombre: ${carta.nombre}, Color: ${this.getColorString(carta.color)}`));
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
  public mostrarCarta(id: number): void {
    this.cargarColeccion();
    const carta = this.coleccion.find(c => c.id === id);
    if (!carta) {
      console.log(chalk.red('¡Error! No se encontró ninguna carta con ese ID en la colección.'));
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
      console.log(chalk.yellow(`Fuerza/Resistencia: ${carta.fuerzaResistencia[0]}/${carta.fuerzaResistencia[1]}`));
    }
    if (carta.marcasLealtad) {
      console.log(chalk.yellow(`Marcas de lealtad: ${carta.marcasLealtad}`));
    }
    console.log(chalk.yellow(`Valor de mercado: ${carta.valorMercado}`));
  }

  /**
   * @brief Método que guarda la colección de cartas del usuario en un archivo JSON.
   */
  private guardarColeccion(): void {
    const rutaArchivo = `./src/magic/${this.nombre}_coleccion.json`;
    fs.writeFileSync(rutaArchivo, JSON.stringify(this.coleccion, null, 2));
  }

  /**
   * @brief Método que carga la colección de cartas del usuario desde un archivo JSON.
   */
  public cargarColeccion(): void {
    const rutaArchivo = `./src/magic/${this.nombre}_coleccion.json`;
    if (fs.existsSync(rutaArchivo)) {
      const data = fs.readFileSync(rutaArchivo, "utf-8");
      this.coleccion = JSON.parse(data);
    }
  }
}