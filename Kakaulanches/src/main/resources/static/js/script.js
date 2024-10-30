document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('burguer-content').classList.remove('d-none');

    function toggleCategory(categoryToShow) {
        const categories = document.querySelectorAll('.category-items');
        categories.forEach(category => {
            if (category.id === categoryToShow) {
                category.classList.remove('d-none');
            } else {
                category.classList.add('d-none');
            }
        });
    }

    // Eventos para alternar categorias
    document.getElementById('btnradio1').addEventListener('click', function() {
        toggleCategory('burguer-content');
    });
    document.getElementById('btnradio2').addEventListener('click', function() {
        toggleCategory('hotdog-content');
    });
    document.getElementById('btnradio3').addEventListener('click', function() {
        toggleCategory('churrasco-content');
    });
    document.getElementById('btnradio4').addEventListener('click', function() {
        toggleCategory('espaguete-content');
    });
    document.getElementById('btnradio5').addEventListener('click', function() {
        toggleCategory('pizza-content');
    });
    document.getElementById('btnradio6').addEventListener('click', function() {
        toggleCategory('bebidas-content');
    });
    document.getElementById('btnradio7').addEventListener('click', function() {
        toggleCategory('sobremesas-content');
    });

    let contadorCarrinho = 0;
    let valorTotal = 0; // Variável para armazenar o valor total
    const buttons = document.querySelectorAll('.btn-contador');
    const contadorSpan = document.getElementById('contador-span');
    const itensAdicionadosDiv = document.getElementById('itens-adicionados');
    const valorTotalDiv = document.querySelector('.Valor-total-items'); // Seleciona a div do total

    // Objeto para armazenar a quantidade e total de cada item
    const itensNoCarrinho = {};

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            contadorCarrinho++;
            contadorSpan.textContent = contadorCarrinho;

            const nomeItem = button.closest('.accordion-item').querySelector('.accordion-header button').textContent.trim();
            const precoItem = parseFloat(button.getAttribute('data-price')); // Verifica se o preço está correto

            // Atualiza o valor total
            valorTotal += precoItem;

            if (itensNoCarrinho[nomeItem]) {
                // Se o item já existe, apenas incrementa a quantidade
                itensNoCarrinho[nomeItem].quantidade++;
                const itemDiv = itensNoCarrinho[nomeItem].div;
                itemDiv.querySelector('.item-quantidade').textContent = 'x' + itensNoCarrinho[nomeItem].quantidade;
            } else {
                const novoItemDiv = document.createElement('div');
                novoItemDiv.classList.add('item-div');

                // Exibe apenas o nome do item
                const itemNome = document.createElement('span');
                itemNome.textContent = nomeItem;

                // Adiciona um span para exibir a quantidade
                const itemQuantidade = document.createElement('span');
                itemQuantidade.classList.add('item-quantidade', 'ms-2'); // Adiciona uma classe para estilização
                itemQuantidade.textContent = 'x1'; // Inicializa com 1

                // Botão de remover
                const removerButton = document.createElement('button');
                removerButton.textContent = 'Remover';
                removerButton.classList.add('btn', 'btn-danger', 'ms-2');

                removerButton.addEventListener('click', () => {
                    if (itensNoCarrinho[nomeItem].quantidade > 1) {
                        itensNoCarrinho[nomeItem].quantidade--;
                        contadorCarrinho--;
                        contadorSpan.textContent = contadorCarrinho;
                        const itemDiv = itensNoCarrinho[nomeItem].div;
                        itemDiv.querySelector('.item-quantidade').textContent = 'x' + itensNoCarrinho[nomeItem].quantidade;

                        // Atualiza o valor total
                        valorTotal -= precoItem;
                    } else {
                        contadorCarrinho--;
                        contadorSpan.textContent = contadorCarrinho;
                        novoItemDiv.remove();
                        delete itensNoCarrinho[nomeItem];

                        // Atualiza o valor total
                        valorTotal -= precoItem;
                    }
                    // Atualiza o valor total na div
                    atualizarValorTotal();
                });

                // Adiciona o nome do item e o span da quantidade
                novoItemDiv.appendChild(itemNome);
                novoItemDiv.appendChild(itemQuantidade);
                novoItemDiv.appendChild(removerButton);
                itensAdicionadosDiv.appendChild(novoItemDiv);

                // Armazena o novo item no carrinho
                itensNoCarrinho[nomeItem] = { div: novoItemDiv, quantidade: 1, preco: precoItem }; // Armazena o preço do item
            }

            // Atualiza o valor total na div
            atualizarValorTotal();
        });
    });

    // Função para atualizar o valor total na div
    function atualizarValorTotal() {
        valorTotalDiv.textContent = `Total itens: R$${valorTotal.toFixed(2)}`; // Exibe o total formatado
    }

    const mainButton = document.getElementById('mainButton');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            const selectedOption = this.getAttribute('data-option');
            mainButton.textContent = `Pagar com: ${selectedOption}`;
        });
    });

    // Função para formatar os itens adicionados em uma mensagem com alinhamento
    function formatarItensAdicionados(itens) {
        return Object.keys(itens).map(item => {
            const preco = `R$ ${parseFloat(itens[item].preco).toFixed(2)}`;
            const quantidade = itens[item].quantidade;
            const totalItem = `R$ ${(parseFloat(itens[item].preco) * quantidade).toFixed(2)}`;

            // Formatação com espaçamento alinhado
            return `${item.padEnd(20)} x ${quantidade} = ${totalItem}`;
        });
    }

    // Função para enviar o pedido via WhatsApp com mensagem formatada
    function enviarPedido(formaPagamento) {
        const dataPedido = new Date().toLocaleDateString('pt-BR');
        const itensAdicionados = formatarItensAdicionados(itensNoCarrinho);

        // Converte o array de itens formatados em uma string com quebras de linha
        const mensagemItens = itensAdicionados.join('\n');

        const valorTotal = Object.keys(itensNoCarrinho).reduce((total, item) => {
            const quantidade = itensNoCarrinho[item].quantidade;
            const precoItem = parseFloat(itensNoCarrinho[item].preco);
            return total + (precoItem * quantidade);
        }, 0).toFixed(2);

        // Monta a mensagem final com espaçamento alinhado
        const mensagem = `
    Pedido do dia ${dataPedido}

    Itens:
    ㅤ
    ${mensagemItens}

    ------------------------------------

    Valor Total: R$${valorTotal}

    Forma de Pagamento: ${formaPagamento}
        `.trim();

        // Prepara o pedido
        const pedido = {
            descricao: mensagem,
            formaPagamento: formaPagamento
        };

        // Envia o pedido
        fetch('/pedido/enviarPedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.status);
            }
            return response.text();
        })
        .then(() => {
            const numeroWhatsApp = '5598985879276';
            window.open(`https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`, '_blank');
        })
        .catch(error => {
            console.error('Erro ao enviar o pedido:', error);
        });
    }



   // Adicionar evento de clique no botão principal
   mainButton.addEventListener('click', function() {
       const formaPagamento = mainButton.textContent.replace('Pagar com: ', '').trim();

       // Verificar se há itens no carrinho e se a forma de pagamento é válida
       if (contadorCarrinho > 0) {
           if (formaPagamento === 'Pix' || formaPagamento === 'Dinheiro') {
               enviarPedido(formaPagamento);
           } else {
               alert('Por favor, selecione uma forma de pagamento válida (Pix ou Dinheiro)!');
           }
       } else {
           alert('Por favor, adicione itens ao carrinho antes de finalizar o pedido!');
       }
   });


});

// Função para mostrar e esconder o carrinho
function hide() {
    var showDiv = document.getElementById("show");
    if (showDiv.style.display === "none") {
        showDiv.style.display = "flex";
    } else {
        showDiv.style.display = "none";
    }
}
