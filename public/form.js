  // ===== SHEM Checkout Script =====

  // --- Ambil data cart dari localStorage ---
  const cartData = JSON.parse(localStorage.getItem("shem_cart")) || [];

  if (cartData.length === 0) {
    window.location.href = "index.html";
  }

  // --- Hitung base price dari cart ---
  let basePrice = cartData.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let shipping  = 0;
  let discount  = 0;

  // --- Render order summary dari cart ---
  function renderOrderSummary() {
    const container = document.getElementById('productList');
    if (!container) return;

    container.innerHTML = '';

    cartData.forEach(item => {
      const row = document.createElement('div');
      row.className = 'product-row';
      row.innerHTML = `
        <div class="product-thumb">
          ${item.img
            ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:contain;border-radius:6px;padding:4px;" />`
            : '🧴'
          }
        </div>
        <div class="product-info">
          <div class="product-name">${item.name}</div>
          <div class="product-variant">${item.sizes ? item.sizes[0] : ''} · Qty: ${item.qty}</div>
        </div>
        <div class="product-price">${formatRp(item.price * item.qty)}</div>
      `;
      container.appendChild(row);
    });

    // Update subtotal
    const subtotalEl = document.getElementById('subtotalText');
    const subtotalAmt = document.getElementById('subtotalAmt');
    if (subtotalEl) subtotalEl.textContent = `Subtotal · ${cartData.length} item${cartData.length > 1 ? 's' : ''}`;
    if (subtotalAmt) subtotalAmt.textContent = formatRp(basePrice);

    updateTotal();
  }

  // --- Elements ---
  const orderBtn      = document.getElementById('orderBtn');
  const modalOverlay  = document.getElementById('modalOverlay');
  const modalClose    = document.getElementById('modalClose');

  const addressEl     = document.getElementById('address');
  const charCount     = document.getElementById('charCount');

  const cityEl        = document.getElementById('city');
  const shippingBox   = document.getElementById('shippingBox');
  const shippingOpts  = document.getElementById('shippingOptions');
  const shippingCostEl = document.getElementById('shippingCost');

  const toggleNote    = document.getElementById('toggleNote');
  const noteBox       = document.getElementById('noteBox');

  const toggleVoucher = document.getElementById('toggleVoucher');
  const voucherBox    = document.getElementById('voucherBox');
  const applyVoucher  = document.getElementById('applyVoucher');
  const voucherCode   = document.getElementById('voucherCode');
  const voucherMsg    = document.getElementById('voucherMsg');

  const discountRow   = document.getElementById('discountRow');
  const discountAmt   = document.getElementById('discountAmt');
  const totalPrice    = document.getElementById('totalPrice');

  const paymentOptions = document.querySelectorAll('.payment-option');
  const shippingRadios = document.querySelectorAll('input[name="shipping"]');
  const phoneInput     = document.getElementById('phone');

  // --- Phone number only numbers ---
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
  });

  // --- Char counter for address textarea ---
  addressEl.addEventListener('input', () => {
    charCount.textContent = addressEl.value.length;
  });

  // --- Show shipping options when city is filled ---
  cityEl.addEventListener('input', () => {
    const filled = cityEl.value.trim().length > 0;
    shippingBox.style.display  = filled ? 'none' : 'block';
    shippingOpts.style.display = filled ? 'flex' : 'none';
    if (!filled) {
      shipping = 0;
      shippingCostEl.textContent = '—';
      shippingCostEl.classList.add('muted');
      updateTotal();
    }
  });

  // --- Shipping method selection ---
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      shipping = parseInt(radio.value);
      shippingCostEl.textContent = formatRp(shipping);
      shippingCostEl.classList.remove('muted');
      updateTotal();
    });
  });

  // --- Payment option highlight ---
  paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
      paymentOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });

  // --- Toggle delivery note ---
  toggleNote.addEventListener('click', () => {
    const isOpen = noteBox.style.display === 'block';
    noteBox.style.display = isOpen ? 'none' : 'block';
  });

  // --- Toggle voucher ---
  toggleVoucher.addEventListener('click', () => {
    const isOpen = voucherBox.style.display === 'block';
    voucherBox.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) voucherCode.focus();
  });

  // --- Valid Voucher Codes ---
  const validVouchers = {
    'SHEM10':  10,
    'SHEM20':  20,
    'WELCOME': 15,
  };

  // --- Apply voucher ---
  applyVoucher.addEventListener('click', () => {
    const code = voucherCode.value.trim().toUpperCase();
    if (!code) {
      showVoucherMsg('Please enter a voucher code.', 'error');
      return;
    }
    if (validVouchers[code]) {
      const pct = validVouchers[code];
      discount = Math.round(basePrice * pct / 100);
      discountRow.style.display = 'flex';
      discountAmt.textContent = '- ' + formatRp(discount);
      showVoucherMsg('Voucher applied! ' + pct + '% off.', 'success');
      updateTotal();
    } else {
      discount = 0;
      discountRow.style.display = 'none';
      showVoucherMsg('Invalid voucher code.', 'error');
      updateTotal();
    }
  });

  // --- Voucher Message ---
  function showVoucherMsg(text, type) {
    voucherMsg.textContent = text;
    voucherMsg.className = 'voucher-msg ' + type;
  }

  // --- Update total ---
  function updateTotal() {
    const total = basePrice + shipping - discount;
    totalPrice.textContent = formatRp(total);
  }

  // --- Format Rupiah ---
  function formatRp(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  // --- Validation ---
  function validateForm() {
    let valid = true;
    const required = [
      { el: document.getElementById('fullname'), msg: 'Full name is required.' },
      { el: document.getElementById('phone'),    msg: 'Phone number is required.' },
      { el: document.getElementById('city'),     msg: 'City is required.' },
      { el: document.getElementById('address'),  msg: 'Address detail is required.' },
    ];

    document.querySelectorAll('.error-msg').forEach(e => e.remove());
    document.querySelectorAll('.field-input.error, .field-textarea.error').forEach(e => e.classList.remove('error'));

    required.forEach(({ el, msg }) => {
      if (!el.value.trim()) {
        el.classList.add('error');
        const err = document.createElement('p');
        err.className = 'error-msg';
        err.textContent = msg;
        el.parentNode.appendChild(err);
        valid = false;
      }
    });

    return valid;
  }

  // --- Place order button ---
  orderBtn.addEventListener('click', () => {
    if (!validateForm()) {
      document.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // --- ORDER DATA (siap dikirim ke backend) ---
    const orderData = {
      email:    document.getElementById('email').value,
      fullname: document.getElementById('fullname').value,
      phone:    document.getElementById('phone').value,
      country:  document.getElementById('country').value,
      city:     document.getElementById('city').value,
      address:  document.getElementById('address').value,
      note:     document.getElementById('deliveryNote').value,
      voucher:  voucherCode.value.trim().toUpperCase(),
      shipping: shipping,
      discount: discount,
      total:    basePrice + shipping - discount,
      payment:  document.querySelector('input[name="payment"]:checked').value,
      items:    cartData.map(item => ({
        id:    item.id,
        name:  item.name,
        qty:   item.qty,
        price: item.price,
        size:  item.sizes ? item.sizes[0] : '',
      })),
    };

    console.log('Order Data (kirim ke backend):', orderData);

    // TODO: teman backend hubungkan ke POST /api/orders
    // fetch('/api/orders', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });

    orderBtn.textContent = 'Processing...';
    orderBtn.disabled = true;

    setTimeout(() => {
      // Kosongkan cart setelah order berhasil
      localStorage.removeItem('shem_cart');
      modalOverlay.classList.add('active');
      orderBtn.textContent = 'Place Order';
      orderBtn.disabled = false;
    }, 1500);R
  });

  // --- Close modal ---
  modalClose.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    window.location.href = 'index.html'; // kembali ke halaman utama
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
      window.location.href = 'index.html';
    }
  });

  // --- Prevent form reload ---
  document.addEventListener('submit', (e) => e.preventDefault());

  // --- INIT ---
  renderOrderSummary();