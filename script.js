let contClientesHist = 0;
let contVeiculosHist = 0;
let contLocacoesHist = 0;
let clientesRegistrados = [];
let veiculosRegistrados = [];
let locacoesRegistradas = [];


window.addEventListener('beforeunload', salvarRegistros);
window.addEventListener('load', carregaItens);

function salvarRegistros() {
    localStorage.setItem('clientesRegistrados', JSON.stringify(clientesRegistrados));
    localStorage.setItem('veiculosRegistrados', JSON.stringify(veiculosRegistrados));
    localStorage.setItem('locacoesRegistradas', JSON.stringify(locacoesRegistradas));
    localStorage.setItem('contClientesHist', contClientesHist);
    localStorage.setItem('contVeiculosHist', contVeiculosHist);
    localStorage.setItem('contLocacoesHist', contLocacoesHist);
}

function carregaItens() {
    clientesRegistrados = JSON.parse(localStorage.getItem('clientesRegistrados'));
    veiculosRegistrados = JSON.parse(localStorage.getItem('veiculosRegistrados'));
    locacoesRegistradas = JSON.parse(localStorage.getItem('locacoesRegistradas'));
    contClientesHist = Number(localStorage.getItem('contClientesHist'));
    contVeiculosHist = Number(localStorage.getItem('contVeiculosHist'));
    contLocacoesHist = Number(localStorage.getItem('contLocacoesHist'));
    (clientesRegistrados == null) ? clientesRegistrados = [] : "";
    (locacoesRegistradas == null) ? locacoesRegistradas = [] : "";
    (veiculosRegistrados == null) ? veiculosRegistrados = [] : "";
    (isNaN(contClientesHist)) ? contClientesHist = 0 : "";
    (isNaN(contVeiculosHist)) ? contVeiculosHist = 0 : "";
    (isNaN(contLocacoesHist)) ? contLocacoesHist = 0 : "";
}


function esconderMenus() {
    const divPrincipal = document.querySelector('.principal');
    let divsFilhas = divPrincipal.children;
    for (i = 0; i < divsFilhas.length; i++) {
        divsFilhas[i].style.display = 'none';
    }
}


function ordenarClientes(coluna) {
    clientesRegistrados.sort((a, b) => {
        if (a[coluna] < b[coluna]) return -1;
        if (a[coluna] > b[coluna]) return 1;
        return 0;
    });

    consultarClientesMenu();
}

function incluirClienteMenu(){
    esconderMenus();
    apagarMensagensDeErro();
    document.getElementById('form-clientes').reset();
    document.getElementById('inclusao-de-clientes').style.display= 'block';
    document.getElementById('campo-cpf').focus();
}

function apagarDadosTabela(tipoObjeto) {
    if (tipoObjeto === 'cliente') {
        var lista = document.getElementById('tabela-clientes').querySelector('tbody');
    } else if (tipoObjeto === 'veiculo') {
        var lista = document.getElementById('tabela-veiculos').querySelector('tbody');
    } else if (tipoObjeto === 'aluguel') {
        var lista = document.getElementById('tabela-aluguel').querySelector('tbody');
    } else if (tipoObjeto === 'locacao') {
        var lista = document.getElementById('tabela-locacoes').querySelector('tbody');
    }
    lista.innerHTML = '';
}

function consultarClientesMenu() {
    apagarDadosTabela('cliente');

    esconderMenus();
    apagarMensagensDeErro();

    for (let i = 0; i < clientesRegistrados.length; i++) {
        let listaDeClientes = document.getElementById('tabela-clientes').querySelector('tbody');
        const dataNascFormatada = formatarData(clientesRegistrados[i].dataNasc);
        const cpfFormatado = formatarCpf(clientesRegistrados[i].cpf);

        possui_locacao = locacoesRegistradas.find(locacao => locacao.idCliente == clientesRegistrados[i].id);
        if (possui_locacao) {
            var botao_exclusao_param = 'disabled';
        } else {
            var botao_exclusao_param = '';
        }

        existe_veiculo = veiculosRegistrados.length > 0;

        if (existe_veiculo && !possui_locacao) {
            var botao_aluguel_param = '';
        } else {
            var botao_aluguel_param = 'disabled';
        }

        let novaLinha = `<tr id="cliente-${clientesRegistrados[i].id}"><td>${cpfFormatado}</td><td>${clientesRegistrados[i].nome}</td><td class="data-nasc-lista">${dataNascFormatada}</td><td><button onclick="excluirCliente(event)" class="botao botao-exclusao" ${botao_exclusao_param}>Excluir</button><button onclick="alugarVeiculoMenu(event)" class="botao botao-aluguel" ${botao_aluguel_param}>Alugar</button></td></tr>`;
        listaDeClientes.innerHTML += novaLinha;
    }

    document.getElementById('lista-de-clientes').style.display = 'block';
}

function incluirVeiculoMenu(veiculo=null){
    const form = document.getElementById('form-veiculos');
    const inputs = form.querySelectorAll('input');
    if (!veiculo) {
        document.getElementById('form-veiculos').reset();
        inputs.forEach(input => {
            input.disabled = false;
        });
    } else {
        document.getElementById('campo-placa').value = veiculo.placa;
        if (veiculo.tipo == 'Carro') {
            document.getElementById('campo-tipo-1').checked = true;
        } else {
            document.getElementById('campo-tipo-2').checked = true;
        }
        document.getElementById('campo-modelo').value = veiculo.modelo;
        document.getElementById('campo-ano').value = veiculo.ano;
        document.getElementById('campo-valor-diaria').value = veiculo.valorDiaria;
        document.getElementById('campo-quilometragem').value = veiculo.quilometragem;

    }
    esconderMenus();
    apagarMensagensDeErro();
    document.getElementById('inclusao-de-veiculos').style.display= 'block';
    document.getElementById('campo-placa').focus();
}

function consultarVeiculosMenu() {
    apagarDadosTabela('veiculo');

    esconderMenus();
    apagarMensagensDeErro();

    for (let i = 0; i < veiculosRegistrados.length; i++) {
        let listaDeVeiculos = document.getElementById('tabela-veiculos').querySelector('tbody');
        const placaFormatada = formatarPlaca(veiculosRegistrados[i].placa);
        const valorDiariaFormatada = formatarValorDiaria(veiculosRegistrados[i].valorDiaria);

        possui_locacao = locacoesRegistradas.find(locacao => locacao.idVeiculoAlugado == veiculosRegistrados[i].id);
        if (possui_locacao) {
            var botao_exclusao_param = 'disabled';
        } else {
            var botao_exclusao_param = '';
        }

        let novaLinha = `<tr id="veiculo-${veiculosRegistrados[i].id}"><td class="valor-campo valor-placa">${placaFormatada}</td><td class="valor-campo valor-tipo">${veiculosRegistrados[i].tipo}</td><td class="valor-campo valor-modelo">${veiculosRegistrados[i].modelo}</td><td class="valor-campo valor-ano">${veiculosRegistrados[i].ano}</td><td class="valor-campo valor-diaria">R$${valorDiariaFormatada}</td><td class="valor-campo valor-quilometragem">${veiculosRegistrados[i].quilometragem}</td><td><button onclick="editarVeiculo(event)" class="botao botao-edicao">Editar</button><button onclick="excluirVeiculo(event)" class="botao botao-exclusao" ${botao_exclusao_param}>Excluir</button></td></tr>`;
        listaDeVeiculos.innerHTML += novaLinha;
    }

    document.getElementById('lista-de-veiculos').style.display = 'block';
}

function alugarVeiculoMenu(event) {
    let botaoAcionado = event.target;
    let linhaCliente = botaoAcionado.parentNode;
    let idCliente = linhaCliente.parentNode.id.split('-')[1];
    let cliente = clientesRegistrados.find(cliente => cliente.id == idCliente);

    esconderMenus();
    apagarMensagensDeErro();
    apagarDadosTabela('aluguel');

    document.getElementById('informacao-cpf-cliente').textContent = `CPF: ${cliente.cpf}`
    document.getElementById('informacao-nome-cliente').textContent = `Nome: ${cliente.nome}`

    let tabelaAluguel = document.getElementById('tabela-aluguel').querySelector('tbody');

    for (let i = 0; i < veiculosRegistrados.length; i++) {
        if (!locacoesRegistradas.find(locacao => locacao.idVeiculoAlugado == veiculosRegistrados[i].id)) {
            const valorDiariaFormatada = formatarValorDiaria(veiculosRegistrados[i].valorDiaria);
            const placaFormatada = formatarPlaca(veiculosRegistrados[i].placa);
            let novaLinha = `<tr id="veiculo-${veiculosRegistrados[i].id}"><td><input type="radio" name="campo-radio-aluguel" id="campo-radio-aluguel-${i+1}"></td><td class="valor-campo valor-placa">${placaFormatada}</td><td class="valor-campo valor-tipo">${veiculosRegistrados[i].tipo}</td><td class="valor-campo valor-modelo">${veiculosRegistrados[i].modelo}</td><td class="valor-campo valor-ano">${veiculosRegistrados[i].ano}</td><td class="valor-campo valor-diaria">R$${valorDiariaFormatada}</td><td class="valor-campo valor-quilometragem">${veiculosRegistrados[i].quilometragem}</td></tr>`;
            tabelaAluguel.innerHTML += novaLinha;
        }
    }
    document.getElementById('locacao-de-veiculos').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-locacao').addEventListener('submit', function(event) {
        event.preventDefault();
        try {
            var idLinhaTabela = document.querySelector('input[name="campo-radio-aluguel"]:checked').parentNode.parentNode.id;
            var idVeiculoAlugado = idLinhaTabela.split('-')[1];
            var cpfCliente = document.getElementById('informacao-cpf-cliente').textContent.split(' ')[1];
            apagarMensagensDeErro();
            validarLocacao(idVeiculoAlugado, cpfCliente);
        } catch (error) {
            apagarMensagensDeErro();
            validarLocacao(null, null)
        }
    });
});

function validarLocacao(idVeiculoAlugado, cpfCliente) {
    if (!idVeiculoAlugado || !cpfCliente) {
        document.querySelector('.erro-aluguel').textContent = 'Selecione um veículo para aluguel!';
    } else {
        incluirLocacao(idVeiculoAlugado, cpfCliente);
    }
}

function incluirLocacao(idVeiculoAlugado, cpfCliente) {
    let idCliente = clientesRegistrados.find(cliente => cliente.cpf == cpfCliente).id;
    contLocacoesHist += 1;

    let dataAtual = new Date();
    let ano = dataAtual.getFullYear();
    let mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    let dia = String(dataAtual.getDate()).padStart(2, '0');
    let dataLocacao = `${ano}-${mes}-${dia}`;

    locacoesRegistradas.push({id: contLocacoesHist, idCliente: idCliente, idVeiculoAlugado: idVeiculoAlugado, dataLocacao: dataLocacao});
    consultarLocacoesMenu();
    salvarRegistros();
}


function consultarLocacoesMenu() {
    apagarDadosTabela('locacao');

    esconderMenus();
    apagarMensagensDeErro();

    for (let i = 0; i < locacoesRegistradas.length; i++) {
        let listaDeLocacoes = document.getElementById('tabela-locacoes').querySelector('tbody');
        let cliente = clientesRegistrados.find(cliente => cliente.id == locacoesRegistradas[i].idCliente);
        let veiculo = veiculosRegistrados.find(veiculo => veiculo.id == locacoesRegistradas[i].idVeiculoAlugado);
        const cpfFormatado = formatarCpf(cliente.cpf);
        const placaFormatada = formatarPlaca(veiculo.placa);
        const valorDiariaFormatada = formatarValorDiaria(veiculo.valorDiaria);
        const dataLocacaoFormatada = formatarData(locacoesRegistradas[i].dataLocacao);
        let novaLinha = `<tr id="alocacao-${locacoesRegistradas[i].id}"><td>${cpfFormatado}</td><td>${cliente.nome}</td><td class="valor-campo valor-placa">${placaFormatada}</td><td class="valor-campo valor-modelo">${veiculo.modelo}</td><td class="valor-campo valor-diaria">R$${valorDiariaFormatada}</td><td>${dataLocacaoFormatada}</td><td><button onclick="devolverVeiculoMenu(event)" class="botao botao-devolucao">Devolver</button></td></tr>`;
        listaDeLocacoes.innerHTML += novaLinha;
    }

    document.getElementById('lista-de-locacoes').style.display = 'block';

}

/*
function devolverVeiculo(event) {
    let botaoAcionado = event.target;
    let linhaLocacao = botaoAcionado.parentNode;
    let locacaoDeveSerDevolvida = window.confirm(`Tem certeza que deseja devolver o veículo?`);
    if (locacaoDeveSerDevolvida) {
        let idLocacao = linhaLocacao.parentNode.id.split('-')[1];
        locacoesRegistradas = locacoesRegistradas.filter(locacao => locacao.id != idLocacao);
        linhaLocacao.parentNode.remove();
       // salvarRegistros();
    }
}
*/

function devolverVeiculoMenu(event) {
    let botaoAcionado = event.target;
    let linhaDevolucao = botaoAcionado.parentNode;
    let idLocacao = linhaDevolucao.parentNode.id.split('-')[1];
    let locacao = locacoesRegistradas.find(locacao => locacao.id == idLocacao);
    let cliente = clientesRegistrados.find(cliente => cliente.id == locacao.idCliente);
    let veiculo = veiculosRegistrados.find(veiculo => veiculo.id == locacao.idVeiculoAlugado);
    document.getElementById('paragrafo-valor-cpf').textContent = `${formatarCpf(cliente.cpf)}`;
    document.getElementById('paragrafo-valor-nome').textContent = `${cliente.nome}`;
    document.getElementById('paragrafo-valor-placa').textContent = `${formatarPlaca(veiculo.placa)}`;
    document.getElementById('paragrafo-valor-modelo').textContent = `${veiculo.modelo}`;
    document.getElementById('paragrafo-valor-diaria').textContent = `R$${formatarValorDiaria(veiculo.valorDiaria)}`;
    document.getElementById('paragrafo-valor-quilometragem').textContent = `${veiculo.quilometragem}`;
    document.getElementById('paragrafo-valor-data-locacao').textContent = `${formatarData(locacao.dataLocacao)}`;
    document.getElementById('campo-quilometragem-atual').value = veiculo.quilometragem;

    esconderMenus();
    apagarMensagensDeErro();
    document.getElementById('devolucao-de-veiculos').style.display = 'block';
    document.getElementById('campo-quilometragem-atual').focus();

}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-devolucao').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let quilometragemAtual = formData.get('campo-quilometragem-atual');
        let placa = document.getElementById('paragrafo-valor-placa').textContent.replace("-","");
        let veiculo = veiculosRegistrados.find(veiculo => veiculo.placa == placa);
        let quilometragemAnterior = veiculo.quilometragem;
        debugger;
        if (verificarQuilometragemAtual(Number(quilometragemAnterior), Number(quilometragemAtual))) {
            veiculo.quilometragem = quilometragemAtual;
            locacoesRegistradas = locacoesRegistradas.filter(locacao => locacao.idVeiculoAlugado != veiculo.id);
            salvarRegistros();
            consultarLocacoesMenu();
        }

    });
});

function verificarQuilometragemAtual(quilometragemAnterior, quilometragemAtual) {
    if (quilometragemAnterior >= quilometragemAtual) {
        document.querySelector('.erro-devolucao').textContent = "Valor da quilometragem inválido! Valor deve ser maior que a quilometragem atual do veículo";
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-clientes').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let cpf = formData.get('campo-cpf');
        let nome = formData.get('campo-nome');
        let dataNasc = formData.get('campo-data-nasc');

        apagarMensagensDeErro();

        validarCliente(cpf, nome, dataNasc);
    });
});

function validarCliente(cpf, nome, dataNasc) {
    const cpfValido = verificarCpf(cpf);
    const nomeValido = verificarNome(nome);
    const dataNascValida = verificarDataNasc(dataNasc);

    if (cpfValido) {
        if (nomeValido && dataNascValida) {
            incluirCliente(cpf, nome, dataNasc);
        } else {
            return false;
        }
    } else if (document.querySelector('.erro-cpf').textContent == '') {
        document.querySelector('.erro-cpf').textContent = 'CPF inválido!';
        return false;
    }

}

function incluirCliente(cpf, nome, dataNasc) {
    debugger;
    contClientesHist += 1;
    clientesRegistrados.push({id: contClientesHist, nome: nome, dataNasc: dataNasc, cpf: cpf});
    salvarRegistros();
    consultarClientesMenu();
}

function verificarCpf(cpf) {
    cpf = cpf.toString().replace(/\D/g, '');
    if (!/^\d{11}$/.test(cpf)) return false;
    let soma = 0;

    if (cpf.length != 11) return false;

    if (['00000000000', '11111111111', '22222222222', '33333333333', '44444444444', '55555555555', '66666666666', '77777777777', '88888888888', '99999999999',].indexOf(cpf) !== -1) return false;

    if (clientesRegistrados.some(cliente => cliente.cpf === cpf)) {
        document.querySelector('.erro-cpf').textContent = 'CPF já existe!';
        return false;
    }

    for (i = 0; i < 9; i++) {
        soma += cpf[i] * (10 - i);
    }

    let j = 0;
    if ([0, 1].includes(soma % 11)) {
        j = 0;
    } else {
        j = 11 - (soma % 11);
    }

    soma = 0;
    for (i = 0; i < 10; i++) {
        soma += cpf[i] * (11 - i);
    }

    let k = 0;
    if ([0, 1].includes(soma % 11)) {
        k = 0;
    } else {
        k = 11 - (soma % 11);
    }

    if (cpf[9] != j.toString() || cpf[10] != k.toString()) {
        return false;
    }
    return true;

}

function verificarNome(nome) {
    if (nome.length > 80 || nome.length < 4) {
        document.querySelector('.erro-nome').textContent = 'Nome deve ter de 4 a 80 caracteres!';
        return false;
    }
    return true;
}

function verificarDataNasc(dataNasc) {
    const dataAtual = new Date();
    dataSplit = dataNasc.split('-'); // [0] é ano - [1] é mês - [2] é dia
    if (!dataNasc || dataAtual.getFullYear() < dataSplit[0]) {
        document.querySelector('.erro-data-nasc').textContent = 'Data inválida!';
        return false;
    }

    const diferencaAnos = dataAtual.getFullYear() - dataSplit[0];
    const diferencaMeses = (dataAtual.getMonth() + 1) - dataSplit[1];
    const diferencaDias = dataAtual.getDate() - dataSplit[2];

    if (diferencaAnos < 18) {
        document.querySelector('.erro-data-nasc').textContent = `Cliente tem ${diferencaAnos} anos. Deve ter pelo menos 18 anos!`;
        return false;
    } else if ((diferencaAnos === 18) && (diferencaMeses < 0 || (diferencaMeses === 0 && diferencaDias < 0))) {
        document.querySelector('.erro-data-nasc').textContent = `Cliente tem ${diferencaAnos - 1} anos. Deve ter pelo menos 18 anos!`;
        return false;
    }
    return true;
}

function formatarData(data) {
    data = data.split('-');
    let ano = data[0];
    let mes = data[1];
    let dia = data[2];

    return `${dia}/${mes}/${ano}`
}

function formatarCpf(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarValorDiaria(valor) {
    valor = Number(valor);
    let valorFloat = valor.toFixed(2);
    let valorComVirgula = valorFloat.replace('.', ',');
    return valorComVirgula;
}

function apagarMensagensDeErro() {
    document.querySelectorAll('.erro').forEach(function(span) {
        span.textContent = '';
    });
}

function excluirCliente(event) {
    let botaoAcionado = event.target;
    let linhaCliente = botaoAcionado.parentNode;
    let clienteDeveSerExcluido = window.confirm(`Tem certeza que deseja excluir o cliente?`);
    if (clienteDeveSerExcluido) {
        debugger;
        let idCliente = linhaCliente.parentNode.id.split('-')[1];
        clientesRegistrados = clientesRegistrados.filter(cliente => cliente.id != idCliente);
        locacoesRegistradas = locacoesRegistradas.filter(locacao => locacao.idCliente != idCliente);
        linhaCliente.parentNode.remove();
        salvarRegistros();
    }
}


// VEICULOS

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-veiculos').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let placa = formData.get('campo-placa');
        let tipo = formData.get('campo-tipo');
        let modelo = formData.get('campo-modelo');
        let ano = formData.get('campo-ano');
        let valorDiaria = formData.get('campo-valor-diaria');
        let quilometragem = formData.get('campo-quilometragem');

        apagarMensagensDeErro();

        let form = document.getElementById('form-veiculos');
        let inputs = form.getElementsByTagName('input');

        let inputsDesabilitados = 0;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].disabled) {
                inputsDesabilitados++;
            }
        }
        if (inputsDesabilitados > 0) {
            const valorDiariaValido = verificarValorDiaria(valorDiaria);
            if (valorDiariaValido) {
                let placaVeiculoEditado = document.getElementById('campo-placa').value;
                let veiculoEditado = veiculosRegistrados.find(veiculo => veiculo.placa == placaVeiculoEditado);
                veiculoEditado.valorDiaria = valorDiaria;
                salvarRegistros();
                consultarVeiculosMenu();
            }
        } else {
            validarVeiculo(placa, tipo, modelo, ano, valorDiaria, quilometragem);
        }
    });
});

function validarVeiculo(placa, tipo, modelo, ano, valorDiaria, quilometragem) {
    const placaValida = verificarPlaca(placa);
    const tipoValido = verificarTipo(tipo);
    const modeloValido = verificarModelo(modelo);
    const anoValido = verificarAno(ano);
    const valorDiariaValido = verificarValorDiaria(valorDiaria);
    const quilometragemValida = verificarQuilometragem(quilometragem);

    if (placaValida && tipoValido && modeloValido && anoValido && valorDiariaValido && quilometragemValida) {
        incluirVeiculo(placa, tipo, modelo, ano, valorDiaria, quilometragem);
    } else {
        return false;
    }
}

function incluirVeiculo(placa, tipo, modelo, ano, valorDiaria, quilometragem) {
    contVeiculosHist += 1;
    // const diariaFormatada = formatarValorDiaria(valorDiaria);
    valorDiaria = Number(valorDiaria);
    let valorDiariaFloat = valorDiaria.toFixed(2);

    veiculosRegistrados.push({id: contVeiculosHist, placa: placa, tipo: tipo, modelo: modelo, ano: ano, valorDiaria: valorDiariaFloat, quilometragem: quilometragem});
    salvarRegistros();
    consultarVeiculosMenu();
}

function verificarPlaca(placa) {
    if (veiculosRegistrados.some(veiculo => veiculo.placa === placa)) {
        document.querySelector('.erro-placa').textContent = `Placa inválida! Placa já está registrada.`;
        return false;
    }

    if (placa.length !== 7 || !/^[A-Za-z]+$/.test(placa.substring(0, 3)) || !/^[1-9]+$/.test(placa.substring(3, 7))) {
        document.querySelector('.erro-placa').textContent = `Placa inválida! Placa deve estar no formato AAA9999.`;
        return false;
    }
    return true;
}

function verificarTipo(tipo) {
    if (!tipo) {
        document.querySelector('.erro-tipo').textContent = `Tipo inválido! Escolha um dos tipos de veículo.`;
    }
    return true;
}

function verificarModelo(modelo) {
    if (modelo.length < 4 || modelo.length > 30) {
        document.querySelector('.erro-modelo').textContent = `Modelo inválido! Modelo deve ter de 4 a 30 caracteres.`;
        return false;
    }
    return true;
}

function verificarAno(anoCarro) {
    const dataAtual = new Date();
    if (anoCarro < 2000 || anoCarro > dataAtual.getFullYear()) {
        document.querySelector('.erro-ano').textContent = `Ano inválido! Ano deve ser maior que 1999 e menor ou igual ao ano atual.`;
        return false;
    }
    return true;
}

function verificarValorDiaria(valorDiaria) {
    if (!(valorDiaria > 0)) {
        document.querySelector('.erro-valor-diaria').textContent = `Valor da diária inválido! Valor deve ser maior que zero.`;
        return false;
    }
    return true;
}

function verificarQuilometragem(quilometragem) {
    if (!(quilometragem > 0)) {
        document.querySelector('.erro-quilometragem').textContent = `Quilometragem inválida! Valor deve ser maior que zero.`;
        return false;
    }
    return true;
}

function formatarPlaca(placa) {
    let arrayCharPlaca = placa.split("");
    arrayCharPlaca.splice(3, 0, '-');
    return arrayCharPlaca.join("");
}

function excluirVeiculo(event) {
    let botaoAcionado = event.target;
    let linhaVeiculo = botaoAcionado.parentNode;
    let veiculoDeveSerExcluido = window.confirm(`Tem certeza que deseja excluir o veiculo?`);
    if (veiculoDeveSerExcluido) {
        idVeiculo = linhaVeiculo.parentNode.id.split('-')[1];
        veiculosRegistrados = veiculosRegistrados.filter(veiculo => veiculo.id != idVeiculo);
        locacoesRegistradas = locacoesRegistradas.filter(locacao => locacao.idVeiculoAlugado != idVeiculo);
        linhaVeiculo.parentNode.remove();
        salvarRegistros();
    }
}

function editarVeiculo(event) {
    let linhaVeiculo = event.target.parentNode.parentNode;
    let idVeiculo = linhaVeiculo.id.split('-')[1];
    let veiculo = veiculosRegistrados.find(veiculo => veiculo.id == idVeiculo);
    mostrarFormEdicao(veiculo);
}

function mostrarFormEdicao(veiculo) {
    const form = document.getElementById('form-veiculos');
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
        if (input.id !== 'campo-valor-diaria') {
            input.disabled = true;
        }
    });
    incluirVeiculoMenu(veiculo);
}

