const express = require("express"); 
const app = express();
const PORTA = 3000;

let BancoPedidos = [];

app.use(express.json());

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

// Criar Pedido
app.post('/pedidos', (req, res) => {
    const { clientecpf, clientenome, produtonome, produtopreco } = req.body;

    if (!clientecpf) return res.status(400).send("CPF é obrigatório");
    if (clientecpf.length < 9) return res.status(400).send("CPF inválido. CPF deve ter no mínimo 9 dígitos");
    if (isNaN(clientecpf)) return res.status(400).send("CPF deve ser numérico");
    
    if (!clientenome) return res.status(400).send("Nome é obrigatório");
    if (clientenome.length < 5) return res.status(400).send("Nome deve possuir no mínimo 5 caracteres");

    if (!produtonome) return res.status(400).send("Nome do produto é obrigatório");
    if (produtonome.length < 5) return res.status(400).send("Nome do produto deve possuir no mínimo 5 caracteres");

    if (!produtopreco) return res.status(400).send("Preço do produto é obrigatório");
    if (produtopreco < 0) return res.status(400).send("Preço do produto não pode ser negativo");

    
    const novoPedido = {
        codigo: Date.now().toString(),
        dataHora: new Date(),
        status: "aberto",
        clientecpf,
        clientenome,
        produtonome,
        produtopreco
    };
    
    BancoPedidos.push(novoPedido);

    return res.status(201).json({
        mensagem: "Pedido cadastrado com sucesso",
        pedido: novoPedido
    });    
});

// Listagem de Pedidos
app.get("/pedidos", (req, res) => {
    const { status } = req.query;
    
    let pedidosFiltrados = BancoPedidos;

    // Se um status for passado na URL (ex: ?status=pago), ele filtra
    if (status) {
        pedidosFiltrados = BancoPedidos.filter(p => p.status === status);
    }

    return res.status(200).json(pedidosFiltrados);
});

// Consulta de um pedido específico
app.get("/pedidos/:codigo", (req, res) => {
    const { codigo } = req.params; 

    if (!codigo) {
        return res.status(400).send("Código do produto é obrigatório");
    }

    const pedidoEncontrado = BancoPedidos.find(c => c.codigo === codigo);

    if (!pedidoEncontrado) {
        return res.status(404).send("Pedido não encontrado");
    }

    return res.status(200).json(pedidoEncontrado);
});

// Atualizar a situação de um pedido
app.put("/pedidos/:codigo", (req, res) => {
    const { codigo } = req.params;
    const { status } = req.body;

    if (!status || !["aberto", "pago", "finalizado"].includes(status)) {
        return res.status(400).send("Status obrigatório e válido (aberto, pago, finalizado)");
    }

    const pedido = BancoPedidos.find(p => p.codigo === codigo);
    if (!pedido) return res.status(404).send("Pedido não encontrado");

    pedido.status = status;
    return res.status(200).json(pedido);
});

// Deletar um pedido
app.delete("/pedidos/:codigo", (req, res) => {
    const { codigo } = req.params;

    if (!codigo) {
        return res.status(400).send("Código é obrigatório");
    }

    const indice = BancoPedidos.findIndex(c => c.codigo === codigo);

    if (indice === -1) {
        return res.status(404).send("Pedido não encontrado para remoção");
    }

    BancoPedidos.splice(indice, 1);

    return res.status(204).send(); 
});