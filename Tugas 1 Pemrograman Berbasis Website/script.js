// SITTA - Sistem Pemesanan Bahan Ajar - JavaScript

// Data mata kuliah per prodi
const mataKuliahData = {
    'Manajemen': ['Pengantar Manajemen', 'Manajemen Keuangan', 'Manajemen Pemasaran', 'Manajemen SDM'],
    'Akuntansi': ['Pengantar Akuntansi', 'Akuntansi Keuangan', 'Akuntansi Biaya', 'Audit'],
    'Sistem Informasi': ['Pemrograman Web', 'Basis Data', 'Analisis Sistem', 'Keamanan Informasi'],
    'Teknologi Informasi': ['Algoritma Pemrograman', 'Jaringan Komputer', 'Sistem Operasi', 'Cloud Computing'],
    'Ilmu Komunikasi': ['Pengantar Komunikasi', 'Komunikasi Massa', 'Public Relations', 'Jurnalistik']
};

let orders = [];
let orderCounter = 1001;

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadData();
    updateStats();
    renderOrdersTable();
});

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });

    // Prodi change -> update mata kuliah
    document.getElementById('prodi').addEventListener('change', function() {
        const mk = document.getElementById('matakuliah');
        mk.innerHTML = '<option value="">-- Pilih Mata Kuliah --</option>';
        
        if (this.value && mataKuliahData[this.value]) {
            mataKuliahData[this.value].forEach(m => {
                mk.innerHTML += `<option value="${m}">${m}</option>`;
            });
        }
    });

    // Form submit
    document.getElementById('orderForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) submitOrder();
    });

    // Input validation - hanya angka
    ['nim', 'telepon', 'kodepos'].forEach(id => {
        document.getElementById(id).addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });

    // Auto-hide error saat input
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) errorMsg.classList.remove('show');
        });
    });

    // Close modal with ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });
}

// Switch tab
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'riwayat') {
        updateStats();
        renderOrdersTable();
    }
}

// Validasi form
function validateForm() {
    let isValid = true;
    
    // Reset errors
    document.querySelectorAll('.error-message').forEach(msg => msg.classList.remove('show'));
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    
    const validations = [
        { id: 'nim', check: v => v.length >= 9, error: 'nimError' },
        { id: 'nama', check: v => v.length >= 3, error: 'namaError' },
        { id: 'email', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), error: 'emailError' },
        { id: 'telepon', check: v => /^08\d{8,11}$/.test(v), error: 'teleponError' },
        { id: 'prodi', check: v => v !== '', error: 'prodiError' },
        { id: 'semester', check: v => v !== '', error: 'semesterError' },
        { id: 'matakuliah', check: v => v !== '', error: 'matakuliahError' },
        { id: 'jumlah', check: v => v >= 1 && v <= 50, error: 'jumlahError' },
        { id: 'alamat', check: v => v.length >= 10, error: 'alamatError' },
        { id: 'kota', check: v => v.length > 0, error: 'kotaError' },
        { id: 'provinsi', check: v => v !== '', error: 'provinsiError' },
        { id: 'kodepos', check: v => v.length === 5, error: 'kodeposError' }
    ];
    
    validations.forEach(val => {
        const elem = document.getElementById(val.id);
        const value = elem.value.trim();
        
        if (!val.check(value)) {
            elem.classList.add('error');
            document.getElementById(val.error).classList.add('show');
            isValid = false;
        }
    });
    
    if (!isValid) {
        showAlert('error', '❌ Mohon lengkapi semua field dengan benar!');
        document.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

// Submit order
function submitOrder() {
    const formData = {
        orderNumber: `ORD-${orderCounter}`,
        nim: document.getElementById('nim').value.trim(),
        nama: document.getElementById('nama').value.trim(),
        email: document.getElementById('email').value.trim(),
        telepon: document.getElementById('telepon').value.trim(),
        prodi: document.getElementById('prodi').value,
        semester: document.getElementById('semester').value,
        matakuliah: document.getElementById('matakuliah').value,
        jumlah: parseInt(document.getElementById('jumlah').value),
        alamat: document.getElementById('alamat').value.trim(),
        kota: document.getElementById('kota').value.trim(),
        provinsi: document.getElementById('provinsi').value,
        kodepos: document.getElementById('kodepos').value.trim(),
        status: 'Pending',
        tanggal: new Date().toISOString(),
        tanggalFormat: formatDate(new Date())
    };
    
    orders.push(formData);
    orderCounter++;
    saveData();
    
    showAlert('success', `✓ Pesanan berhasil! Nomor Order: ${formData.orderNumber}`);
    resetForm();
    updateStats();
    renderOrdersTable();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset form
function resetForm() {
    document.getElementById('orderForm').reset();
    document.getElementById('matakuliah').innerHTML = '<option value="">-- Pilih Mata Kuliah --</option>';
    document.querySelectorAll('.error').forEach(f => f.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(m => m.classList.remove('show'));
}

// Render tabel pesanan
function renderOrdersTable(filteredOrders = null) {
    const tbody = document.getElementById('ordersTableBody');
    const displayOrders = filteredOrders || orders;
    
    if (displayOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <p>Belum ada pesanan</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = [...displayOrders].reverse().map(order => `
        <tr>
            <td><strong>${order.orderNumber}</strong></td>
            <td>${order.nim}</td>
            <td>${order.nama}</td>
            <td>${order.matakuliah}</td>
            <td>${order.jumlah} modul</td>
            <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>${order.tanggalFormat}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-small" onclick="viewDetail('${order.orderNumber}')">👁️ Detail</button>
                    <button class="btn btn-secondary btn-small" onclick="updateStatus('${order.orderNumber}')">🔄 Status</button>
                    <button class="btn btn-danger btn-small" onclick="deleteOrder('${order.orderNumber}')">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Update statistik
function updateStats() {
    document.getElementById('totalPesanan').textContent = orders.length;
    document.getElementById('totalSelesai').textContent = orders.filter(o => o.status === 'Selesai').length;
    document.getElementById('totalProses').textContent = orders.filter(o => o.status === 'Proses').length;
}

// Search & filter
function searchOrders() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    
    let filtered = orders;
    
    if (search) {
        filtered = filtered.filter(o => 
            o.nim.toLowerCase().includes(search) ||
            o.nama.toLowerCase().includes(search) ||
            o.orderNumber.toLowerCase().includes(search)
        );
    }
    
    if (status) {
        filtered = filtered.filter(o => o.status === status);
    }
    
    renderOrdersTable(filtered);
}

// View detail
function viewDetail(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    document.getElementById('modalBody').innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Nomor Order</div>
            <div class="detail-value"><strong>${order.orderNumber}</strong></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Status</div>
            <div class="detail-value"><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Tanggal</div>
            <div class="detail-value">${order.tanggalFormat}</div>
        </div>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);">
        <div class="detail-item">
            <div class="detail-label">NIM</div>
            <div class="detail-value">${order.nim}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Nama</div>
            <div class="detail-value">${order.nama}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${order.email}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Telepon</div>
            <div class="detail-value">${order.telepon}</div>
        </div>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);">
        <div class="detail-item">
            <div class="detail-label">Program Studi</div>
            <div class="detail-value">${order.prodi}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Semester</div>
            <div class="detail-value">Semester ${order.semester}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Mata Kuliah</div>
            <div class="detail-value"><strong>${order.matakuliah}</strong></div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Jumlah</div>
            <div class="detail-value">${order.jumlah} modul</div>
        </div>
        <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--border);">
        <div class="detail-item">
            <div class="detail-label">Alamat</div>
            <div class="detail-value">${order.alamat}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Kota</div>
            <div class="detail-value">${order.kota}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Provinsi</div>
            <div class="detail-value">${order.provinsi}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Kode Pos</div>
            <div class="detail-value">${order.kodepos}</div>
        </div>
    `;
    
    openModal();
}

// Update status
function updateStatus(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    const statusOptions = ['Pending', 'Proses', 'Selesai', 'Batal'];
    const currentIndex = statusOptions.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    
    if (confirm(`Ubah status dari "${order.status}" menjadi "${statusOptions[nextIndex]}"?`)) {
        order.status = statusOptions[nextIndex];
        saveData();
        updateStats();
        renderOrdersTable();
        showAlert('success', `✓ Status berhasil diubah menjadi "${order.status}"`);
    }
}

// Delete order
function deleteOrder(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) return;
    
    if (confirm(`Hapus pesanan ${orderNumber}?\n\nMahasiswa: ${order.nama}\nMata Kuliah: ${order.matakuliah}`)) {
        orders = orders.filter(o => o.orderNumber !== orderNumber);
        saveData();
        updateStats();
        renderOrdersTable();
        showAlert('success', `✓ Pesanan ${orderNumber} berhasil dihapus`);
    }
}

// Tracking order
function trackOrder() {
    const orderNumber = document.getElementById('trackingInput').value.trim().toUpperCase();
    
    if (!orderNumber) {
        showAlert('error', '⚠️ Masukkan nomor order!');
        return;
    }
    
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (!order) {
        document.getElementById('trackingResult').innerHTML = `
            <div class="alert alert-error show">
                <span style="font-size: 1.5rem;">❌</span>
                <div>
                    <strong>Pesanan Tidak Ditemukan</strong>
                    <p>Nomor order "${orderNumber}" tidak ada dalam sistem.</p>
                </div>
            </div>
        `;
        return;
    }
    
    const stages = {
        'Pending': { title: 'Pesanan Diterima', desc: 'Menunggu verifikasi', icon: '📝' },
        'Proses': { title: 'Sedang Diproses', desc: 'Pesanan sedang disiapkan', icon: '📦' },
        'Selesai': { title: 'Pesanan Selesai', desc: 'Siap digunakan', icon: '✅' },
        'Batal': { title: 'Dibatalkan', desc: 'Pesanan dibatalkan', icon: '❌' }
    };
    
    const currentStage = order.status;
    const stageData = stages[currentStage];
    
    let html = `
        <div style="background: white; padding: 1.5rem; border-radius: 12px; margin-top: 1.5rem; border: 2px solid var(--border);">
            <h3 style="color: var(--primary); margin-bottom: 1rem;">
                ${stageData.icon} Tracking: ${order.orderNumber}
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <div class="detail-label">Nama</div>
                    <div class="detail-value">${order.nama}</div>
                </div>
                <div>
                    <div class="detail-label">Mata Kuliah</div>
                    <div class="detail-value">${order.matakuliah}</div>
                </div>
                <div>
                    <div class="detail-label">Status</div>
                    <div class="detail-value"><span class="status-badge status-${currentStage.toLowerCase()}">${currentStage}</span></div>
                </div>
            </div>
            <div class="tracking-timeline">
    `;
    
    if (currentStage === 'Batal') {
        html += `
            <div class="tracking-step completed">
                <div class="tracking-step-content">
                    <div class="tracking-date">${order.tanggalFormat}</div>
                    <div class="tracking-title">${stages['Batal'].icon} ${stages['Batal'].title}</div>
                    <div class="tracking-description">${stages['Batal'].desc}</div>
                </div>
            </div>
        `;
    } else {
        ['Pending', 'Proses', 'Selesai'].forEach((status, idx) => {
            const isCompleted = ['Pending', 'Proses', 'Selesai'].indexOf(currentStage) >= idx;
            const date = isCompleted ? (idx === 0 ? order.tanggalFormat : getEstimatedDate(idx * 2)) : '-';
            
            html += `
                <div class="tracking-step ${isCompleted ? 'completed' : ''}">
                    <div class="tracking-step-content">
                        <div class="tracking-date">${date}</div>
                        <div class="tracking-title">${stages[status].icon} ${stages[status].title}</div>
                        <div class="tracking-description">${stages[status].desc}</div>
                    </div>
                </div>
            `;
        });
    }
    
    html += '</div></div>';
    document.getElementById('trackingResult').innerHTML = html;
}

// Modal functions
function openModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.add('show');
    modal.onclick = function(e) {
        if (e.target === modal) closeModal();
    };
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// Alert function
function showAlert(type, message) {
    const container = document.getElementById('alertContainer');
    const icon = type === 'success' ? '✓' : '✕';
    
    container.innerHTML = `
        <div class="alert alert-${type} show">
            <span style="font-size: 1.5rem;">${icon}</span>
            <div>${message}</div>
        </div>
    `;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
    
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Utility functions
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getEstimatedDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return formatDate(date);
}

function saveData() {
    try {
        localStorage.setItem('sittaOrders', JSON.stringify(orders));
        localStorage.setItem('sittaCounter', orderCounter);
    } catch (e) {
        console.error('Error saving:', e);
    }
}

function loadData() {
    try {
        const saved = localStorage.getItem('sittaOrders');
        if (saved) {
            orders = JSON.parse(saved);
            const counter = localStorage.getItem('sittaCounter');
            orderCounter = counter ? parseInt(counter) : 1001;
        }
    } catch (e) {
        console.error('Error loading:', e);
    }
}

// Console helper
console.log('%c🎓 SITTA - Sistem Pemesanan Bahan Ajar', 'color: #2563eb; font-size: 16px; font-weight: bold;');