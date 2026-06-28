    // ===== SHEM Admin Dashboard =====

    const USE_BACKEND = false; // ganti true kalau backend sudah siap

    // ══════════════════════════════════════════════
    // DEMO LOGIN (sementara, sebelum backend siap)
    // ══════════════════════════════════════════════
    const DEMO_ADMIN = { email: 'shem.parfum@gmail.com', password: 'admin123' };

    function toggleAdminPw() {
    var input = document.getElementById('adminPassword');
    input.type = input.type === 'password' ? 'text' : 'password';
    }

    function handleAdminLogin() {
    var email = document.getElementById('adminEmail').value.trim();
    var pw    = document.getElementById('adminPassword').value;
    var errEl = document.getElementById('adminLoginError');
    var btn   = document.getElementById('adminLoginBtn');

    errEl.textContent = '';

    if (!email || !pw) {
        errEl.textContent = 'Email dan password wajib diisi.';
        return;
    }

    btn.textContent = 'Memproses...';
    btn.disabled = true;

    if (USE_BACKEND) {
        fetch('api/admin/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pw })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
        btn.textContent = 'Masuk';
        btn.disabled = false;
        if (data.success) {
            sessionStorage.setItem('shem_admin', JSON.stringify(data.admin));
            enterDashboard();
        } else {
            errEl.textContent = data.message || 'Email atau password salah.';
        }
        })
        .catch(function() {
        btn.textContent = 'Masuk';
        btn.disabled = false;
        errEl.textContent = 'Terjadi kesalahan. Coba lagi.';
        });
    } else {
        // Demo login lokal — hapus kalau backend sudah siap
        setTimeout(function() {
        btn.textContent = 'Masuk';
        btn.disabled = false;
        if (email === DEMO_ADMIN.email && pw === DEMO_ADMIN.password) {
            sessionStorage.setItem('shem_admin', JSON.stringify({ email: email }));
            enterDashboard();
        } else {
            errEl.textContent = 'Email atau password salah. (Demo: ' + DEMO_ADMIN.email + ' / ' + DEMO_ADMIN.password + ')';
        }
        }, 700);
    }
    }

    function enterDashboard() {
    document.getElementById('loginGate').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'flex';
    loadAllData();
    }

    function checkAdminSession() {
    var admin = sessionStorage.getItem('shem_admin');
    if (admin) {
        enterDashboard();
    }
    }

    // Enter key submits login
    document.addEventListener('DOMContentLoaded', function() {
    var pwField = document.getElementById('adminPassword');
    if (pwField) {
        pwField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleAdminLogin();
        });
    }
    checkAdminSession();
    });

    // ══════════════════════════════════════════════
    // DATA STORE (in-memory, fallback kalau belum backend)
    // ══════════════════════════════════════════════

    let ADMIN_PRODUCTS = [
    { id: 1, name: 'PEACE OF MIND',     category: 'fresh',    price: 350000, badge: null,  img: 'asset/product/peaceofmind.png',     notes: 'Fresh · Calm · Comforting', desc: '', sizes: ['55ml'] },
    { id: 2, name: 'VELVET BLOOM',      category: 'floral',   price: 350000, badge: null,  img: 'asset/product/velvetbloom.png',     notes: 'Soft · Sweet · Irresistible', desc: '', sizes: ['55ml'] },
    { id: 3, name: 'TOBACCO ROYALE',    category: 'woody',    price: 350000, badge: 'new', img: 'asset/product/tobaccoroyale.png',   notes: 'Warm · Sweet · Powerful', desc: '', sizes: ['55ml'] },
    { id: 4, name: 'GREEN ENCHANTMENT', category: 'fresh',    price: 350000, badge: null,  img: 'asset/product/greenenchantment.png',notes: 'Clean · Fresh · Powerful', desc: '', sizes: ['55ml'] },
    { id: 5, name: 'SCENT OF AMBITION', category: 'oriental', price: 350000, badge: 'new', img: 'asset/product/scentofambition.png', notes: 'Oud · Rose · Patchouli', desc: '', sizes: ['55ml'] },
    { id: 6, name: 'SERENITY',          category: 'woody',    price: 350000, badge: null,  img: 'asset/hehehe.png',                  notes: 'Fresh · Calm · Soft', desc: '', sizes: ['10ml', '55ml'] },
    ];

    let ADMIN_ORDERS = [
    { id: 'SHEM-001', customer: 'Ezra Wijaya',    items: [{ name: 'Peace of Mind', qty: 1 }],                          total: 350000, payment: 'QRIS', status: 'paid' },
    { id: 'SHEM-002', customer: 'Naya Putri',     items: [{ name: 'Velvet Bloom', qty: 2 }],                           total: 700000, payment: 'Bank', status: 'pending' },
    { id: 'SHEM-003', customer: 'Raka Aditya',     items: [{ name: 'Serenity (10ml)', qty: 1 }],                       total: 100000, payment: 'QRIS', status: 'paid' },
    { id: 'SHEM-004', customer: 'Vina Salsabila', items: [{ name: 'Tobacco Royale', qty: 1 }],                         total: 350000, payment: 'Bank', status: 'failed' },
    ];

    const ADMIN_CUSTOMERS = [
    { name: 'Ezra Wijaya Tama', email: 'ezrawijaya106@gmail.com', phone: '088214553358', joined: '12 Jun 2026' },
    { name: 'Naya Putri',       email: 'naya.putri@gmail.com',    phone: '081234567890', joined: '10 Jun 2026' },
    { name: 'Raka Aditya',      email: 'raka.aditya@gmail.com',   phone: '085678901234', joined: '05 Jun 2026' },
    ];

    const ADMIN_REVIEWS = [
    { customer: 'Piyann837', product: 'Velvet Bloom',   rating: 5, comment: 'Segar dan tahan lama, untuk dipakai daily enak banget.' },
    { customer: 'Salsa_22',  product: 'Peace of Mind',  rating: 4, comment: 'Wanginya soft, cocok buat kerja.' },
    { customer: 'mrizky.k',  product: 'Tobacco Royale', rating: 5, comment: 'Maskulin banget, jadi favorit!' },
    ];

    // ══════════════════════════════════════════════
    // NAVIGATION
    // ══════════════════════════════════════════════

    function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.getElementById('page-' + pageId).classList.add('active');
    document.querySelectorAll('#sidebarMenu li').forEach(function(li) {
        li.classList.toggle('active', li.dataset.page === pageId);
    });
    }

    document.querySelectorAll('#sidebarMenu li').forEach(function(li) {
    li.addEventListener('click', function() { goToPage(li.dataset.page); });
    });

    // ══════════════════════════════════════════════
    // RENDER: DASHBOARD
    // ══════════════════════════════════════════════

    function renderDashboard() {
    document.getElementById('statProduk').textContent  = ADMIN_PRODUCTS.length;
    document.getElementById('statOrder').textContent   = ADMIN_ORDERS.length;
    document.getElementById('statRevenue').textContent = formatRp(
        ADMIN_ORDERS.filter(function(o) { return o.status === 'paid'; })
                    .reduce(function(s, o) { return s + o.total; }, 0)
    );
    document.getElementById('statPending').textContent = ADMIN_ORDERS.filter(function(o) { return o.status === 'pending'; }).length;

    var tbody = document.getElementById('dashboardProductTable');
    tbody.innerHTML = ADMIN_PRODUCTS.slice(0, 5).map(function(p) {
        return '<tr>' +
        '<td><div class="prod-cell"><img class="prod-thumb" src="' + p.img + '" onerror="this.style.display=\'none\'"/>' + p.name + '</div></td>' +
        '<td>' + capitalize(p.category) + '</td>' +
        '<td>' + formatRp(p.price) + '</td>' +
        '<td><span class="pill active">Aktif</span></td>' +
        '</tr>';
    }).join('');
    }

    // ══════════════════════════════════════════════
    // RENDER + CRUD: PRODUK
    // ══════════════════════════════════════════════

    function renderProduk() {
    document.getElementById('produkCount').textContent = ADMIN_PRODUCTS.length;

    var tbody = document.getElementById('produkTable');
    tbody.innerHTML = ADMIN_PRODUCTS.map(function(p) {
        var badgeHtml = p.badge
        ? '<span class="pill ' + p.badge + '">' + p.badge.toUpperCase() + '</span>'
        : '<span class="pill none">—</span>';

        return '<tr>' +
        '<td><div class="prod-cell"><img class="prod-thumb" src="' + p.img + '" onerror="this.style.display=\'none\'"/>' + p.name + '</div></td>' +
        '<td>' + capitalize(p.category) + '</td>' +
        '<td>' + formatRp(p.price) + '</td>' +
        '<td>' + (p.sizes || []).join(', ') + '</td>' +
        '<td>' + badgeHtml + '</td>' +
        '<td><div class="row-actions">' +
            '<button class="icon-btn" title="Edit" onclick="editProduct(' + p.id + ')">✏️</button>' +
            '<button class="icon-btn delete" title="Hapus" onclick="deleteProduct(' + p.id + ')">🗑️</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
    }

    var editingProductId = null;

    function openProductModal() {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Tambah Produk';
    document.getElementById('pf_name').value     = '';
    document.getElementById('pf_category').value = 'fresh';
    document.getElementById('pf_price').value    = '';
    document.getElementById('pf_badge').value    = '';
    document.getElementById('pf_notes').value    = '';
    document.getElementById('pf_desc').value     = '';
    document.getElementById('pf_img').value      = '';
    document.getElementById('pf_size10').checked = false;
    document.getElementById('pf_size55').checked = true;
    document.getElementById('productFormError').textContent = '';

    document.getElementById('productModalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    }

    function editProduct(id) {
    var p = ADMIN_PRODUCTS.find(function(x) { return x.id === id; });
    if (!p) return;

    editingProductId = id;
    document.getElementById('productModalTitle').textContent = 'Edit Produk';
    document.getElementById('pf_name').value     = p.name;
    document.getElementById('pf_category').value = p.category;
    document.getElementById('pf_price').value    = p.price;
    document.getElementById('pf_badge').value    = p.badge || '';
    document.getElementById('pf_notes').value    = p.notes || '';
    document.getElementById('pf_desc').value     = p.desc || '';
    document.getElementById('pf_img').value      = p.img || '';
    document.getElementById('pf_size10').checked = (p.sizes || []).indexOf('10ml') !== -1;
    document.getElementById('pf_size55').checked = (p.sizes || []).indexOf('55ml') !== -1;
    document.getElementById('productFormError').textContent = '';

    document.getElementById('productModalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    }

    function closeProductModal() {
    document.getElementById('productModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    }

    function handleProductModalClick(e) {
    if (e.target === document.getElementById('productModalOverlay')) closeProductModal();
    }

    function saveProduct() {
    var name     = document.getElementById('pf_name').value.trim();
    var category = document.getElementById('pf_category').value;
    var price    = parseInt(document.getElementById('pf_price').value);
    var badge    = document.getElementById('pf_badge').value || null;
    var notes    = document.getElementById('pf_notes').value.trim();
    var desc     = document.getElementById('pf_desc').value.trim();
    var img      = document.getElementById('pf_img').value.trim();
    var sizes    = [];
    if (document.getElementById('pf_size10').checked) sizes.push('10ml');
    if (document.getElementById('pf_size55').checked) sizes.push('55ml');

    var errEl = document.getElementById('productFormError');
    errEl.textContent = '';

    if (!name)              { errEl.textContent = 'Nama produk wajib diisi.'; return; }
    if (!price || price <= 0) { errEl.textContent = 'Harga harus diisi dengan angka valid.'; return; }
    if (sizes.length === 0) { errEl.textContent = 'Pilih minimal 1 ukuran.'; return; }

    var saveBtn = document.getElementById('productSaveBtn');
    saveBtn.textContent = 'Menyimpan...';
    saveBtn.disabled = true;

    var productData = {
        id: editingProductId || Date.now(),
        name: name, category: category, price: price, badge: badge,
        notes: notes, desc: desc, img: img || 'asset/hehehe.png', sizes: sizes
    };

    if (USE_BACKEND) {
        var url    = editingProductId ? 'api/admin/products.php?id=' + editingProductId : 'api/admin/products.php';
        var method = editingProductId ? 'PUT' : 'POST';

        fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
        saveBtn.textContent = 'Simpan Produk';
        saveBtn.disabled = false;
        if (data.success) {
            applyProductSave(productData);
        } else {
            errEl.textContent = data.message || 'Gagal menyimpan produk.';
        }
        })
        .catch(function() {
        saveBtn.textContent = 'Simpan Produk';
        saveBtn.disabled = false;
        errEl.textContent = 'Terjadi kesalahan. Coba lagi.';
        });
    } else {
        // Simulasi simpan lokal — hapus kalau backend sudah siap
        setTimeout(function() {
        saveBtn.textContent = 'Simpan Produk';
        saveBtn.disabled = false;
        applyProductSave(productData);
        }, 500);
    }
    }

    function applyProductSave(productData) {
    if (editingProductId) {
        var idx = ADMIN_PRODUCTS.findIndex(function(p) { return p.id === editingProductId; });
        if (idx !== -1) ADMIN_PRODUCTS[idx] = productData;
        showToast('Produk "' + productData.name + '" berhasil diperbarui ✅');
    } else {
        ADMIN_PRODUCTS.push(productData);
        showToast('Produk "' + productData.name + '" berhasil ditambahkan ✅');
    }
    closeProductModal();
    renderProduk();
    renderDashboard();
    }

    function deleteProduct(id) {
    var p = ADMIN_PRODUCTS.find(function(x) { return x.id === id; });
    if (!p) return;
    if (!confirm('Hapus produk "' + p.name + '"?')) return;

    if (USE_BACKEND) {
        fetch('api/admin/products.php?id=' + id, { method: 'DELETE' })
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) applyProductDelete(id, p.name);
            else showToast('Gagal menghapus produk.');
        })
        .catch(function() { showToast('Terjadi kesalahan saat menghapus.'); });
    } else {
        applyProductDelete(id, p.name);
    }
    }

    function applyProductDelete(id, name) {
    ADMIN_PRODUCTS = ADMIN_PRODUCTS.filter(function(p) { return p.id !== id; });
    showToast('Produk "' + name + '" dihapus.');
    renderProduk();
    renderDashboard();
    }

    // ══════════════════════════════════════════════
    // RENDER + DETAIL: PESANAN / TRANSAKSI
    // ══════════════════════════════════════════════

    function renderPesanan() {
    var filter = document.getElementById('orderFilter') ? document.getElementById('orderFilter').value : 'all';
    var filtered = filter === 'all' ? ADMIN_ORDERS : ADMIN_ORDERS.filter(function(o) { return o.status === filter; });

    document.getElementById('pesananCount').textContent = filtered.length;
    document.getElementById('ordPaid').textContent    = ADMIN_ORDERS.filter(function(o) { return o.status === 'paid'; }).length;
    document.getElementById('ordPending').textContent = ADMIN_ORDERS.filter(function(o) { return o.status === 'pending'; }).length;
    document.getElementById('ordFailed').textContent  = ADMIN_ORDERS.filter(function(o) { return o.status === 'failed'; }).length;

    var statusLabel = { paid: 'Lunas', pending: 'Menunggu', failed: 'Gagal' };

    var tbody = document.getElementById('pesananTable');
    tbody.innerHTML = filtered.map(function(o) {
        var itemsText = o.items.map(function(i) { return i.name + ' x' + i.qty; }).join(', ');
        return '<tr>' +
        '<td>' + o.id + '</td>' +
        '<td>' + o.customer + '</td>' +
        '<td>' + itemsText + '</td>' +
        '<td>' + formatRp(o.total) + '</td>' +
        '<td>' + o.payment + '</td>' +
        '<td><span class="pill ' + o.status + '">' + statusLabel[o.status] + '</span></td>' +
        '<td><button class="icon-btn" title="Lihat detail" onclick="viewOrder(\'' + o.id + '\')">👁️</button></td>' +
        '</tr>';
    }).join('');
    }

    function viewOrder(orderId) {
    var o = ADMIN_ORDERS.find(function(x) { return x.id === orderId; });
    if (!o) return;

    var statusLabel = { paid: 'Lunas', pending: 'Menunggu', failed: 'Gagal' };
    var itemsHtml = o.items.map(function(i) {
        return '<div class="order-detail-row"><span>' + i.name + '</span><span>x' + i.qty + '</span></div>';
    }).join('');

    document.getElementById('orderDetailContent').innerHTML =
        '<div class="order-detail-row"><span>ID Order</span><span>' + o.id + '</span></div>' +
        '<div class="order-detail-row"><span>Pelanggan</span><span>' + o.customer + '</span></div>' +
        itemsHtml +
        '<div class="order-detail-row"><span>Pembayaran</span><span>' + o.payment + '</span></div>' +
        '<div class="order-detail-row"><span>Total</span><span>' + formatRp(o.total) + '</span></div>' +
        '<div class="order-detail-row"><span>Status saat ini</span><span><span class="pill ' + o.status + '">' + statusLabel[o.status] + '</span></span></div>' +
        '<select class="order-status-select" id="orderStatusSelect">' +
        '<option value="pending" ' + (o.status === 'pending' ? 'selected' : '') + '>Menunggu</option>' +
        '<option value="paid" '    + (o.status === 'paid'    ? 'selected' : '') + '>Lunas</option>' +
        '<option value="failed" '  + (o.status === 'failed'  ? 'selected' : '') + '>Gagal</option>' +
        '</select>' +
        '<button class="admin-save-btn" style="margin-top:12px;" onclick="updateOrderStatus(\'' + o.id + '\')">Update Status</button>';

    document.getElementById('orderModalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    }

    function updateOrderStatus(orderId) {
    var newStatus = document.getElementById('orderStatusSelect').value;
    var o = ADMIN_ORDERS.find(function(x) { return x.id === orderId; });
    if (!o) return;

    if (USE_BACKEND) {
        fetch('api/admin/orders.php?id=' + orderId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
        })
        .then(function(res) { return res.json(); })
        .then(function(data) {
        if (data.success) {
            o.status = newStatus;
            closeOrderModal();
            renderPesanan();
            renderDashboard();
            showToast('Status order ' + orderId + ' diperbarui ✅');
        } else {
            showToast('Gagal memperbarui status.');
        }
        })
        .catch(function() { showToast('Terjadi kesalahan.'); });
    } else {
        o.status = newStatus;
        closeOrderModal();
        renderPesanan();
        renderDashboard();
        showToast('Status order ' + orderId + ' diperbarui ✅');
    }
    }

    function closeOrderModal() {
    document.getElementById('orderModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    }

    function handleOrderModalClick(e) {
    if (e.target === document.getElementById('orderModalOverlay')) closeOrderModal();
    }

    // ══════════════════════════════════════════════
    // RENDER: PELANGGAN
    // ══════════════════════════════════════════════

    function renderPelanggan() {
    document.getElementById('pelangganCount').textContent = ADMIN_CUSTOMERS.length;
    var tbody = document.getElementById('pelangganTable');
    tbody.innerHTML = ADMIN_CUSTOMERS.map(function(c) {
        return '<tr><td>' + c.name + '</td><td>' + c.email + '</td><td>' + c.phone + '</td><td>' + c.joined + '</td></tr>';
    }).join('');
    }

    // ══════════════════════════════════════════════
    // RENDER: REVIEW
    // ══════════════════════════════════════════════

    function renderReview() {
    document.getElementById('reviewCount').textContent = ADMIN_REVIEWS.length;
    var tbody = document.getElementById('reviewTable');
    tbody.innerHTML = ADMIN_REVIEWS.map(function(r) {
        var stars = '★★★★★☆☆☆☆☆'.slice(5 - r.rating, 10 - r.rating);
        return '<tr><td>' + r.customer + '</td><td>' + r.product + '</td><td><span class="stars">' + stars + '</span></td><td>' + r.comment + '</td></tr>';
    }).join('');
    }

    // ══════════════════════════════════════════════
    // SETTINGS
    // ══════════════════════════════════════════════

    function renderSettings() {
    var pill = document.getElementById('backendStatusPill');
    if (USE_BACKEND) {
        pill.textContent = 'Aktif';
        pill.className = 'status-pill on';
    } else {
        pill.textContent = 'Nonaktif';
        pill.className = 'status-pill off';
    }
    }

    // ══════════════════════════════════════════════
    // HELPERS
    // ══════════════════════════════════════════════

    function formatRp(amount) { return 'Rp ' + amount.toLocaleString('id-ID'); }
    function capitalize(str)  { return str.charAt(0).toUpperCase() + str.slice(1); }

    var toastTimer;
    function showToast(msg) {
    var t = document.getElementById('adminToast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2600);
    }

    document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Keluar dari admin panel?')) {
        sessionStorage.removeItem('shem_admin');
        document.getElementById('adminContainer').style.display = 'none';
        document.getElementById('loginGate').style.display = 'flex';
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
    }
    });

    // ══════════════════════════════════════════════
    // LOAD ALL
    // ══════════════════════════════════════════════

    function loadAllData() {
    if (USE_BACKEND) {
        fetch('api/admin/overview.php')
        .then(function(res) { return res.json(); })
        .then(function(data) {
            if (data.success) {
            if (data.products) ADMIN_PRODUCTS = data.products;
            if (data.orders)   ADMIN_ORDERS   = data.orders;
            }
            renderAll();
        })
        .catch(function() { renderAll(); });
    } else {
        renderAll();
    }
    }

    function renderAll() {
    renderDashboard();
    renderProduk();
    renderPesanan();
    renderPelanggan();
    renderReview();
    renderSettings();
    }