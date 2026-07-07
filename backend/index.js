// index.js
// จุดเริ่มต้นของ backend server (Express)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const computerRoutes = require('./routes/computers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /health - ตรวจสอบสถานะ server
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// เปลี่ยนชื่อ resource เป็น "computers" ตามชื่อโปรเจกต์ compuroom
app.use('/api/computers', computerRoutes);

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