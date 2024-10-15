let listaLingucas = []; //conjunto de dadoslistaAlunos
let oQueEstaFazendo = ''; //variável global de controle
let linguca = null; //variavel global 

window.onload = inserirDadosIniciais();

//metodo para mostrar mensagem quando o foco for para a chave primaria 
document.getElementById("inputId").addEventListener("focus", function () {
    mostrarAviso("Digite o Id e clic no botão procure");
});

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaLingucas.length; i++) {
        const linguca = listaLingucas[i];
        if (linguca.Id == chave) {
            linguca.posicaoNaLista = i; // se achou, guarda nesse atributo a posição na lista (índice)
            return listaLingucas[i];//se achou, interrompe o laço de repetição e devolve a linha inteira
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   ---------------------------------------------------------
function procure() {
    const Id = document.getElementById("inputId").value;
    if (Id) { // se digitou um Id
        linguca = procurePorChavePrimaria(Id);
        if (linguca) { //achou na lista
            mostrarDadosAluno(linguca);
            visibilidadeDosBotoes('inline', 'none', 
                'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else { // se deixou o Id em branco e tentou procurar
        document.getElementById("inputId").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("Id").focus();

    //para facilitar os testes sem ter que digitar notas (vai sumir quando terminarem os testes)
    document.getElementById("inputPeso").value = 7;
    document.getElementById("inputTamanho").value = 7;
    document.getElementById("inputNivelQualidade").value = 7;
    document.getElementById("inputDataFabricacao").value = 7;
}

// Função para alterar um elemento da lista
function alterar() {
    // Remove o readonly dos campos
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    bloquearAtributos(true);
    document.getElementById("Id").readOnly = true; // bloqueia a chave
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista
    const Id = document.getElementById("Id").value;
    const tipo = document.getElementById("inputTipo").value;

    let peso = parseFloat(document.getElementById("inputPeso").value);
    let tamanho = parseFloat(document.getElementById("inputTamanho").value);
    let nota3 = parseFloat(document.getElementById("inputNivelQualidade").value);
    let nota4 = parseFloat(document.getElementById("inputDataFabricacao").value);

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (Id &&
        tipo &&
        !isNaN(parseFloat(peso)) && peso >= 0 && peso <= 10 &&
        !isNaN(parseFloat(tamanho)) && tamanho >= 0 && tamanho <= 10 &&
        !isNaN(parseFloat(nota3)) && nota3 >= 0 && nota3 <= 10 &&
        !isNaN(parseFloat(nota4)) && nota4 >= 0 && nota4 <= 10
    ) { // se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                linguca = new Linguca(id, tipo, peso, tamanho, nota3, nota4);
                listaLingucas.push(linguca);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                alunoAlterado = new Linguca(id, tipo, peso, tamanho, nota3, nota4);
                listaLingucas[linguca.posicaoNaLista] = alunoAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaLingucas.length; i++) {
                    if (linguca.posicaoNaLista != i) {
                        novaLista.push(listaLingucas[i]);
                    }
                }
                listaLingucas = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("Id").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//backend
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto += linha.Id + " - " +
            linha.tipo + " - " +
            linha.peso + " - " +
            linha.tamanho + " - " +
            linha.nota3 + " - " +
            linha.nota4 + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaLingucas);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do linguca nos campos
function mostrarDadosAluno(linguca) {
    document.getElementById("inputTipo").value = linguca.tipo;
    document.getElementById("inputPeso").value = linguca.peso;
    document.getElementById("inputTamanho").value = linguca.tamanho;
    document.getElementById("inputNivelQualidade").value = linguca.nota3;
    document.getElementById("inputDataFabricacao").value = linguca.nota4;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados
function limparAtributos() {
    document.getElementById("inputTipo").value = "";
    document.getElementById("inputPeso").value = "";
    document.getElementById("inputTamanho").value = "";
    document.getElementById("inputNivelQualidade").value = "";
    document.getElementById("inputDataFabricacao").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    //quando recebe valor == true no parâmetro, libera a chave e bloqueia a edição dos outros atributos. Se receber false, faz o contrário.
    document.getElementById("Id").readOnly = !soLeitura; // sempre ao contrário dos outros atributos
    document.getElementById("inputTipo").readOnly = soLeitura;
    document.getElementById("inputPeso").readOnly = soLeitura;
    document.getElementById("inputTamanho").readOnly = soLeitura;
    document.getElementById("inputNivelQualidade").readOnly = soLeitura;
    document.getElementById("inputDataFabricacao").readOnly = soLeitura;
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("Id").focus();
}

//backend
function inserirDadosIniciais() {
    //esta função é para não ter que ficar digitando dados a cada vez que 
    //recarrega a página. Facilita os testes. 

    listaLingucas = [];//se houver dados na lista, apaga todos
    let linguca = new Linguca('111', 'Ana Silva', 8.5, 7.2, 9.0, 8.0);
    listaLingucas.push(linguca);
    linguca = new Linguca('222', 'Bruno Costa', 6.3, 5.8, 7.0, 6.5);
    listaLingucas.push(linguca);
    linguca = new Linguca('333', 'Carla Oliveira', 9.1, 8.7, 9.3, 8.9);
    listaLingucas.push(linguca);
    linguca = new Linguca('444', 'Daniel Souza', 7.5, 6.9, 8.0, 7.2);
    listaLingucas.push(linguca);
    linguca = new Linguca('555', 'Eduardo Lima', 5.6, 7.4, 6.5, 6.8);
    listaLingucas.push(linguca);
    linguca = new Linguca('666', 'Bruno Costa', 3.2, 5.1, 2.0, 1.5);
    listaLingucas.push(linguca);
    linguca = new Linguca('777', 'Bernadete Pereira da Costa Larga', 8, 8.1, 8.0, 9.5);
    listaLingucas.push(linguca);
    listar();
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    bloquearAtributos(true);
}
