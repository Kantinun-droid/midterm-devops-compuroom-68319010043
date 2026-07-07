// index.js
// จุดเริ่มต้นของ backend server (Express)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Computer = require('./models/Computer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET /health - ตรวจสอบสถานะ server
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// ===================== CRUD API: /api/computers =====================

// GET /api/computers - ดูรายการทั้งหมด
app.get('/api/computers', async (req, res) => {
  try {
    const computers = await Computer.findAll();
    res.json(computers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/computers/:id - ดูรายการเดียว
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

// POST /api/computers - เพิ่มเครื่องใหม่
app.post('/api/computers', async (req, res) => {
  try {
    const { asset_code, brand_model, cpu, ram_gb, room, status } = req.body;
    if (!asset_code) {
      return res.status(400).json({ error: 'asset_code จำเป็นต้องระบุ' });
    }
    const newComputer = await Computer.create({
      asset_code,
      brand_model,
      cpu,
      ram_gb,
      room,
      status,
    });
    res.status(201).json(newComputer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/computers/:id - แก้ไขข้อมูลเครื่อง
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

// DELETE /api/computers/:id - ลบเครื่อง
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

async function start() {
  try {
    await sequelize.authenticate();
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ');

    // สร้างตารางอัตโนมัติถ้ายังไม่มี (แทนการเขียน SQL CREATE TABLE เอง)
    await sequelize.sync();
    console.log('Sync ตาราง compuroom เรียบร้อย');

    app.listen(PORT, () => {
      console.log(`Server กำลังรันที่ port ${PORT}`);
    });
  } catch (err) {
    console.error('เชื่อมต่อฐานข้อมูลไม่สำเร็จ:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;