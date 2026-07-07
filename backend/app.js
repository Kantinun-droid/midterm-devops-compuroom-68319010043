// app.js
// Express app เพียวๆ ไม่รวม logic การเชื่อมต่อ DB หรือ app.listen
// แยกไว้แบบนี้เพื่อให้ไฟล์ test (Jest) import ไปใช้ได้โดยไม่ต้อง start server จริง

const express = require('express');
const cors = require('cors');
const Computer = require('./models/Computer');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.get('/api/computers', async (req, res) => {
  try {
    const computers = await Computer.findAll();
    res.json(computers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/computers/:id', async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (!computer) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลเครื่องนี้' });
    }
    res.json(computer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/computers', async (req, res) => {
  try {
    const { asset_code, brand_model, cpu, ram_gb, room, status } = req.body;
    if (!asset_code) {
      return res.status(400).json({ error: 'asset_code จำเป็นต้องระบุ' });
    }
    const newComputer = await Computer.create({
      asset_code, brand_model, cpu, ram_gb, room, status,
    });
    res.status(201).json(newComputer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/computers/:id', async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (!computer) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลเครื่องนี้' });
    }
    await computer.update(req.body);
    res.json(computer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/computers/:id', async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (!computer) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลเครื่องนี้' });
    }
    await computer.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;