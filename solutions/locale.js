/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 * Confidential and proprietary. Unauthorized use prohibited.
 * MyMilesAI is a trademark of Harijas LLC.
 * MyMilesAI is a recordkeeping tool - not tax advice.
 * See LICENSE for full terms. harijasllc@outlook.com
 */

/* ── Solutions locale layer ──────────────────────────────────────────────────
   Single source of truth for all US/CA locale strings and persona data.
   Exposes window.MM = { get, set, strings, personas }.
   Storage key 'mm_region' is shared with MSRegionPill in ms-parts1.jsx.
   Fires CustomEvent('mm-locale-change', {detail:{locale:'US'|'CA'}}) on change.
   Sets document.documentElement.dataset.locale on change and on first load.
──────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var KEY = 'mm_region';

  /* ── Locale string table ─────────────────────────────────────────────── */
  var STRINGS = {
    US: {
      rate:            '$0.725/mile (2026 IRS)',
      rateShort:       '$0.725/mi',
      rateValue:       0.725,
      unit:            'miles',
      unitShort:       'mi',
      currency:        '$',
      complianceLabel: 'IRS-compliant',
      auditLabel:      'IRS audit-ready',
      form1:           'IRS Pub. 463',
      form2:           'Form 2106',
      scheduleForm:    'Schedule C',
      formHeader:      'IRS Form 2106 — 2026',
      trustStrip:      'IRS Pub. 463 compliant · No credit card required · 10-day free trial',
      rateNote:        'At $0.725/mile, the 2026 IRS standard mileage rate.',
      regionLabel:     'United States',
      heroClaim:       'in missed deductions every year.',
      subComplianceNote: 'IRS Pub. 463 compliant exports, ready for Schedule C.',
    },
    CA: {
      rate:            '$0.73/km first 5,000 km, $0.67/km after (2026 CRA)',
      rateShort:       '$0.73/km',
      rateValue:       0.73,
      unit:            'kilometres',
      unitShort:       'km',
      currency:        '$',
      complianceLabel: 'CRA-compliant',
      auditLabel:      'CRA audit-ready',
      form1:           'CRA T2125',
      form2:           'Form T777',
      scheduleForm:    'T4A',
      formHeader:      'CRA T2125 — 2026',
      trustStrip:      'CRA T2125 compliant · No credit card required · 10-day free trial',
      rateNote:        'At $0.73/km (first 5,000 km), the 2026 CRA reasonable rate.',
      regionLabel:     'Canada',
      heroClaim:       'in missed deductions every year.',
      subComplianceNote: 'CRA T2125 compliant exports, ready for T4A filing.',
    },
  };

  /* ── Persona data ────────────────────────────────────────────────────── */
  /* Each persona: { distance, deduction, heroStat, trips[] }
     trips[]: { date, route, dist, amount }
     dist/amount are plain numbers (strings) — unit label applied at render time */
  var PERSONAS = {
    realtors: {
      name: 'Realtors',
      icon: 'home',
      US: {
        distance:  '20,000 miles',
        deduction: '$14,500',
        heroStat:  '$14,500',
        trips: [
          { date:'05/02', route:'Home → 142 Maple St · Showing',         dist:'14.2', amount:'10.30' },
          { date:'05/02', route:'Office → Lakeside Dr · Open house',     dist:'18.3', amount:'13.27' },
          { date:'05/03', route:'Client A → Client B · Buyer tour',      dist:'11.7', amount:'8.48'  },
          { date:'05/03', route:'MLS Office → Staging address',               dist:'9.1',  amount:'6.60'  },
        ],
      },
      CA: {
        distance:  '32,000 km',
        deduction: '$23,500',
        heroStat:  '$23,500',
        trips: [
          { date:'05/02', route:'Home → 142 Maple St · Showing',              dist:'22.8', amount:'16.64' },
          { date:'05/02', route:'Office → Lakeshore Blvd · Open house',       dist:'29.5', amount:'21.54' },
          { date:'05/03', route:'Client A → Client B · Buyer tour',           dist:'18.8', amount:'13.72' },
          { date:'05/03', route:'MLS Office → Staging address',                    dist:'14.6', amount:'10.66' },
        ],
      },
    },

    rideshare: {
      name: 'Rideshare & Delivery',
      icon: 'car',
      US: {
        distance:  '18,000 miles',
        deduction: '$13,050',
        heroStat:  '$13,050',
        trips: [
          { date:'05/02', route:'Pickup Zone A → Drop-off · DoorDash', dist:'8.4',  amount:'6.09'  },
          { date:'05/02', route:'Deadhead → Surge Zone',                    dist:'3.2',  amount:'2.32'  },
          { date:'05/02', route:'Pickup Zone B → Airport',                  dist:'22.1', amount:'16.02' },
          { date:'05/03', route:'Starbucks → Pickup Zone A',                dist:'1.8',  amount:'1.30'  },
        ],
      },
      CA: {
        distance:  '29,000 km',
        deduction: '$21,150',
        heroStat:  '$21,150',
        trips: [
          { date:'05/02', route:'Pickup Zone A → Drop-off · DoorDash', dist:'13.5', amount:'9.86'  },
          { date:'05/02', route:'Deadhead → Surge Zone',                    dist:'5.1',  amount:'3.72'  },
          { date:'05/02', route:'Pickup Zone B → YVR Airport',              dist:'35.6', amount:'25.99' },
          { date:'05/03', route:'Tim Hortons → Pickup Zone A',              dist:'2.9',  amount:'2.12'  },
        ],
      },
    },

    freelancers: {
      name: 'Freelancers & Consultants',
      icon: 'laptop',
      US: {
        distance:  '8,000 miles',
        deduction: '$5,800',
        heroStat:  '$5,800',
        trips: [
          { date:'05/02', route:'Home → Acme Corp · Consulting',           dist:'12.1', amount:'8.77'  },
          { date:'05/02', route:'Acme Corp → Starbucks · Client meeting',  dist:'4.2',  amount:'3.05'  },
          { date:'05/03', route:'Home → Startup HQ · Workshop',            dist:'18.7', amount:'13.56' },
          { date:'05/03', route:'Startup HQ → Home office',                     dist:'18.7', amount:'13.56' },
        ],
      },
      CA: {
        distance:  '12,900 km',
        deduction: '$9,400',
        heroStat:  '$9,400',
        trips: [
          { date:'05/02', route:'Home → Bay Street Office · Consulting',  dist:'19.5', amount:'14.24' },
          { date:'05/02', route:'Bay St → Tim Hortons · Client meeting',  dist:'6.8',  amount:'4.96'  },
          { date:'05/03', route:'Home → Startup HQ · Workshop',           dist:'30.1', amount:'21.97' },
          { date:'05/03', route:'Startup HQ → Home office',                    dist:'30.1', amount:'21.97' },
        ],
      },
    },

    'small-business': {
      name: 'Small Business Owners',
      icon: 'storefront',
      US: {
        distance:  '12,000 miles',
        deduction: '$8,700',
        heroStat:  '$8,700',
        trips: [
          { date:'05/02', route:'Storefront → Supplier · Restocking',  dist:'9.4',  amount:'6.82'  },
          { date:'05/02', route:'Office → Bank · Deposit run',          dist:'2.1',  amount:'1.52'  },
          { date:'05/03', route:'Warehouse → Second location',               dist:'14.8', amount:'10.73' },
          { date:'05/03', route:'Office → Equipment rental',                 dist:'7.2',  amount:'5.22'  },
        ],
      },
      CA: {
        distance:  '19,300 km',
        deduction: '$14,100',
        heroStat:  '$14,100',
        trips: [
          { date:'05/02', route:'Storefront → Supplier · Restocking',  dist:'15.1', amount:'11.02' },
          { date:'05/02', route:'Office → Bank · Deposit run',          dist:'3.4',  amount:'2.48'  },
          { date:'05/03', route:'Warehouse → Second location',               dist:'23.8', amount:'17.37' },
          { date:'05/03', route:'Office → Equipment rental',                 dist:'11.6', amount:'8.47'  },
        ],
      },
    },

    construction: {
      name: 'Construction & Trades',
      icon: 'hardhat',
      US: {
        distance:  '18,000 miles',
        deduction: '$13,050',
        heroStat:  '$13,050',
        trips: [
          { date:'05/02', route:'Yard → Job Site · Materials run',   dist:'22.1', amount:'16.02' },
          { date:'05/02', route:'Site A → Site B · Equipment',        dist:'8.7',  amount:'6.31'  },
          { date:'05/03', route:'Yard → Hardware supply',                  dist:'11.4', amount:'8.27'  },
          { date:'05/03', route:'Site B → Subcontractor meeting',          dist:'5.3',  amount:'3.84'  },
        ],
      },
      CA: {
        distance:  '29,000 km',
        deduction: '$21,150',
        heroStat:  '$21,150',
        trips: [
          { date:'05/02', route:'Yard → Job Site · Materials run',   dist:'35.6', amount:'25.99' },
          { date:'05/02', route:'Site A → Site B · Equipment',        dist:'14.0', amount:'10.22' },
          { date:'05/03', route:'Yard → Home Depot · Supplies',       dist:'18.3', amount:'13.36' },
          { date:'05/03', route:'Site B → Subcontractor meeting',          dist:'8.5',  amount:'6.21'  },
        ],
      },
    },

    'sales-reps': {
      name: 'Sales Reps & Field Service',
      icon: 'territory',
      US: {
        distance:  '24,000 miles',
        deduction: '$17,400',
        heroStat:  '$17,400',
        trips: [
          { date:'05/02', route:'Office → Acme Corp · Sales call',        dist:'31.2', amount:'22.62' },
          { date:'05/02', route:'Acme Corp → Westside Pharma · Demo',     dist:'18.4', amount:'13.34' },
          { date:'05/03', route:'Office → Airport · Conference',           dist:'24.7', amount:'17.91' },
          { date:'05/03', route:'Hotel → Territory south · Cold calls',   dist:'42.1', amount:'30.52' },
        ],
      },
      CA: {
        distance:  '38,600 km',
        deduction: '$28,200',
        heroStat:  '$28,200',
        trips: [
          { date:'05/02', route:'Office → Bay St Corp · Sales call',      dist:'50.2', amount:'36.65' },
          { date:'05/02', route:'Bay St → Westside Inc · Demo',           dist:'29.6', amount:'21.61' },
          { date:'05/03', route:'Office → YYZ Airport · Conference',      dist:'39.7', amount:'28.98' },
          { date:'05/03', route:'Hotel → Territory south · Cold calls',   dist:'67.8', amount:'49.49' },
        ],
      },
    },
  };

  /* ── Public API ──────────────────────────────────────────────────────── */
  function get() {
    try { return localStorage.getItem(KEY) || 'US'; } catch (e) { return 'US'; }
  }

  function set(r) {
    try { localStorage.setItem(KEY, r); } catch (e) {}
    try { document.documentElement.setAttribute('data-locale', r.toLowerCase()); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('mm-locale-change', { detail: { locale: r } })); } catch (e) {}
  }

  window.MM = { get: get, set: set, strings: STRINGS, personas: PERSONAS };

  /* Apply data-locale immediately so CSS [data-locale] selectors work on first paint */
  try { document.documentElement.setAttribute('data-locale', get().toLowerCase()); } catch (e) {}
})();
