const FeatVisAutoDetect = () => React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
    fontSize: 13
  }
}, React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}, React.createElement("span", {
  style: {
    letterSpacing: '0.15em',
    color: 'rgba(248,249,250,0.6)'
  }
}, "\u25CF Background tracking"), React.createElement("span", {
  style: {
    color: 'rgba(248,249,250,0.4)'
  }
}, "09:41:08")), React.createElement("div", {
  style: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}, React.createElement("svg", {
  viewBox: "0 0 400 220",
  style: {
    width: '100%',
    maxWidth: 500
  }
}, React.createElement("path", {
  d: "M 30 180 Q 100 50, 180 120 T 370 60",
  fill: "none",
  stroke: "#1B4DDB",
  strokeWidth: "3",
  strokeDasharray: "6 6",
  strokeLinecap: "round"
}), React.createElement("circle", {
  cx: "30",
  cy: "180",
  r: "8",
  fill: "#F8F9FA"
}), React.createElement("circle", {
  cx: "370",
  cy: "60",
  r: "10",
  fill: "#1B4DDB"
}))), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 16,
    paddingTop: 16,
    borderTop: '1px solid rgba(248,249,250,0.15)'
  }
}, [['Distance', '4.2 mi'], ['Duration', '11 min'], ['Status', 'Auto-logged']].map(([k, v]) => React.createElement("div", {
  key: k
}, React.createElement("div", {
  style: {
    color: 'rgba(248,249,250,0.5)',
    marginBottom: 4,
    fontSize: 9,
    letterSpacing: '0.1em'
  }
}, k), React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 20,
    color: '#F8F9FA'
  }
}, v)))));
const FeatVisClassify = () => React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  }
}, [{
  f: 'Home',
  t: 'Downtown Office',
  m: '12.1',
  cls: 'biz',
  auto: true
}, {
  f: 'Downtown Office',
  t: 'Client — Acme Corp',
  m: '4.2',
  cls: 'biz',
  auto: true
}, {
  f: 'Acme Corp',
  t: 'Starbucks',
  m: '0.8',
  cls: 'pers',
  auto: false
}, {
  f: 'Starbucks',
  t: 'Office',
  m: '1.1',
  cls: 'biz',
  auto: true
}].map((t, i) => React.createElement("div", {
  key: i,
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 14,
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 12
  }
}, React.createElement("div", {
  style: {
    flex: 1
  }
}, React.createElement("div", {
  style: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 2
  }
}, t.f, " \u2192 ", t.t), React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 20
  }
}, t.m, " mi")), React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }
}, t.auto && React.createElement("span", {
  style: {
    fontSize: 9,
    color: '#1B4DDB',
    fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
    letterSpacing: '0.1em'
  }
}, "AI"), React.createElement("span", {
  style: {
    padding: '6px 12px',
    borderRadius: 100,
    background: t.cls === 'biz' ? '#1B4DDB' : '#E5E7EB',
    color: t.cls === 'biz' ? '#FFFFFF' : '#374151',
    fontSize: 11,
    fontWeight: 500
  }
}, t.cls === 'biz' ? 'Business' : 'Personal')))));
const FeatVisAudit = () => React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 14,
    padding: 24,
    fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
    fontSize: 12,
    overflow: 'hidden'
  }
}, React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", null, React.createElement("div", {
  style: {
    color: '#6B7280',
    marginBottom: 4
  }
}, "Mileage Summary \u2014 2026"), React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 18
  }
}, "Mileage Log \xB7 Q1 Summary")), React.createElement("div", {
  style: {
    padding: '6px 10px',
    background: '#1B4DDB',
    color: '#FFFFFF',
    borderRadius: 100,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.1em'
  }
}, "\u2713 Verified")), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 60px 60px',
    gap: 8,
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10
  }
}, React.createElement("div", null, "Date"), React.createElement("div", null, "Route"), React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, "Miles"), React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, "$")), [['01/04', 'Home → Client A · Sales call', '24.1', '17.47'], ['01/04', 'Client A → Client B · Consult', '12.8', '9.28'], ['01/05', 'Home → Warehouse · Supplies', '8.4', '6.09'], ['01/06', 'Office → Airport · Conference', '31.2', '22.62']].map((r, i) => React.createElement("div", {
  key: i,
  style: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 60px 60px',
    gap: 8,
    padding: '8px 0',
    borderBottom: '1px solid #F0F0F0',
    fontSize: 13
  }
}, React.createElement("div", null, r[0]), React.createElement("div", {
  style: {
    color: '#111827'
  }
}, r[1]), React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, r[2]), React.createElement("div", {
  style: {
    textAlign: 'right',
    color: '#1B4DDB'
  }
}, "$", r[3]))), React.createElement("div", {
  style: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid #111827',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  }
}, React.createElement("span", {
  style: {
    color: '#6B7280'
  }
}, "Illustrative \xB7 Sample export"), React.createElement("span", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: '#6B7280'
  }
}, "Your numbers will differ")));
const FeatFeatures = () => {
  const feats = [{
    k: 'Auto GPS tracking',
    h: 'Start driving. That\'s it.',
    p: 'No buttons to press. No app to open. MyMilesAI detects motion via GPS and accelerometer, logs your trip silently even when your phone is locked, and does it all on less battery than a 2-minute phone call. Every mile captured is a deductible mile you would have forgotten.',
    stat: 'Auto',
    label: 'no taps required to start a trip',
    visBg: '#0B0F0E',
    visColor: '#F8F9FA',
    vis: React.createElement(FeatVisAutoDetect, null)
  }, {
    k: 'AI trip classification',
    h: 'Swipe right for business. Left for personal.',
    p: 'Review trips at end of day — takes about 12 seconds. Swipe right for Business, left for Personal. The AI learns your routes after a week and auto-classifies recurring trips. Client office every Tuesday? Classified. Regular supply run? Done.',
    stat: '12s',
    label: 'daily review time after first week',
    visBg: '#FAFAFA',
    visColor: '#111827',
    visBorder: '1px solid #E5E7EB',
    vis: React.createElement(FeatVisClassify, null)
  }, {
    k: 'Tax-ready exports',
    h: 'One tap. Tax-ready. Done.',
    p: 'One tap exports a PDF with all four required elements: date, destination, business purpose, and miles. Or export CSV for QuickBooks, Xero, FreshBooks, or Wave. Tax rates auto-applied based on your country setting.',
    stat: '4/4',
    label: 'required elements captured',
    visBg: '#FFFFFF',
    visColor: '#111827',
    vis: React.createElement(FeatVisAudit, null)
  }];
  return React.createElement("div", null, feats.map((f, i) => React.createElement("div", {
    key: f.k,
    className: "f-section"
  }, React.createElement("div", {
    className: "f-grid"
  }, React.createElement("div", {
    className: "f-copy",
    style: {
      order: i % 2 === 0 ? 1 : 2
    }
  }, React.createElement("div", {
    className: "f-copy-label"
  }, "\u2014 ", f.k), React.createElement("h2", null, f.h), React.createElement("p", null, f.p), React.createElement("div", {
    className: "f-stat"
  }, React.createElement("div", {
    className: "f-stat-num"
  }, f.stat), React.createElement("div", {
    className: "f-stat-lbl"
  }, f.label))), React.createElement("div", {
    className: "f-visual",
    style: {
      order: i % 2 === 0 ? 2 : 1,
      background: f.visBg,
      border: f.visBorder || 'none',
      color: f.visColor
    }
  }, f.vis)))));
};
const FeatAdditional = () => {
  const items = [{
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 28,
      height: 28,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M12 2L13.5 6.5H19L14.5 9.5L16 14L12 11L8 14L9.5 9.5L5 6.5H10.5Z"
    })),
    title: 'Real-Time Deduction Counter',
    desc: 'Watch your tax savings grow with every mile. The app shows you a live counter of your estimated deduction at $0.725/mile (or $0.73/km for Canada). At the end of the year, you\'ll know exactly what you\'re claiming before you sit down with your accountant.'
  }, {
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 28,
      height: 28,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M12 2L13 3V10L17 8L18 9L13 12V22H11V12L6 9L7 8L11 10V3L12 2Z"
    })),
    title: 'Works Offline',
    desc: 'No signal? No problem. MyMilesAI logs trips even without an internet connection. Trips sync automatically when you\'re back online. Great for rural routes, tunnels, and areas with spotty coverage.'
  }, {
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 28,
      height: 28,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M12 2a10 10 0 100 20A10 10 0 0012 2z"
    }), React.createElement("path", {
      d: "M2 12h20M12 2a14 14 0 010 20M12 2a14 14 0 000 20"
    })),
    title: 'Privacy-First',
    desc: 'Trip classification runs on your device. Your trip records sync encrypted to your own private cloud account so your history follows you across phones. Your data is never sold, never used for advertising, and never shared with data brokers. We make money from subscriptions, not from your location history.'
  }, {
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 28,
      height: 28,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2M9 21a2 2 0 100-4 2 2 0 000 4M20 21a2 2 0 100-4 2 2 0 000 4"
    })),
    title: 'Multi-Vehicle Support',
    desc: 'Company car Monday, personal car Friday? Track across multiple vehicles and MyMilesAI keeps the records separate. Perfect for people who drive different vehicles throughout the week.'
  }, {
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 28,
      height: 28,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34"
    }), React.createElement("polygon", {
      points: "18 2 22 6 12 16 8 16 8 12 18 2"
    })),
    title: 'Client & Purpose Tagging',
    desc: 'Tag trips by client, project, or purpose. When your accountant asks "what were all your trips to Acme Corp?" you can pull that report in two taps. Organized records make tax time actually bearable.'
  }, {
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 28,
      height: 28,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), React.createElement("path", {
      d: "M2 12h20M12 2a14 14 0 010 20M12 2a14 14 0 000 20"
    })),
    title: 'Country-aware tax rates',
    desc: 'Set your country in Settings and the app applies the right tax rate and units automatically — miles or kilometres, with the right standard mileage rate baked in. Built-in coverage for the US, Canada, UK, Australia, Germany, France, Ireland, Netherlands, and India.'
  }];
  return React.createElement("section", {
    className: "f-more"
  }, React.createElement("div", {
    className: "f-more-inner"
  }, React.createElement("div", {
    className: "f-more-label"
  }, "\u2014 More features"), React.createElement("h2", null, "Everything else you'd expect \u2014", React.createElement("br", null), "and a few things you wouldn't."), React.createElement("div", {
    className: "f-cards"
  }, items.map((item, i) => React.createElement("div", {
    key: i,
    className: "f-card"
  }, React.createElement("div", {
    className: "f-card-icon"
  }, item.icon), React.createElement("h3", null, item.title), React.createElement("p", null, item.desc))))));
};
const FeatCTA = () => React.createElement("section", {
  className: "f-cta"
}, React.createElement("div", {
  className: "f-cta-inner"
}, React.createElement("div", {
  className: "f-cta-label"
}, "\u2014 Start today"), React.createElement("h2", null, "The next mile you drive", React.createElement("br", null), "could be ", React.createElement("span", {
  style: {
    color: '#C9A96E'
  }
}, "deductible.")), React.createElement("p", null, "Your first 7 days are free. Cancel anytime from the app."), React.createElement("a", {
  href: "signup/",
  className: "f-cta-btn"
}, "Start Free Trial", React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: 16,
  height: 16,
  fill: "none"
}, React.createElement("path", {
  d: "M3 8H13M8 3L13 8L8 13",
  stroke: "white",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})))));
const Site = () => React.createElement(React.Fragment, null, React.createElement(MSNav, null), React.createElement("section", {
  className: "f-hero"
}, React.createElement("div", {
  className: "eyebrow"
}, "\u2014 Features"), React.createElement("h1", null, "Everything you need to claim every mile."), React.createElement("p", null, "Auto GPS tracking, AI classification, tax-ready exports, and 6 more features built specifically for self-employed professionals who drive for work and need records that hold up at tax time."), React.createElement("div", {
  style: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '2rem'
  }
}, React.createElement("a", {
  href: "signup/",
  style: {
    background: '#1B4DDB',
    color: '#FFFFFF',
    padding: '15px 30px',
    borderRadius: 100,
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 12px 28px -10px rgba(27,77,219,0.45)',
    whiteSpace: 'nowrap'
  }
}, "Start Free Trial", React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: 13,
  height: 13,
  fill: "none",
  "aria-hidden": "true"
}, React.createElement("path", {
  d: "M3 8H13M8 3L13 8L8 13",
  stroke: "#fff",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}))), React.createElement("a", {
  href: "pricing.html",
  style: {
    background: '#FFFFFF',
    color: '#0B0F0E',
    border: '1px solid #E5E7EB',
    padding: '14px 26px',
    borderRadius: 100,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    whiteSpace: 'nowrap'
  }
}, "See Pricing")), React.createElement("div", {
  style: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 16,
    fontFamily: "'DM Sans',system-ui,sans-serif"
  }
}, "7 days free. Cancel anytime. \xB7 Multi-region")), React.createElement(FeatFeatures, null), React.createElement(FeatAdditional, null), React.createElement(FeatCTA, null), React.createElement(MSFooter, null));
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Site, null));