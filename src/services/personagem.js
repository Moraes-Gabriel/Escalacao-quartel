import { useLocalStorage } from "./local-storage/use-local-storage";
import axios from "axios";
import { elementaryChargeDependencies } from "mathjs";
import { tamanhoDeUmArray } from "../services/metodos";

const localStorage = useLocalStorage();

export function getPersonagemSelecionado() {
  return localStorage.getObject("personagem-selecionado");
}

export function criarSoldado(
  nome,
  numero,
  numeroEscalaPreta,
  numeroEscalaVermelha,
  plantao,
  listaPersonagens = getPersonagensCriados()
) {
  const tamanhoPersonagensCriados = listaPersonagens.length + 1;

  const personagem = {
    id: tamanhoPersonagensCriados,
    nome: nome,
    numero: numero,
    escalaPreta: numeroEscalaPreta,
    escalaVermelha: numeroEscalaVermelha,
    plantao: plantao,
    baixado: false,
    operacao: false,
  };

  return personagem;
}

export function getPersonagensCriados() {
  return localStorage.getObject("personagens-criados");
}

export function getPersonagemPorId(idBuscado) {
  const listaPersonagensCriados = localStorage.getObject("personagens-criados");

  const personagemFiltrado = listaPersonagensCriados.find((item) => {
    return item.id == idBuscado;
  });
  return personagemFiltrado;
}

export function getIndexPorIdPersonagem(idBuscado) {
  const listaPersonagensCriados = localStorage.getObject("personagens-criados");

  return listaPersonagensCriados.findIndex((item) => {
    return item.id == idBuscado;
  });
}

export function atualizarPersonagem(id, personagemNovo) {
  const listaPersonagensCriados = localStorage.getObject("personagens-criados");

  listaPersonagensCriados[getIndexPorIdPersonagem(id)] = { ...personagemNovo };

  localStorage.setObject("personagens-criados", listaPersonagensCriados);

  if (id == getPersonagemSelecionado().id) {
    localStorage.setObject("personagem-selecionado", { ...personagemNovo });
  }

  return { ...personagemNovo };
}
export function listaDoMaiorProMenor(arraySoldados) {
  const arraySoldadoOrdenado = [];
  const ta = tamanhoDeUmArray(arraySoldados)
  for (let index = 0; index < ta; index++) {
    let maior = 0;
    let ind = 0;
    let soldadoComMaiorNumero;
    arraySoldados.forEach((element, indice) => {
      if (element.numero > maior) {
        soldadoComMaiorNumero = element;
        maior = element.numero
        ind = indice;
      }
    });

    arraySoldados.splice(ind, 1)
    arraySoldadoOrdenado.push(soldadoComMaiorNumero);
  }
  return arraySoldadoOrdenado;
}
