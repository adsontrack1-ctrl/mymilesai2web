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
  slug: 'sales-reps',
  heroSub: s => `Logs every account visit, cold-call run, and territory drive automatically. ${s.auditLabel} records — organized the way your expense reports need them.`,
  features: [(s, p) => ({
    eyebrow: '— Territory tracking',
    h: 'Every account visit logged — even the cold-call sweeps.',
    p: `MyMilesAI captures every mile across your territory — client visits, demos, conference drives, multi-stop cold-call routes. All at the ${s.rateShort} rate, automatically, no manual entries.`,
    stat: p.deduction,
    statLabel: 'estimated annual deduction for field sales reps',
    visual: React.createElement(RouteVisual, {
      from: "Office",
      to: "Acme Corp",
      context: "Sales call",
      dist: "31.2",
      unit: s.unitShort,
      amount: "22.62"
    }),
    visualBg: '#EFF3FF'
  }), s => ({
    eyebrow: '— Multi-stop routes',
    h: 'Five accounts in one afternoon? Every leg captured.',
    p: "Multi-stop territory runs are logged precisely — A to B to C to D. No gaps, no guessing. Each leg recorded with the exact distance and deductible amount.",
    visual: React.createElement(ClassifyVisual, {
      bizLabel: "Client visit"
    }),
    visualBg: '#F0FDF4'
  }), (s, p) => ({
    eyebrow: '— Expense-ready exports',
    h: 'Expense reports and tax filings — one export.',
    p: `Export ${s.complianceLabel} mileage logs filtered by date, account, or territory. ${s.form2} ready or formatted for reimbursement — whichever you need.`,
    visual: React.createElement(DeductVisual, {
      deduction: p.deduction,
      distance: p.distance,
      complianceLabel: s.complianceLabel,
      form2: s.form2
    }),
    visualBg: '#FFFBEB'
  })],
  faqs: [{
    q: 'Can I separate miles by account or territory?',
    a: 'Yes — tag drives by account and filter exports by any tag. Clean reports for any territory structure.'
  }, {
    q: 'What about conference and airport drives?',
    a: 'Fully captured. Any drive for business — conference, airport, client dinner — is logged automatically.'
  }, {
    q: s => `What rate does my mileage log use?`,
    a: s => `${s.rate}. Applied automatically to every business mile.`
  }, {
    q: 'Can I use this for both personal deductions and employer reimbursement?',
    a: 'Yes — export filtered logs for reimbursement and a full log for your annual tax filing. Two reports, one log.'
  }]
  // Customer testimonials are intentionally omitted until we have real, consented
  // quotes on file. SolTestimonial returns null when none is provided.
};
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(SolPersonaPage, {
  persona: PERSONA
}));