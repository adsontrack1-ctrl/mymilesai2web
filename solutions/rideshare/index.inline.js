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
}, "94%")), React.createElement("div", {
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
}, "6%"))), React.createElement("div", {
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
  slug: 'rideshare',
  heroSub: s => `Captures every deadhead mile, multi-app drive, and delivery run automatically. ${s.auditLabel} log — ready for ${s.scheduleForm} in one tap.`,
  features: [(s, p) => ({
    eyebrow: '— Deadhead capture',
    h: 'Every mile between rides is worth money too.',
    p: `Most rideshare drivers only log active-ride miles. MyMilesAI captures every deadhead and repositioning mile automatically — the ones most apps miss.`,
    stat: p.deduction,
    statLabel: 'estimated annual deduction for full-time rideshare drivers',
    visual: React.createElement(RouteVisual, {
      from: "Pickup Zone A",
      to: "Drop-off",
      context: "DoorDash",
      dist: "8.4",
      unit: s.unitShort,
      amount: "6.09"
    }),
    visualBg: '#EFF3FF'
  }), s => ({
    eyebrow: '— Multi-app support',
    h: 'Uber, Lyft, DoorDash, Instacart — one continuous log.',
    p: "Switch between apps mid-shift and MyMilesAI keeps a single, unbroken mileage log. No manual switching, no gaps, no missed miles regardless of which platform you're on.",
    visual: React.createElement(ClassifyVisual, {
      bizLabel: "Rideshare delivery"
    }),
    visualBg: '#F0FDF4'
  }), (s, p) => ({
    eyebrow: '— Tax-ready exports',
    h: `${s.scheduleForm} ready — one tap.`,
    p: `Export a complete, verified mileage log your accountant can file directly. ${s.auditLabel} · timestamps, totals, and per-trip records — no spreadsheet required.`,
    visual: React.createElement(DeductVisual, {
      deduction: p.deduction,
      distance: p.distance,
      complianceLabel: s.complianceLabel,
      form2: s.form2
    }),
    visualBg: '#FFFBEB'
  })],
  faqs: [{
    q: 'Does it capture deadhead miles?',
    a: 'Yes — every mile from drop-off to next pickup is logged automatically, not just active-ride miles.'
  }, {
    q: 'Can I use it across Uber and DoorDash on the same shift?',
    a: 'Yes. MyMilesAI logs continuous mileage regardless of which app you are actively using.'
  }, {
    q: s => `What rate is applied to my deduction?`,
    a: s => `${s.rate}. Your log and deduction total are calculated automatically at the current rate.`
  }, {
    q: 'Do I need to manually tag trip types?',
    a: 'No. The AI classifies business vs. personal automatically based on your driving patterns and time of day.'
  }]
  // Customer testimonials are intentionally omitted until we have real, consented
  // quotes on file. SolTestimonial returns null when none is provided.
};
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(SolPersonaPage, {
  persona: PERSONA
}));