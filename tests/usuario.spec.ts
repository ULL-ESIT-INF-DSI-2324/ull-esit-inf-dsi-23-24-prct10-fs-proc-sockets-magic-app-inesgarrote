import "mocha";
//import { expect } from "chai";
import pkg from "chai";
const { expect } = pkg;
import { Usuario } from "../src/magic/usuario.js";
import { Color, Tipo, Rareza, Carta } from "../src/magic/carta.js";

describe("Usuario", () => {
    // usuario para test
    const usuario = new Usuario("shakira");
    // carta para test
    const carta = new Carta(1, "Carta", 1, Color.Azul, Tipo.Criatura, Rareza.Comun, "Texto", 1, [1, 1], undefined);
    it("Constructor works", () => {
        expect(usuario.nombre).to.equal("shakira");
        expect(usuario.coleccion).to.eql([]);
    });
    it("getNombre works", () => {
        expect(usuario.getNombre()).to.equal("shakira");
    });
    it("agregarCarta works", () => {
        usuario.agregarCarta(carta);
        expect(usuario.coleccion).to.eql([carta]);
    });
    it("modificarCarta works", () => {
        const carta_modificada = new Carta(1, "Carta", 1, Color.Azul, Tipo.Criatura, Rareza.Comun, "Carta modificada", 1, [1, 1], undefined);
        usuario.modificarCarta(1, carta_modificada);
        expect(usuario.coleccion[0].textoReglas).to.equal("Carta modificada");
        usuario.modificarCarta(1, carta);
    });
    it("eliminarCarta works", () => {
        usuario.eliminarCarta(1);
        expect(usuario.coleccion).to.eql([]);
    
        
    });
});