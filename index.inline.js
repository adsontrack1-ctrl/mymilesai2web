const MSHomeValueProps = () => React.createElement("section", {
  style: {
    padding: '80px 56px',
    background: '#F8F9FA',
    borderTop: '1px solid #E5E7EB',
    borderBottom: '1px solid #E5E7EB'
  }
}, React.createElement("div", {
  style: {
    textAlign: 'center',
    marginBottom: 48
  }
}, React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#1B4DDB',
    marginBottom: 16
  }
}, "\u2014 Why it works"), React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(26px,3.2vw,40px)',
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    maxWidth: 640,
    margin: '0 auto'
  }
}, "The average self-employed driver deducts $6,500/year. Most leave half of it on the table.")), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 32,
    maxWidth: 1100,
    margin: '0 auto'
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
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), React.createElement("path", {
    d: "M12 8v4l3 2"
  }), React.createElement("path", {
    d: "M4.5 5.5L2 3"
  }), React.createElement("path", {
    d: "M19.5 5.5L22 3"
  })),
  title: 'Auto-tracks every mile',
  desc: 'No manual logging. MyMilesAI detects driving automatically and records every trip in the background — even when your phone is locked.'
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
    d: "M9 12l2 2 4-4"
  }), React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "16",
    rx: "2"
  }), React.createElement("path", {
    d: "M3 9h18"
  })),
  title: 'AI classifies business vs personal',
  desc: 'Swipe right for business, left for personal. Takes 12 seconds a day. The AI learns your patterns and classifies repeat routes automatically.'
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
    d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
  }), React.createElement("polyline", {
    points: "14 2 14 8 20 8"
  }), React.createElement("line", {
    x1: "9",
    y1: "13",
    x2: "15",
    y2: "13"
  }), React.createElement("line", {
    x1: "9",
    y1: "17",
    x2: "12",
    y2: "17"
  })),
  title: 'Tax-ready exports in one tap',
  desc: 'Export a PDF in standard mileage format or CSV for QuickBooks, Xero, or FreshBooks. Send to your accountant. Your mileage log is complete and accurate.'
}].map((v, i) => React.createElement("div", {
  key: i,
  style: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 16,
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
    marginBottom: 10,
    letterSpacing: '-0.01em'
  }
}, v.title), React.createElement("p", {
  style: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 1.6
  }
}, v.desc)))));
const MSHomeAudience = () => {
  const cards = [{
    title: 'Freelancers & Consultants',
    desc: 'Client meetings, site visits, co-working runs. Every trip to a client is deductible — if you can prove it.',
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("rect", {
      x: "2",
      y: "7",
      width: "20",
      height: "14",
      rx: "2"
    }), React.createElement("path", {
      d: "M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
    })),
    color: '#EEF2FF'
  }, {
    title: 'Real Estate Agents',
    desc: 'Showings, open houses, inspections, closings. You drove 47 miles to that listing. Did you log it?',
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M3 12l9-9 9 9"
    }), React.createElement("path", {
      d: "M5 10v10h14V10"
    })),
    color: '#EEF2FF'
  }, {
    title: 'Rideshare & Delivery Drivers',
    desc: 'Uber, Lyft, DoorDash, Instacart — your car is your office. Track miles between pickups and to your start location.',
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v9a2 2 0 01-2 2h-2M9 21a2 2 0 100-4 2 2 0 000 4M20 21a2 2 0 100-4 2 2 0 000 4"
    })),
    color: '#EEF2FF'
  }, {
    title: 'Small Business Owners',
    desc: 'Supply runs, vendor meetings, bank trips. If you drive it for business, you can deduct it at standard mileage rates.',
    icon: React.createElement("svg", {
      viewBox: "0 0 24 24",
      width: 20,
      height: 20,
      fill: "none",
      stroke: "#1B4DDB",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    }), React.createElement("polyline", {
      points: "9 22 9 12 15 12 15 22"
    })),
    color: '#EEF2FF'
  }];
  return React.createElement("section", {
    style: {
      padding: '100px 56px',
      background: '#FFFFFF'
    }
  }, React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 56
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: '#1B4DDB',
      marginBottom: 16
    }
  }, "\u2014 Who it's for"), React.createElement("h2", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(26px,3.2vw,40px)',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      maxWidth: 560,
      margin: '0 auto'
    }
  }, "If you drive for work in the US or Canada, you should be tracking miles.")), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 20,
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, cards.map((c, i) => React.createElement("div", {
    key: i,
    style: {
      border: '1px solid #E5E7EB',
      borderRadius: 16,
      padding: '28px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      background: c.color,
      borderRadius: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, c.icon), React.createElement("h3", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 700,
      fontSize: 22,
      lineHeight: 1.3,
      letterSpacing: '-0.01em'
    }
  }, c.title), React.createElement("p", {
    style: {
      fontSize: 17,
      color: '#374151',
      lineHeight: 1.6,
      flex: 1
    }
  }, c.desc), React.createElement("a", {
    href: "features.html",
    style: {
      fontSize: 16,
      color: '#1B4DDB',
      fontWeight: 600,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5
    }
  }, "Learn more", React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 12,
    height: 12,
    fill: "none"
  }, React.createElement("path", {
    d: "M3 8H13M8 3L13 8L8 13",
    stroke: "#1B4DDB",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))))));
};
const MSHomeCTA = () => React.createElement("section", {
  style: {
    padding: '80px 56px',
    background: '#1B4DDB',
    color: '#FFFFFF',
    textAlign: 'center'
  }
}, React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(24px,3vw,38px)',
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    marginBottom: 16
  }
}, "Your first 7 days are free. Cancel anytime."), React.createElement("p", {
  style: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 32,
    maxWidth: 480,
    margin: '0 auto 32px'
  }
}, "Start tracking today. If you drive for work and you're not logging miles, you're leaving money on the table every single day."), React.createElement("a", {
  href: "signup/",
  style: {
    background: '#FFFFFF',
    color: '#1B4DDB',
    padding: '18px 36px',
    borderRadius: 100,
    fontSize: 15,
    fontWeight: 700,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 8px 24px -8px rgba(0,0,0,0.2)'
  }
}, "Start Free Trial \u2192"));
const Site = () => React.createElement(React.Fragment, null, React.createElement(MSNav, null), React.createElement(MSHero, null), React.createElement(MSHomeValueProps, null), React.createElement(MSHomeAudience, null), React.createElement(MSAudience, null), React.createElement(MSHomeCTA, null), React.createElement(MSFooter, null));
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Site, null));