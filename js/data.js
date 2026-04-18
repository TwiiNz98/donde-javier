/* ==========================================================
   data.js — Donde Javier | Catálogo y zonas de despacho
   ========================================================== */

const CATEGORIES = [
  { id: 'todos',     label: 'Todo el menú',     icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>' },
  { id: 'completos', label: 'Completos',        icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>' },
  { id: 'papas',     label: 'Papas Fritas',    icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="9" ry="5"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 18h6"/></svg>' },
  { id: 'combos',    label: 'Combos',          icon: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-9"/><path d="M14 17H5a3 3 0 0 1 0-6h14a3 3 0 0 1 0 6z"/><path d="M14 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>' },
];

const ZONES = [
  { id: 'sector-centro',  name: 'Sector Centro',             cost: 0,    minFree: 6000,  eta: '20–30 min' },
  { id: 'rahue-alto',     name: 'Rahue Alto',                cost: 1000, minFree: 8000,  eta: '25–35 min' },
  { id: 'rahue-bajo',     name: 'Rahue Bajo',                cost: 1500, minFree: 10000, eta: '30–40 min' },
  { id: 'villa-alegre',   name: 'Villa Alegre / Las Quemas', cost: 2000, minFree: null,  eta: '35–45 min' },
  { id: 'pampa-alegre',   name: 'Pampa Alegre',              cost: 2000, minFree: null,  eta: '35–45 min' },
  { id: 'los-cristales',  name: 'Los Cristales',             cost: 2500, minFree: null,  eta: '40–50 min' },
];

const PRODUCTS = [
  {
    id: 1,
    slug: 'completo-clasico',
name: 'Completo Clásico',
    category: 'completos',
    description: 'Tomate fresco, chucrut y mayonesa sobre pan artesanal.',
    price: 1000,
    tag: null,
    hasSizes: false,
    image: 'images/completo.png',
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate picado',   removable: true  },
      { id: 'chucrut', name: 'Chucrut',         removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
    ],
  },
  {
    id: 2,
    slug: 'completo-italiano',
    name: 'Completo Italiano',
    category: 'completos',
    description: 'Palta natural, tomate fresco y mayonesa casera.',
    price: 1600,
    tag: 'Más vendido',
    hasSizes: false,
    image: 'images/italiano.png',
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate fresco',   removable: true  },
      { id: 'palta',   name: 'Palta natural',   removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
    ],
  },
  {
    id: 3,
    slug: 'combo-italiano-bebida',
    name: 'Italiano + Bebida',
    category: 'combos',
    description: 'Italiano completo más bebida 350ml.',
    price: 2000,
    tag: 'COMBO',
    badge: 'ribbon',
    hasSizes: false,
    image: 'images/italianobebida.png',
    ingredients: [
      { id: 'pan',     name: 'Pan artesanal',   removable: true  },
      { id: 'vienesa', name: 'Vienesa premium', removable: false },
      { id: 'tomate',  name: 'Tomate fresco',   removable: true  },
      { id: 'palta',   name: 'Palta natural',   removable: true  },
      { id: 'mayo',    name: 'Mayonesa casera', removable: true  },
      { id: 'bebida',  name: 'Bebida 350ml',    removable: false },
    ],
  },
  {
    id: 4,
    slug: 'papas-fritas',
    name: 'Papas Fritas',
    category: 'papas',
    description: 'Papas fritas crocantes con sal de mar.',
    price: 1000,
    tag: null,
    hasSizes: true,
    sizes: [
      { id: 'personal', label: 'Porción Personal', sublabel: 'Ideal para uno',  price: 1000 },
      { id: 'familiar', label: 'Porción Familiar',  sublabel: 'Para compartir', price: 2000 },
    ],
    image: 'images/papasfritas.png',
    ingredients: [
      { id: 'papa',   name: 'Papa nacional',  removable: false },
      { id: 'sal',    name: 'Sal de mar',     removable: true  },
      { id: 'aceite', name: 'Aceite vegetal', removable: false },
    ],
  },
];
