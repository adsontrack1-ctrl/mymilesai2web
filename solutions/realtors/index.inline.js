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
}, "97%")), React.createElement("div", {
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
}, "3%"))), React.createElement("div", {
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
  slug: 'realtors',
  heroSub: s => `MyMilesAI automatically logs every showing, open house, and client drive. ${s.auditLabel} records exported in one tap — no spreadsheets, no memory required.`,
  features: [(s, p) => ({
    eyebrow: '— Auto-detection',
    h: 'Every showing logged the moment you leave.',
    p: `Stop relying on memory at tax time. MyMilesAI detects when you start driving to a showing or open house and captures every ${s.unit} automatically at the ${s.rateShort} rate — before you park.`,
    stat: p.deduction,
    statLabel: 'estimated annual deduction for active realtors',
    visual: React.createElement(RouteVisual, {
      from: "Home",
      to: "142 Maple St",
      context: "Showing",
      dist: "14.2",
      unit: s.unitShort,
      amount: "10.30"
    }),
    visualBg: '#EFF3FF'
  }), s => ({
    eyebrow: '— AI classification',
    h: "The app knows it's a client visit — not a personal errand.",
    p: "MyMilesAI reads your route context — time of day, location patterns, frequency — and separates client drives from personal trips automatically. No tagging required.",
    visual: React.createElement(ClassifyVisual, {
      bizLabel: "Showing"
    }),
    visualBg: '#F0FDF4'
  }), (s, p) => ({
    eyebrow: '— Compliance exports',
    h: `One-tap export. ${s.formHeader} ready.`,
    p: `Export your complete mileage log in a format your accountant recognizes instantly. ${s.auditLabel} · ${s.form2} ready · timestamp-verified.`,
    visual: React.createElement(DeductVisual, {
      deduction: p.deduction,
      distance: p.distance,
      complianceLabel: s.complianceLabel,
      form2: s.form2
    }),
    visualBg: '#FFFBEB'
  })],
  faqs: [{
    q: s => `What mileage rate does MyMilesAI use?`,
    a: s => `${s.rate}. The rate is updated each January automatically.`
  }, {
    q: 'Does it capture miles driven between showings?',
    a: 'Yes — every leg is logged, including client A to client B drives that happen back-to-back.'
  }, {
    q: 'What about open house weekends?',
    a: 'MyMilesAI runs 24/7 and captures weekend drives the same as weekdays.'
  }, {
    q: 'Does the log have what tax filing needs?',
    a: s => `Exports include timestamps, start/end addresses, and total ${s.unit} — the four required elements for a mileage record (date, destination, business purpose, and miles driven).`
  }, {
    q: 'Do I need to tag every trip?',
    a: 'No. The AI handles classification. You can review trips in the app, but tagging is never required.'
  }]
  // Customer testimonials are intentionally omitted until we have real, consented
  // quotes on file. SolTestimonial in sol-parts.jsx returns null when no
  // testimonial is provided, so the page collapses gracefully.
};
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(SolPersonaPage, {
  persona: PERSONA
}));