const RouteVisual = ({
  from,
  to,
  context,
  dist,
  unit,
  amount
}) => React.createElement("div", {
  style: {
    padding: '18px 16px',
    fontFamily: "'DM Sans',system-ui,sans-serif"
  }
}, React.createElement("div", {
  style: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6B7280',
    letterSpacing: '0.06em',
    marginBottom: 12
  }
}, "TRIP DETECTED"), React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column'
  }
}, React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 6
  }
}, React.createElement("div", {
  style: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#1B4DDB',
    flexShrink: 0
  }
}), React.createElement("span", {
  style: {
    fontSize: 13,
    color: '#111827',
    fontWeight: 600
  }
}, from)), React.createElement("div", {
  style: {
    borderLeft: '1.5px dashed #C7D6FB',
    marginLeft: '3.5px',
    height: 20
  }
}), React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingTop: 6
  }
}, React.createElement("div", {
  style: {
    width: 8,
    height: 8,
    borderRadius: 2,
    background: '#C9A96E',
    flexShrink: 0
  }
}), React.createElement("span", {
  style: {
    fontSize: 13,
    color: '#111827',
    fontWeight: 600
  }
}, to, " \xB7 ", context))), React.createElement("div", {
  style: {
    marginTop: 12,
    padding: '8px 12px',
    background: '#EFF3FF',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}, React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1B4DDB'
  }
}, "\u2713 Auto-logged"), React.createElement("span", {
  style: {
    fontSize: 12,
    color: '#1B4DDB',
    fontWeight: 600
  }
}, dist, " ", unit, " \xB7 $", amount)));
const ClassifyVisual = ({
  bizLabel
}) => React.createElement("div", {
  style: {
    padding: '18px 16px',
    fontFamily: "'DM Sans',system-ui,sans-serif"
  }
}, React.createElement("div", {
  style: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6B7280',
    letterSpacing: '0.06em',
    marginBottom: 12
  }
}, "AI CLASSIFICATION"), React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  }
}, React.createElement("div", {
  style: {
    padding: '9px 12px',
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}, React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 700,
    color: '#16A34A'
  }
}, "\u2713 Business \u2014 ", bizLabel), React.createElement("span", {
  style: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: 600
  }
}, "95%")), React.createElement("div", {
  style: {
    padding: '9px 12px',
    background: '#F8F9FA',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}, React.createElement("span", {
  style: {
    fontSize: 12,
    color: '#6B7280'
  }
}, "Personal \u2014 Errand"), React.createElement("span", {
  style: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 600
  }
}, "5%"))), React.createElement("div", {
  style: {
    marginTop: 10,
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 1.5
  }
}, "No manual tagging. AI handles classification automatically."));
const DeductVisual = ({
  deduction,
  distance,
  complianceLabel,
  form2
}) => React.createElement("div", {
  style: {
    padding: '20px 16px',
    fontFamily: "'DM Sans',system-ui,sans-serif",
    textAlign: 'center'
  }
}, React.createElement("div", {
  style: {
    fontSize: 10,
    fontWeight: 700,
    color: '#6B7280',
    letterSpacing: '0.06em',
    marginBottom: 14
  }
}, "ANNUAL DEDUCTION"), React.createElement("div", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(1.75rem,3vw,2.25rem)',
    color: '#C9A96E',
    lineHeight: 1,
    marginBottom: 4
  }
}, deduction), React.createElement("div", {
  style: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16
  }
}, distance, " / year"), React.createElement("div", {
  style: {
    display: 'flex',
    gap: 6,
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
}, React.createElement("span", {
  style: {
    fontSize: 10,
    padding: '4px 10px',
    background: '#EFF3FF',
    color: '#1B4DDB',
    borderRadius: 100,
    fontWeight: 600,
    border: '1px solid #C7D6FB'
  }
}, complianceLabel), React.createElement("span", {
  style: {
    fontSize: 10,
    padding: '4px 10px',
    background: '#EFF3FF',
    color: '#1B4DDB',
    borderRadius: 100,
    fontWeight: 600,
    border: '1px solid #C7D6FB'
  }
}, form2, " ready")));
const PERSONA = {
  slug: 'small-business',
  heroSub: s => `Tracks every supplier run, bank deposit, and delivery automatically. ${s.auditLabel} logs for every vehicle — no paperwork required.`,
  features: [(s, p) => ({
    eyebrow: '— Every business run',
    h: 'Never lose a supplier run, deposit, or delivery again.',
    p: `MyMilesAI detects every drive the moment you leave. Supplier runs, bank deposits, equipment pickups — all captured automatically at the ${s.rateShort} rate with no manual logging.`,
    stat: p.deduction,
    statLabel: 'estimated annual deduction for small business owners',
    visual: React.createElement(RouteVisual, {
      from: "Storefront",
      to: "Supplier",
      context: "Restocking",
      dist: "9.4",
      unit: s.unitShort,
      amount: "6.82"
    }),
    visualBg: '#EFF3FF'
  }), s => ({
    eyebrow: '— Multiple locations',
    h: 'Tracks across your storefront, warehouse, and second location.',
    p: "Set multiple business locations as home bases. MyMilesAI correctly classifies drives between any of your locations as business miles — no manual overrides needed.",
    visual: React.createElement(ClassifyVisual, {
      bizLabel: "Supplier run"
    }),
    visualBg: '#F0FDF4'
  }), (s, p) => ({
    eyebrow: '— Tax-ready exports',
    h: 'Accountant-ready reports in one tap.',
    p: `Export ${s.complianceLabel} mileage logs covering every vehicle and every run. ${s.form2} ready — organized by date, route, and amount, all verified.`,
    visual: React.createElement(DeductVisual, {
      deduction: p.deduction,
      distance: p.distance,
      complianceLabel: s.complianceLabel,
      form2: s.form2
    }),
    visualBg: '#FFFBEB'
  })],
  faqs: [{
    q: 'Can I track multiple vehicles?',
    a: 'Yes. MyMilesAI supports multiple vehicles under one account, each with their own separate log.'
  }, {
    q: 'Can I separate personal and business miles on the same vehicle?',
    a: 'Yes. MyMilesAI classifies each drive as business or personal. Only business miles count toward your deduction.'
  }, {
    q: s => `Which mileage rate applies?`,
    a: s => `${s.rate}. All deduction totals are calculated automatically using the current rate.`
  }, {
    q: 'What if employees drive for business too?',
    a: 'Each driver can use their own account. Mileage logs remain separate and exportable per driver.'
  }],
  testimonial: {
    quote: "I run three locations and two delivery vehicles. MyMilesAI keeps everything straight — my accountant said my mileage records are the cleanest she's ever seen.",
    name: "James O.",
    role: "Owner, Riverside Supply Co. · Portland, OR",
    initials: "JO"
  }
};
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(SolPersonaPage, {
  persona: PERSONA
}));