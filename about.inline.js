const AboutPage = () => React.createElement(React.Fragment, null, React.createElement("section", {
  style: {
    padding: '96px 56px 72px',
    background: '#F8F9FA',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#1B4DDB',
    marginBottom: 24
  }
}, "\u2014 About MyMilesAI"), React.createElement("h1", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(32px,4vw,56px)',
    lineHeight: 1.06,
    letterSpacing: '-0.03em',
    maxWidth: 780,
    marginBottom: 24
  }
}, "Built by people who got tired of losing deductions."), React.createElement("p", {
  style: {
    fontSize: 20,
    lineHeight: 1.65,
    color: '#374151',
    maxWidth: 640
  }
}, "We drove for work. We forgot to log. We lost thousands at tax time \u2014 and we knew exactly where the money went. Just nowhere. Unclaimed. Gone.")), React.createElement("section", {
  style: {
    padding: '80px 56px',
    background: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: 80,
    maxWidth: 1100,
    margin: '0 auto',
    alignItems: 'start'
  }
}, React.createElement("div", null, React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(24px,2.8vw,36px)',
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    marginBottom: 32
  }
}, "The product we wished existed."), React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    fontSize: 17,
    lineHeight: 1.7,
    color: '#374151'
  }
}, React.createElement("p", null, "MyMilesAI is a product of Harijas LLC, serving self-employed professionals who drive for work \u2014 freelancers, real estate agents, rideshare and delivery drivers, 1099 contractors, and small business owners who need a paper trail."), React.createElement("p", null, "We built MyMilesAI because the existing options were either too expensive, too complicated, or built for enterprise fleet management rather than individual workers. We wanted something that ran classification on-device for fast tagging, kept your data in your own private cloud account so history follows you across phones, supported multiple countries, and cost less than a cup of coffee a month."), React.createElement("p", null, "Every feature in MyMilesAI exists because a real driver asked for it. The AI classification, the country-aware tax rates, the offline mode, the QuickBooks CSV exports \u2014 all of it came from actual users telling us what they needed at tax time."))), React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  }
}, [{
  label: 'Founded',
  value: '2026'
}, {
  label: 'Company',
  value: 'Harijas LLC'
}, {
  label: 'Headquartered',
  value: 'Canada'
}, {
  label: 'Serving',
  value: 'Multi-region'
}, {
  label: 'Contact',
  value: 'support@mymilesai.com'
}].map(r => React.createElement("div", {
  key: r.label,
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '16px 0',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("span", {
  style: {
    fontSize: 12,
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 500,
    color: '#9CA3AF'
  }
}, r.label), React.createElement("span", {
  style: {
    fontSize: 15,
    fontWeight: 600,
    color: '#0B0F0E'
  }
}, r.value === 'support@mymilesai.com' ? React.createElement("a", {
  href: "mailto:support@mymilesai.com",
  style: {
    color: '#1B4DDB',
    textDecoration: 'none'
  }
}, r.value) : r.value)))))), React.createElement("section", {
  style: {
    padding: '80px 56px',
    background: '#F8F9FA',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", {
  style: {
    maxWidth: 1100,
    margin: '0 auto'
  }
}, React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(22px,2.6vw,34px)',
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    marginBottom: 48,
    textAlign: 'center'
  }
}, "What we believe."), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 32
  }
}, [{
  icon: React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 22,
    height: 22,
    fill: "none",
    stroke: "#1B4DDB",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M12 2L13 3V10L17 8L18 9L13 12V22H11V12L6 9L7 8L11 10V3L12 2Z"
  }), React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    strokeDasharray: "2 4"
  })),
  title: 'Privacy is not a feature. It\'s the baseline.',
  desc: 'Your data is yours. Trip classification runs on-device; trip records sync encrypted to your private cloud account so your history is portable. We never sell your driving history to data brokers, insurers, or marketers. We make money from subscriptions — full stop.'
}, {
  icon: React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 22,
    height: 22,
    fill: "none",
    stroke: "#1B4DDB",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z"
  })),
  title: 'Simple beats powerful every time.',
  desc: 'We could add 40 features. We add the ones that matter to self-employed workers who don\'t want to think about their mileage log. Three taps, max. That\'s the design constraint.'
}, {
  icon: React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: 22,
    height: 22,
    fill: "none",
    stroke: "#1B4DDB",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M22 12h-4l-3 9L9 3l-3 9H2"
  })),
  title: 'Affordable for people it\'s built for.',
  desc: '$6.99/month is less than what you\'d lose forgetting a single client meeting. We priced it for freelancers, not enterprise procurement teams.'
}].map((v, i) => React.createElement("div", {
  key: i,
  style: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 14,
    padding: '28px 24px'
  }
}, React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    background: '#EEF2FF',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  }
}, v.icon), React.createElement("h3", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 22,
    marginBottom: 12,
    lineHeight: 1.35
  }
}, v.title), React.createElement("p", {
  style: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 1.6
  }
}, v.desc)))))), React.createElement("section", {
  style: {
    padding: '64px 56px',
    background: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", {
  style: {
    maxWidth: 640,
    margin: '0 auto',
    textAlign: 'center'
  }
}, React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(22px,2.6vw,32px)',
    lineHeight: 1.12,
    letterSpacing: '-0.025em',
    marginBottom: 24
  }
}, "Get in touch."), React.createElement("p", {
  style: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 32,
    lineHeight: 1.6
  }
}, "We're real people. If you have a question, a feature request, or you're experiencing an issue, email us directly. We read everything."), React.createElement("div", {
  style: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
}, React.createElement("a", {
  href: "mailto:support@mymilesai.com",
  style: {
    background: '#1B4DDB',
    color: '#FFFFFF',
    padding: '14px 28px',
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8
  }
}, React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: 14,
  height: 14,
  fill: "none"
}, React.createElement("path", {
  d: "M2 4a1 1 0 011-1h10a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V4z",
  stroke: "white",
  strokeWidth: "1.5"
}), React.createElement("path", {
  d: "M2 4l6 5 6-5",
  stroke: "white",
  strokeWidth: "1.5",
  strokeLinecap: "round"
})), "support@mymilesai.com"), React.createElement("a", {
  href: "mailto:hello@mymilesai.com",
  style: {
    background: '#FFFFFF',
    color: '#0B0F0E',
    padding: '14px 28px',
    borderRadius: 100,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    border: '1px solid #E5E7EB',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8
  }
}, "hello@mymilesai.com")))));
const Site = () => React.createElement(React.Fragment, null, React.createElement(MSNav, null), React.createElement(AboutPage, null), React.createElement(MSCTA, null), React.createElement(MSFooter, null));
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Site, null));