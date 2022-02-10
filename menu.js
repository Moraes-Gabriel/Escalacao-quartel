import axios from "axios";
import { useLocalStorage } from "./src/services/local-storage/use-local-storage";
import { isString, solicitarInput, imprimirQuatidadeDeSoldados} from "./src/services/metodos";
import {
  getPersonagemPorId,
  getPersonagensCriados,
  criarSoldado,
  listaDoMaiorProMenor,
} from "./src/services/personagem";
import { Escala, tamanhoDeUmArray } from "./src/services/escala";

const localStorage = useLocalStorage();

export function menuPrincipal() {
  let arrayOpcoes = [];
  if (localStorage.getObject("personagens-criados").length > 0) {
    arrayOpcoes = [
      { hotkey: "1", title: "Soldados", selected: true },
      { hotkey: "2", title: "Escalas" },
      { separator: true },
      { hotkey: "X", title: "Sair" },
    ];
  } else {
    arrayOpcoes = [
      { hotkey: "10", title: "Criar Soldado", selected: true },
      { separator: true },
      { hotkey: "X", title: "Sair" },
    ];
  }

  var menu = require("console-menu");

  menu(arrayOpcoes, {
    header: "Menu Principal",
    border: true,
  }).then((item) => {
    if (item) {
      switch (item.hotkey) {
        case "1":
          menuSoldado();
          break;

        case "2":
          menuEscala();
          break;

        case "10":
          criadorSoldado();
          break;
      }
    } else {
      return false;
    } 
  });
}

export function menuSoldado() {
  let arrayOpcoes = [];
  if (localStorage.getObject("personagens-criados").length > 0) {
    arrayOpcoes = [
      { hotkey: "1", title: "Criar soldado", selected: true },
      { hotkey: "2", title: "Selecionar soldado" },
      { separator: true },
      { hotkey: "X", title: "Voltar" },
    ];
  } else {
    arrayOpcoes = [
      { hotkey: "1", title: "Criar Soldado", selected: true },
      { separator: true },
      { hotkey: "X", title: "Voltar" },
    ];
  }

  var menu = require("console-menu");

  menu(arrayOpcoes, {
    header: "Menu Principal",
    border: true,
  }).then((item) => {
    if (item) {
      switch (item.hotkey) {
        case "1":
          criadorSoldado();
          break;

        case "2":
          selecionadorPersonagem();
          break;
        case "X":
          menuPrincipal();
          break;
      }
    } else {
      return false;
    }
  });
}
export function menuEscala() {
  var menu = require("console-menu");
  menu(
    [
      { hotkey: "1", title: "Verificar proxima escala" },
      { hotkey: "2", title: "Escalas dos ultimos 7 dias", selected: true },
      { hotkey: "3", title: "Quantidade de soldados", selected: true },

      { separator: true },
      { hotkey: "X", title: "Voltar" },
    ],
    {
      header: "Example menu",
      border: true,
    }
  ).then((item) => {
    if (item) {
      switch (item.hotkey) {
        case "1":
          Escala();
          
          break;

        case "2":
          menuEscaladosDaSemana();
          break;

        case "3":
          imprimirQuatidadeDeSoldados();
         
          menuEscala();
          break;

        case "X":
          menuPrincipal();
          break;
      }
    } else {
      return false;
    }
  });
}
export function menuEscaladosDaSemana() {
  var menu = require("console-menu");
  menu(
    [
      { hotkey: "1", title: "hoje" },
      { hotkey: "2", title: "ontem", selected: true },

      { separator: true },
      { hotkey: "X", title: "Voltar" },
    ],
    {
      header: "Example menu",
      border: true,
    }
  ).then((item) => {
    if (item) {
      switch (item.hotkey) {
        case "1":
          Escala();
          break;

        case "2":
          menuEscala();
          break;
        case "X":
          menuPrincipal();
          break;
      }
    } else {
      return false;
    }
  });
}

export function menuPersonagemSelecionado() {
  var menu = require("console-menu");
  menu(
    [
      { hotkey: "1", title: "Batalhar", selected: true },
      { hotkey: "2", title: "Realizar Missões" },
      { hotkey: "3", title: "Equipamentos" },
      { hotkey: "4", title: "Loja" },
      { separator: true },
      { hotkey: "X", title: "Voltar" }
    ],
    {
      header: "Menu Personagem",
      border: true
    }
  ).then(async (item) => {
    if (item) {
      switch (item.hotkey) {
        case "1":
          batalharComPersonagemSelecionado();
          break;

        case "2":
          selecionarMissoes();
          break;

        case "3":
          await chamaMenuEquipamentos();
          menuPersonagemSelecionado();
          break;

        case "4":
          menuLoja();
          break;

        case "X":
          menuPrincipal();
          break;
      }
    } else {
      console.log("Cancelado");
    }
  });
}


async function selecionadorSoldado() {
  console.log("===========================================");
  const listaSoldadosCriados = getPersonagensCriados();

  listaSoldadosCriados.forEach((soldado, indice) => {
    console.log(
      " " +
        indice +
        " - " +
        soldado.nome +
        " (Numero " +
        soldado.numero +
        ")"
    );
    console.log("===========================================");
  });

  const idSoldado = await solicitarInput(
    "Digite o id do soldado que deseja selecionar"
  );
  if (
    isNaN(idSoldado) ||
    idSoldado < 0 ||
    idSoldado >= listaSoldadosCriados.length ||
    idSoldado === ""
  ) {
    console.log(
      "Você inseriu um soldado inexistente. Voltando ao menu principal"
    );
    menuPrincipal();
  } else {
    const soldadoSelecionado = getPersonagemPorId(
      listaSoldadosCriados[idSoldado].id
    );
    console.log("Você selecionou " + soldadoSelecionado.nome);

    localStorage.setObject("personagem-selecionado", personagemSelecionado);

    menuPersonagemSelecionado();
  }
}

export async function criadorSoldado() {
  console.log("Bem vindo ao criador de Soldado!");

  const nome = await solicitarInput("Digite o nome do seu Soldado");
  const numero = await solicitarInput("Digite o numero do seu Soldado");
  const numeroEscalaPreta = await solicitarInput(
    "Digite o numero da escala preta do Soldado");
  const numeroEscalaVermelha = await solicitarInput(
    "Digite o numero da escala vermelha do Soldado");
  const plantao = await solicitarInput(
    "Digite a quantidade de plantao feita pelo soldado");

  const soldado = criarSoldado(
    nome,
    numero,
    numeroEscalaPreta,
    numeroEscalaVermelha,
    plantao
  );

  console.log(soldado);
  localStorage.setObject("personagens-criados", [
    ...localStorage.getObject("personagens-criados"),
    soldado,
  ]);
  menuPrincipal();
}
