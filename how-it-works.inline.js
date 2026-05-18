const HIWDetail = () => {
  const steps = [{
    n: '01',
    title: 'Install and forget about setup.',
    sub: 'Takes 90 seconds. Then never again.',
    bullets: ['Download from the App Store', 'Sign in with Google, Apple, or email', 'Grant location permission (background mode)', 'That\'s it — there is no step 4'],
    note: 'No hardware. No OBD plug. No Bluetooth beacon. Just your phone and 90 seconds of your time.',
    color: '#1B4DDB'
  }, {
    n: '02',
    title: 'Drive normally. We track everything.',
    sub: 'Zero taps per trip.',
    bullets: ['App detects driving motion automatically', 'Logs start point, end point, route, and distance', 'Records timestamps and duration', 'Runs silently even when your phone is locked'],
    note: '"You drove 12.3 miles from your office to a client meeting. We logged it. You didn\'t have to think about it." Every logged mile = $0.725 in potential deductions.',
    color: '#16A34A'
  }, {
    n: '03',
    title: 'Classify at the end of the day.',
    sub: '~12 seconds. Seriously.',
    bullets: ['Open the app — your trips are waiting', 'Swipe right for Business, left for Personal', 'Bulk classify recurring routes with one tap', 'AI learns your patterns after the first week'],
    note: 'After a week, 80% of your trips classify themselves. You just review the AI\'s work.',
    color: '#C9A96E'
  }, {
    n: '04',
    title: 'Export and file.',
    sub: 'One tap. Done.',
    bullets: ['Tap Export → choose PDF or CSV', 'PDF includes all four required elements', 'CSV imports directly into QuickBooks, Xero, FreshBooks', 'Send to your accountant or upload to TurboTax'],
    note: 'That 12.3-mile trip to your client meeting? It\'s now an $8.92 deduction. Multiplied by every work trip you took this year.',
    color: '#1B4DDB'
  }];
  const Phone01 = () => React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 0'
    }
  }, React.createElement("svg", {
    viewBox: "0 0 240 440",
    style: {
      width: '100%',
      maxWidth: '176px',
      display: 'block'
    },
    "aria-hidden": "true"
  }, React.createElement("g", {
    className: "s01-phone"
  }, React.createElement("rect", {
    width: "240",
    height: "440",
    rx: "30",
    fill: "#0F1729"
  }), React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "76",
    y: "14",
    width: "88",
    height: "22",
    rx: "11",
    fill: "#0F1729"
  }), React.createElement("g", {
    className: "s01-screen1"
  }, React.createElement("rect", {
    x: "76",
    y: "76",
    width: "88",
    height: "88",
    rx: "20",
    fill: "#E8EEFF"
  }), React.createElement("g", {
    className: "s01-dl-icon"
  }, React.createElement("line", {
    x1: "120",
    y1: "96",
    x2: "120",
    y2: "134",
    stroke: "#1B4DDB",
    strokeWidth: "5",
    strokeLinecap: "round"
  }), React.createElement("polyline", {
    points: "107,123 120,137 133,123",
    fill: "none",
    stroke: "#1B4DDB",
    strokeWidth: "5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), React.createElement("g", {
    className: "s01-dl-check"
  }, React.createElement("circle", {
    cx: "120",
    cy: "120",
    r: "24",
    fill: "#22C55E"
  }), React.createElement("polyline", {
    points: "109,120 116,129 133,109",
    fill: "none",
    stroke: "white",
    strokeWidth: "4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), React.createElement("rect", {
    x: "66",
    y: "178",
    width: "108",
    height: "10",
    rx: "5",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "80",
    y: "193",
    width: "80",
    height: "8",
    rx: "4",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "36",
    y: "346",
    width: "168",
    height: "6",
    rx: "3",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "36",
    y: "346",
    width: "108",
    height: "6",
    rx: "3",
    fill: "#1B4DDB"
  })), React.createElement("g", {
    className: "s01-screen2"
  }, React.createElement("rect", {
    x: "58",
    y: "70",
    width: "124",
    height: "12",
    rx: "6",
    fill: "#0F1729",
    fillOpacity: "0.12"
  }), React.createElement("rect", {
    x: "78",
    y: "87",
    width: "84",
    height: "8",
    rx: "4",
    fill: "#0F1729",
    fillOpacity: "0.07"
  }), React.createElement("rect", {
    x: "28",
    y: "124",
    width: "184",
    height: "46",
    rx: "10",
    fill: "#1B4DDB",
    fillOpacity: "0.08"
  }), React.createElement("rect", {
    x: "28",
    y: "124",
    width: "184",
    height: "46",
    rx: "10",
    fill: "none",
    stroke: "#1B4DDB",
    strokeWidth: "2"
  }), React.createElement("rect", {
    x: "50",
    y: "143",
    width: "10",
    height: "12",
    rx: "3",
    fill: "#1B4DDB",
    fillOpacity: "0.6"
  }), React.createElement("rect", {
    x: "68",
    y: "143",
    width: "90",
    height: "8",
    rx: "4",
    fill: "#1B4DDB",
    fillOpacity: "0.45"
  }), React.createElement("rect", {
    x: "28",
    y: "178",
    width: "184",
    height: "46",
    rx: "10",
    fill: "#F8F9FA"
  }), React.createElement("rect", {
    x: "68",
    y: "197",
    width: "90",
    height: "8",
    rx: "4",
    fill: "#0F1729",
    fillOpacity: "0.15"
  }), React.createElement("rect", {
    x: "28",
    y: "232",
    width: "184",
    height: "46",
    rx: "10",
    fill: "#F8F9FA"
  }), React.createElement("rect", {
    x: "68",
    y: "251",
    width: "90",
    height: "8",
    rx: "4",
    fill: "#0F1729",
    fillOpacity: "0.12"
  })), React.createElement("g", {
    className: "s01-screen3"
  }, React.createElement("circle", {
    cx: "120",
    cy: "114",
    r: "38",
    fill: "#E8EEFF"
  }), React.createElement("path", {
    d: "M120 82C102 82 90 95 90 112C90 132 120 158 120 158C120 158 150 132 150 112C150 95 138 82 120 82Z",
    fill: "#1B4DDB"
  }), React.createElement("circle", {
    cx: "120",
    cy: "110",
    r: "10",
    fill: "white"
  }), React.createElement("rect", {
    x: "42",
    y: "170",
    width: "156",
    height: "12",
    rx: "6",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "56",
    y: "187",
    width: "128",
    height: "10",
    rx: "5",
    fill: "#E8EEFF",
    fillOpacity: "0.65"
  }), React.createElement("g", {
    className: "s01-pulse-btn"
  }, React.createElement("rect", {
    x: "48",
    y: "226",
    width: "144",
    height: "44",
    rx: "22",
    fill: "#1B4DDB"
  }), React.createElement("rect", {
    x: "72",
    y: "244",
    width: "96",
    height: "8",
    rx: "4",
    fill: "white",
    fillOpacity: "0.85"
  })), React.createElement("rect", {
    x: "78",
    y: "284",
    width: "84",
    height: "8",
    rx: "4",
    fill: "#0F1729",
    fillOpacity: "0.14"
  })), React.createElement("g", {
    className: "s01-screen4"
  }, React.createElement("circle", {
    cx: "120",
    cy: "178",
    r: "72",
    fill: "#DCFCE7"
  }), React.createElement("circle", {
    cx: "120",
    cy: "178",
    r: "54",
    fill: "#22C55E"
  }), React.createElement("polyline", {
    points: "95,178 110,195 148,155",
    fill: "none",
    stroke: "white",
    strokeWidth: "7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), React.createElement("rect", {
    x: "68",
    y: "272",
    width: "104",
    height: "14",
    rx: "7",
    fill: "#0F1729",
    fillOpacity: "0.13"
  }), React.createElement("rect", {
    x: "82",
    y: "292",
    width: "76",
    height: "10",
    rx: "5",
    fill: "#0F1729",
    fillOpacity: "0.07"
  })))));
  const Phone02 = () => React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 0'
    }
  }, React.createElement("svg", {
    viewBox: "0 0 240 440",
    style: {
      width: '100%',
      maxWidth: '176px',
      display: 'block'
    },
    "aria-hidden": "true"
  }, React.createElement("defs", null, React.createElement("clipPath", {
    id: "scr02"
  }, React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22"
  }))), React.createElement("g", {
    className: "s02-phone"
  }, React.createElement("rect", {
    width: "240",
    height: "440",
    rx: "30",
    fill: "#0F1729"
  }), React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "76",
    y: "14",
    width: "88",
    height: "22",
    rx: "11",
    fill: "#0F1729"
  }), React.createElement("g", {
    clipPath: "url(#scr02)"
  }, React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "290",
    fill: "#F0F2F6"
  }), React.createElement("line", {
    x1: "10",
    y1: "96",
    x2: "230",
    y2: "96",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "10",
    y1: "156",
    x2: "230",
    y2: "156",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "10",
    y1: "216",
    x2: "230",
    y2: "216",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "10",
    y1: "276",
    x2: "230",
    y2: "276",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "70",
    y1: "36",
    x2: "70",
    y2: "326",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "130",
    y1: "36",
    x2: "130",
    y2: "326",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("line", {
    x1: "190",
    y1: "36",
    x2: "190",
    y2: "326",
    stroke: "#E2E6ED",
    strokeWidth: "1"
  }), React.createElement("path", {
    className: "s02-route",
    d: "M 44 190 C 78 148 140 230 196 190",
    fill: "none",
    stroke: "#1B4DDB",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeDasharray: "220",
    strokeDashoffset: "0"
  }), React.createElement("circle", {
    cx: "44",
    cy: "190",
    r: "8",
    fill: "#1B4DDB"
  }), React.createElement("circle", {
    cx: "44",
    cy: "190",
    r: "4",
    fill: "white"
  }), React.createElement("circle", {
    cx: "196",
    cy: "190",
    r: "8",
    fill: "#C9A96E"
  }), React.createElement("circle", {
    cx: "196",
    cy: "190",
    r: "4",
    fill: "white"
  }), React.createElement("g", {
    className: "s02-car"
  }, React.createElement("rect", {
    x: "184",
    y: "177",
    width: "22",
    height: "12",
    rx: "3",
    fill: "#0F1729"
  }), React.createElement("rect", {
    x: "188",
    y: "171",
    width: "14",
    height: "8",
    rx: "2",
    fill: "#0F1729"
  }), React.createElement("circle", {
    cx: "188",
    cy: "189",
    r: "4",
    fill: "#4a5568"
  }), React.createElement("circle", {
    cx: "202",
    cy: "189",
    r: "4",
    fill: "#4a5568"
  })), React.createElement("rect", {
    x: "10",
    y: "326",
    width: "220",
    height: "98",
    fill: "#FFFFFF"
  }), React.createElement("line", {
    x1: "10",
    y1: "326",
    x2: "230",
    y2: "326",
    stroke: "#E5E7EB",
    strokeWidth: "1"
  }), React.createElement("rect", {
    x: "20",
    y: "336",
    width: "72",
    height: "8",
    rx: "4",
    fill: "#E8EEFF"
  }), React.createElement("text", {
    className: "s02-cnt0",
    x: "20",
    y: "368",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "19",
    fill: "#0F1729"
  }, "0.0 mi"), React.createElement("text", {
    className: "s02-cnt1",
    x: "20",
    y: "368",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "19",
    fill: "#0F1729"
  }, "3.1 mi"), React.createElement("text", {
    className: "s02-cnt2",
    x: "20",
    y: "368",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "19",
    fill: "#0F1729"
  }, "6.7 mi"), React.createElement("text", {
    className: "s02-cnt3",
    x: "20",
    y: "368",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "19",
    fill: "#0F1729"
  }, "9.4 mi"), React.createElement("text", {
    className: "s02-cnt4",
    x: "20",
    y: "368",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "19",
    fill: "#0F1729"
  }, "12.3 mi"), React.createElement("g", {
    className: "s02-badge"
  }, React.createElement("rect", {
    x: "128",
    y: "352",
    width: "88",
    height: "28",
    rx: "14",
    fill: "#0F1729"
  }), React.createElement("text", {
    x: "172",
    y: "371",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "13",
    fill: "#C9A96E"
  }, "+$8.92")), React.createElement("rect", {
    x: "20",
    y: "384",
    width: "56",
    height: "7",
    rx: "3.5",
    fill: "#E5E7EB"
  })))));
  const Phone03 = () => React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 0'
    }
  }, React.createElement("svg", {
    viewBox: "0 0 240 440",
    style: {
      width: '100%',
      maxWidth: '176px',
      display: 'block'
    },
    "aria-hidden": "true"
  }, React.createElement("defs", null, React.createElement("clipPath", {
    id: "scr03"
  }, React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22"
  }))), React.createElement("g", {
    className: "s03-phone"
  }, React.createElement("rect", {
    width: "240",
    height: "440",
    rx: "30",
    fill: "#0F1729"
  }), React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "76",
    y: "14",
    width: "88",
    height: "22",
    rx: "11",
    fill: "#0F1729"
  }), React.createElement("g", {
    clipPath: "url(#scr03)"
  }, React.createElement("g", {
    className: "s03-trips"
  }, React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "390",
    fill: "#F8F9FA"
  }), React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "48",
    fill: "#FFFFFF"
  }), React.createElement("line", {
    x1: "10",
    y1: "84",
    x2: "230",
    y2: "84",
    stroke: "#E5E7EB",
    strokeWidth: "1"
  }), React.createElement("text", {
    x: "120",
    y: "66",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "15",
    fill: "#0F1729"
  }, "Today's Trips"), React.createElement("g", {
    className: "s03-card1"
  }, React.createElement("rect", {
    x: "20",
    y: "100",
    width: "200",
    height: "80",
    rx: "12",
    fill: "#FFFFFF",
    stroke: "#E5E7EB",
    strokeWidth: "1.5"
  }), React.createElement("text", {
    x: "36",
    y: "127",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "17",
    fill: "#0F1729"
  }, "12.3 mi"), React.createElement("text", {
    x: "36",
    y: "147",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: "12",
    fill: "#6B7280"
  }, "Office \u2192 Client Meeting"), React.createElement("circle", {
    cx: "36",
    cy: "165",
    r: "6",
    fill: "none",
    stroke: "#94A3B8",
    strokeWidth: "1.5"
  }), React.createElement("line", {
    x1: "36",
    y1: "165",
    x2: "36",
    y2: "160",
    stroke: "#94A3B8",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }), React.createElement("line", {
    x1: "36",
    y1: "165",
    x2: "40",
    y2: "165",
    stroke: "#94A3B8",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }), React.createElement("text", {
    x: "46",
    y: "169",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: "11",
    fill: "#94A3B8"
  }, "18 min")), React.createElement("g", {
    className: "s03-biz"
  }, React.createElement("rect", {
    x: "72",
    y: "118",
    width: "96",
    height: "26",
    rx: "13",
    fill: "#DCFCE7"
  }), React.createElement("text", {
    x: "120",
    y: "136",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "12",
    fill: "#22C55E"
  }, "BUSINESS")), React.createElement("g", {
    className: "s03-card2"
  }, React.createElement("rect", {
    x: "20",
    y: "100",
    width: "200",
    height: "80",
    rx: "12",
    fill: "#FFFFFF",
    stroke: "#E5E7EB",
    strokeWidth: "1.5"
  }), React.createElement("text", {
    x: "36",
    y: "127",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "17",
    fill: "#0F1729"
  }, "3.1 mi"), React.createElement("text", {
    x: "36",
    y: "147",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: "12",
    fill: "#6B7280"
  }, "Home \u2192 Grocery Store"), React.createElement("circle", {
    cx: "36",
    cy: "165",
    r: "6",
    fill: "none",
    stroke: "#94A3B8",
    strokeWidth: "1.5"
  }), React.createElement("line", {
    x1: "36",
    y1: "165",
    x2: "36",
    y2: "160",
    stroke: "#94A3B8",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }), React.createElement("line", {
    x1: "36",
    y1: "165",
    x2: "40",
    y2: "165",
    stroke: "#94A3B8",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }), React.createElement("text", {
    x: "46",
    y: "169",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: "11",
    fill: "#94A3B8"
  }, "8 min")), React.createElement("g", {
    className: "s03-per"
  }, React.createElement("rect", {
    x: "72",
    y: "118",
    width: "96",
    height: "26",
    rx: "13",
    fill: "#F1F5F9"
  }), React.createElement("text", {
    x: "120",
    y: "136",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "12",
    fill: "#94A3B8"
  }, "PERSONAL"))), React.createElement("g", {
    className: "s03-export"
  }, React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "390",
    fill: "#FFFFFF"
  }), React.createElement("text", {
    x: "120",
    y: "96",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "15",
    fill: "#0F1729"
  }, "Export Report"), React.createElement("text", {
    x: "120",
    y: "116",
    textAnchor: "middle",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: "12",
    fill: "#6B7280"
  }, "2026 \xB7 847 trips"), React.createElement("g", {
    className: "s03-pdf"
  }, React.createElement("rect", {
    x: "88",
    y: "140",
    width: "52",
    height: "64",
    rx: "4",
    fill: "#FFFFFF",
    stroke: "#E5E7EB",
    strokeWidth: "1.5"
  }), React.createElement("polygon", {
    points: "126,140 140,140 140,154",
    fill: "#EF4444"
  }), React.createElement("rect", {
    x: "98",
    y: "172",
    width: "32",
    height: "4",
    rx: "2",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "98",
    y: "182",
    width: "22",
    height: "4",
    rx: "2",
    fill: "#E5E7EB"
  })), React.createElement("g", {
    className: "s03-check3"
  }, React.createElement("circle", {
    cx: "152",
    cy: "152",
    r: "13",
    fill: "#22C55E"
  }), React.createElement("polyline", {
    points: "146,152 150,157 159,143",
    fill: "none",
    stroke: "white",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), React.createElement("g", {
    className: "s03-btn"
  }, React.createElement("rect", {
    x: "48",
    y: "232",
    width: "144",
    height: "44",
    rx: "22",
    fill: "#1B4DDB"
  }), React.createElement("text", {
    x: "120",
    y: "259",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "14",
    fill: "#FFFFFF"
  }, "Export PDF")))))));
  const Phone04 = () => React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '8px 0'
    }
  }, React.createElement("svg", {
    viewBox: "0 0 240 440",
    style: {
      width: '100%',
      maxWidth: '176px',
      display: 'block'
    },
    "aria-hidden": "true"
  }, React.createElement("defs", null, React.createElement("clipPath", {
    id: "scr04"
  }, React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22"
  }))), React.createElement("g", {
    className: "s04-phone"
  }, React.createElement("rect", {
    width: "240",
    height: "440",
    rx: "30",
    fill: "#0F1729"
  }), React.createElement("rect", {
    x: "10",
    y: "14",
    width: "220",
    height: "412",
    rx: "22",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "76",
    y: "14",
    width: "88",
    height: "22",
    rx: "11",
    fill: "#0F1729"
  }), React.createElement("g", {
    clipPath: "url(#scr04)"
  }, React.createElement("g", {
    className: "s04-log"
  }, React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "390",
    fill: "#F8F9FA"
  }), React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "46",
    fill: "#FFFFFF"
  }), React.createElement("line", {
    x1: "10",
    y1: "82",
    x2: "230",
    y2: "82",
    stroke: "#E5E7EB",
    strokeWidth: "1"
  }), React.createElement("text", {
    x: "120",
    y: "64",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "15",
    fill: "#0F1729"
  }, "Your Mileage Log"), React.createElement("rect", {
    x: "20",
    y: "90",
    width: "200",
    height: "34",
    rx: "8",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "30",
    y: "101",
    width: "34",
    height: "12",
    rx: "6",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "74",
    y: "101",
    width: "76",
    height: "8",
    rx: "4",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "168",
    y: "101",
    width: "40",
    height: "8",
    rx: "4",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "20",
    y: "130",
    width: "200",
    height: "34",
    rx: "8",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "30",
    y: "141",
    width: "34",
    height: "12",
    rx: "6",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "74",
    y: "141",
    width: "60",
    height: "8",
    rx: "4",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "168",
    y: "141",
    width: "40",
    height: "8",
    rx: "4",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "20",
    y: "170",
    width: "200",
    height: "34",
    rx: "8",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "30",
    y: "181",
    width: "34",
    height: "12",
    rx: "6",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "74",
    y: "181",
    width: "70",
    height: "8",
    rx: "4",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "168",
    y: "181",
    width: "40",
    height: "8",
    rx: "4",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "20",
    y: "210",
    width: "200",
    height: "34",
    rx: "8",
    fill: "#FFFFFF"
  }), React.createElement("rect", {
    x: "30",
    y: "221",
    width: "34",
    height: "12",
    rx: "6",
    fill: "#E8EEFF"
  }), React.createElement("rect", {
    x: "74",
    y: "221",
    width: "52",
    height: "8",
    rx: "4",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "168",
    y: "221",
    width: "40",
    height: "8",
    rx: "4",
    fill: "#E8EEFF"
  })), React.createElement("g", {
    className: "s04-btn"
  }, React.createElement("g", {
    className: "s04-btn-inner"
  }, React.createElement("rect", {
    x: "48",
    y: "352",
    width: "144",
    height: "44",
    rx: "22",
    fill: "#1B4DDB"
  }), React.createElement("text", {
    x: "120",
    y: "379",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "14",
    fill: "#FFFFFF"
  }, "Export"))), React.createElement("g", {
    className: "s04-pills"
  }, React.createElement("rect", {
    x: "10",
    y: "36",
    width: "220",
    height: "390",
    fill: "#FFFFFF"
  }), React.createElement("text", {
    x: "120",
    y: "80",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "14",
    fill: "#0F1729"
  }, "Choose format"), React.createElement("rect", {
    x: "46",
    y: "104",
    width: "68",
    height: "36",
    rx: "18",
    fill: "#1B4DDB"
  }), React.createElement("text", {
    x: "80",
    y: "127",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "13",
    fill: "#FFFFFF"
  }, "PDF"), React.createElement("rect", {
    x: "126",
    y: "104",
    width: "68",
    height: "36",
    rx: "18",
    fill: "none",
    stroke: "#E5E7EB",
    strokeWidth: "2"
  }), React.createElement("text", {
    x: "160",
    y: "127",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "13",
    fill: "#94A3B8"
  }, "CSV")), React.createElement("g", {
    className: "s04-pdfdoc"
  }, React.createElement("rect", {
    x: "62",
    y: "110",
    width: "116",
    height: "150",
    rx: "6",
    fill: "#FFFFFF",
    stroke: "#E5E7EB",
    strokeWidth: "1.5"
  }), React.createElement("polygon", {
    points: "156,110 178,110 178,132",
    fill: "#EF4444"
  }), React.createElement("text", {
    x: "120",
    y: "142",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "11",
    fill: "#0F1729"
  }, "MyMilesAI"), React.createElement("line", {
    x1: "72",
    y1: "152",
    x2: "168",
    y2: "152",
    stroke: "#E5E7EB",
    strokeWidth: "1"
  }), React.createElement("text", {
    x: "120",
    y: "170",
    textAnchor: "middle",
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: "10",
    fill: "#6B7280"
  }, "Standard Format"), React.createElement("rect", {
    x: "72",
    y: "180",
    width: "96",
    height: "5",
    rx: "2.5",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "72",
    y: "192",
    width: "80",
    height: "5",
    rx: "2.5",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "72",
    y: "204",
    width: "88",
    height: "5",
    rx: "2.5",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "72",
    y: "216",
    width: "64",
    height: "5",
    rx: "2.5",
    fill: "#E5E7EB"
  }), React.createElement("rect", {
    x: "72",
    y: "228",
    width: "96",
    height: "5",
    rx: "2.5",
    fill: "#E5E7EB"
  })), React.createElement("g", {
    className: "s04-check4"
  }, React.createElement("circle", {
    cx: "150",
    cy: "122",
    r: "16",
    fill: "#22C55E"
  }), React.createElement("polyline", {
    points: "143,122 148,128 158,112",
    fill: "none",
    stroke: "white",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), React.createElement("g", {
    className: "s04-apps"
  }, React.createElement("circle", {
    cx: "72",
    cy: "316",
    r: "18",
    fill: "#22C55E"
  }), React.createElement("text", {
    x: "72",
    y: "322",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "14",
    fill: "white"
  }, "Q"), React.createElement("circle", {
    cx: "120",
    cy: "316",
    r: "18",
    fill: "#1B4DDB"
  }), React.createElement("text", {
    x: "120",
    y: "322",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "14",
    fill: "white"
  }, "X"), React.createElement("circle", {
    cx: "168",
    cy: "316",
    r: "18",
    fill: "#EF4444"
  }), React.createElement("text", {
    x: "168",
    y: "322",
    textAnchor: "middle",
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: "700",
    fontSize: "14",
    fill: "white"
  }, "T"))))));
  return React.createElement("section", {
    style: {
      padding: '40px 56px 40px',
      background: '#FFFFFF'
    }
  }, React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0
    }
  }, steps.map((s, i) => {
    const textContent = React.createElement("div", {
      style: {
        paddingTop: 10
      }
    }, React.createElement("h3", {
      style: {
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
        fontWeight: 700,
        fontSize: 22,
        marginBottom: 6,
        letterSpacing: '-0.02em'
      }
    }, s.title), React.createElement("div", {
      style: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: "'DM Sans',system-ui,sans-serif",
        fontWeight: 500,
        marginBottom: 12
      }
    }, s.sub), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 12
      }
    }, s.bullets.map((b, bi) => React.createElement("div", {
      key: bi,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        fontSize: 17,
        color: '#1F1D1A'
      }
    }, React.createElement("svg", {
      viewBox: "0 0 16 16",
      width: 14,
      height: 14,
      style: {
        flexShrink: 0,
        marginTop: 3
      },
      fill: "none"
    }, React.createElement("path", {
      d: "M3 8L6.5 11.5L13 4.5",
      stroke: s.color,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })), b))), React.createElement("div", {
      style: {
        background: '#F8F9FA',
        border: `1px solid ${s.color}33`,
        borderLeft: `3px solid ${s.color}`,
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: 15,
        color: '#374151',
        lineHeight: 1.6,
        fontStyle: 'normal',
        maxWidth: 580
      }
    }, s.note));
    return React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: 32,
        paddingBottom: i < steps.length - 1 ? 28 : 0,
        marginBottom: i < steps.length - 1 ? 0 : 0,
        position: 'relative'
      }
    }, i < steps.length - 1 && React.createElement("div", {
      style: {
        position: 'absolute',
        left: 36,
        top: 44,
        bottom: 0,
        width: 2,
        background: '#E5E7EB'
      }
    }), React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
        zIndex: 1
      }
    }, React.createElement("div", {
      style: {
        width: 48,
        height: 48,
        borderRadius: '50%',
        background: s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FFFFFF',
        fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0
      }
    }, s.n)), React.createElement("div", {
      className: "step-content-grid"
    }, textContent, i === 0 ? React.createElement(Phone01, null) : i === 1 ? React.createElement(Phone02, null) : i === 2 ? React.createElement(Phone03, null) : React.createElement(Phone04, null)));
  })));
};
const HIWCalculator = () => {
  const [miles, setMiles] = React.useState(100);
  const rate = 0.725;
  const annual = Math.round(miles * 52 * rate);
  const weekly = (miles * rate).toFixed(2);
  return React.createElement("section", {
    style: {
      padding: '80px 56px',
      background: '#0F1729',
      color: '#F8F9FA'
    }
  }, React.createElement("div", {
    style: {
      maxWidth: 680,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontSize: 14,
      fontWeight: 600,
      color: 'rgba(248,249,250,0.6)',
      marginBottom: 20
    }
  }, "\u2014 Quick calculator"), React.createElement("h2", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(24px,3vw,38px)',
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      marginBottom: 16
    }
  }, "How much are you leaving on the table?"), React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'rgba(246,243,238,0.65)',
      marginBottom: 48
    }
  }, "Enter your typical business miles per week and see your estimated annual deduction at the 2026 standard mileage rate."), React.createElement("div", {
    style: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16,
      padding: '40px 40px',
      marginBottom: 32
    }
  }, React.createElement("div", {
    style: {
      marginBottom: 32
    }
  }, React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 14,
      color: 'rgba(248,249,250,0.7)',
      marginBottom: 12,
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 500
    }
  }, "Business miles per week"), React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, React.createElement("input", {
    type: "range",
    min: 10,
    max: 500,
    step: 10,
    value: miles,
    onChange: e => setMiles(Number(e.target.value)),
    style: {
      flex: 1,
      accentColor: '#1B4DDB',
      height: 6,
      cursor: 'pointer'
    }
  }), React.createElement("div", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 28,
      color: '#FFFFFF',
      minWidth: 64,
      textAlign: 'right'
    }
  }, miles))), React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20
    }
  }, React.createElement("div", {
    style: {
      background: 'rgba(27,77,219,0.2)',
      border: '1px solid rgba(27,77,219,0.3)',
      borderRadius: 10,
      padding: '20px 16px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 32,
      color: '#378ADD',
      lineHeight: 1,
      marginBottom: 6
    }
  }, "$", weekly), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'rgba(248,249,250,0.55)',
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 500
    }
  }, "Weekly deduction")), React.createElement("div", {
    style: {
      background: 'rgba(201,169,110,0.15)',
      border: '1px solid rgba(201,169,110,0.3)',
      borderRadius: 10,
      padding: '20px 16px',
      textAlign: 'center'
    }
  }, React.createElement("div", {
    style: {
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      fontWeight: 800,
      fontSize: 32,
      color: '#C9A96E',
      lineHeight: 1,
      marginBottom: 6
    }
  }, "$", annual.toLocaleString()), React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'rgba(248,249,250,0.55)',
      fontFamily: "'DM Sans',system-ui,sans-serif",
      fontWeight: 500
    }
  }, "Annual deduction"))), React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 12,
      color: 'rgba(248,249,250,0.4)',
      fontFamily: "'DM Sans',system-ui,sans-serif"
    }
  }, "At the 2026 standard mileage rate \xB7 ", miles, " mi/wk \xD7 52 weeks \xB7 Not tax advice \u2014 consult a tax professional")), React.createElement("a", {
    href: "signup/",
    style: {
      background: '#1B4DDB',
      color: '#FFFFFF',
      padding: '18px 36px',
      borderRadius: 100,
      fontSize: 15,
      fontWeight: 700,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      boxShadow: '0 12px 32px -8px rgba(27,77,219,0.5)'
    }
  }, "Start tracking \u2014 free for 7 days", React.createElement("svg", {
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
  })))));
};
const HIWBottomCTA = () => React.createElement("section", {
  style: {
    padding: '80px 56px',
    background: '#F8F9FA',
    borderTop: '1px solid #E5E7EB',
    textAlign: 'center'
  }
}, React.createElement("div", {
  style: {
    maxWidth: 640,
    margin: '0 auto'
  }
}, React.createElement("div", {
  style: {
    fontFamily: "'DM Sans',system-ui,sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#1B4DDB',
    marginBottom: 16
  }
}, "\u2014 Ready?"), React.createElement("h2", {
  style: {
    fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    fontWeight: 800,
    fontSize: 'clamp(26px,3vw,38px)',
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    marginBottom: 12
  }
}, "Your first deductible mile starts today."), React.createElement("p", {
  style: {
    fontSize: 17,
    color: '#374151',
    lineHeight: 1.6,
    marginBottom: 32
  }
}, "Download, drive, deduct. It takes 90 seconds to set up and nothing to maintain."), React.createElement("div", {
  style: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20
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
    fontFamily: "'DM Sans',system-ui,sans-serif"
  }
}, "7 days free. Cancel anytime. \xB7 Multi-region")));
const BeforeAfterWidget = () => React.createElement("div", {
  className: "ba-wrap",
  "aria-hidden": "true"
}, React.createElement("div", {
  className: "ba-left"
}, React.createElement("div", {
  className: "ba-left-header"
}, "Mileage Log \u2014 2025 \xA0", React.createElement("s", null, "$")), React.createElement("div", {
  className: "ba-entry"
}, "Tues \u2014 client visit \u2014 12mi? maybe"), React.createElement("div", {
  className: "ba-entry"
}, "Wed \u2014 Acme Corp \u2014 4 (or 5?)"), React.createElement("div", {
  className: "ba-entry"
}, React.createElement("s", null, "Thurs \u2014 forgot")), React.createElement("div", {
  className: "ba-entry"
}, "Fri \u2014 Bank run \u2014 1.something"), React.createElement("div", {
  className: "ba-left-total"
}, "Total: ???"), React.createElement("svg", {
  className: "ba-coffee",
  viewBox: "0 0 60 60",
  width: "56",
  height: "56"
}, React.createElement("circle", {
  cx: "30",
  cy: "30",
  r: "22",
  fill: "none",
  stroke: "#C9A96E",
  strokeWidth: "2.5",
  opacity: "0.28"
}), React.createElement("circle", {
  cx: "30",
  cy: "30",
  r: "17",
  fill: "none",
  stroke: "#C9A96E",
  strokeWidth: "1",
  opacity: "0.15"
}))), React.createElement("div", {
  className: "ba-arrow-wrap"
}, React.createElement("svg", {
  viewBox: "0 0 28 20",
  width: "26",
  height: "18",
  fill: "none"
}, React.createElement("path", {
  d: "M2 10H24M17 3L24 10L17 17",
  stroke: "#1B4DDB",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), React.createElement("span", {
  className: "ba-arrow-label"
}, "MyMilesAI")), React.createElement("div", {
  className: "ba-right"
}, React.createElement("div", {
  className: "ba-right-badge"
}, React.createElement("span", {
  className: "ba-badge-dot"
}), "VERIFIED"), React.createElement("div", {
  className: "ba-right-title"
}, "Mileage Log \xB7 Q1 Summary"), React.createElement("div", {
  className: "ba-rows"
}, React.createElement("div", {
  className: "ba-row ba-row1"
}, React.createElement("div", {
  className: "ba-row-info"
}, React.createElement("div", {
  className: "ba-row-trip"
}, "Home \u2192 Client A"), React.createElement("div", {
  className: "ba-row-meta"
}, "01/04 \xB7 24.1 mi")), React.createElement("span", {
  className: "ba-row-amount"
}, "$17.47")), React.createElement("div", {
  className: "ba-row ba-row2"
}, React.createElement("div", {
  className: "ba-row-info"
}, React.createElement("div", {
  className: "ba-row-trip"
}, "Client A \u2192 Client B"), React.createElement("div", {
  className: "ba-row-meta"
}, "01/04 \xB7 12.8 mi")), React.createElement("span", {
  className: "ba-row-amount"
}, "$9.28")), React.createElement("div", {
  className: "ba-row ba-row3"
}, React.createElement("div", {
  className: "ba-row-info"
}, React.createElement("div", {
  className: "ba-row-trip"
}, "Home \u2192 Warehouse"), React.createElement("div", {
  className: "ba-row-meta"
}, "01/05 \xB7 8.4 mi")), React.createElement("span", {
  className: "ba-row-amount"
}, "$6.09")), React.createElement("div", {
  className: "ba-row ba-row4"
}, React.createElement("div", {
  className: "ba-row-info"
}, React.createElement("div", {
  className: "ba-row-trip"
}, "Office \u2192 Airport"), React.createElement("div", {
  className: "ba-row-meta"
}, "01/06 \xB7 31.2 mi")), React.createElement("span", {
  className: "ba-row-amount"
}, "$22.62"))), React.createElement("div", {
  className: "ba-divider"
}), React.createElement("div", {
  className: "ba-bottom"
}, React.createElement("span", {
  className: "ba-bottom-label"
}, "Illustrative \xB7 Sample"), React.createElement("span", {
  className: "ba-total-num"
}))));
const Site = () => React.createElement(React.Fragment, null, React.createElement(MSNav, null), React.createElement("section", {
  className: "page-hero"
}, React.createElement("div", {
  className: "page-hero-inner"
}, React.createElement("div", null, React.createElement("div", {
  className: "eyebrow"
}, "\u2014 How it works"), React.createElement("h1", null, "From download to deduction in under a minute."), React.createElement("p", null, "No hardware. No setup fees. Just your phone, your car, and 90 seconds."), React.createElement("div", {
  className: "page-hero-ctas"
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
  className: "page-hero-trust"
}, "7 days free. Cancel anytime. \xB7 Multi-region")), React.createElement(BeforeAfterWidget, null))), React.createElement(HIWDetail, null), React.createElement(HIWCalculator, null), React.createElement(HIWBottomCTA, null), React.createElement(MSFooter, null));
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Site, null));