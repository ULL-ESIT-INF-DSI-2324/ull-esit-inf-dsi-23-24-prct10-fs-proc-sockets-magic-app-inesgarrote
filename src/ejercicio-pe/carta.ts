/**
 * @brief Enumerado de colores de las cartas
 */
export enum Color {
  Blanco = "Blanco",
  Azul = "Azul",
  Negro = "Negro",
  Rojo = "Rojo",
  Verde = "Verde",
  Incoloro = "Incoloro",
  Multicolor = "Multicolor",
}

/**
 * @brief Enumerado de tipo de carta
 */
export enum Tipo {
  Tierra = "Tierra",
  Criatura = "Criatura",
  Encantamiento = "Encantamiento",
  Conjuro = "Conjuro",
  Instantaneo = "Instantaneo",
  Artefacto = "Artefacto",
  Planeswalker = "Planeswalker",
}

/**
 * @brief Enumerado de rareza de carta
 */
export enum Rareza {
  Comun = "Comun",
  Infrecuente = "Infrecuente",
  Rara = "Rara",
  Mitica = "Mitica",
}

// alias de tipo
export type fuerzaResistencia = [number, number] | undefined;

/**
 * @brief Interfaz para la clase Carta
 */
export interface CartaIntertaz {
  id: number;
  nombre: string;
  costeMana: number;
  color: Color;
  tipo: Tipo;
  rareza: Rareza;
  textoReglas: string;
  fuerzaResistencia: fuerzaResistencia; // sólo se incluyen en aquellas cartas de tipo Criatura
  marcasLealtad: number | undefined; // Solo en cartas Planeswalker
  valorMercado: number;
}

/**
 * @brief Clase Carta
 */
export class Carta implements CartaIntertaz {
  constructor(
    public id: number,
    public nombre: string,
    public costeMana: number,
    public color: Color,
    public tipo: Tipo,
    public rareza: Rareza,
    public textoReglas: string,
    public valorMercado: number,
    public fuerzaResistencia: fuerzaResistencia,
    public marcasLealtad: number | undefined,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.costeMana = costeMana;
    this.color = color;
    this.tipo = tipo;
    this.rareza = rareza;
    this.textoReglas = textoReglas;
    this.valorMercado = valorMercado;
    if (this.tipo === Tipo.Criatura) {
      if (fuerzaResistencia == undefined) {
        throw new Error("Las criaturas deben tener fuerza y resistencia");
      }
      this.fuerzaResistencia = fuerzaResistencia;
    }
    if (this.tipo === Tipo.Planeswalker) {
      if (marcasLealtad == undefined) {
        throw new Error("Los planeswalker deben tener marcas de lealtad");
      }
      this.marcasLealtad = marcasLealtad;
    }
  }
}
