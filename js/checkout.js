/* ==========================================================
   checkout.js — Donde Javier | Checkout ULTRA-COMPACTO MOBILE-FIRST
   Sin scroll, todo visible, optimizado para conversión
   ========================================================== */

const Checkout = (() => {
  
  const WA_NUMBER = '56944222079';
  let currentStep = 1;
  
  const overlayEl = () => document.getElementById('checkout-overlay');
  const sheetEl   = () => document.getElementById('checkout-sheet');

  function open() {
    if (Cart.getTotalCount() === 0) {
      Toast.show('Primero agrega productos a tu pedido po', 'error');
      return;
    }
    currentStep = 1;
    Cart.close();
    renderSheet();
    setTimeout(() => {
      overlayEl().classList.add('open');
      document.body.style.overflow = 'hidden';
    }, 80);
  }

  function close() {
    overlayEl().classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderSheet() {
    if (currentStep === 1) {
      renderStep1();
    } else {
      renderStep2();
    }
  }

/* ═══════════════════════════════════════════════════════
      STEP 1: MINIMALISTA - Solo sector y total
      ═══════════════════════════════════════════════════════ */
  function renderStep1() {
    const selectedZoneId = document.getElementById('zone-select')?.value;
    const subtotal = Cart.getSubtotal();
    const deliveryCost = selectedZoneId ? getDeliveryCost(ZONES.find(z => z.id === selectedZoneId)) : 0;
    const total = subtotal + deliveryCost;
    
    sheetEl().innerHTML = `
      <!-- Header simple -->
      <div class="checkout-header-compact">
        <div class="checkout-stepper-mini">
          <span class="step-mini ${currentStep === 1 ? 'active' : 'done'}">1</span>
          <span class="step-line-mini"></span>
          <span class="step-mini ${currentStep === 2 ? 'active' : ''}">2</span>
        </div>
        <button class="checkout-close-mini" onclick="Checkout.close()">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Total siempre visible -->
      <div class="checkout-total-banner">
        <div>
          <span>Total a pagar:</span>
          <strong>$${total.toLocaleString('es-CL')}</strong>
        </div>
        <div class="checkout-delivery-row">
          <span>Delivery</span>
          <span class="delivery-dots"></span>
          <span id="delivery-amount">${selectedZoneId ? (deliveryCost === 0 ? 'Gratis' : '$' + deliveryCost.toLocaleString('es-CL')) : 'Precio por estimar'}</span>
        </div>
      </div>

      <!-- Selector de sector - DESTACADO -->
      <div class="checkout-zone-section">
        <label class="checkout-zone-label">📍 ¿Dónde te entregamos?</label>
        <select class="checkout-select-highlight" id="zone-select" onchange="Checkout._onZoneChange()">
          <option value="">Selecciona tu sector</option>
          ${ZONES.map(z => `<option value="${z.id}" ${z.id === selectedZoneId ? 'selected' : ''}>${z.name}</option>`).join('')}
        </select>
        <div class="zone-delivery-info" id="zone-info">
          <span id="zone-info-text"></span>
        </div>
      </div>

      <!-- Botón -->
      <div class="checkout-footer-compact">
        <button class="checkout-btn-compact" id="continue-btn" onclick="Checkout._goToStep2()" ${!selectedZoneId ? 'disabled' : ''}>
          Continuar →
        </button>
      </div>
    `;
    
    if (selectedZoneId) {
      const zone = ZONES.find(z => z.id === selectedZoneId);
      if (zone) updateZoneInfo(zone, deliveryCost);
    }
  }

  /* ═══════════════════════════════════════════════════════
     STEP 2: Tus datos - DISEÑO PROFESIONAL E-COMMERCE
     ═══════════════════════════════════════════════════════ */
  function renderStep2() {
    const zoneId = document.getElementById('zone-select')?.value;
    const zone = ZONES.find(z => z.id === zoneId);
    const deliveryCost = zone ? getDeliveryCost(zone) : 0;
    const subtotal = Cart.getSubtotal();
    const total = subtotal + deliveryCost;
    
    sheetEl().innerHTML = `
      <!-- Header -->
      <div class="checkout-header-compact">
        <div class="checkout-stepper-mini">
          <span class="step-mini done">✓</span>
          <span class="step-line-mini"></span>
          <span class="step-mini active">2</span>
        </div>
        <button class="checkout-close-mini" onclick="Checkout.close()">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Total visible -->
      <div class="checkout-total-banner">
        <span>Total a pagar:</span>
        <strong>$${total.toLocaleString('es-CL')}</strong>
      </div>

      <!-- Datos del cliente -->
      <div class="checkout-form-simple">
        <div class="checkout-field-group">
          <label class="checkout-field-label">Nombre completo</label>
          <input type="text" id="client-name" placeholder="Tu nombre" class="checkout-input-simple" autocomplete="given-name">
        </div>
        <div class="checkout-field-group">
          <label class="checkout-field-label">Teléfono</label>
          <input type="tel" id="client-phone" placeholder="ej: 942345678" class="checkout-input-simple" autocomplete="tel">
        </div>
        <div class="checkout-field-group">
          <label class="checkout-field-label">Dirección de entrega</label>
          <input type="text" id="client-address" placeholder="Calle, número, block..." class="checkout-input-simple" autocomplete="street-address">
        </div>
        <div class="checkout-field-group">
          <label class="checkout-field-label">Notas (opcional)</label>
          <input type="text" id="client-notes" placeholder="Timbre, referencia, piso..." class="checkout-input-simple">
        </div>
      </div>

      <!-- Botones -->
      <div class="checkout-footer-compact checkout-footer-split">
        <button class="checkout-btn-secondary" onclick="Checkout._goToStep1()">
          ← Atrás
        </button>
        <button class="checkout-btn-compact checkout-btn-success" id="send-order-btn" onclick="Checkout._submit()">
          Confirmar ✓
        </button>
      </div>
    `;
  }

  /* ═══════════════════════════════════════════════════════
     ORDER SUMMARY
     ═══════════════════════════════════════════════════════ */
  function renderSummary() {
    const el = document.getElementById('order-summary');
    if (!el) return;
    const items = Cart.getItems();
    el.innerHTML = items.map(item => {
      const sub = item.price * item.qty;
      const mods = item.removed.length > 0 ? ` <span style="color:var(--text-3);font-size:10px">(sin ${item.removed.join(', ')})</span>` : '';
      return `<div class="checkout-item-compact"><span>${item.qty}× ${item.name}${mods}</span><span>$${sub.toLocaleString('es-CL')}</span></div>`;
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════
     HELPERS
     ═══════════════════════════════════════════════════════ */
  function updateTotalsDisplay(deliveryCost) {
    const subtotal = Cart.getSubtotal();
    const total = subtotal + deliveryCost;
    
    const deliveryEl = document.getElementById('delivery-value');
    const totalEl = document.getElementById('total-value');
    
    if (deliveryEl) {
      deliveryEl.innerHTML = deliveryCost > 0 ? `$${deliveryCost.toLocaleString('es-CL')}` : '<span style="color:var(--green)">Gratis</span>';
    }
    if (totalEl) {
      totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
    }
  }

  function updateZoneInfo(zone, deliveryCost) {
    const infoEl = document.getElementById('zone-info');
    const textEl = document.getElementById('zone-info-text');
    
    if (infoEl && textEl && zone) {
      infoEl.classList.add('show');
      textEl.innerHTML = `Tiempo Estimado 🚚 ${zone.eta}`;
    }
  }

  /* ═══════════════════════════════════════════════════════
     NAVIGATION
     ═══════════════════════════════════════════════════════ */
  function goToStep2() {
    const zoneId = document.getElementById('zone-select')?.value;
    if (!zoneId) {
      Toast.show('Selecciona tu zona de entrega', 'error');
      return;
    }
    currentStep = 2;
    renderSheet();
  }

  function goToStep1() {
    currentStep = 1;
    renderSheet();
  }

  /* ═══════════════════════════════════════════════════════
     ZONE CHANGE
     ═══════════════════════════════════════════════════════ */
  function onZoneChange() {
    const select = document.getElementById('zone-select');
    const zoneId = select?.value;
    const zone = ZONES.find(z => z.id === zoneId);
    const btn = document.getElementById('continue-btn');

    if (btn) {
      btn.disabled = !zoneId;
    }

    const deliveryEl = document.getElementById('delivery-amount');
    if (deliveryEl) {
      if (zone) {
        const deliveryCost = getDeliveryCost(zone);
        Cart.setDelivery(deliveryCost);
        deliveryEl.textContent = deliveryCost === 0 ? 'Gratis' : '$' + deliveryCost.toLocaleString('es-CL');
        updateZoneInfo(zone, deliveryCost);
        updateTotalBanner();
      } else {
        const infoEl = document.getElementById('zone-info');
        if (infoEl) infoEl.classList.remove('show');
        Cart.setDelivery(0);
        deliveryEl.textContent = 'Precio por estimar';
        updateTotalBanner();
      }
    }
  }

  function updateTotalBanner() {
    const subtotal = Cart.getSubtotal();
    const delivery = Cart.getDelivery() || 0;
    const total = subtotal + delivery;
    const totalEl = document.querySelector('.checkout-total-banner strong');
    if (totalEl) {
      totalEl.textContent = `$${total.toLocaleString('es-CL')}`;
    }
  }

  function getDeliveryCost(zone) {
    if (!zone) return 0;
    const subtotal = Cart.getSubtotal();
    if (zone.minFree && subtotal >= zone.minFree) return 0;
    return zone.cost;
  }

  /* ═══════════════════════════════════════════════════════
     VALIDATION
     ═══════════════════════════════════════════════════════ */
  function validateStep2() {
    const name = document.getElementById('client-name')?.value?.trim() || '';
    const phone = document.getElementById('client-phone')?.value?.trim() || '';
    const address = document.getElementById('client-address')?.value?.trim() || '';

    if (!name) { Toast.show('Ingresa tu nombre', 'error'); return false; }
    if (!phone) { Toast.show('Ingresa tu teléfono', 'error'); return false; }
    if (!address) { Toast.show('Ingresa tu dirección', 'error'); return false; }

    return true;
  }

  function showError(errId, fieldId) {
    const err = document.getElementById(errId);
    const field = document.getElementById(fieldId);
    if (err) err.classList.add('show');
    if (field) field.classList.add('error');
  }

  function clearError(errId, fieldId) {
    const err = document.getElementById(errId);
    const field = document.getElementById(fieldId);
    if (err) err.classList.remove('show');
    if (field) field.classList.remove('error');
  }

/* ═══════════════════════════════════════════════════════
      SUBMIT
      ═══════════════════════════════════════════════════════ */
  function submit() {
    console.log('=== INICIANDO SUBMIT ===');
    
    if (!validateStep2()) {
      console.log('❌ Validación fallida - no se envía');
      Toast.show('Completa todos los campos requeridos', 'error');
      return;
    }

    console.log('✅ Validación exitosa');
    
    const name = document.getElementById('client-name')?.value.trim() || '';
    const phone = document.getElementById('client-phone')?.value.trim() || '';
    const address = document.getElementById('client-address')?.value.trim() || '';
    const notes = document.getElementById('client-notes')?.value.trim() || '';
    const zoneId = document.getElementById('zone-select')?.value || '';
    const zone = ZONES.find(z => z.id === zoneId);
    const items = Cart.getItems();

    console.log('📦 Items en carrito:', items.length);
    console.log('👤 Cliente:', name);
    console.log('📍 Zona:', zone?.name);

    const btn = document.getElementById('send-order-btn');
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Enviando...'; }

    try {
      const deliveryCost = zone ? getDeliveryCost(zone) : 0;
      const subtotal = Cart.getSubtotal();
      const total = subtotal + deliveryCost;
      const orderId = generateOrderId();
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

      console.log('💰 Subtotal:', subtotal);
      console.log('🚚 Delivery:', deliveryCost);
      console.log('💵 Total:', total);

      let itemLines = '';
      let itemNumber = 1;
      items.forEach((item) => {
        const sub = item.price * item.qty;
        itemLines += `${itemNumber}. ${item.name} ×${item.qty}\n`;
        itemLines += `   $${item.price.toLocaleString('es-CL')} c/u = $${sub.toLocaleString('es-CL')}\n`;
        if (item.removed.length > 0) {
          itemLines += `   ⚠️ Sin: ${item.removed.join(', ')}\n`;
        }
        itemNumber++;
      });

      const deliveryLine = deliveryCost === 0 ? '   $0 (GRATIS)' : `   $${deliveryCost.toLocaleString('es-CL')}`;
      const notesLine = notes ? `\n📝 Notas: ${notes}` : '';

      const message = [
        '═══════════════════════════════════',
        '        🍔 DONDE JAVIER 🍔',
        '      Delivery Osorno - Rahue Alto',
        '═══════════════════════════════════',
        '',
        `📋 PEDIDO N°: ${orderId}`,
        `📅 Fecha: ${dateStr}`,
        `🕐 Hora: ${timeStr}`,
        '',
        '───────────────────────────────────',
        '          DATOS DEL CLIENTE',
        '───────────────────────────────────',
        `👤 Nombre: ${name}`,
        `📞 Teléfono: ${phone}`,
        `📍 Dirección: ${address}`,
        `🗺 Sector: ${zone?.name || '—'}${notesLine}`,
        '',
        '───────────────────────────────────',
        '             TU PEDIDO',
        '───────────────────────────────────',
        '',
        itemLines,
        '───────────────────────────────────',
        '            RESUMEN',
        '───────────────────────────────────',
        `Subtotal:            $${subtotal.toLocaleString('es-CL')}`,
        `Delivery:${deliveryLine}`,
        '───────────────────────────────────',
        `💰 TOTAL A PAGAR:   $${total.toLocaleString('es-CL')}`,
        '═══════════════════════════════════',
        '',
        `⏱ Tiempo estimado: ${zone?.eta || '25-35 min'}`,
        '📱 Confirmaremos tu pedido por WhatsApp',
        '',
        '🙏 ¡Gracias por tu preferencia!',
      ].join('\n');

      console.log('=== PEDIDO GENERADO ===');
      console.log('📱 Número WhatsApp:', WA_NUMBER);
      console.log('🔗 URL:', `https://wa.me/${WA_NUMBER}`);

      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
      
      console.log('🚀 Abriendo WhatsApp...');
      
      // Intento 1: window.open
      const waWindow = window.open(waUrl, '_blank');
      
      // Intento 2: si falla, usar location.href
      setTimeout(() => {
        if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
          console.log('⚠️ window.open falló, usando window.location.href');
          window.location.href = waUrl;
          Toast.show('WhatsApp se abrirá automáticamente', 'default');
        } else {
          console.log('✅ WhatsApp abierto exitosamente');
        }
      }, 500);
      
      Cart.clear();
      close();
      Toast.show('¡Pedido enviado por WhatsApp!', 'success');
      
    } catch (error) {
      console.error('❌ Error al enviar pedido:', error);
      Toast.show('Error al enviar. Intenta de nuevo.', 'error');
      if (btn) { btn.disabled = false; btn.innerHTML = 'Confirmar ✓'; }
    }
  }

  function generateOrderId() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const rnd = Math.floor(Math.random() * 900 + 100);
    return `DJ-${hrs}${min}-${rnd}`;
  }

  return {
    open, close,
    _onZoneChange: onZoneChange,
    _goToStep2: goToStep2,
    _goToStep1: goToStep1,
    _submit: submit,
    _clearError: clearError,
  };

})();