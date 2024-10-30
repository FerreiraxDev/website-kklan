package com.cardapio_lanches.Kakaulanches;

import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URLEncoder; // Para a codificação da URL
import java.nio.charset.StandardCharsets; // Para os conjuntos de caracteres

@Controller
@RequestMapping("/")
public class PedidoController {

    @GetMapping("/")
    public String mostrarIndex() {
        return "index"; // Retorna a página index.html
    }

    @GetMapping("/menu-screen")
    public String mostrarPedido() {
        return "menu-screen"; // Retorna a página menu-screen.html
    }

    private static final String NUMERO_LANCHONETE = "+5598985879276"; // Exemplo de número

    @PostMapping("/pedido/enviarPedido")
    public ResponseEntity<String> enviarPedido(@RequestBody Pedido pedido) {
        // Montar a mensagem do pedido
        String mensagem = "Pedido: " + pedido.getDescricao() + "\n" +
                "Forma de Pagamento: " + pedido.getFormaPagamento();

        // URL para o WhatsApp Web
        String urlWhatsApp = "https://api.whatsapp.com/send?phone=" + NUMERO_LANCHONETE +
                "&text=" + URLEncoder.encode(mensagem, StandardCharsets.UTF_8);

        // Retorna a URL para o frontend
        return ResponseEntity.ok(urlWhatsApp);
    }
}
