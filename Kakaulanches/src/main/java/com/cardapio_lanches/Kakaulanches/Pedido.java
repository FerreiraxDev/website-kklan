package com.cardapio_lanches.Kakaulanches; // Ajuste o pacote conforme necessário

public class Pedido {
    private String descricao; // Descrição do pedido
    private String formaPagamento; // Forma de pagamento

    // Construtor
    public Pedido(String descricao, String formaPagamento) {
        this.descricao = descricao;
        this.formaPagamento = formaPagamento;
    }

    // Getter para descrição
    public String getDescricao() {
        return descricao;
    }

    // Setter para descrição
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    // Getter para forma de pagamento
    public String getFormaPagamento() {
        return formaPagamento;
    }

    // Setter para forma de pagamento
    public void setFormaPagamento(String formaPagamento) {
        this.formaPagamento = formaPagamento;
    }
}
