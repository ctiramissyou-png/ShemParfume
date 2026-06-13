// ── Voucher data (nanti dari backend) ──
    const MEMBER_VOUCHERS = [
    {
        code:    'WELCOME15',
        disc:    '15% OFF',
        desc:    'Voucher selamat datang member baru',
        exp:     '31 Des 2026',
        used:    false,
    },
    {
        code:    'SHEM10',
        disc:    '10% OFF',
        desc:    'Diskon spesial member SHEM',
        exp:     '31 Des 2026',
        used:    false,
    },
    {
        code:    'BDAY20',
        disc:    '20% OFF',
        desc:    'Voucher ulang tahun (aktif di bulan lahirmu)',
        exp:     'Sesuai bulan lahir',
        used:    false,
    },
    ];

    // ── Load user data ──
    function loadProfile() {
    var user = JSON.parse(localStorage.getItem('shem_user')) || {
        name: 'SHEM Member',
        email: '—',
        phone: '—',
        address: '—',
        dob: '—'
    };

    // Avatar (initial name)
    document.getElementById('profileAvatar').textContent = user.name ? user.name.charAt(0).toUpperCase() : '?';
    document.getElementById('profileName').textContent = user.name || '—';
    document.getElementById('profileEmail').textContent = user.email || '—';

    // Info grid
    var info = [
        { label: 'Nama Lengkap', value: user.name || '—' },
        { label: 'Tanggal Lahir', value: user.dob || '—' },
        { label: 'Email', value: user.email || '—' },
        { label: 'No. HP', value: user.phone || '—' },
        { label: 'Alamat', value: user.address || '—' },
    ];

    var infoEl = document.getElementById('profileInfo');
    infoEl.innerHTML = info.map(function(item) {
        return '<div class="info-item"><label>' + item.label + '</label><p>' + item.value + '</p></div>';
    }).join('');
    }

    // ── Render vouchers ──
    function renderVouchers(vouchers) {
    var grid = document.getElementById('voucherGrid');
    grid.innerHTML = vouchers.map(function(v)  {
        return '<div class="voucher-card ' + (v.used ? 'used' : '') + '">' +
        (v.used ? '<span class="used-stamp">Terpakai</span>' : '') +
        '<div class="voucher-disc">' + v.disc + '</div>' +
        '<div class="voucher-desc">' + v.desc + '</div>' +
        '<div class="voucher-code-row">' +
            '<span class="voucher-code">' + v.code + '</span>' +
            (!v.used ? '<button class="copy-btn" onclick="copyVoucher(\'' + v.code + '\')">📋 Salin</button>' : '') +
        '</div>' +
        '<div class="voucher-exp">Berlaku hingga: ' + v.exp + '</div>' +
        '</div>';
    }).join('');
    }

    // ── Copy voucher ──
    function copyVoucher(code) {
    navigator.clipboard.writeText(code).then(function() {
        showToast('Kode "' + code + '" berhasil disalin! 🎉');
    }).catch(function() {
        showToast('Kode voucher: ' + code);
    });
    }

    // ── Toast ──
    var toastTimer;
    function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2800);
    }

    // ── Logout ──
    function handleLogout() {
    localStorage.removeItem('shem_user');
    window.location.href = 'login.html';
    }

    // ── Load vouchers ──
    function loadVouchers() {
    if (USE_BACKEND) {
        fetch('api/vouchers.php')
        .then(function(res) { return res.json(); })
        .then(function(data) {
        if (data.success) {
            renderVouchers(data.vouchers);
        } else {
            renderVouchers(MEMBER_VOUCHERS); // fallback
        }
        })
        .catch(function() {
        renderVouchers(MEMBER_VOUCHERS); // fallback
        });
    } else {
        renderVouchers(MEMBER_VOUCHERS); // pakai data lokal
    }
    }

    // ── Init ──
    const USE_BACKEND = false; // Set true jika sudah ada backend
    loadProfile();
    loadVouchers();