import { useLocalStorage } from './src/services/local-storage/use-local-storage'
import { menuPrincipal } from './menu';


const localStorage = useLocalStorage();

async function main() {
  inicializarArquivosArmazenamento();
  menuPrincipal()
}

function inicializarArquivosArmazenamento() {
  localStorage.setObject("personagem-selecionado", {});

  if (!localStorage.getObject("personagens-criados")) {
    localStorage.setObject("personagens-criados", []);
  }
  if (!localStorage.getObject("soldados-escalados-ontem")) {
    localStorage.setObject("soldados-escalados-ontem", []);
  }
  if (!localStorage.getObject("soldados-escalados-hoje")) {
    localStorage.setObject("soldados-escalados-hoje", []);
  }
}

main();