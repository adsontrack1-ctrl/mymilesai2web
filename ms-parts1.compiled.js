const MSLogo = ({
  size = 22,
  onDark = false
}) => React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    lineHeight: 1
  }
}, React.createElement("svg", {
  viewBox: "0 0 64 64",
  fill: "none",
  style: {
    width: size * 1.3,
    height: size * 1.3,
    flexShrink: 0
  },
  "aria-hidden": "true"
}, React.createElement("circle", {
  cx: "12",
  cy: "50",
  r: "4",
  fill: onDark ? '#F8F9FA' : '#0B0F0E'
}), React.createElement("path", {
  d: "M 12 50 Q 12 30 28 22 T 52 14",
  stroke: "#1B4DDB",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  fill: "none"
}), React.createElement("circle", {
  cx: "52",
  cy: "14",
  r: "5",
  fill: "#1B4DDB"
}), React.createElement("circle", {
  cx: "52",
  cy: "14",
  r: "2",
  fill: "#F8F9FA"
})), React.createElement("span", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: size,
    letterSpacing: '-0.035em',
    color: onDark ? '#F8F9FA' : '#0B0F0E'
  }
}, "MyMiles", React.createElement("span", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    color: '#C9A96E',
    letterSpacing: '-0.02em',
    paddingLeft: '0.03em'
  }
}, "AI")));
const MSRegionPill = () => {
  const [region, setRegion] = React.useState(() => {
    try {
      return localStorage.getItem('mm_region') || 'US';
    } catch (e) {
      return 'US';
    }
  });
  const [open, setOpen] = React.useState(false);
  const choose = r => {
    setRegion(r);
    if (window.MM) {
      window.MM.set(r);
    } else {
      try {
        localStorage.setItem('mm_region', r);
      } catch (e) {}
      try {
        document.dispatchEvent(new CustomEvent('mm-locale-change', {
          detail: {
            locale: r
          }
        }));
      } catch (e) {}
    }
    setOpen(false);
  };
  const opts = {
    US: {
      label: 'MI',
      sub: 'United States'
    },
    CA: {
      label: 'KM',
      sub: 'Canada'
    }
  };
  const Flag = ({
    code
  }) => code === 'US' ? React.createElement("span", {
    style: {
      width: 18,
      height: 12,
      display: 'inline-block',
      background: 'linear-gradient(180deg,#B22234 33%,#FFFFFF 33%,#FFFFFF 66%,#B22234 66%)',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 7,
      height: 6,
      background: '#3C3B6E'
    }
  })) : React.createElement("span", {
    style: {
      width: 18,
      height: 12,
      display: 'inline-block',
      background: 'linear-gradient(90deg,#D52B1E 0 25%,#FFFFFF 25% 75%,#D52B1E 75%)',
      borderRadius: 2,
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0
    }
  }, React.createElement("span", {
    style: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      color: '#D52B1E',
      fontSize: 8,
      lineHeight: 1,
      fontWeight: 700
    }
  }, "\uD83C\uDF41"));
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);
  return React.createElement("div", {
    style: {
      position: 'relative'
    },
    onClick: e => e.stopPropagation()
  }, React.createElement("button", {
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '7px 10px 7px 12px',
      border: '1px solid #E5E7EB',
      borderRadius: 100,
      fontSize: 13,
      background: '#FFFFFF',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, React.createElement(Flag, {
    code: region
  }), React.createElement("span", {
    style: {
      fontWeight: 600,
      letterSpacing: '0.02em'
    }
  }, opts[region].label), React.createElement("span", {
    style: {
      fontSize: 9,
      opacity: 0.5,
      marginLeft: 1
    }
  }, "\u25BE")), open && React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 0,
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 12,
      padding: 6,
      boxShadow: '0 14px 36px -10px rgba(11,15,14,0.18)',
      minWidth: 200,
      zIndex: 60
    }
  }, ['US', 'CA'].map(r => React.createElement("button", {
    key: r,
    onClick: () => choose(r),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      width: '100%',
      background: r === region ? '#F8F9FA' : 'transparent',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontFamily: 'inherit',
      textAlign: 'left'
    }
  }, React.createElement(Flag, {
    code: r
  }), React.createElement("div", {
    style: {
      flex: 1
    }
  }, React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600
    }
  }, opts[r].sub), React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#6B7280'
    }
  }, "Distance in ", opts[r].label === 'MI' ? 'miles' : 'kilometers')), r === region && React.createElement("span", {
    style: {
      color: '#1B4DDB',
      fontSize: 13
    }
  }, "\u2713")))));
};
const MS_SOL_LINKS = [{
  slug: 'realtors',
  label: 'Realtors'
}, {
  slug: 'rideshare',
  label: 'Rideshare & Delivery'
}, {
  slug: 'freelancers',
  label: 'Freelancers & Consultants'
}, {
  slug: 'small-business',
  label: 'Small Business'
}, {
  slug: 'construction',
  label: 'Construction & Trades'
}, {
  slug: 'sales-reps',
  label: 'Sales Reps'
}];
const MSNav = ({
  mobile
}) => {
  const [solOpen, setSolOpen] = React.useState(false);
  const solRef = React.useRef(null);
  const links = [{
    label: 'Features',
    href: 'features.html'
  }, {
    label: 'How It Works',
    href: 'how-it-works.html'
  }, {
    label: 'Pricing',
    href: 'pricing.html'
  }, {
    label: 'Blog',
    href: 'blog.html'
  }, {
    label: 'About',
    href: 'about.html'
  }];
  const here = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isSol = here.includes('/solutions');
  const hereFile = here.split('/').pop() || '';
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') setSolOpen(false);
    };
    const onOut = e => {
      if (solRef.current && !solRef.current.contains(e.target)) setSolOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOut);
    };
  }, []);
  if (mobile) return React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid #E5E7EB'
    }
  }, React.createElement("a", {
    href: "./",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, React.createElement(MSLogo, {
    size: 18
  })), React.createElement("a", {
    href: "signin/",
    style: {
      background: 'transparent',
      color: '#0B0F0E',
      border: '1px solid #0B0F0E',
      padding: '8px 16px',
      borderRadius: 100,
      fontSize: 12,
      fontWeight: 500,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center'
    }
  }, "Sign In"));
  return React.createElement("div", {
    className: "nav-links",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '22px 56px',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(14px)',
      zIndex: 50,
      borderBottom: '1px solid rgba(11,15,14,0.05)'
    }
  }, React.createElement("a", {
    href: "./",
    style: {
      textDecoration: 'none',
      color: 'inherit'
    }
  }, React.createElement(MSLogo, {
    size: 22
  })), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 36,
      fontSize: 14,
      color: '#1F1D1A',
      alignItems: 'center'
    }
  }, React.createElement("div", {
    style: {
      position: 'relative'
    },
    ref: solRef
  }, React.createElement("button", {
    "aria-haspopup": "true",
    "aria-expanded": solOpen,
    onClick: () => setSolOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      color: '#1F1D1A',
      fontWeight: isSol ? 700 : 500,
      opacity: isSol ? 1 : 0.7,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: 14,
      fontFamily: 'inherit',
      padding: 0,
      paddingBottom: 4,
      borderBottom: isSol ? '2px solid #1B4DDB' : '2px solid transparent',
      transition: 'opacity .15s,border-color .15s'
    },
    onMouseOver: e => {
      if (!isSol) e.currentTarget.style.opacity = 1;
    },
    onMouseOut: e => {
      if (!isSol) e.currentTarget.style.opacity = 0.7;
    }
  }, "Solutions", React.createElement("svg", {
    viewBox: "0 0 10 6",
    width: 9,
    height: 9,
    fill: "none",
    style: {
      transform: solOpen ? 'rotate(180deg)' : 'none',
      transition: 'transform .2s',
      flexShrink: 0
    },
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M1 1L5 5L9 1",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), solOpen && React.createElement("div", {
    role: "menu",
    "aria-label": "Solutions pages",
    style: {
      position: 'absolute',
      top: 'calc(100% + 14px)',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#fff',
      border: '1px solid #E5E7EB',
      borderRadius: 14,
      padding: 8,
      boxShadow: '0 12px 32px -8px rgba(0,0,0,0.14)',
      zIndex: 100,
      minWidth: 312,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 2
    }
  }, MS_SOL_LINKS.map(l => React.createElement("a", {
    key: l.slug,
    href: `/solutions/${l.slug}/`,
    role: "menuitem",
    style: {
      display: 'block',
      padding: '9px 12px',
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      color: '#374151',
      textDecoration: 'none'
    },
    onMouseOver: e => {
      e.currentTarget.style.background = '#F8F9FA';
    },
    onMouseOut: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, l.label)), React.createElement("a", {
    href: "/solutions/",
    role: "menuitem",
    style: {
      gridColumn: '1/-1',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '9px 12px',
      borderRadius: 8,
      borderTop: '1px solid #F3F4F6',
      marginTop: 4,
      fontSize: 13,
      fontWeight: 600,
      color: '#1B4DDB',
      textDecoration: 'none'
    },
    onMouseOver: e => {
      e.currentTarget.style.background = '#EFF3FF';
    },
    onMouseOut: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, "All solutions", React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 12,
    height: 12,
    fill: "none",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M3 8H13M8 3L13 8L8 13",
    stroke: "#1B4DDB",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))))), links.map(l => {
    const active = hereFile === l.href;
    return React.createElement("a", {
      key: l.href,
      href: l.href,
      style: {
        color: 'inherit',
        textDecoration: 'none',
        fontWeight: active ? 700 : 500,
        opacity: active ? 1 : 0.7,
        position: 'relative',
        paddingBottom: 4,
        borderBottom: active ? '2px solid #1B4DDB' : '2px solid transparent',
        transition: 'opacity .15s,border-color .15s'
      },
      onMouseOver: e => {
        if (!active) e.currentTarget.style.opacity = 1;
      },
      onMouseOut: e => {
        if (!active) e.currentTarget.style.opacity = 0.7;
      }
    }, l.label);
  })), React.createElement("div", {
    className: "nav-signin",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, React.createElement(MSRegionPill, null), React.createElement("a", {
    href: "signin/",
    style: {
      background: '#FFFFFF',
      color: '#0B0F0E',
      border: '1px solid #E5E7EB',
      padding: '10px 22px',
      borderRadius: 100,
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all .15s',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center'
    },
    onMouseOver: e => {
      e.currentTarget.style.borderColor = '#0B0F0E';
    },
    onMouseOut: e => {
      e.currentTarget.style.borderColor = '#E5E7EB';
    }
  }, "Sign In")));
};
const MSHero = () => {
  return React.createElement("section", {
    style: {
      padding: '72px 56px 110px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 56,
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 720
    }
  }, React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-10%',
      right: '-8%',
      width: 720,
      height: 720,
      background: 'radial-gradient(circle at center, rgba(27,77,219,0.08), rgba(55,138,221,0.04) 40%, transparent 70%)',
      pointerEvents: 'none',
      filter: 'blur(20px)'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2
    }
  }, React.createElement("h1", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(38px,4.2vw,62px)',
      lineHeight: 1.06,
      letterSpacing: '-0.03em',
      marginBottom: 26
    }
  }, React.createElement("span", {
    style: {
      display: 'block'
    }
  }, "Track every mile."), React.createElement("span", {
    style: {
      display: 'block'
    }
  }, "Claim every ", React.createElement("span", {
    style: {
      color: '#1B4DDB',
      fontStyle: 'italic'
    }
  }, "dollar."))), React.createElement("p", {
    style: {
      fontSize: 20,
      lineHeight: 1.6,
      color: '#374151',
      maxWidth: 510,
      marginBottom: 36
    }
  }, "MyMilesAI automatically logs your trips with GPS, classifies them with AI, and calculates your tax deductions \u2014 all hands-free."), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      marginBottom: 24,
      flexWrap: 'wrap'
    }
  }, React.createElement("a", {
    href: "signup/",
    style: {
      background: '#1B4DDB',
      color: '#FFFFFF',
      border: 'none',
      padding: '17px 32px',
      borderRadius: 100,
      fontSize: 15,
      fontWeight: 700,
      cursor: 'pointer',
      boxShadow: '0 12px 28px -10px rgba(27,77,219,0.45)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      textDecoration: 'none'
    }
  }, "Start Free Trial", React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 14,
    height: 14,
    fill: "none"
  }, React.createElement("path", {
    d: "M3 8H13M8 3L13 8L8 13",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), React.createElement("a", {
    href: "how-it-works.html",
    style: {
      background: '#FFFFFF',
      color: '#0B0F0E',
      border: '1px solid #E5E7EB',
      padding: '16px 28px',
      borderRadius: 100,
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, "See How It Works")), React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      fontSize: 14,
      color: '#6B7280',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 13,
    height: 13,
    fill: "none"
  }, React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6.5",
    stroke: "#6B7280",
    strokeWidth: "1.4"
  }), React.createElement("path", {
    d: "M8 4v4l3 2",
    stroke: "#6B7280",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  })), "7-day free trial"), React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 13,
    height: 13,
    fill: "none"
  }, React.createElement("path", {
    d: "M2 8l4 4L14 4",
    stroke: "#6B7280",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), "Cancel anytime"), React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, React.createElement("svg", {
    viewBox: "0 0 16 16",
    width: 13,
    height: 13,
    fill: "none"
  }, React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "6.5",
    stroke: "#6B7280",
    strokeWidth: "1.4"
  }), React.createElement("path", {
    d: "M2 8H14M8 2Q11 5 11 8Q11 11 8 14Q5 11 5 8Q5 5 8 2",
    stroke: "#6B7280",
    strokeWidth: "1.2",
    fill: "none"
  })), "US + Canada"))), React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 680,
      overflow: 'visible'
    }
  }, React.createElement("div", {
    className: "hero-glow",
    style: {
      position: 'absolute',
      width: 320,
      height: 680,
      borderRadius: '50%',
      background: 'radial-gradient(ellipse at center, rgba(27,77,219,0.25) 0%, rgba(27,77,219,0.08) 50%, transparent 70%)',
      zIndex: 1,
      pointerEvents: 'none',
      filter: 'blur(32px)'
    }
  }), React.createElement("div", {
    style: {
      position: 'relative',
      flexShrink: 0,
      zIndex: 2
    }
  }, React.createElement("img", {
    className: "hero-phone-img",
    src: "assets/hero/app-real.jpg",
    alt: "MyMilesAI app \u2014 automatic mileage tracking",
    style: {
      width: 264,
      height: 'auto',
      borderRadius: 44,
      boxShadow: '0 20px 60px rgba(27,77,219,0.18), 0 8px 24px rgba(0,0,0,0.10)',
      display: 'block',
      maxWidth: '100%',
      WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
      maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)'
    }
  }), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 55,
      left: 39,
      width: 128,
      height: 18,
      background: '#EFEFF4',
      borderRadius: 3,
      zIndex: 4,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 3
    }
  }, React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 700,
      fontSize: 11,
      color: '#111827',
      letterSpacing: '-0.01em',
      lineHeight: 1
    }
  }, "demo")), React.createElement("div", {
    style: {
      position: 'absolute',
      top: 440,
      left: 35,
      width: 150,
      height: 18,
      background: '#FFFFFF',
      borderRadius: 3,
      zIndex: 4,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 3
    }
  }, React.createElement("span", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 700,
      fontSize: 11,
      color: '#111827',
      letterSpacing: '-0.01em',
      lineHeight: 1
    }
  }, "Client Office")), React.createElement("div", {
    className: "hero-card1",
    style: {
      position: 'absolute',
      top: 56,
      left: -148,
      background: '#FFFFFF',
      border: '1px solid rgba(27,77,219,0.18)',
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(27,77,219,0.10)',
      width: 144,
      zIndex: 3,
      pointerEvents: 'none'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#1B4DDB',
      fontFamily: "'DM Sans',system-ui,sans-serif",
      marginBottom: 4
    }
  }, "New trip"), React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#0B0F0E'
    }
  }, "12.4 mi"), React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#16A34A',
      fontWeight: 600,
      marginTop: 2
    }
  }, "+$8.99 deduction")), React.createElement("div", {
    className: "hero-card2",
    style: {
      position: 'absolute',
      top: '32%',
      right: -144,
      background: '#FFFFFF',
      border: '1px solid rgba(201,169,110,0.35)',
      borderRadius: 12,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      width: 134,
      zIndex: 3,
      pointerEvents: 'none'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#C9A96E',
      fontFamily: "'DM Sans',system-ui,sans-serif",
      marginBottom: 4
    }
  }, "Q1 total"), React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#0B0F0E'
    }
  }, "247 trips")), React.createElement("div", {
    className: "hero-card3",
    style: {
      position: 'absolute',
      bottom: 86,
      left: -152,
      background: '#FFFFFF',
      border: '1px solid rgba(201,169,110,0.25)',
      borderRadius: 12,
      padding: '12px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      width: 148,
      zIndex: 3,
      pointerEvents: 'none'
    }
  }, React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: '#6B7280',
      fontFamily: "'DM Sans',system-ui,sans-serif",
      marginBottom: 4
    }
  }, "Deductible"), React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: '#C9A96E',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif"
    }
  }, "$2,183.14")))), React.createElement("style", null, `
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* Layer 2: Glow pulse */
        .hero-glow{animation:hero-glow-pulse 4s ease-in-out infinite}
        @keyframes hero-glow-pulse{0%,100%{opacity:.4}50%{opacity:.6}}

        /* Phone: tilt + float */
        .hero-phone-img{transform:none}
        @media(prefers-reduced-motion:no-preference){
          .hero-phone-img{animation:hero-phone-float 3s ease-in-out infinite}
        }
        @keyframes hero-phone-float{
          0%,100%{transform:translateY(0)}
          50%    {transform:translateY(-8px)}
        }

        /* Layer 4: Floating cards — stagger baked into keyframes */
        .hero-card1{opacity:0;transform:translateY(-20px);animation:hero-card1-in 10s ease-in-out infinite}
        .hero-card2{opacity:0;transform:translateX(20px); animation:hero-card2-in 10s ease-in-out infinite}
        .hero-card3{opacity:0;transform:translateY(20px); animation:hero-card3-in 10s ease-in-out infinite}
        @keyframes hero-card1-in{
          0%       {opacity:0;transform:translateY(-20px)}
          10%      {opacity:1;transform:translateY(0)}
          80%      {opacity:1;transform:translateY(0)}
          90%,100% {opacity:0;transform:translateY(-20px)}
        }
        @keyframes hero-card2-in{
          0%,20%   {opacity:0;transform:translateX(20px)}
          30%      {opacity:1;transform:translateX(0)}
          85%      {opacity:1;transform:translateX(0)}
          95%,100% {opacity:0;transform:translateX(20px)}
        }
        @keyframes hero-card3-in{
          0%,40%   {opacity:0;transform:translateY(20px)}
          50%      {opacity:1;transform:translateY(0)}
          88%      {opacity:1;transform:translateY(0)}
          98%,100% {opacity:0;transform:translateY(20px)}
        }

        /* Reduced-motion: static end state, no animation */
        @media(prefers-reduced-motion:reduce){
          .hero-glow{animation:none;opacity:.5}
          .hero-phone-img{animation:none;transform:none}
          .hero-card1,.hero-card2,.hero-card3{animation:none;opacity:1;transform:none}
        }

        /* Mobile: phone + glow only, hide cards + counter */
        @media(max-width:900px){
          .hero-card1,.hero-card2,.hero-card3{display:none}
          .hero-glow{width:180px!important;height:280px!important}
        }
      `));
};
const MS_SAMPLE_TRIPS = [{
  date: '2026-04-02',
  from: 'Home Office',
  to: 'Acme Corp HQ',
  purpose: 'Q2 strategy meeting w/ J. Lopez',
  miles: 18.4,
  type: 'biz'
}, {
  date: '2026-04-02',
  from: 'Acme Corp HQ',
  to: 'Beanline Coffee',
  purpose: 'Lunch (personal)',
  miles: 1.2,
  type: 'pers'
}, {
  date: '2026-04-05',
  from: 'Home Office',
  to: 'Vista Title Co.',
  purpose: 'Closing — 412 Maple Ave',
  miles: 7.8,
  type: 'biz'
}, {
  date: '2026-04-08',
  from: 'Home Office',
  to: '1414 Oak St (listing)',
  purpose: 'Showing — Walker family',
  miles: 11.6,
  type: 'biz'
}, {
  date: '2026-04-08',
  from: '1414 Oak St',
  to: '88 Lakeshore (listing)',
  purpose: 'Showing — Walker family',
  miles: 6.3,
  type: 'biz'
}, {
  date: '2026-04-12',
  from: 'Home Office',
  to: 'Riverstone Office Supply',
  purpose: 'Print marketing flyers',
  miles: 4.4,
  type: 'biz'
}, {
  date: '2026-04-15',
  from: 'Home Office',
  to: 'Marriott Convention Ctr',
  purpose: 'Industry CE conference',
  miles: 24.1,
  type: 'biz'
}, {
  date: '2026-04-15',
  from: 'Marriott Convention Ctr',
  to: 'Home Office',
  purpose: 'Return from CE conference',
  miles: 24.1,
  type: 'biz'
}, {
  date: '2026-04-19',
  from: 'Home Office',
  to: 'Roosevelt Elementary',
  purpose: 'School pickup',
  miles: 3.2,
  type: 'pers'
}, {
  date: '2026-04-22',
  from: 'Home Office',
  to: '1st Republic Bank',
  purpose: 'Deposit closing check',
  miles: 5.7,
  type: 'biz'
}];
const MS_SAMPLE_RATE = 0.725;
function msDownloadSamplePDF() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF library failed to load. Please refresh the page and try again.');
    return;
  }
  const {
    jsPDF
  } = window.jspdf;
  const trips = MS_SAMPLE_TRIPS;
  const rate = MS_SAMPLE_RATE;
  const isBiz = t => t.type === 'biz';
  const isPers = t => t.type === 'pers';
  const totalMi = trips.reduce((s, t) => s + t.miles, 0);
  const bizMi = trips.filter(isBiz).reduce((s, t) => s + t.miles, 0);
  const persMi = trips.filter(isPers).reduce((s, t) => s + t.miles, 0);
  const deduction = bizMi * rate;
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter'
  });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(11, 15, 14);
  doc.text('Mileage Log — Sample', margin, margin + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(85, 85, 85);
  doc.text('April 2026 (sample data) · Driver: Demo · Generated ' + new Date().toLocaleString(), margin, margin + 24);
  const badgeText = 'VERIFIED';
  const badgeW = doc.getTextWidth(badgeText) + 14;
  const badgeX = pageW - margin - badgeW;
  doc.setFillColor(27, 94, 63);
  doc.roundedRect(badgeX, margin, badgeW, 16, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(badgeText, badgeX + 7, margin + 11);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(margin, margin + 32, pageW - margin, margin + 32);
  const body = trips.map(t => {
    const ded = isBiz(t) ? '$' + (t.miles * rate).toFixed(2) : '—';
    return [t.date, t.from + ' → ' + t.to, t.purpose, t.miles.toFixed(1), isBiz(t) ? 'Business' : isPers(t) ? 'Personal' : '—', ded];
  });
  doc.autoTable({
    head: [['Date', 'Route (Destination)', 'Business Purpose', 'Miles', 'Class', 'Deduction']],
    body,
    startY: margin + 42,
    margin: {
      left: margin,
      right: margin
    },
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 4,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [51, 51, 51],
      fontStyle: 'bold',
      fontSize: 7.5
    },
    columnStyles: {
      0: {
        cellWidth: 60
      },
      1: {
        cellWidth: 'auto'
      },
      2: {
        cellWidth: 130
      },
      3: {
        halign: 'right',
        cellWidth: 38
      },
      4: {
        cellWidth: 50
      },
      5: {
        halign: 'right',
        cellWidth: 55
      }
    },
    didParseCell: data => {
      if (data.section !== 'body' || !trips[data.row.index]) return;
      if (isBiz(trips[data.row.index])) data.cell.styles.fillColor = [240, 247, 244];else if (isPers(trips[data.row.index])) data.cell.styles.fillColor = [253, 245, 249];
    }
  });
  let y = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 18 : margin + 200;
  if (y > pageH - 160) {
    doc.addPage();
    y = margin;
  }
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageW - margin, y);
  y += 14;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  for (const [k, v] of [['Total trips', String(trips.length)], ['Total miles (all classes)', totalMi.toFixed(1) + ' mi'], ['Business miles', bizMi.toFixed(1) + ' mi'], ['Personal miles', persMi.toFixed(1) + ' mi'], ['Standard mileage rate', '$' + rate.toFixed(3) + ' / mi']]) {
    doc.text(k, margin, y);
    doc.text(v, pageW - margin, y, {
      align: 'right'
    });
    y += 14;
  }
  y += 4;
  doc.setDrawColor(153, 153, 153);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Total deduction (business × rate)', margin, y);
  doc.text('$' + deduction.toFixed(2), pageW - margin, y, {
    align: 'right'
  });
  y += 26;
  if (y > pageH - 100) {
    doc.addPage();
    y = margin;
  }
  doc.setDrawColor(221, 221, 221);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(102, 102, 102);
  const notice = 'SAMPLE — illustrative trips only. Real reports are generated from your own MyMilesAI trip log. Method: Standard mileage rate. This log records the four required elements for each business trip: date, destination, business purpose, and miles driven. Vehicle records and odometer readings are maintained separately by the driver. MyMilesAI is a recordkeeping tool, not a tax preparer or tax-advice service — consult a qualified tax professional before filing.';
  doc.text(doc.splitTextToSize(notice, pageW - margin * 2), margin, y);
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mymilesai-sample-mileage-log.pdf';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
const MSHow = () => {
  const steps = [{
    n: '01',
    title: 'Install and go.',
    body: 'Download from the App Store. Sign in with Google, Apple, or email. That\'s the entire setup. No hardware. No OBD plug. No Bluetooth beacon. Just your phone.',
    meta: 'Zero taps · Background mode'
  }, {
    n: '02',
    title: 'Drive normally.',
    body: 'MyMilesAI runs in the background. It detects when you\'re driving and logs your start point, end point, route, distance, and time — silently, even when your phone is locked. You drove 12.3 miles to a client meeting. We logged it. You didn\'t have to think about it.',
    meta: '~0 taps per trip'
  }, {
    n: '03',
    title: 'Swipe and export.',
    body: 'At end of day, open the app. Swipe right for Business, left for Personal — it takes about 12 seconds. Hit export. Get a PDF with all required elements. That 12.3-mile trip is now an $8.92 deduction. Send it to your accountant or upload to TurboTax.',
    meta: 'One tap export',
    cta: 'Try a sample PDF →',
    ctaAction: msDownloadSamplePDF
  }];
  return React.createElement("section", {
    style: {
      padding: '120px 56px',
      background: '#FFFFFF'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: '#1B4DDB',
      marginBottom: 24
    }
  }, "\u2014 How it works"), React.createElement("h2", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(32px,3.8vw,48px)',
      lineHeight: 1.08,
      letterSpacing: '-0.025em',
      marginBottom: 56,
      maxWidth: 780
    }
  }, "Three steps. $2,183.14 recovered, on average, every quarter."), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 32
    }
  }, steps.map(s => React.createElement("div", {
    key: s.n,
    style: {
      borderTop: '1px solid #0B0F0E',
      paddingTop: 24
    }
  }, React.createElement("div", {
    style: {
      fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
      fontSize: 14,
      color: '#1B4DDB',
      marginBottom: 20
    }
  }, s.n), React.createElement("h3", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 700,
      fontSize: 26,
      lineHeight: 1.15,
      marginBottom: 14,
      letterSpacing: '-0.02em'
    }
  }, s.title), React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.6,
      color: '#374151',
      marginBottom: 20
    }
  }, s.body), React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 500,
      fontSize: 14,
      color: '#6B7280'
    }
  }, s.meta), s.cta ? React.createElement("button", {
    onClick: s.ctaAction,
    style: {
      marginTop: 18,
      padding: '12px 18px',
      background: '#0B0F0E',
      color: '#F8F9FA',
      border: 'none',
      borderRadius: 6,
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 600,
      fontSize: 13,
      cursor: 'pointer',
      letterSpacing: '0.01em'
    }
  }, s.cta) : null))));
};
const MSFeatures = () => {
  const feats = [{
    k: 'Auto GPS tracking',
    h: 'Start driving. That\'s it.',
    p: 'No buttons to press. No app to open. MyMilesAI detects motion via GPS and accelerometer, logs your trip silently even when your phone is locked, and does it all on less battery than a 2-minute phone call. Every mile captured is a deductible mile you would have forgotten.',
    stat: 'Auto',
    label: 'no taps required to start a trip'
  }, {
    k: 'AI trip classification',
    h: 'Swipe right for business. Left for personal.',
    p: 'Review trips at end of day — takes about 12 seconds. Swipe right for Business, left for Personal. The AI learns your routes after a week and auto-classifies recurring trips. Client office every Tuesday? Classified. Regular supply run? Done.',
    stat: '12s',
    label: 'daily review time after first week'
  }, {
    k: 'Tax-ready exports',
    h: 'One tap. Tax-ready. Done.',
    p: 'One tap exports a PDF with all four required elements: date, destination, business purpose, and miles. Or export CSV for QuickBooks, Xero, FreshBooks, or Wave. Works for US and Canada with locale auto-detect.',
    stat: '4/4',
    label: 'required elements captured'
  }];
  return React.createElement("section", {
    style: {
      padding: '120px 56px'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 120
    }
  }, feats.map((f, i) => React.createElement("div", {
    key: f.k,
    style: {
      display: 'grid',
      gridTemplateColumns: i % 2 === 0 ? '1fr 1.1fr' : '1.1fr 1fr',
      gap: 80,
      alignItems: 'center'
    }
  }, React.createElement("div", {
    style: {
      order: i % 2 === 0 ? 1 : 2
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: '#1B4DDB',
      marginBottom: 20
    }
  }, "\u2014 ", f.k), React.createElement("h2", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(28px,3.2vw,42px)',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      marginBottom: 20
    }
  }, f.h), React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.6,
      color: '#374151',
      maxWidth: 480,
      marginBottom: 28
    }
  }, f.p), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      paddingTop: 24,
      borderTop: '1px solid #E5E7EB',
      maxWidth: 320
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 38,
      color: '#1B4DDB',
      lineHeight: 1
    }
  }, f.stat), React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#6B7280',
      lineHeight: 1.4
    }
  }, f.label))), React.createElement("div", {
    style: {
      order: i % 2 === 0 ? 2 : 1,
      aspectRatio: '4/3',
      background: i === 0 ? '#0B0F0E' : i === 1 ? '#FAFAFA' : '#FFFFFF',
      border: i === 1 ? '1px solid #E8EAED' : 'none',
      borderRadius: 20,
      padding: 32,
      position: 'relative',
      overflow: 'hidden',
      color: i === 0 ? '#F8F9FA' : '#0B0F0E'
    }
  }, i === 0 && React.createElement(FeatVisAutoDetect, null), i === 1 && React.createElement(FeatVisClassify, null), i === 2 && React.createElement(FeatVisAudit, null))))));
};
const FeatVisAutoDetect = () => React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
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
    color: 'rgba(246,243,238,0.6)'
  }
}, "\u25CF BACKGROUND \xB7 TRACKING"), React.createElement("span", {
  style: {
    color: 'rgba(246,243,238,0.4)'
  }
}, "09:41:08")), React.createElement("div", {
  style: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
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
    borderTop: '1px solid rgba(246,243,238,0.15)'
  }
}, [['DISTANCE', '4.2 mi'], ['DURATION', '11 min'], ['STATUS', 'AUTO-LOGGED']].map(([k, v]) => React.createElement("div", {
  key: k
}, React.createElement("div", {
  style: {
    color: 'rgba(246,243,238,0.5)',
    marginBottom: 4
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
    flex: 1,
    fontSize: 14
  }
}, React.createElement("div", {
  style: {
    color: '#6B7280',
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: 12
  }
}, t.f, " \u2192 ", t.t), React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 20,
    marginTop: 2
  }
}, t.m, " mi")), React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  }
}, t.auto && React.createElement("span", {
  style: {
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
    fontSize: 9,
    letterSpacing: '0.12em',
    color: '#1B4DDB'
  }
}, "AI"), React.createElement("span", {
  style: {
    padding: '6px 12px',
    borderRadius: 100,
    background: t.cls === 'biz' ? '#1B4DDB' : '#E5E7EB',
    color: t.cls === 'biz' ? '#F8F9FA' : '#0B0F0E',
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
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
    fontSize: 12,
    position: 'relative',
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
}, "MILEAGE SUMMARY \u2014 2026"), React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 18,
    fontStyle: 'normal'
  }
}, "Mileage Log \xB7 Q1 Summary")), React.createElement("div", {
  style: {
    padding: '6px 10px',
    background: '#1B4DDB',
    color: '#F8F9FA',
    borderRadius: 100,
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.1em'
  }
}, "\u2713 VERIFIED")), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 60px 60px',
    gap: 8,
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10
  }
}, React.createElement("div", null, "DATE"), React.createElement("div", null, "ROUTE"), React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, "MILES"), React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, "$")), [['01/04', 'Home → Client A · Sales call', '24.1', '17.47'], ['01/04', 'Client A → Client B · Consultation', '12.8', '9.28'], ['01/05', 'Home → Warehouse · Supplies', '8.4', '6.09'], ['01/06', 'Office → Airport · Conference travel', '31.2', '22.62']].map((r, i) => React.createElement("div", {
  key: i,
  style: {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 60px 60px',
    gap: 8,
    padding: '8px 0',
    borderBottom: '1px solid #F8F9FA',
    fontSize: 13
  }
}, React.createElement("div", null, r[0]), React.createElement("div", {
  style: {
    color: '#0B0F0E'
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
    borderTop: '1px solid #0B0F0E',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline'
  }
}, React.createElement("span", {
  style: {
    color: '#6B7280'
  }
}, "Q1 TOTAL \xB7 247 TRIPS"), React.createElement("span", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: '#1B4DDB'
  }
}, "$2,183.14")));
const HeroPhone = () => React.createElement("div", {
  style: {
    width: 340,
    height: 680,
    background: '#0B0F0E',
    borderRadius: 48,
    padding: 10,
    boxShadow: '0 50px 120px -30px rgba(11,15,14,0.35), 0 20px 40px -20px rgba(11,15,14,0.2)',
    position: 'relative'
  }
}, React.createElement("div", {
  style: {
    width: '100%',
    height: '100%',
    background: '#F8F9FA',
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column'
  }
}, React.createElement("div", {
  style: {
    position: 'absolute',
    top: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 110,
    height: 32,
    background: '#0B0F0E',
    borderRadius: 100,
    zIndex: 10
  }
}), React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 26px 0',
    fontFamily: 'SF Pro Text, -apple-system, system-ui',
    fontSize: 14,
    fontWeight: 600,
    position: 'relative',
    zIndex: 5
  }
}, React.createElement("span", null, "9:41"), React.createElement("span", {
  style: {
    opacity: 0
  }
}, "_"), React.createElement("span", {
  style: {
    display: 'inline-flex',
    gap: 4,
    alignItems: 'center'
  }
}, React.createElement("span", {
  style: {
    fontSize: 10
  }
}, "\u25CF\u25CF\u25CF"))), React.createElement("div", {
  style: {
    margin: '42px 14px 0',
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #E5E7EB',
    borderRadius: 16,
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 8px 20px -8px rgba(11,15,14,0.08)'
  }
}, React.createElement("div", {
  style: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: '#1B4DDB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}, React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: 14,
  height: 14
}, React.createElement("path", {
  d: "M3 8 L7 12 L13 4",
  fill: "none",
  stroke: "#FFF",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}))), React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0
  }
}, React.createElement("div", {
  style: {
    fontSize: 11.5,
    fontWeight: 600,
    color: '#0B0F0E',
    lineHeight: 1.2
  }
}, "Trip completed \xB7 12.1 mi"), React.createElement("div", {
  style: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.3,
    marginTop: 1
  }
}, "Property Showing \xB7 +$8.77 deduction")), React.createElement("span", {
  style: {
    fontSize: 9,
    color: '#9CA3AF',
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace'
  }
}, "now")), React.createElement("div", {
  style: {
    margin: '12px 14px 0',
    background: 'linear-gradient(165deg,#0A1628 0%,#0F1E3D 60%,#1B2F5A 100%)',
    borderRadius: 18,
    padding: '16px 16px 14px',
    color: '#F8F9FA',
    position: 'relative',
    overflow: 'hidden'
  }
}, React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  }
}, React.createElement("span", {
  style: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '3px 9px',
    borderRadius: 100,
    background: 'rgba(201,169,110,0.15)',
    fontSize: 9,
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
    color: '#C9A96E',
    letterSpacing: '0.1em'
  }
}, React.createElement("span", {
  style: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#C9A96E'
  }
}), "GPS ACTIVE"), React.createElement("span", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 11,
    opacity: 0.55
  }
}, "MyMilesAI")), React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4px 0 8px',
    position: 'relative'
  }
}, React.createElement("svg", {
  viewBox: "0 0 160 110",
  style: {
    width: 200,
    height: 138
  }
}, React.createElement("defs", null, React.createElement("linearGradient", {
  id: "hgauge",
  x1: "0",
  y1: "0",
  x2: "1",
  y2: "0"
}, React.createElement("stop", {
  offset: "0%",
  stopColor: "#1B4DDB"
}), React.createElement("stop", {
  offset: "40%",
  stopColor: "#378ADD"
}), React.createElement("stop", {
  offset: "100%",
  stopColor: "#C9A96E"
}))), React.createElement("path", {
  d: "M 20 90 A 60 60 0 0 1 140 90",
  stroke: "rgba(246,243,238,0.1)",
  strokeWidth: "10",
  fill: "none",
  strokeLinecap: "round"
}), React.createElement("path", {
  d: "M 20 90 A 60 60 0 0 1 118 36",
  stroke: "url(#hgauge)",
  strokeWidth: "10",
  fill: "none",
  strokeLinecap: "round"
}), React.createElement("text", {
  x: "80",
  y: "80",
  textAnchor: "middle",
  fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
  fontWeight: "800",
  fontSize: "40",
  fill: "#1B4DDB"
}, "42"), React.createElement("text", {
  x: "80",
  y: "98",
  textAnchor: "middle",
  fontFamily: "ui-monospace,SF Mono,Menlo,monospace",
  fontSize: "8",
  fill: "rgba(246,243,238,0.55)",
  letterSpacing: "0.15em"
}, "MPH"))), React.createElement("div", {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: 6
  }
}, [['68.1', 'BUSINESS MI', '#1B4DDB'], ['23.1', 'PERSONAL MI', '#378ADD'], ['$49.39', 'DEDUCTION', '#C9A96E']].map(([v, k, c]) => React.createElement("div", {
  key: k,
  style: {
    background: 'rgba(10,22,40,0.5)',
    border: '1px solid rgba(27,77,219,0.15)',
    borderRadius: 10,
    padding: '8px 6px',
    textAlign: 'center'
  }
}, React.createElement("div", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 16,
    color: c,
    lineHeight: 1
  }
}, v), React.createElement("div", {
  style: {
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
    fontSize: 7,
    color: 'rgba(246,243,238,0.55)',
    letterSpacing: '0.1em',
    marginTop: 3
  }
}, k))))), React.createElement("div", {
  style: {
    display: 'flex',
    gap: 6,
    padding: '12px 14px 6px'
  }
}, React.createElement("button", {
  style: {
    flex: 1,
    padding: '7px 0',
    borderRadius: 100,
    background: '#0B0F0E',
    color: '#F8F9FA',
    border: 'none',
    fontSize: 10.5,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  }
}, React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: 10,
  height: 10
}, React.createElement("circle", {
  cx: "5",
  cy: "8",
  r: "3",
  fill: "none",
  stroke: "#F8F9FA",
  strokeWidth: "1.4"
}), React.createElement("path", {
  d: "M8 8 L12 5 L14 7",
  stroke: "#F8F9FA",
  strokeWidth: "1.4",
  fill: "none",
  strokeLinecap: "round"
})), "Auto On"), React.createElement("button", {
  style: {
    flex: 1,
    padding: '7px 0',
    borderRadius: 100,
    background: '#FFFFFF',
    color: '#0B0F0E',
    border: '1px solid #E5E7EB',
    fontSize: 10.5,
    fontWeight: 500
  }
}, "+ Add Manual"), React.createElement("button", {
  style: {
    flex: 1,
    padding: '7px 0',
    borderRadius: 100,
    background: '#FFFFFF',
    color: '#0B0F0E',
    border: '1px solid #E5E7EB',
    fontSize: 10.5,
    fontWeight: 500
  }
}, "Map")), React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: '6px 18px 8px'
  }
}, React.createElement("span", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: '-0.01em'
  }
}, "Recent Trips"), React.createElement("span", {
  style: {
    fontSize: 10,
    color: '#1B4DDB',
    fontWeight: 500
  }
}, "See all \u2192")), React.createElement("div", {
  style: {
    padding: '0 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
    overflow: 'hidden'
  }
}, [{
  time: '2:10 PM',
  dur: '18 min',
  tag: 'BUSINESS',
  tagColor: '#1B4DDB',
  tagBg: 'rgba(27,77,219,0.08)',
  from: '123 Main St, Downtown',
  to: '456 Oak Ave, Westside',
  ded: '8.4',
  stop: 'Client Meeting',
  sub: '+$8.10'
}, {
  time: '11:15 AM',
  dur: '9 min',
  tag: 'PERSONAL',
  tagColor: '#6B7280',
  tagBg: '#F8F9FA',
  from: 'Home, Maple Drive',
  to: 'Costco, Regent Ave',
  ded: '3.2',
  money: '$47.63',
  hint: 'missed deduction so far'
}].map((t, i) => React.createElement("div", {
  key: i,
  style: {
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: '9px 12px',
    position: 'relative'
  }
}, React.createElement("div", {
  style: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  }
}, React.createElement("span", {
  style: {
    fontSize: 9,
    color: '#6B7280',
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace'
  }
}, t.time, " \xB7 ", t.dur), React.createElement("span", {
  style: {
    fontSize: 8,
    padding: '2px 7px',
    borderRadius: 100,
    background: t.tagBg,
    color: t.tagColor,
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace',
    letterSpacing: '0.1em',
    fontWeight: 600
  }
}, t.tag)), React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8
  }
}, React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 3
  }
}, React.createElement("span", {
  style: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#0B0F0E'
  }
}), React.createElement("span", {
  style: {
    width: 1,
    height: 14,
    background: '#E5E7EB',
    margin: '2px 0'
  }
}), React.createElement("span", {
  style: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: t.tagColor
  }
})), React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 0,
    fontSize: 10,
    lineHeight: 1.35
  }
}, React.createElement("div", {
  style: {
    color: '#0B0F0E'
  }
}, t.from), React.createElement("div", {
  style: {
    color: '#0B0F0E',
    marginTop: 2
  }
}, t.to), t.stop && React.createElement("div", {
  style: {
    marginTop: 4,
    fontSize: 8.5,
    color: '#6B7280',
    fontFamily: 'ui-monospace,\'SF Mono\',Menlo,monospace'
  }
}, t.stop, " ", React.createElement("span", {
  style: {
    color: '#16A34A'
  }
}, t.sub)), t.hint && React.createElement("div", {
  style: {
    marginTop: 4,
    fontSize: 8,
    color: '#9CA3AF',
    fontStyle: 'normal'
  }
}, t.hint)), React.createElement("div", {
  style: {
    textAlign: 'right'
  }
}, React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontWeight: 700,
    fontSize: 15,
    fontStyle: 'normal',
    color: t.tagColor,
    lineHeight: 1
  }
}, t.money || t.ded)))))), React.createElement("div", {
  style: {
    margin: '8px 14px 16px',
    padding: '8px',
    background: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 100,
    display: 'flex',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'space-around'
  }
}, React.createElement("button", {
  style: {
    padding: '7px 14px',
    borderRadius: 100,
    background: '#1B4DDB',
    color: '#FFF',
    border: 'none',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5
  }
}, React.createElement("svg", {
  viewBox: "0 0 16 16",
  width: 11,
  height: 11
}, React.createElement("path", {
  d: "M3 11 L5 6 L11 6 L13 11 M4 11 L12 11 M5.5 13 L5.5 13.5 M10.5 13 L10.5 13.5",
  stroke: "#FFF",
  strokeWidth: "1.5",
  fill: "none",
  strokeLinecap: "round"
}), React.createElement("rect", {
  x: "4",
  y: "11",
  width: "8",
  height: "2.5",
  rx: "0.5",
  fill: "#FFF"
})), "Drive"), ['Trips', 'Stats', 'Alerts'].map((t, i) => React.createElement("button", {
  key: t,
  style: {
    padding: '7px 10px',
    borderRadius: 100,
    background: 'transparent',
    color: '#6B7280',
    border: 'none',
    fontSize: 11,
    fontWeight: 500
  }
}, t)))));
window.HeroPhone = HeroPhone;
window.MSLogo = MSLogo;
window.MSNav = MSNav;
window.MSHero = MSHero;
window.MSHow = MSHow;
window.MSFeatures = MSFeatures;
window.MSRegionPill = MSRegionPill;