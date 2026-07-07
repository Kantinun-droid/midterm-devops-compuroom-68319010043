<script setup>
import { ref, onMounted } from 'vue'

// อ่าน URL ของ backend จาก Environment Variables ห้าม hardcode
const API_URL = import.meta.env.VITE_API_URL

import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'

   export default defineConfig({
     plugins: [vue()],
   })

const computers = ref([])
const loading = ref(false)
const errorMsg = ref('')

// ฟอร์มสำหรับเพิ่ม/แก้ไขข้อมูล
const form = ref({
  id: null,
  asset_code: '',
  brand_model: '',
  cpu: '',
  ram_gb: '',
  room: '',
  status: 'ใช้งาน',
})
const isEditing = ref(false)

// ดึงข้อมูลทั้งหมดจาก backend
async function fetchComputers() {
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await fetch(`${API_URL}/api/computers`)
    if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
    computers.value = await res.json()
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

// รีเซ็ตฟอร์ม
function resetForm() {
  form.value = {
    id: null,
    asset_code: '',
    brand_model: '',
    cpu: '',
    ram_gb: '',
    room: '',
    status: 'ใช้งาน',
  }
  isEditing.value = false
}

// บันทึกข้อมูล (เพิ่มใหม่ หรือ แก้ไข)
async function saveComputer() {
  errorMsg.value = ''
  try {
    const payload = {
      asset_code: form.value.asset_code,
      brand_model: form.value.brand_model,
      cpu: form.value.cpu,
      ram_gb: form.value.ram_gb ? Number(form.value.ram_gb) : null,
      room: form.value.room,
      status: form.value.status,
    }

    let res
    if (isEditing.value) {
      // แก้ไขข้อมูลเดิม
      res = await fetch(`${API_URL}/api/computers/${form.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      // เพิ่มข้อมูลใหม่
      res = await fetch(`${API_URL}/api/computers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    if (!res.ok) {
      const errData = await res.json()
      throw new Error(errData.error || 'บันทึกข้อมูลไม่สำเร็จ')
    }

    resetForm()
    await fetchComputers()
  } catch (err) {
    errorMsg.value = err.message
  }
}

// เตรียมฟอร์มสำหรับแก้ไข
function editComputer(computer) {
  form.value = { ...computer }
  isEditing.value = true
}

// ลบข้อมูล
async function deleteComputer(id) {
  if (!confirm('ยืนยันการลบเครื่องนี้?')) return
  errorMsg.value = ''
  try {
    const res = await fetch(`${API_URL}/api/computers/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('ลบข้อมูลไม่สำเร็จ')
    await fetchComputers()
  } catch (err) {
    errorMsg.value = err.message
  }
}

onMounted(fetchComputers)
</script>

<template>
  <div class="container">
    <header>
      <h1>ระบบบันทึกข้อมูลเครื่องคอมพิวเตอร์ประจำห้อง</h1>
      <p class="student-info">
        <!-- TODO: แก้เป็นชื่อ-นามสกุล-รหัสนักศึกษาจริงของผู้ทำ -->
        ชื่อ-นามสกุล: นายกันตินันท์ ทาแก้ว | รหัสนักศึกษา: 68319010043
      </p>
    </header>

    <section class="form-section">
      <h2>{{ isEditing ? 'แก้ไขข้อมูลเครื่อง' : 'เพิ่มเครื่องใหม่' }}</h2>
      <form @submit.prevent="saveComputer">
        <div class="form-row">
          <label>รหัสครุภัณฑ์/รหัสเครื่อง</label>
          <input v-model="form.asset_code" required placeholder="เช่น PC-001" />
        </div>
        <div class="form-row">
          <label>ยี่ห้อและรุ่น</label>
          <input v-model="form.brand_model" placeholder="เช่น Dell OptiPlex 3080" />
        </div>
        <div class="form-row">
          <label>สเปก CPU</label>
          <input v-model="form.cpu" placeholder="เช่น Intel i5-10500" />
        </div>
        <div class="form-row">
          <label>RAM (GB)</label>
          <input v-model="form.ram_gb" type="number" placeholder="เช่น 8" />
        </div>
        <div class="form-row">
          <label>ห้องที่ติดตั้ง</label>
          <input v-model="form.room" placeholder="เช่น ห้อง 501" />
        </div>
        <div class="form-row">
          <label>สถานะ</label>
          <select v-model="form.status">
            <option value="ใช้งาน">ใช้งาน</option>
            <option value="ส่งซ่อม">ส่งซ่อม</option>
            <option value="จำหน่าย">จำหน่าย</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit">{{ isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มเครื่อง' }}</button>
          <button type="button" v-if="isEditing" @click="resetForm">ยกเลิก</button>
        </div>
      </form>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </section>

    <section class="list-section">
      <h2>รายการเครื่องคอมพิวเตอร์ทั้งหมด</h2>
      <p v-if="loading">กำลังโหลดข้อมูล...</p>
      <table v-else>
        <thead>
          <tr>
            <th>รหัสเครื่อง</th>
            <th>ยี่ห้อ/รุ่น</th>
            <th>CPU</th>
            <th>RAM</th>
            <th>ห้อง</th>
            <th>สถานะ</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in computers" :key="item.id">
            <td>{{ item.asset_code }}</td>
            <td>{{ item.brand_model }}</td>
            <td>{{ item.cpu }}</td>
            <td>{{ item.ram_gb }}</td>
            <td>{{ item.room }}</td>
            <td>{{ item.status }}</td>
            <td>
              <button @click="editComputer(item)">แก้ไข</button>
              <button @click="deleteComputer(item.id)">ลบ</button>
            </td>
          </tr>
          <tr v-if="computers.length === 0">
            <td colspan="7">ยังไม่มีข้อมูลเครื่องคอมพิวเตอร์</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Sarabun', 'Segoe UI', sans-serif;
}
header {
  margin-bottom: 24px;
}
.student-info {
  color: #555;
  font-size: 0.9rem;
}
.form-section, .list-section {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.form-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
label {
  font-weight: 600;
  margin-bottom: 4px;
}
input, select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #2563eb;
  color: white;
  cursor: pointer;
}
button:hover {
  background-color: #1d4ed8;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f3f4f6;
}
.error {
  color: #dc2626;
  margin-top: 8px;
}
</style>