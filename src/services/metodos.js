import { useQuestion } from "./question/use-question";
import { useLocalStorage } from "../services/local-storage/use-local-storage";


const localStorage = useLocalStorage();

export async function solicitarInput(desc) {
  let input
    input = await useQuestion("\n"+desc);

    return input;
}

export function subirNivel(personagem, niveisASubir) {
    const personagemEvoluido = { ...personagem };
  
    for (let i = 0; i < niveisASubir; i++) {
      personagemEvoluido.nivel += 1;
  
      if (personagemEvoluido.nivel % 2 != 0) {
        personagemEvoluido.vida += VIDA_POR_NIVEL;
        personagemEvoluido.vigor += VIGOR_POR_NIVEL;
      }
    }
    return personagemEvoluido;
  }

  export function isString(objeto) {
    return Object.prototype.toString.call(objeto) === "[object String]"
  }
  export function imprimirQuatidadeDeSoldados(){
    const listaPersonagensCriados =   localStorage.getObject("personagens-criados");
    const tamanhoLista = tamanhoDeUmArray(listaPersonagensCriados)
  }
  
  export function tamanhoDeUmArray(arraySoldado) {
    var contador = 0;
    if(arraySoldado){
    arraySoldado.forEach((element) => {
      contador += 1;
    });
    }
    return contador;
  }
  