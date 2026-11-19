import express from "express";
import { produtos } from "./produtoS.js";

const app = express();
const port = 3000;

app.use(express.json());

// Controle de ID
let proximoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;

// Listar todos os produtos
app.get("/produtos", (req, res) => {
    res.status(200).json(produtos);
});

// Listar produto por ID
app.get("/produtos/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(produto);
});

// Cadastrar novo produto
app.post("/produtos", (req, res) => {
    const { nome, preco, estoque, categoria } = req.body;

    if (!nome || preco === undefined || estoque === undefined || !categoria) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const novoProduto = {
        id: proximoId++,
        nome,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        categoria
    };

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
});

app.put('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { nome,preco,estoque,categoria } = req.body

    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(404).json({ mensagem: `Produto com ID ${id} não encontrado para atualização`})
    }

    if (!nome || preco === undefined || estoque === undefined || !categoria) {
        return res.status(400).json({
            mensagem: 'Todos os campos (nome, preco, estoque, categoria) devem ser informados'
        })
    }
    produtos[index] = {
    id,
    nome,
    preco: parseFloat(preco),
    estoque: parseInt(estoque),
    categoria
}

res.status(200).json(produtos[index])

})

app.delete('/produtos/:id', (req, res) => {
    const id = parseInt(req.params.id)

    const index = produtos.findIndex(p => p.id === id)

    if (index === -1) {
        return res.status(401).json({ mensagem: `Produto com ID ${id} não encontrado para esclusão`})
    }

    const [produtoRemovido] = produtos.splice(index, 1)

    res.status(200).json({
        mensagem: `Produto com ID ${id} removido com sucesso`,
        produto: produtoRemovido
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});