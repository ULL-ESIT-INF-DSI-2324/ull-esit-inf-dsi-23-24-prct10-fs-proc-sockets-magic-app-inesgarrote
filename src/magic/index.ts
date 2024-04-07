
import yargs from "yargs";
import chalk from "chalk";
import { hideBin } from "yargs/helpers";
import {Color, Tipo, Rareza,  Carta } from "./carta.js";
import { Usuario } from "./usuario.js";



const usuarios: Usuario[] = [
  new Usuario('inesgarrote'),
  new Usuario('quevedo'),
  new Usuario('luis'),

];


yargs(hideBin(process.argv))
  .command({
    command: 'add',
    describe: 'Adds a card to the collection',
    builder: {
      id: {
        describe: 'Card ID',
        type: 'number',
        demandOption: true,
      },
      nombre: {
        describe: 'Card name',
        type: 'string',
        demandOption: true,
      },
      costeMana: {
        describe: 'Mana cost of the card',
        type: 'number',
        demandOption: true,
      },
      color: {
        describe: 'Color of the card',
        type: 'string',
        demandOption: true,
        choices: Object.values(Color),
      },
      tipo: {
        describe: 'Type of the card',
        type: 'string',
        demandOption: true,
        choices: Object.values(Tipo),
      },
      rareza: {
        describe: 'Rarity of the card',
        type: 'string',
        demandOption: true,
        choices: Object.values(Rareza),
      },
      textoReglas: {
        describe: 'Rules text of the card',
        type: 'string',
        demandOption: true,
      },
      fuerzaResistencia: {
        describe: 'Strength/Toughness of the card (only for Creature type)',
        type: 'string', 
      },
      marcasLealtad: {
        describe: 'Loyalty marks of the card (only for Planeswalker type)',
        type: 'number',
      },
      valorMercado: {
        describe: 'Market value of the card',
        type: 'number',
        demandOption: true,
      },
    },
    handler: (argv) => {
      const usuario = usuarios.find(u => u.getNombre() === argv.user);
      if (!usuario) {
        console.log(chalk.red('Usuario no encontrado'));
        process.exit(1);
      }
      let fuerzaResistenciaArray: [number, number] | undefined;
      if (argv.tipo === Tipo.Criatura) {
        if (argv.fuerzaResistencia) {
          try {
            fuerzaResistenciaArray = JSON.parse(argv.fuerzaResistencia) as [number, number];
          } catch (error) {
            console.error(chalk.red('Error al analizar fuerzaResistencia:'), error);
            process.exit(1); // Salir del proceso con un código de error
          }
        } else {
          console.log(chalk.red('El atributo fuerzaResistencia es requerido para cartas de tipo Criatura.'));
          process.exit(1); // Salir del proceso con un código de error
        }
      }

      const carta: Carta = {
        id: argv.id as number,
        nombre: argv.nombre as string,
        costeMana: argv.costeMana as number,
        color: argv.color as Color,
        tipo: argv.tipo as Tipo,
        rareza: argv.rareza as Rareza,
        textoReglas: argv.textoReglas as string,
        fuerzaResistencia: fuerzaResistenciaArray , // Update the type to 'string'
        marcasLealtad: argv.marcasLealtad as number,
        valorMercado: argv.valorMercado as number,
      };
      usuario.agregarCarta(carta);
    },
  })
  .command({
    command: 'list',
    describe: 'List all cards in the collection',
    handler: (argv) => {
      const usuario = usuarios.find(u => u.getNombre() === argv.user);
      if (!usuario) {
        console.log(chalk.red('Usuario no encontrado'));
        process.exit(1);
      }
      usuario.listarCartas();
    },
  })
  .command({
    command: 'show',
    describe: 'Show information of a specific card',
    builder: {
      id: {
        describe: 'Card ID',
        type: 'number',
        demandOption: true,
      },
    },
    handler: (argv) => {
      const usuario = usuarios.find(u => u.getNombre() === argv.user);
      if (!usuario) {
        console.log(chalk.red('Usuario no encontrado'));
        process.exit(1);
      }
      usuario.mostrarCarta(argv.id as number);
    },
  })
  .command({
    command: 'update',
    describe: 'Update a card in the collection',
    builder: {
      id: {
        describe: 'Card ID',
        type: 'number',
        demandOption: true,
      },
      nombre: {
        describe: 'Card name',
        type: 'string',
        demandOption: true,
      },
      costeMana: {
        describe: 'Mana cost of the card',
        type: 'number',
        demandOption: true,
      },
      color: {
        describe: 'Color of the card',
        type: 'string',
        demandOption: true,
        choices: Object.values(Color),
      },
      tipo: {
        describe: 'Type of the card',
        type: 'string',
        demandOption: true,
        choices: Object.values(Tipo),
      },
      rareza: {
        describe: 'Rarity of the card',
        type: 'string',
        demandOption: true,
        choices: Object.values(Rareza),
      },
      textoReglas: {
        describe: 'Rules text of the card',
        type: 'string',
        demandOption: true,
      },
      fuerzaResistencia: {
        describe: 'Strength/Toughness of the card (only for Creature type)',
        type: 'string', 
      },
      marcasLealtad: {
        describe: 'Loyalty marks of the card (only for Planeswalker type)',
        type: 'number',
      },
      valorMercado: {
        describe: 'Market value of the card',
        type: 'number',
        demandOption: true,
      },
    },
    handler: (argv) => {
      const usuario = usuarios.find(u => u.getNombre() === argv.user);
      if (!usuario) {
        console.log(chalk.red('Usuario no encontrado'));
        process.exit(1);
      }
      let fuerzaResistenciaArray: [number, number] | undefined;

      if (argv.tipo === Tipo.Criatura) {
        if (argv.fuerzaResistencia) {
          try {
            fuerzaResistenciaArray = JSON.parse(argv.fuerzaResistencia) as [number, number];
          } catch (error) {
            console.log(chalk.red('Error al analizar fuerzaResistencia:'), error);
            process.exit(1); // Salir del proceso con un código de error
          }
        } else {
          console.log(chalk.red('El atributo fuerzaResistencia es requerido para cartas de tipo Criatura.'));
          process.exit(1); // Salir del proceso con un código de error
        }
      }
    
      const cartanueva: Carta = {
        id: argv.id as number,
        nombre: argv.nombre as string,
        costeMana: argv.costeMana as number,
        color: argv.color as Color,
        tipo: argv.tipo as Tipo,
        rareza: argv.rareza as Rareza,
        textoReglas: argv.textoReglas as string,
        fuerzaResistencia: fuerzaResistenciaArray, // Actualiza el tipo a 'fuerzaResistencia'
        marcasLealtad: argv.marcasLealtad as number,
        valorMercado: argv.valorMercado as number,
      };
    
      // Modificar la carta
      usuario.modificarCarta(argv.id as number, cartanueva as Carta);
    },
  })
  .command({
    command: 'delete',
    describe: 'Delete a card from the collection',
    builder: {
      id: {
        describe: 'Card ID',
        type: 'number',
        demandOption: true,
      },
    },
    handler: (argv) => {
      const usuario = usuarios.find(u => u.getNombre() === argv.user);
      if (!usuario) {
        console.log(chalk.red('Usuario no encontrado'));
        process.exit(1);
      }
      usuario.eliminarCarta(argv.id as number);
    },
  })
  .help()
  .argv;