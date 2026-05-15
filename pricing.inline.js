const PricingROI = () => React.createElement("section", {
  style: {
    padding: '64px 56px',
    background: '#F8F9FA',
    borderTop: '1px solid #E5E7EB',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", {
  style: {
    maxWidth: 800,
    margin: '0 auto',
    textAlign: 'center'
  }
}, React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(22px,2.8vw,34px)',
    lineHeight: 1.15,
    letterSpacing: '-0.025em',
    marginBottom: 16
  }
}, "At $0.725/mile, it takes fewer than 10 business miles to pay for a month of MyMilesAI."), React.createElement("p", {
  style: {
    fontSize: 15,
    color: '#374151',
    maxWidth: 560,
    margin: '0 auto 40px',
    lineHeight: 1.6
  }
}, "The average self-employed driver who uses a mileage tracker deducts over $6,500 per year. MyMilesAI Pro costs $69.99/year. Do the math."), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 24
  }
}, [{
  n: '97 mi',
  label: 'Break-even point at annual price',
  sub: 'At $0.725/mi, 97 miles of business driving pays for a full year of MyMilesAI Pro'
}, {
  n: '$6,500',
  label: 'Avg annual deduction for tracked drivers',
  sub: 'Drivers who actually log miles claim significantly more than those who don\'t'
}, {
  n: '7 days',
  label: 'Free trial — cancel anytime',
  sub: 'Try it during your normal week. If it doesn\'t log every trip, cancel and pay nothing'
}].map((s, i) => React.createElement("div", {
  key: i,
  style: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: '24px 20px'
  }
}, React.createElement("div", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 28,
    color: '#1B4DDB',
    lineHeight: 1,
    marginBottom: 8
  }
}, s.n), React.createElement("div", {
  style: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
    color: '#0B0F0E'
  }
}, s.label), React.createElement("div", {
  style: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 1.5
  }
}, s.sub))))));
const PricingFAQ = () => {
  const [open, setOpen] = React.useState(null);
  const faqs = [{
    q: 'Is there a free plan?',
    a: 'No free plan, but we offer a 7-day free trial. You can use every feature during the trial and see exactly how much you would have deducted. If it\'s not useful, cancel before day 7 and you pay nothing.'
  }, {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from within the app at any time. No questions asked, no cancellation fees, no phone calls to sit through. If you cancel mid-period, you keep access until the end of your billing cycle.'
  }, {
    q: 'Does it work outside the US?',
    a: 'Yes. Set your country in Settings and the app applies the right tax rate and units (miles or kilometres) automatically. Country-aware rates cover the US, Canada, UK, Australia, Germany, France, Ireland, Netherlands, and India today.'
  }, {
    q: 'Will it drain my battery?',
    a: 'No. We use a low-power GPS mode optimized for background operation. MyMilesAI typically uses about 1% of your daily battery — less than most social media apps. On most phones you won\'t notice it in your battery stats.'
  }, {
    q: 'Can I switch from MileIQ?',
    a: 'Yes. We support CSV import so you don\'t lose your mileage history. Export your data from MileIQ, import it into MyMilesAI, and your records are intact. You get the new features without starting from scratch.'
  }, {
    q: 'Is my location data safe?',
    a: 'Yes. MyMilesAI uses on-device processing — your GPS data is processed and stored on your phone, not on our servers. We never sell your location data or driving history to third parties. We make money from subscriptions, not from your data.'
  }, {
    q: 'What happens to my data if I cancel?',
    a: 'Your trip logs remain accessible during your active subscription period. We recommend exporting your data before canceling. After cancellation, your account data is retained for 90 days in case you resubscribe, then deleted.'
  }, {
    q: 'Does it work for 1099 contractors?',
    a: 'Yes — it\'s designed specifically for 1099 workers, freelancers, rideshare drivers, and anyone who drives for work and files self-employment taxes. The exports are formatted for US and Canadian tax filing.'
  }];
  return React.createElement("section", {
    style: {
      padding: '80px 56px',
      background: '#FFFFFF',
      borderTop: '1px solid #E5E7EB'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: '#1B4DDB',
      marginBottom: 24
    }
  }, "\u2014 FAQ"), React.createElement("h2", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(26px,3vw,38px)',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      marginBottom: 48
    }
  }, "Questions we get every week."), React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      border: '1px solid #E5E7EB',
      borderRadius: 14,
      overflow: 'hidden'
    }
  }, faqs.map((f, i) => React.createElement("div", {
    key: i,
    style: {
      borderBottom: i < faqs.length - 1 ? '1px solid #E5E7EB' : 'none'
    }
  }, React.createElement("button", {
    onClick: () => setOpen(open === i ? null : i),
    style: {
      width: '100%',
      padding: '20px 24px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      textAlign: 'left',
      fontFamily: "'DM Sans',system-ui,sans-serif"
    }
  }, React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      color: '#0B0F0E',
      lineHeight: 1.4
    }
  }, f.q), React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 16,
    height: 16,
    fill: "none",
    style: {
      flexShrink: 0,
      transform: open === i ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.2s'
    }
  }, React.createElement("path", {
    d: "M4 6L8 10L12 6",
    stroke: "#6B7280",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), open === i && React.createElement("div", {
    style: {
      padding: '0 24px 20px',
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.7
    }
  }, f.a)))), React.createElement("div", {
    style: {
      marginTop: 40,
      padding: '24px',
      background: '#F8F9FA',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 15,
      marginBottom: 8
    }
  }, "Still not sure?"), React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#374151',
      marginBottom: 16
    }
  }, "Try it free \u2014 you'll know in 7 days. Cancel anytime."), React.createElement("a", {
    href: "signup/",
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
      gap: 6
    }
  }, "Start Free Trial \u2192"))));
};
const Site = () => React.createElement(React.Fragment, null, React.createElement(MSNav, null), React.createElement("section", {
  className: "page-hero"
}, React.createElement("div", {
  className: "eyebrow"
}, "\u2014 Pricing"), React.createElement("h1", null, "One plan. Everything included."), React.createElement("p", null, "MyMilesAI Pro is $6.99/month or $69.99/year. 7-day free trial. At $0.725/mile, it takes fewer than 10 business trips to pay for a year."), React.createElement("div", {
  style: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 32
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
  href: "how-it-works.html",
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
}, "See How It Works")), React.createElement("div", {
  style: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 16,
    fontFamily: "'DM Sans',system-ui,sans-serif"
  }
}, "7 days free. Cancel anytime. \xB7 Multi-region")), React.createElement(MSPricing, null), React.createElement(PricingROI, null), React.createElement(PricingFAQ, null), React.createElement(MSCTA, null), React.createElement(MSFooter, null));
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Site, null));