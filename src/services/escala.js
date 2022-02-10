import { useLocalStorage } from "./local-storage/use-local-storage";
import { menuPrincipal } from "../../menu";
import { imprimirQuatidadeDeSoldados, tamanhoDeUmArray } from "./metodos"
import {
  atualizarPersonagem,
  listaDoMaiorProMenor,
} from "./personagem";
import {
  solicitarInputNumeroDeSoldadosParaEscalar,
  solicitarInputTipoDeEscala,
  solicitarInputParaEscalarSoldadosPara24,
} from "./solicitarInput";

const localStorage = useLocalStorage();

export async function Escala() {
  const numeroDeSoldadosParaEscalar =
    await solicitarInputNumeroDeSoldadosParaEscalar();
  const tipoDeEscala = await solicitarInputTipoDeEscala();

  const arrayPersonagens =
    retornarListaPersonagensEscalaMaiorProMenorEComPlantaoMaisQue2(
      tipoDeEscala
    );
  const arraySoldadosEscalados = await verificarQuemVaiSerEscalado(
    arrayPersonagens,
    numeroDeSoldadosParaEscalar,
    tipoDeEscala
  );

  escaladosOntem();
  localStorage.setObject("escalados-hoje", arraySoldadosEscalados);
  printDosSoldadosEscalados(arraySoldadosEscalados);

  menuPrincipal();
}

function verificarQuemVaiSerEscalado(
  arrayPersonagens,
  numeroDeSoldadosParaEscalar,
  tipoDeEscala
) {
  const arrayPersonagensAtualizado = [...arrayPersonagens];
  const arrayEscalados = [];
  let bo = false;

  while (tamanhoDeUmArray(arrayEscalados) != numeroDeSoldadosParaEscalar) {
    const soldadoSerEscalado = soldadoAptoParaSerEscalado(
      arrayPersonagensAtualizado,
      tipoDeEscala
    );

    if (!soldadoSerEscalado) {
      bo = true;
      break;
    }

    arrayEscalados.push(soldadoSerEscalado);
    const indice = arrayPersonagensAtualizado.indexOf(soldadoSerEscalado);
    arrayPersonagensAtualizado.splice(indice, 1);
  }

  if (bo == true) {
    if (tamanhoDeUmArray(arrayEscalados) < numeroDeSoldadosParaEscalar) {
      return verificarQuemVaiSerEscaladoPara24(
        arrayPersonagensAtualizado,
        numeroDeSoldadosParaEscalar,
        tipoDeEscala,
        arrayEscalados
      );
    }
  } else {
    resetarPlantaoDeSoldadosEscalados(arrayEscalados, tipoDeEscala);
    resetarEscalaDeSoldadosEscalados(arrayEscalados, tipoDeEscala);
    aumentarEscalaDeSoldadosNaoEscalados(
      arrayPersonagensAtualizado,
      tipoDeEscala
    );
    aumentarPlantaoDeSoldadosNaoEscalados(
      arrayPersonagensAtualizado,
      tipoDeEscala
    );
  }

  return arrayEscalados;
}
function soldadoAptoParaSerEscalado(arraySoldado, tipoDeEscala) {
  const arraySoldadoAtualizado = arraySoldado;

  const numeroEscalaPreta = arraySoldadoAtualizado[0].escalaPreta;
  const numeroEscalaVermelha = arraySoldadoAtualizado[0].escalaVermelha;

  var maior = 0;
  let soldadoMaisNovo;

  arraySoldadoAtualizado.forEach((element) => {
    if (tipoDeEscala == "escalaPreta") {
      if (
        element.numero > maior &&
        element.escalaPreta == numeroEscalaPreta &&
        element.plantao > 2 &&
        element.baixado == false &&
        element.operacao == false
      ) {
        maior = element.numero;
        soldadoMaisNovo = element;
      }
    } else if (
      element.numero > maior &&
      element.escalaVermelha == numeroEscalaVermelha &&
      element.plantao > 2 &&
      element.baixado == false &&
      element.operacao == false
    ) {
      maior = element.numero;
      soldadoMaisNovo = element;
    }
  });

  return soldadoMaisNovo;
}

export function retornarListaPersonagensEscalaMaiorProMenorEComPlantaoMaisQue2(
  tipoDeEscala
) {
  const listaPersonagensCriados = localStorage.getObject("personagens-criados");

  const listaPersonagemAtualizado = listaDoMaiorProMenor(
    listaPersonagensCriados
  );
  let maiorEscala = maiorEscalaDosSoldados(tipoDeEscala);
  const arrayPersonagens = [];

  while (maiorEscala >= 0) {
    listaPersonagemAtualizado.forEach((element) => {
      if (tipoDeEscala == "escalaPreta") {
        if (element.escalaPreta == maiorEscala) {
          arrayPersonagens.push(element);
        }
      } else {
        if (element.escalaVermelha == maiorEscala) {
          arrayPersonagens.push(element);
        }
      }
    });
    maiorEscala -= 1;
  }
  const arraySoldadoSobrando = [...arrayPersonagens];
  const arraySoldado = [];
  listaPersonagemAtualizado.forEach((element) => {
    if (element.plantao > 2) {
      arraySoldado.push(element);
      const indice = arraySoldadoSobrando.indexOf(element);
      arraySoldadoSobrando.splice(indice, 1);
    }
  });

  const arraySoldadosEmOrdem = arraySoldado.concat(arraySoldadoSobrando);
  return arraySoldadosEmOrdem;
}
export function retornarlistaPara24MaiorPlantaoEMaiorEscalaVermelha(
  arrayEscalados
) {
  let maiorPlantao = maiorPlantaoDosSoldados(arrayEscalados);
  const arraySoldadosEmOrdem = [];

  while (maiorPlantao >= 0) {
    arrayEscalados.forEach((element) => {
      if (element.plantao == maiorPlantao) {
        arraySoldadosEmOrdem.push(element);
      }
    });
    maiorPlantao -= 1;
  }
  return arraySoldadosEmOrdem;
}

export function maiorEscalaDosSoldados(tipoDeEscala) {
  const listaPersonagensCriados = localStorage.getObject("personagens-criados");

  var maior = 0;

  listaPersonagensCriados.forEach((element) => {
    if (tipoDeEscala == "escalaPreta") {
      if (element.escalaPreta > maior) {
        maior = element.escalaPreta;
      }
    } else {
      if (element.escalaVermelha > maior) {
        maior = element.escalaVermelha;
      }
    }
  });
  return maior;
}
export function maiorPlantaoDosSoldados(arraySoldado) {
  const arraySoldadoC = arraySoldado ;
  var plantao = 0;
  arraySoldadoC.forEach((element) => {
    if (element.plantao > plantao) {
      plantao = element.escalaPreta;
    }
  });
  return plantao;
}

export async function verificarQuemVaiSerEscaladoPara24(
  arraySoldados,
  nSE,
  tipoDeEscala,
  arraySoldadosEscalados
) {
  let arraySoldadosAtualizado = arraySoldados;
  const arraySoldadosEscaladosCopia = arraySoldadosEscalados;
  const quantidadeDeSoldadosEscalados = tamanhoDeUmArray(
    arraySoldadosEscaladosCopia
  );
  if(tipoDeEscala == "escalaVermelha") {
    arraySoldadosAtualizado = retornarlistaPara24MaiorPlantaoEMaiorEscalaVermelha(arraySoldadosAtualizado);
  }
  let contador = 0;
  const tamanhoArray = tamanhoDeUmArray(arraySoldadosAtualizado);
  printDosSoldadosEscalados(arraySoldadosEscaladosCopia);

  const numero = await solicitarInputParaEscalarSoldadosPara24(
    quantidadeDeSoldadosEscalados,
    tamanhoArray
  );

  if (numero < tamanhoArray && numero > 0) {
    while (contador != numero) {
      contador++;

      const soldadoSerEscalado = soldadoAptoParaSerEscaladoPara24(
        arraySoldadosAtualizado,
        tipoDeEscala
      );
      if (!soldadoSerEscalado) break;
      arraySoldadosEscaladosCopia.push(soldadoSerEscalado);
      const indice = arraySoldadosAtualizado.indexOf(soldadoSerEscalado);
      arraySoldadosAtualizado.splice(indice, 1);
    }
  } else {
    console.log("digite um valor menor que " + tamanhoArray);
  }
 
  resetarPlantaoDeSoldadosEscalados(arraySoldadosEscaladosCopia);
  resetarEscalaDeSoldadosEscalados(arraySoldadosEscaladosCopia, tipoDeEscala);
  aumentarEscalaDeSoldadosNaoEscalados(arraySoldadosAtualizado, tipoDeEscala);
  aumentarPlantaoDeSoldadosNaoEscalados(arraySoldadosAtualizado, tipoDeEscala);
  return arraySoldadosEscaladosCopia;
}
function soldadoAptoParaSerEscaladoPara24(arraySoldado, tipoDeEscala) {
  const arraySoldadoAtualizado = arraySoldado;

  const numeroEscalaPreta = arraySoldadoAtualizado[0].escalaPreta;
  const numeroEscalaVermelha = arraySoldadoAtualizado[0].escalaVermelha;
  const maiorPlantao = arraySoldadoAtualizado[0].plantao;

  var maior = 0;
  let soldadoMaisNovo;

  arraySoldadoAtualizado.forEach((element) => {
    if (tipoDeEscala == "escalaPreta") {
      if (element.numero > maior && element.escalaPreta == numeroEscalaPreta && element.baixado == false) {
        maior = element.numero;
        soldadoMaisNovo = element;
      }
    } else if (
      element.numero > maior &&
      element.escalaVermelha == numeroEscalaVermelha &&
      element.plantao == maiorPlantao &&
      element.baixado == false
    ) {
      maior = element.numero;
      soldadoMaisNovo = element;
    }
  });

  return soldadoMaisNovo;
}

function escaladosOntem() {
  const listaEscaladosHoje = localStorage.getObject("escalados-hoje");

  localStorage.setObject("escalados-ontem", listaEscaladosHoje);
}

function aumentarEscalaDeSoldadosNaoEscalados(arraySoldado, tipoDeEscala) {
  arraySoldado.forEach((element) => {
    if (tipoDeEscala == "escalaPreta") {
      element.escalaPreta += 1;
      atualizarPersonagem(element.id, element);
    } else {
      element.escalaVermelha += 1;
      atualizarPersonagem(element.id, element);
    }
  });
}

function aumentarPlantaoDeSoldadosNaoEscalados(arraySoldado, tipoDeEscala) {
  arraySoldado.forEach((element) => {
    if (tipoDeEscala == "escalaPreta") {
      element.plantao += 1;
      atualizarPersonagem(element.id, element);
    } else {
      element.plantao += 1;
      atualizarPersonagem(element.id, element);
    }
  });
}
function resetarEscalaDeSoldadosEscalados(arraySoldado, tipoDeEscala) {
  arraySoldado.forEach((element) => {
    if (tipoDeEscala == "escalaPreta") {
      element.escalaPreta = 0;
      atualizarPersonagem(element.id, element);
    } else {
      element.escalaVermelha = 0;
      atualizarPersonagem(element.id, element);
    }
  });
}
function resetarPlantaoDeSoldadosEscalados(arraySoldado) {
  arraySoldado.forEach((element) => {
    element.plantao = 0;
    atualizarPersonagem(element.id, element);
  });
}
async function printDosSoldadosEscalados(arraySoldados) {
  const arraySoldadoAtualizado = arraySoldados;
  console.log("Soldados escalados para o dia:");
  console.log("===========================================");
  if(arraySoldados){
  arraySoldadoAtualizado.forEach((soldado, indice) => {
    console.log(
      " " +
        indice +
        " - " +
        soldado.nome +
        " - " +
        "(Numero: " +
        soldado.numero +
        ")"
    );
    console.log("===========================================");
  });
}
}
