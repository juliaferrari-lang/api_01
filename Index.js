//INDEX da Julia de Albuquerque Ferrari
import express from 'express';
import { professores } from './professores.js';

const app = express();
const PORT = 3001;

app.use(express.json());

//GET
app.get('/professores', (req, res) => {
  res.status(200).json(professores);
});

app.get('/professores/maior-bolsa', (req, res) => {
  if (professores.length === 0) {
    return res.status(404).json({ mesagem: 'Nenhum professor encontrado' });
  }

  const maiorBolsa = professores.reduce((maior, professor) => {
    return professor.bolsa > maior.bolsa ? professor : maior;
  });

  res.status(200).json(maiorBolsa);
});

app.get('/professores/sala/:sala', (req, res) => {
  const sala = req.params.sala.toLowerCase();
  const professoresSala = professores.filter(p => p.sala.toLowerCase() === sala);
  if (professoresSala.length > 0) {
    res.status(200).json(professoresSala);
  } else {
    res.status(404).json({ mesagem: `Nenhum professor encontrado na sala ${sala}` });
  }
});

app.get('/professores/:cpf', (req, res) => {
  const cpf = req.params.cpf;
  const professor = professores.find(p => String(p.cpf) === cpf);
  if (professor) {
    res.status(200).json(professor);
  } else {
    res.status(404).json({ mesagem: `Professor não encontrado com CPF ${cpf}` });
  }
});

//POST
app.post("/professores", (req, res) => {
    const { nome, cpf, sala, curso, bolsa } = req.body;

    if (!nome || cpf === undefined || !sala || !curso || bolsa === undefined) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const novoProfessor = {
        nome,
        cpf: String(cpf),
        sala,
        curso,
        bolsa: parseFloat(bolsa)
    };

    professores.push(novoProfessor);

    res.status(201).json(novoProfessor);
});

//PUT
app.put('/professores/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const { nome, sala, curso, bolsa } = req.body;

    const index = professores.findIndex(p => String(p.cpf) === String(cpf));

    if (index === -1) {
        return res.status(404).json({ mensagem: `Professor com cpf ${cpf} não encontrado para atualização` });
    }

    if (!nome || cpf === undefined || !sala || !curso || bolsa === undefined) {
        return res.status(400).json({
            mensagem: 'Todos os campos (nome, cpf, sala, curso, bolsa) devem ser informados'
        });
    }

    professores[index] = {
        nome,
        cpf: String(cpf),
        sala,
        curso,
        bolsa: parseFloat(bolsa)
    };

    res.status(200).json(professores[index]);
});

//DELETE
app.delete('/professores/:cpf', (req, res) => {
    const cpf = req.params.cpf;

    const index = professores.findIndex(p => String(p.cpf) === String(cpf));

    if (index === -1) {
        return res.status(401).json({ mensagem: `Professor com cpf ${cpf} não encontrado para exclusão` });
    }

    const [professorRemovido] = professores.splice(index, 1);

    res.status(200).json({
        mensagem: `Professor com cpf ${cpf} removido com sucesso`,
        professores: professorRemovido
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acessar http://localhost:${PORT}/professores para ver a lista de professores`);
});