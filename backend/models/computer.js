const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Computer = sequelize.define('Computer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  asset_code: {
    // รหัสครุภัณฑ์/รหัสเครื่อง
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  brand_model: {
    // ยี่ห้อและรุ่น
    type: DataTypes.STRING,
    allowNull: true,
  },
  cpu: {
    // สเปก CPU
    type: DataTypes.STRING,
    allowNull: true,
  },
  ram_gb: {
    // สเปก RAM (GB)
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  room: {
    // ห้องที่ติดตั้ง
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    // สถานะ: ใช้งาน / ส่งซ่อม / จำหน่าย
    type: DataTypes.ENUM('ใช้งาน', 'ส่งซ่อม', 'จำหน่าย'),
    allowNull: false,
    defaultValue: 'ใช้งาน',
  },
}, {
  tableName: 'compuroom', // ชื่อตาราง = รหัสโปรเจกต์ ตามข้อกำหนดในเอกสาร
  timestamps: true,
});

module.exports = Computer;