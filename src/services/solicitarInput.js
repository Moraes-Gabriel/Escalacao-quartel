import { imprimirQuatidadeDeSoldados, solicitarInput } from "./metodos";

export async function solicitarInputNumeroDeSoldadosParaEscalar(){
    const numeroDeSoldadosParaEscalar = await solicitarInput(
        "Digite o numero de soldados à ser escalados"
      );
      return numeroDeSoldadosParaEscalar;
} 

export async function solicitarInputTipoDeEscala() {
    const tipoDeEscala = await solicitarInput(
      "Digite o tipo de escala para escalar os soldados DIGITE: " +
        "1 - escalaPreta e 2 - escalaVermelha"
    );
    if (tipoDeEscala == 1) {
      return "escalaPreta";
    } else {
      return "escalaVermelha";
    }
  }
export async function solicitarInputParaEscalarSoldadosPara24(quantidadeDeSoldadosEscalados,tamanhoArray){

    
    console.log("quantidade de soldados escalados: " + quantidadeDeSoldadosEscalados);
    console.log("quantidade de soldados que voce pode escalar para 24: " + tamanhoArray);
    console.log("+==========================")
    console.log("voce deseja recrutar soldados 24?");
    console.log("se sim digite a quantidade de soldados inferior a: " + tamanhoArray);
    console.log("se deseja mantar os escalados " + quantidadeDeSoldadosEscalados + " digite 0")

    const n = await solicitarInput("digite um numero:");

    return n;
  }