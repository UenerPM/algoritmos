let listaLingucas = []; //conjunto de dadoslistaAlunos
let oQueEstaFazendo = ''; //variável global de controle
let linguca = null; //variavel global 

window.onload = inserirDadosIniciais();




function ordenaAlfabeticamente(arrayDePalavras) {
    const comprimentoDoArray = arrayDePalavras.length;
    let houveTroca;
    // Bubble Sort
    for (let j = 0; j < comprimentoDoArray; j++) {
        houveTroca = false;
        for (let i = 0; i < comprimentoDoArray - 1; i++) {
            // Compara duas palavras
            if (arrayDePalavras[i].sommelier.toUpperCase() > arrayDePalavras[i + 1].sommelier.toUpperCase()) { 
            // Troca as palavras se estiverem na ordem errada
            const palavraTemporaria = arrayDePalavras[i];
            arrayDePalavras[i] = arrayDePalavras[i + 1];
            arrayDePalavras[i + 1] = palavraTemporaria;

            houveTroca = true;
        }
    }
    // Se não houve troca, o array já está ordenado
    if (!houveTroca) break;
}

return arrayDePalavras;
}


function ordenarLista() {
    const palavrasOrdenadas = ordenaAlfabeticamente(listaLingucas);


}

//metodo para mostrar mensagem quando o foco for para a chave primaria 
document.getElementById("inputId").addEventListener("focus", function () {
    mostrarAviso("Digite o Id e clic no botão procure");
});

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaLingucas.length; i++) {
        const linguca = listaLingucas[i];
        if (linguca.id == chave) {
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
            mostrarDadosLinguca(linguca);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
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
    document.getElementById("inputId").focus();
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
    document.getElementById("inputId").readOnly = true; // bloqueia a chave
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    let Id;
    if (linguca == null) {
        Id = document.getElementById("inputId").value;
    } else {
        Id = linguca.id;
    }




    //gerencia operações inserir, alterar e excluir na lista
    const tipo = document.getElementById("inputTipo").value;
    const peso = parseFloat(document.getElementById("inputPeso").value);
    const tamanho = parseFloat(document.getElementById("inputTamanho").value);
    const nivelQualidade = parseFloat(document.getElementById("inputNivelQualidade").value);
    const dataFabricacao = document.getElementById("inputDataFabricacao").value;
    const sommelier = document.getElementById("inputSommelier").value

    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (Id && tipo && !isNaN(parseFloat(peso)) && peso && !isNaN(parseFloat(tamanho)) && !isNaN(parseFloat(nivelQualidade)) && nivelQualidade >= 0 && nivelQualidade <= 10 && dataFabricacao && sommelier) { // se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                linguca = new Linguca(Id, tipo, peso, tamanho, dataFabricacao, nivelQualidade, sommelier);
                listaLingucas.push(linguca);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                lingucaAlterada = new Linguca(Id, tipo, peso, tamanho, dataFabricacao, nivelQualidade, sommelier);
                listaLingucas[linguca.posicaoNaLista] = lingucaAlterada;
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
        document.getElementById("inputId").focus();
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
        texto += "<br>" +
            "Sommelier: " + linha.sommelier + "<br>" +
            "ID: " + linha.id + " - " +
            linha.tipo + " - " +
            linha.peso + "g" + " - " +
            linha.tamanho + "cm" + " - " +
            linha.nivelQualidade + " - " +
            "Data: " + linha.dataFabricacao + "<Br>";


    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(ordenaAlfabeticamente(listaLingucas));
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
function mostrarDadosLinguca(linguca) {
    document.getElementById("inputTipo").value = linguca.tipo;
    document.getElementById("inputPeso").value = linguca.peso;
    document.getElementById("inputTamanho").value = linguca.tamanho;
    document.getElementById("inputNivelQualidade").value = linguca.nivelQualidade;
    document.getElementById("inputDataFabricacao").value = linguca.dataFabricacao;
    document.getElementById("inputSommelier").value = linguca.sommelier
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
    document.getElementById("inputSommelier").value = ""

    bloquearAtributos(true);
}
//lembrar o professor do bug no codigo
function bloquearAtributos(soLeitura) {
    //quando recebe valor == true no parâmetro, libera a chave e bloqueia a edição dos outros atributos. Se receber false, faz o contrário.
    document.getElementById("inputId").readOnly = !soLeitura; // sempre ao contrário dos outros atributos
    document.getElementById("inputTipo").readOnly = soLeitura;
    document.getElementById("inputPeso").readOnly = soLeitura;
    document.getElementById("inputTamanho").readOnly = soLeitura;
    document.getElementById("inputNivelQualidade").readOnly = soLeitura;
    document.getElementById("inputDataFabricacao").readOnly = soLeitura;
    document.getElementById("inputDataFabricacao").readOnly = soLeitura;
    document.getElementById("inputSommelier").readOnly = soLeitura;
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
    document.getElementById("inputId").focus();
}

//backend
function inserirDadosIniciais() {
    //esta função é para não ter que ficar digitando dados a cada vez que 
    //recarrega a página. Facilita os testes. 

    listaLingucas = [];//se houver dados na lista, apaga todos
    let linguca = new Linguca(111, 'Calabresa', 900, 20, "0012-03-12", 9.1, "lanhão");
    listaLingucas.push(linguca);
    linguca = new Linguca(222, 'Salame', 300, 5.8, "0012-03-12", 7.5, "grigo burro");
    listaLingucas.push(linguca);
    linguca = new Linguca(333, 'de xurrasco', 534, 78, "0012-01-12", 9.3, "xana movél");
    listaLingucas.push(linguca);
    linguca = new Linguca(444, 'de macho', 875437, 4, "0012-02-12", 10, "Alexandre");
    listaLingucas.push(linguca);
    linguca = new Linguca(555, 'mista', 367.9, 7.4, "0012-07-12", 5, "chupi-chupi-gozatron");
    listaLingucas.push(linguca);
    linguca = new Linguca(666, 'Toscana', 234.2, 38, "0012-05-12", 2.0, "eu");
    listaLingucas.push(linguca);
    linguca = new Linguca(777, 'Portuguesa', 9, 25, "0012-12-12", 8.0, "vaido");
    listaLingucas.push(linguca);
    linguca = new Linguca(877, 'Portuguesa', 9, 25, "0012-12-12", 8.0, "VAIDO");
    listaLingucas.push(linguca);
    listar();
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    bloquearAtributos(true);
}



function salvarNoComputador() {
    nomeParaSalvar = "./LINGUÇAS GIGANTES.csv";
    let textoCSV = "";
    for (let i = 0; i < listaLingucas.length; i++) {
        const linha = listaLingucas[i];
        textoCSV += linha.id + ";" +
            linha.tipo + ";" +
            linha.peso + ";" +
            linha.tamanho + ";" +
            linha.dataFabricacao + ";" +
            linha.nivelQualidade + ";" +
            linha.sommelier + "\n";
    }

    salvarEmArquivo(nomeParaSalvar, textoCSV);
}


function salvarEmArquivo(nomeArq, conteudo) {
    // Cria um blob com o conteúdo em formato de texto
    const blob = new Blob([conteudo], { type: 'text/plain' });
    // Cria um link temporário para o download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArq; // Nome do arquivo de download
    // Simula o clique no link para iniciar o download
    link.click();
    // Libera o objeto URL
    URL.revokeObjectURL(link.href);
}


// Função para abrir o seletor de arquivos para upload
function buscarDadosSalvosNoComputador() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv'; // Aceita apenas arquivos CSV
    input.onchange = function (event) {
        const arquivo = event.target.files[0];
        console.log(arquivo.name);
        if (arquivo) {
            processarArquivo(arquivo);
        }
    };
    input.click(); // Simula o clique para abrir o seletor de arquivos

}

// Função para processar o arquivo CSV e transferir os dados para a listaMusica
function processarArquivo(arquivo) {
    const leitor = new FileReader();
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); // Separa o conteúdo por linha
        listaLingucas = []; // Limpa a lista atual (se necessário)
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (linha) {
                const dados = linha.split(';'); // Separa os dados por ';'
                if (dados.length === 7) {
                    // Adiciona os dados à listaMusica como um objeto
                    listaLingucas.push({
                        id: dados[0],
                        tipo: dados[1],
                        peso: dados[2],
                        tamanho: dados[3],
                        dataFabricacao: dados[4],
                        nivelQualidade: dados[5],
                        sommelier: dados[6]
                    });
                }
            }
        }
        // console.log("Upload concluído!", listaMusica); // Exibe no console a lista atualizada
        listar();
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}
