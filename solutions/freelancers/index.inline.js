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
}, "96%")), React.createElement("div", {
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
}, "Personal \u2014 Commute"), React.createElement("span", {
  style: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: 600
  }
}, "4%"))), React.createElement("div", {
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
  slug: 'freelancers',
  heroSub: s => `MyMilesAI logs every client visit, coworking trip, and conference drive automatically. ${s.auditLabel} records — organized by project if you need them.`,
  features: [(s, p) => ({
    eyebrow: '— Client trip logging',
    h: 'Every client drive logged — no manual entry ever.',
    p: `MyMilesAI detects when you leave for a client meeting and captures every ${s.unit} automatically. No app-switching, no manual entries, no forgotten trips at quarter end.`,
    stat: p.deduction,
    statLabel: 'estimated annual deduction for active consultants',
    visual: React.createElement(RouteVisual, {
      from: "Home",
      to: "Acme Corp",
      context: "Consulting",
      dist: "12.1",
      unit: s.unitShort,
      amount: "8.77"
    }),
    visualBg: '#EFF3FF'
  }), s => ({
    eyebrow: '— AI classification',
    h: 'The app separates client drives from personal trips automatically.',
    p: "MyMilesAI learns your patterns — regular client locations, coworking spaces, conference centers — and correctly classifies business drives without any tagging from you.",
    visual: React.createElement(ClassifyVisual, {
      bizLabel: "Client visit"
    }),
    visualBg: '#F0FDF4'
  }), (s, p) => ({
    eyebrow: '— Exports',
    h: 'Invoice-ready. Accountant-ready.',
    p: `Export mileage logs filtered by client, project, or date range. Your accountant gets a verified report that covers every mile — down to the cent.`,
    visual: React.createElement(DeductVisual, {
      deduction: p.deduction,
      distance: p.distance,
      complianceLabel: s.complianceLabel,
      form2: s.form2
    }),
    visualBg: '#FFFBEB'
  })],
  faqs: [{
    q: 'Can I organize miles by client or project?',
    a: 'Yes — you can tag and filter trips by client or project for clean billing and reporting at any time.'
  }, {
    q: 'What if I work from multiple home offices?',
    a: 'You can set multiple home base locations. MyMilesAI tracks from whichever origin you start from each day.'
  }, {
    q: s => `What mileage rate is applied?`,
    a: s => `${s.rate}. Applied automatically to every logged business mile.`
  }, {
    q: 'Does it work with an irregular schedule?',
    a: 'Yes. There is no fixed schedule required — MyMilesAI detects every drive automatically, any day or time.'
  }]
  // Customer testimonials are intentionally omitted until we have real, consented
  // quotes on file. SolTestimonial returns null when none is provided.
};
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(SolPersonaPage, {
  persona: PERSONA
}));