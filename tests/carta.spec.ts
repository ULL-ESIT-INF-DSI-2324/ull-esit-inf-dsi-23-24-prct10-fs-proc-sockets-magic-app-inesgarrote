import "mocha";
//import { expect } from "chai";
import pkg from "chai";
const { expect } = pkg;
import { Color, Tipo, Rareza, Carta } from "../src/magic/carta.js";

describe("Carta", () => {
    it("Constructor works", () => {
        const carta = new Carta(1, "Carta", 1, Color.Azul, Tipo.Criatura, Rareza.Comun, "Texto", 1, [1, 1], undefined);
        expect(carta.id).to.equal(1);
        expect(carta.nombre).to.equal("Carta");
        expect(carta.costeMana).to.equal(1);
        expect(carta.color).to.equal("Azul");
        expect(carta.tipo).to.equal("Criatura");
        expect(carta.rareza).to.equal("Comun");
        expect(carta.textoReglas).to.equal("Texto");
        expect(carta.valorMercado).to.equal(1);
        expect(carta.fuerzaResistencia).to.eql([1, 1]);
        expect(carta.marcasLealtad).to.equal(undefined);
    });
    it("Should throw an error if fuerzaResistencia is not defined in a creature", () => {
        expect(() => new Carta(1, "Carta", 1, Color.Azul, Tipo.Criatura, Rareza.Comun, "Texto", 1, undefined, undefined)).to.throw("Las criaturas deben tener fuerza y resistencia");
    });
    it("Should throw an error if marcasLealtad is defined in a planeswalker", () => {
        expect(() => new Carta(1, "Carta", 1, Color.Azul, Tipo.Planeswalker, Rareza.Comun, "Texto", 1, undefined, undefined)).to.throw("Los planeswalker deben tener marcas de lealtad");
    });
});