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
     STEP 1: ULTRA-COMPACTO - Sin scroll
     ═══════════════════════════════════════════════════════ */
  function renderStep1() {
    const selectedZoneId = document.getElementById('zone-select')?.value;
    const subtotal = Cart.getSubtotal();
    const totalItems = Cart.getTotalCount();
    const total = subtotal;
    
    sheetEl().innerHTML = `
      <!-- Header con stepper integrado -->
      <div class="checkout-header-compact">
        <div class="checkout-stepper-mini">
          <span class="step-mini ${currentStep === 1 ? 'active' : 'done'}">✓</span>
          <span class="step-line-mini"></span>
          <span class="step-mini ${currentStep === 2 ? 'active' : ''}">2</span>
        </div>
        <button class="checkout-close-mini" onclick="Checkout.close()">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <!-- Resumen pedido - barrita roja -->
      <div class="checkout-bar-compact">
        <span>🛒 ${totalItems} prod${totalItems !== 1 ? 's' : ''}</span>
        <span class="checkout-bar-total">Total: $${total.toLocaleString('es-CL')}</span>
      </div>

      <!-- Contenido compact -->
      <div class="checkout-body-compact">
        <!-- Items (scroll interno si hay muchos) -->
        <div class="checkout-items-compact" id="order-summary"></div>
        
        <!-- Zona de entrega -->
        <div class="checkout-zone-compact">
          <select class="checkout-select-compact" id="zone-select" onchange="Checkout._onZoneChange()">
            <option value="">📍 Selecciona sector</option>
            ${ZONES.map(z => `<option value="${z.id}" ${z.id === selectedZoneId ? 'selected' : ''}>${z.name}</option>`).join('')}
          </select>
          <p class="checkout-error-mini" id="zone-error">Selecciona zona</p>
        </div>
        
        <!-- Info delivery -->
        <div class="checkout-delivery-info" id="zone-info">
          <span id="zone-info-text"></span>
        </div>

        <!-- Totales inline -->
        <div class="checkout-totals-compact">
          <div class="totals-inline">
            <span>Prod: $${subtotal.toLocaleString('es-CL')}</span>
            <span class="totals-divider">|</span>
            <span>Delivery: <span id="delivery-value">—</span></span>
          </div>
          <div class="totals-grand">
            <span>Total: <strong id="total-value">$${total.toLocaleString('es-CL')}</strong></span>
          </div>
        </div>
      </div>

      <!-- Botón siempre visible -->
      <div class="checkout-footer-compact">
        <button class="checkout-btn-compact" id="continue-btn" onclick="Checkout._goToStep2()">
          Continuar →
        </button>
      </div>
    `;

    renderSummary();
    
    if (selectedZoneId) {
      const zone = ZONES.find(z => z.id === selectedZoneId);
      if (zone) {
        const deliveryCost = getDeliveryCost(zone);
        updateTotalsDisplay(deliveryCost);
        updateZoneInfo(zone, deliveryCost);
      }
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
    const totalItems = Cart.getTotalCount();
    
    sheetEl().innerHTML = `
      <!-- Header con stepper -->
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

      <!-- Barrita resumen -->
      <div class="checkout-bar-compact">
        <span>🛒 ${totalItems} prod${totalItems !== 1 ? 's' : ''}</span>
        <span class="checkout-bar-total">Total: $${total.toLocaleString('es-CL')}</span>
      </div>

      <!-- Formulario profesional con labels y hints -->
      <div class="checkout-body-compact checkout-body-form">
        
        <!-- Nombre completo -->
        <div class="checkout-field-group">
          <label class="checkout-field-label">
            Nombre completo <span class="required">*</span>
          </label>
          <input type="text" class="checkout-field-input" id="client-name"
                 placeholder="Tu nombre y apellido"
                 autocomplete="given-name"
                 oninput="Checkout._clearError('name-error', 'client-name')">
          <span class="checkout-field-hint">📌 Ej: Juan Pérez</span>
          <p class="checkout-error-mini" id="name-error">Ingresa tu nombre completo</p>
        </div>
        
        <!-- Teléfono -->
        <div class="checkout-field-group">
          <label class="checkout-field-label">
            Teléfono de contacto <span class="required">*</span>
          </label>
          <input type="tel" class="checkout-field-input" id="client-phone"
                 placeholder="+56 9 0000 0000"
                 autocomplete="tel"
                 oninput="Checkout._clearError('phone-error', 'client-phone')">
          <span class="checkout-field-hint">📌 Para confirmar tu pedido por WhatsApp</span>
          <p class="checkout-error-mini" id="phone-error">Ingresa un teléfono válido</p>
        </div>
        
        <!-- Dirección -->
        <div class="checkout-field-group">
          <label class="checkout-field-label">
            Dirección de entrega <span class="required">*</span>
          </label>
          <input type="text" class="checkout-field-input" id="client-address"
                 placeholder="Calle, número, block, departamento..."
                 autocomplete="street-address"
                 oninput="Checkout._clearError('address-error', 'client-address')">
          <span class="checkout-field-hint">📌 Ej: Av. Los Lagos 1234, Depto 501</span>
          <p class="checkout-error-mini" id="address-error">Ingresa tu dirección de entrega</p>
        </div>
        
        <!-- Notas -->
        <div class="checkout-field-group">
          <label class="checkout-field-label">
            Notas adicionales <span style="font-weight:400;color:var(--text-3)">(opcional)</span>
          </label>
          <input type="text" class="checkout-field-input" id="client-notes"
                 placeholder="Timbre, referencia, piso, sector...">
          <span class="checkout-field-hint">📌 Información adicional para encontrarte más fácil</span>
        </div>
        
      </div>

      <!-- Footer con botones -->
      <div class="checkout-footer-compact">
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
    
    if (infoEl && textEl) {
      infoEl.classList.add('show');
      const freeMsg = zone.minFree ? ` (gratis desde $${zone.minFree.toLocaleString('es-CL')})` : '';
      const costMsg = deliveryCost === 0 ? '<strong style="color:var(--green)">Gratis</strong>' : `$${deliveryCost.toLocaleString('es-CL')}${freeMsg}`;
      textEl.innerHTML = `🚚 ${costMsg} · ⏱ ${zone.eta}`;
    }
  }

  /* ═══════════════════════════════════════════════════════
     NAVIGATION
     ═══════════════════════════════════════════════════════ */
  function goToStep2() {
    const zoneId = document.getElementById('zone-select')?.value;
    if (!zoneId) {
      showError('zone-error', 'zone-select');
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

    if (zone) {
      const deliveryCost = getDeliveryCost(zone);
      Cart.setDelivery(deliveryCost);
      updateTotalsDisplay(deliveryCost);
      updateZoneInfo(zone, deliveryCost);
      clearError('zone-error', 'zone-select');
    } else {
      const infoEl = document.getElementById('zone-info');
      if (infoEl) infoEl.classList.remove('show');
      updateTotalsDisplay(0);
      Cart.setDelivery(0);
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
    let ok = true;
    const name = document.getElementById('client-name')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    const address = document.getElementById('client-address')?.value.trim();

    if (!name || name.length < 2) { showError('name-error', 'client-name'); ok = false; }
    if (!phone || phone.length < 8) { showError('phone-error', 'client-phone'); ok = false; }
    if (!address || address.length < 5) { showError('address-error', 'client-address'); ok = false; }

    return ok;
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
    if (!validateStep2()) {
      Toast.show('Completa todos los campos requeridos', 'error');
      return;
    }

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const notes = document.getElementById('client-notes')?.value.trim() || '';
    const zoneId = document.getElementById('zone-select').value;
    const zone = ZONES.find(z => z.id === zoneId);
    const items = Cart.getItems();

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
      console.log('URL WhatsApp:', `https://wa.me/${WA_NUMBER}`);
      console.log('Mensaje:', message);

      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
      
      const waWindow = window.open(waUrl, '_blank');
      
      if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
        window.location.href = waUrl;
        Toast.show('WhatsApp se abrirá automáticamente', 'default');
      }
      
      Cart.clear();
      close();
      Toast.show('¡Pedido enviado por WhatsApp!', 'success');
      
    } catch (error) {
      console.error('Error al enviar pedido:', error);
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