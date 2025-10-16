document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();

    // Função auxiliar para pegar dados do localStorage
    const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];

    // Função auxiliar para salvar dados no localStorage
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // Manipulador do formulário de cadastro de filmes
    if (currentPage === 'cadastro-filmes.html') {
        const formFilme = document.getElementById('form-filme');
        formFilme.addEventListener('submit', (e) => {
            e.preventDefault();
            const filme = {
                id: Date.now(),
                titulo: e.target.titulo.value,
                descricao: e.target.descricao.value,
                genero: e.target.genero.value,
                classificacao: e.target.classificacao.value,
                duracao: e.target.duracao.value,
                estreia: e.target.estreia.value,
            };
            const filmes = getData('filmes');
            filmes.push(filme);
            saveData('filmes', filmes);
            alert('Filme salvo com sucesso!');
            formFilme.reset();
        });
    }

    // Manipulador do formulário de cadastro de salas
    if (currentPage === 'cadastro-salas.html') {
        const formSala = document.getElementById('form-sala');
        formSala.addEventListener('submit', (e) => {
            e.preventDefault();
            const sala = {
                id: Date.now(),
                nome: e.target.nome.value,
                capacidade: e.target.capacidade.value,
                tipo: e.target.tipo.value,
            };
            const salas = getData('salas');
            salas.push(sala);
            saveData('salas', salas);
            alert('Sala salva com sucesso!');
            formSala.reset();
        });
    }

    // Carregar dados e manipular formulário de cadastro de sessões
    if (currentPage === 'cadastro-sessoes.html') {
        const selectFilme = document.getElementById('filme');
        const selectSala = document.getElementById('sala');
        const filmes = getData('filmes');
        const salas = getData('salas');

        filmes.forEach(filme => {
            const option = document.createElement('option');
            option.value = filme.id;
            option.textContent = filme.titulo;
            selectFilme.appendChild(option);
        });

        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.id;
            option.textContent = `${sala.nome} (${sala.tipo})`;
            selectSala.appendChild(option);
        });

        const formSessao = document.getElementById('form-sessao');
        formSessao.addEventListener('submit', (e) => {
            e.preventDefault();
            const sessao = {
                id: Date.now(),
                filmeId: e.target.filme.value,
                salaId: e.target.sala.value,
                dataHora: e.target.dataHora.value,
                preco: e.target.preco.value,
                idioma: e.target.idioma.value,
                formato: e.target.formato.value,
            };
            const sessoes = getData('sessoes');
            sessoes.push(sessao);
            saveData('sessoes', sessoes);
            alert('Sessão salva com sucesso!');
            formSessao.reset();
        });
    }

    // Listagem de sessões disponíveis
    if (currentPage === 'sessoes.html') {
        const listaSessoes = document.getElementById('lista-sessoes');
        const sessoes = getData('sessoes');
        const filmes = getData('filmes');
        const salas = getData('salas');

        if (sessoes.length === 0) {
            listaSessoes.innerHTML = '<p class="col-12 text-center">Nenhuma sessão disponível no momento.</p>';
        } else {
            sessoes.forEach(sessao => {
                const filme = filmes.find(f => f.id == sessao.filmeId);
                const sala = salas.find(s => s.id == sessao.salaId);

                if (filme && sala) {
                    const dataHora = new Date(sessao.dataHora);
                    const card = `
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100 session-card">
                                <div class="card-body">
                                    <h5 class="card-title">${filme.titulo}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">${sala.nome} - ${sessao.formato}</h6>
                                    <p class="card-text">
                                        <strong>Data:</strong> ${dataHora.toLocaleDateString()}<br>
                                        <strong>Hora:</strong> ${dataHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
                                        <strong>Idioma:</strong> ${sessao.idioma}<br>
                                        <strong>Preço:</strong> R$ ${parseFloat(sessao.preco).toFixed(2)}
                                    </p>
                                    <a href="venda-ingressos.html?sessaoId=${sessao.id}" class="btn btn-primary w-100">Comprar Ingresso</a>
                                </div>
                            </div>
                        </div>
                    `;
                    listaSessoes.innerHTML += card;
                }
            });
        }
    }

    // Carregar dados e manipular venda de ingressos
    if (currentPage === 'venda-ingressos.html') {
        const selectSessao = document.getElementById('sessao');
        const sessoes = getData('sessoes');
        const filmes = getData('filmes');
        const salas = getData('salas');

        sessoes.forEach(sessao => {
            const filme = filmes.find(f => f.id == sessao.filmeId);
            const sala = salas.find(s => s.id == sessao.salaId);
            if (filme && sala) {
                const dataHora = new Date(sessao.dataHora);
                const option = document.createElement('option');
                option.value = sessao.id;
                option.textContent = `${filme.titulo} - ${sala.nome} - ${dataHora.toLocaleDateString()} ${dataHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                selectSessao.appendChild(option);
            }
        });
        
        // Pré-seleciona a sessão se o ID for passado pela URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessaoId = urlParams.get('sessaoId');
        if (sessaoId) {
            selectSessao.value = sessaoId;
        }

        const formIngresso = document.getElementById('form-ingresso');
        formIngresso.addEventListener('submit', (e) => {
            e.preventDefault();
            const ingresso = {
                id: Date.now(),
                sessaoId: e.target.sessao.value,
                cliente: e.target.cliente.value,
                cpf: e.target.cpf.value,
                assento: e.target.assento.value,
                pagamento: e.target.pagamento.value,
            };
            const ingressos = getData('ingressos');
            ingressos.push(ingresso);
            saveData('ingressos', ingressos);
            alert('Venda confirmada com sucesso!');
            formIngresso.reset();
            window.location.href = 'sessoes.html';
        });
    }
});
