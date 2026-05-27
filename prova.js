const express = require("express"); 
const app = express();
const PORTA = 3000;

let BancoPedidos = [];
let proximoCodigo = 1; // Variável para gerar números inteiros sequenciais

app.use(express.json());

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

// US01 - Inclusão de um novo pedido
app.post('/pedidos', (req, res) => {
    const { clienteCpf, clienteNome, produtoNome, produtoPreco } = req.body;

    // [R01, R02] Validando CPF
    if (!clienteCpf) return res.status(400).send("CPF do cliente é obrigatório");
    if (isNaN(clienteCpf) || String(clienteCpf).length !== 9) {
        return res.status(400).send("CPF deve ser numérico e possuir exatamente 9 algarismos");
    }
    
    // [R03, R04] Validando Nome do Cliente
    if (!clienteNome) return res.status(400).send("Nome do cliente é obrigatório");
    if (clienteNome.length < 5) return res.status(400).send("Nome do cliente deve ter pelo menos 5 caracteres");

    // [R05, R06] Validando Nome do Produto
    if (!produtoNome) return res.status(400).send("Nome do produto é obrigatório");
    if (produtoNome.length < 5) return res.status(400).send("Nome do produto deve ter pelo menos 5 caracteres");

    // [R07, R08] Validando Preço
    if (produtoPreco === undefined || produtoPreco === null) return res.status(400).send("Preço do produto é obrigatório");
    if (typeof produtoPreco !== 'number' || produtoPreco < 0) return res.status(400).send("Preço do produto deve ser um número positivo");

    // [R09] Geração automática
    const novoPedido = {
        codigo: proximoCodigo++, // Adiciona o número inteiro atual e depois soma 1 para o próximo
        dataHora: new Date(),
        clienteCpf: String(clienteCpf),
        clienteNome,
        produtoNome,
        produtoPreco,
        situacao: "aberto"
    };
    
    BancoPedidos.push(novoPedido);

    return res.status(201).json(novoPedido);    
});

// US02 - Listagem de pedidos
app.get("/pedidos", (req, res) => {
    const { situacao } = req.query;
    let pedidosFiltrados = BancoPedidos;

    // [R01, R02] Filtragem opcional e validação de valores
    if (situacao) {
        if (!["aberto", "pago", "finalizado"].includes(situacao)) {
            return res.status(400).send("A situação para filtro deve ser 'aberto', 'pago' ou 'finalizado'");
        }
        pedidosFiltrados = BancoPedidos.filter(p => p.situacao === situacao);
    }

    // [R03] Retornar apenas os dados específicos (ocultando o CPF)
    const resposta = pedidosFiltrados.map(pedido => ({
        codigo: pedido.codigo,
        dataHora: pedido.dataHora,
        clienteNome: pedido.clienteNome,
        produtoNome: pedido.produtoNome,
        situacao: pedido.situacao,
        valorTotal: pedido.produtoPreco
    }));

    return res.status(200).json(resposta);
});

// US03 - Consulta de um pedido
app.get("/pedidos/:codigo", (req, res) => {
    // [R01] Código obrigatório (já garantido pela rota)
    const codigoParam = req.params.codigo; 

    // [R02] Valida se é número
    if (isNaN(codigoParam)) return res.status(400).send("O código do pedido deve ser um número");
    
    const codigoConvertido = Number(codigoParam);
    const pedido = BancoPedidos.find(p => p.codigo === codigoConvertido);

    if (!pedido) return res.status(404).send("Pedido não encontrado");

    // [R03] Retorno específico
    return res.status(200).json({
        codigo: pedido.codigo,
        dataHora: pedido.dataHora,
        clienteCpf: pedido.clienteCpf,
        clienteNome: pedido.clienteNome,
        produtoNome: pedido.produtoNome,
        situacao: pedido.situacao,
        valorTotal: pedido.produtoPreco
    });
});

// US04 - Atualizar a situação de um pedido
app.put("/pedidos/:codigo", (req, res) => {
    const codigoParam = req.params.codigo;
    const { situacao } = req.body;

    // [R02] Valida se é número
    if (isNaN(codigoParam)) return res.status(400).send("O código do pedido deve ser um número");
    
    // [R03, R04] Valida a situação enviada
    if (!situacao || !["aberto", "pago", "finalizado"].includes(situacao)) {
        return res.status(400).send("A situação do pedido é obrigatória e deve ser 'aberto', 'pago' ou 'finalizado'");
    }

    const codigoConvertido = Number(codigoParam);
    const pedido = BancoPedidos.find(p => p.codigo === codigoConvertido);
    
    if (!pedido) return res.status(404).send("Pedido não encontrado");

    pedido.situacao = situacao;
    return res.status(200).json(pedido);
});

// US05 - Deletar um pedido
app.delete("/pedidos/:codigo", (req, res) => {
    const codigoParam = req.params.codigo;

    // [R02] Valida se é número
    if (isNaN(codigoParam)) return res.status(400).send("O código do pedido deve ser um número");

    const codigoConvertido = Number(codigoParam);
    const indice = BancoPedidos.findIndex(p => p.codigo === codigoConvertido);

    if (indice === -1) {
        return res.status(404).send("Pedido não encontrado para remoção");
    }

    BancoPedidos.splice(indice, 1);

    return res.status(204).send(); 
});
