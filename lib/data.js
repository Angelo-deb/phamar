export function today(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

export function generateId(arr) {
  return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1
}

export function daysUntilExpiry(dateStr) {
  const diff = new Date(dateStr) - new Date(today())
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function drugStatus(d) {
  const days = daysUntilExpiry(d.expiry)
  if (days < 0)       return 'expired'
  if (days <= 30)     return 'expiring'
  if (d.qty === 0)    return 'out'
  if (d.qty < d.minQty) return 'low'
  return 'ok'
}

export const STATUS_MAP = {
  ok:       { label: 'En stock',      cls: 'badge-green' },
  low:      { label: 'Stock faible',  cls: 'badge-amber' },
  out:      { label: 'Rupture',       cls: 'badge-red'   },
  expired:  { label: 'Périmé',        cls: 'badge-red'   },
  expiring: { label: 'Expire bientôt',cls: 'badge-amber' },
}

export const CATEGORIES = [
  'Antalgiques','Antibiotiques','Anti-inflammatoires','Antipaludéens',
  'Solutions','Vitamines','Gastro-entérologie','Cardiologie',
  'Dermatologie','Ophtalmologie','Autre',
]

export const REASONS_IN  = ['Approvisionnement fournisseur','Retour client','Correction inventaire','Don']
export const REASONS_OUT = ['Vente','Péremption','Retour fournisseur','Usage interne','Perte/Vol']

export const INITIAL_USERS = [
  { id:1, name:'Dr. Mbouda Admin',  email:'admin@pharma.cm', password:'admin123', role:'admin', active:true  },
  { id:2, name:'Alice Ngono',       email:'alice@pharma.cm', password:'pass123',  role:'user',  active:true  },
  { id:3, name:'Paul Essomba',      email:'paul@pharma.cm',  password:'pass123',  role:'user',  active:false },
]

export const INITIAL_DRUGS = [
  { id:1, name:'Paracétamol 500mg',   qty:120, minQty:20, price:150,  category:'Antalgiques',          expiry:today(180), unit:'boîte'   },
  { id:2, name:'Amoxicilline 500mg',  qty:8,   minQty:15, price:2200, category:'Antibiotiques',        expiry:today(90),  unit:'boîte'   },
  { id:3, name:'Ibuprofène 400mg',    qty:45,  minQty:10, price:800,  category:'Anti-inflammatoires',  expiry:today(365), unit:'boîte'   },
  { id:4, name:'Métronidazole 250mg', qty:0,   minQty:10, price:500,  category:'Antibiotiques',        expiry:today(200), unit:'boîte'   },
  { id:5, name:'Quinine 300mg',       qty:55,  minQty:20, price:1200, category:'Antipaludéens',        expiry:today(-5),  unit:'boîte'   },
  { id:6, name:'Sérum physiologique', qty:30,  minQty:10, price:350,  category:'Solutions',            expiry:today(60),  unit:'flacon'  },
  { id:7, name:'Vitamine C 1000mg',   qty:200, minQty:30, price:250,  category:'Vitamines',            expiry:today(400), unit:'boîte'   },
  { id:8, name:'Oméprazole 20mg',     qty:12,  minQty:15, price:1500, category:'Gastro-entérologie',   expiry:today(120), unit:'boîte'   },
]

export const SEED_MOVEMENTS = [
  { id:1, drugId:1, drugName:'Paracétamol 500mg',   type:'in',  qty:50,  reason:'Approvisionnement fournisseur', note:'',             user:'Dr. Mbouda Admin', date:today(-6) },
  { id:2, drugId:7, drugName:'Vitamine C 1000mg',   type:'in',  qty:100, reason:'Approvisionnement fournisseur', note:'',             user:'Alice Ngono',      date:today(-5) },
  { id:3, drugId:1, drugName:'Paracétamol 500mg',   type:'out', qty:12,  reason:'Vente',                         note:'Client fidèle',user:'Alice Ngono',      date:today(-4) },
  { id:4, drugId:2, drugName:'Amoxicilline 500mg',  type:'out', qty:5,   reason:'Vente',                         note:'',             user:'Dr. Mbouda Admin', date:today(-3) },
  { id:5, drugId:5, drugName:'Quinine 300mg',       type:'out', qty:3,   reason:'Péremption',                    note:'Date dépassée',user:'Alice Ngono',      date:today(-2) },
  { id:6, drugId:6, drugName:'Sérum physiologique', type:'in',  qty:20,  reason:'Approvisionnement fournisseur', note:'',             user:'Dr. Mbouda Admin', date:today(-1) },
  { id:7, drugId:3, drugName:'Ibuprofène 400mg',    type:'out', qty:8,   reason:'Vente',                         note:'',             user:'Alice Ngono',      date:today()   },
]

export const INITIAL_SUPPLIERS = [
  { id: 1, name: 'PharmaPlus', contact: '+237 690 12 34 56', email: 'contact@pharmaplus.cm', address: 'Yaoundé', active: true },
  { id: 2, name: 'Medex', contact: '+237 670 98 76 54', email: 'info@medex.cm', address: 'Douala', active: true },
]
