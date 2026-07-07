// routes/computers.js
// CRUD API ทั้ง 5 endpoint ตามข้อกำหนด Week 2
// ใช้ Computer.findAll(), .create(), .update() แทนการเขียน SQL เอง

const express = require('express');
const router = express.Router();
const Computer = require('../models/computer');

// GET /api/computers - ดูรายการทั้งหมด
router.get('/', async (req, res) => {
  try {
    const computers = await Computer.findAll();
    res.json(computers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/computers/:id - ดูรายการเดียว
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;