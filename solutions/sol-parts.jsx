/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 * Confidential and proprietary. Unauthorized use prohibited.
 * MyMilesAI is a recordkeeping tool - not tax advice.
 * See LICENSE for full terms. harijasllc@outlook.com
 */

/* Solutions shared components — exported to window.Sol*
   Requires: locale.js loaded first (window.MM), ms-parts1.jsx (MSLogo, MSRegionPill, MSFooter, MSCTA)
   CSS: solutions.css (pa- keyframes, phone frame, sol- layout classes) */

/* ─────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────── */
const SOL_BEAT_MS = 2000;
const SOL_REDUCED = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SOL_BEAT_META = [
  { label:'Drive detected', step:'1/4', color:'#1B4DDB', bg:'rgba(27,77,219,0.06)',   border:'rgba(27,77,219,0.22)'   },
  { label:'Classified',     step:'2/4', color:'#1B4DDB', bg:'rgba(27,77,219,0.06)',   border:'rgba(27,77,219,0.22)'   },
  { label:'Logged',         step:'3/4', color:'#16A34A', bg:'rgba(22,163,74,0.06)',   border:'rgba(22,163,74,0.25)'   },
  { label:'Deducted',       step:'4/4', color:'#C9A96E', bg:'rgba(201,169,110,0.07)', border:'rgba(201,169,110,0.35)' },
];

const SOL_PERSONA_SLUGS = ['realtors','rideshare','freelancers','small-business','construction','sales-reps'];

const SOL_PERSONA_META = {
  realtors:        { name:'Realtors',                 short:'Realtors'   },
  rideshare:       { name:'Rideshare & Delivery',     short:'Rideshare'  },
  freelancers:     { name:'Freelancers & Consultants',short:'Freelancers'},
  'small-business':{ name:'Small Business Owners',    short:'Small Biz'  },
  construction:    { name:'Construction & Trades',    short:'Trades'     },
  'sales-reps':    { name:'Sales Reps & Field Service',short:'Sales'     },
};

/* ─────────────────────────────────────────────────────────────────
   Persona SVG icons (24×24 viewport, stroke-based)
───────────────────────────────────────────────────────────────── */
const SOL_ICONS = {
  realtors: (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10.5z"/>
      <path d="M9 22V13h6v9"/>
    </svg>
  ),
  rideshare: (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3V9l2.5-5h11L19 9v8h-2"/>
      <circle cx="7.5" cy="17" r="2"/>
      <circle cx="16.5" cy="17" r="2"/>
      <path d="M3 12h18"/>
    </svg>
  ),
  freelancers: (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="13" rx="2"/>
      <path d="M2 10h20M8 21h8M12 18v3"/>
    </svg>
  ),
  'small-business': (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9h18v13H3z"/>
      <path d="M3 9l3-6h12l3 6"/>
      <path d="M3 9a3 3 0 0 0 6 0m0 0a3 3 0 0 0 6 0m0 0a3 3 0 0 0 6 0"/>
      <path d="M9 22v-7h6v7"/>
    </svg>
  ),
  construction: (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 20h20"/>
      <path d="M4 20v-6h16v6"/>
      <path d="M8 14v-4a4 4 0 0 1 8 0v4"/>
      <path d="M12 3v3"/>
      <path d="M6 6h12"/>
    </svg>
  ),
  'sales-reps': (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="15" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-4 0v2M8 7V5a2 2 0 0 0-4 0"/>
      <path d="M12 12v5M8.5 14.5l3.5-2.5 3.5 2.5"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────────
   Locale hook (shared by all components)
───────────────────────────────────────────────────────────────── */
const useLocale = () => {
  const [locale, setLocale] = React.useState(window.MM.get());
  React.useEffect(() => {
    const h = e => setLocale(e.detail.locale);
    document.addEventListener('mm-locale-change', h);
    return () => document.removeEventListener('mm-locale-change', h);
  }, []);
  return locale;
};

/* ─────────────────────────────────────────────────────────────────
   Beat 1 — GPS map / drive detection
───────────────────────────────────────────────────────────────── */
const SolBeatDetect = () => (
  <div style={{width:'100%',height:'100%',background:'#08101E',position:'relative',overflow:'hidden',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
    <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} aria-hidden="true">
      {[22,44,66,88].map(y=><line key={'h'+y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1B4DDB" strokeWidth="0.5" opacity="0.16"/>)}
      {[20,40,60,80].map(x=><line key={'v'+x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#1B4DDB" strokeWidth="0.5" opacity="0.16"/>)}
      <path d="M 44 400 Q 88 270 150 210 T 235 95" fill="none" stroke="#1B4DDB" strokeWidth="2.5"
        strokeDasharray="400" strokeLinecap="round"
        style={{animation:'pa-route-draw 0.8s 0.15s ease both'}}/>
      <circle cx="44" cy="400" r="5.5" fill="#F8F9FA" style={{animation:'pa-fade 0.3s ease both'}}/>
      <circle cx="235" cy="95" r="14" fill="none" stroke="rgba(27,77,219,0.3)" strokeWidth="1.5" style={{animation:'pa-fade 0.4s 0.7s ease both'}}/>
    </svg>
    <div style={{position:'absolute',top:'18%',left:'63%',transformOrigin:'50% 100%',animation:'pa-pin-drop 0.7s 0.4s cubic-bezier(0.22,1,0.36,1) both'}}>
      <svg viewBox="0 0 28 36" width={26} height={34} fill="none" aria-hidden="true">
        <path d="M14 0C6.3 0 0 6.3 0 14c0 8.4 14 22 14 22S28 22.4 28 14C28 6.3 21.7 0 14 0z" fill="#1B4DDB"/>
        <circle cx="14" cy="14" r="5.5" fill="#F8F9FA"/>
        <circle cx="14" cy="14" r="2" fill="#1B4DDB"/>
      </svg>
      <div style={{position:'absolute',bottom:-6,left:'50%',transform:'translateX(-50%)',width:12,height:5,background:'rgba(27,77,219,0.45)',borderRadius:'50%',filter:'blur(3px)'}}/>
    </div>
    <div style={{position:'absolute',bottom:18,left:10,right:10,animation:'pa-up 0.4s 0.9s ease both'}}>
      <div style={{background:'rgba(27,77,219,0.88)',border:'1px solid rgba(55,138,221,0.3)',borderRadius:13,padding:'10px 14px',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)'}}>
        <div style={{fontSize:9,color:'rgba(248,249,250,0.5)',marginBottom:3,letterSpacing:'0.07em',fontFamily:"ui-monospace,'SF Mono',Menlo,monospace"}}>● Background tracking</div>
        <div style={{fontSize:14,fontWeight:700,color:'#F8F9FA'}}>Drive detected</div>
      </div>
    </div>
    <div style={{position:'absolute',top:11,right:13,fontSize:9,color:'rgba(248,249,250,0.28)',fontFamily:"ui-monospace,'SF Mono',Menlo,monospace",fontVariantNumeric:'tabular-nums'}}>09:42:17</div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────
   Beat 2 — AI classification
───────────────────────────────────────────────────────────────── */
const SolBeatClassify = ({persona, locale}) => {
  const s = window.MM.strings[locale];
  const p = window.MM.personas[persona][locale];
  const trip = p.trips[0];
  return (
    <div style={{width:'100%',height:'100%',background:'#F8F9FA',display:'flex',flexDirection:'column',padding:'14px 12px',gap:10,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{fontSize:10,color:'#9CA3AF',animation:'pa-fade 0.3s ease both',marginTop:6}}>New trip detected</div>
      <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:12,padding:'12px 13px',animation:'pa-up 0.4s 0.1s ease both'}}>
        <div style={{fontSize:10,color:'#6B7280',marginBottom:4,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{trip.route}</div>
        <div style={{fontWeight:800,fontSize:22,color:'#111827',fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",lineHeight:1}}>{trip.dist} {s.unitShort}</div>
        <div style={{fontSize:11,color:'#16A34A',marginTop:5,fontWeight:600}}>${trip.amount} deductible · {s.rateShort}</div>
      </div>
      <div style={{display:'flex',gap:8,animation:'pa-up 0.4s 0.22s ease both'}}>
        <div style={{flex:1,background:'#F3F4F6',borderRadius:10,padding:'9px 6px',textAlign:'center',fontSize:11,fontWeight:600,color:'#9CA3AF'}}>← Personal</div>
        <div style={{flex:1.2,background:'#1B4DDB',borderRadius:10,padding:'9px 6px',textAlign:'center',fontSize:11,fontWeight:700,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:4}}>
          <svg viewBox="0 0 12 12" width={9} height={9} fill="none" aria-hidden="true"><path d="M6 1L7.5 4.5H11L8 7L9.5 11L6 8.5L2.5 11L4 7L1 4.5H4.5Z" fill="#fff" opacity="0.85"/></svg>
          Business →
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'center',animation:'pa-right 0.4s 0.42s ease both'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:5,background:'#EFF3FF',border:'1px solid #C7D6FB',borderRadius:100,padding:'5px 12px'}}>
          <svg viewBox="0 0 12 12" width={9} height={9} fill="none" aria-hidden="true"><path d="M6 1L7.5 4.5H11L8 7L9.5 11L6 8.5L2.5 11L4 7L1 4.5H4.5Z" fill="#1B4DDB" opacity="0.85"/></svg>
          <span style={{fontSize:11,fontWeight:700,color:'#1B4DDB'}}>AI classified · Business</span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Beat 3 — Logging counter
───────────────────────────────────────────────────────────────── */
const SolBeatLog = ({persona, locale}) => {
  const s = window.MM.strings[locale];
  const p = window.MM.personas[persona][locale];
  const distTotal = p.trips.reduce((sum, t) => sum + parseFloat(t.dist), 0);
  const [count, setCount] = React.useState(SOL_REDUCED ? 47 : 1);

  React.useEffect(() => {
    if (SOL_REDUCED) { setCount(47); return; }
    let active = true;
    const start = Date.now(), dur = 1500, target = 47;
    const tick = () => {
      if (!active) return;
      const prog = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.round(1 + (target - 1) * (1 - Math.pow(1 - prog, 3))));
      if (prog < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return () => { active = false; };
  }, []);

  const runDist = (distTotal * count / 47).toFixed(1);
  return (
    <div style={{width:'100%',height:'100%',background:'#F8F9FA',padding:'12px 12px',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{position:'relative',height:132,marginBottom:12}}>
        {[2,1,0].map(i => (
          <div key={i} style={{
            position:'absolute', top:i*5, left:-(i*5), right:-(i*5),
            background:'#fff', border:'1px solid #E5E7EB', borderRadius:10,
            padding:'9px 11px',
            boxShadow:i===0?'0 3px 12px -4px rgba(0,0,0,0.1)':'none',
            animation:`pa-up 0.4s ${(2-i)*0.06}s ease both`,
          }}>
            {i===0 && p.trips[0] && <>
              <div style={{fontSize:10,color:'#6B7280',marginBottom:3,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{p.trips[0].route}</div>
              <div style={{fontWeight:700,fontSize:15,color:'#111827'}}>{p.trips[0].dist} {s.unitShort}</div>
            </>}
          </div>
        ))}
      </div>
      <div style={{background:'#fff',border:'1px solid #E5E7EB',borderRadius:10,padding:'11px 13px',display:'flex',justifyContent:'space-between',alignItems:'center',animation:'pa-fade 0.4s 0.18s ease both'}}>
        <div>
          <div style={{fontSize:10,color:'#6B7280',marginBottom:2}}>Trips logged</div>
          <div style={{fontWeight:800,fontSize:30,color:'#1B4DDB',fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{count}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10,color:'#6B7280',marginBottom:2}}>Distance</div>
          <div style={{fontWeight:700,fontSize:14,color:'#111827',fontVariantNumeric:'tabular-nums'}}>{runDist} {s.unitShort}</div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Beat 4 — Tax form + deduction (locale-aware form header)
───────────────────────────────────────────────────────────────── */
const SolBeatDeduct = ({persona, locale}) => {
  const s = window.MM.strings[locale];
  const p = window.MM.personas[persona][locale];
  return (
    <div style={{width:'100%',height:'100%',background:'#fff',padding:'14px 12px',overflow:'hidden',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <div style={{marginBottom:10,paddingBottom:10,borderBottom:'1px solid #E5E7EB',animation:'pa-fade 0.35s ease both'}}>
        <div style={{fontSize:9,color:'#9CA3AF',marginBottom:2,fontFamily:"ui-monospace,'SF Mono',Menlo,monospace",letterSpacing:'0.05em'}}>{s.formHeader}</div>
        <div style={{fontWeight:700,fontSize:13,color:'#111827'}}>Mileage Log · Annual</div>
      </div>
      {p.trips.map((t, i) => (
        <div key={i} style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          padding:'5px 0', borderBottom:'1px solid #F3F4F6', fontSize:10,
          animation:`pa-row 0.3s ${0.12+i*0.1}s ease both`,
        }}>
          <span style={{color:'#374151',flex:1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis',paddingRight:6,maxWidth:'74%'}}>{t.route}</span>
          <span style={{color:'#1B4DDB',fontWeight:600,fontVariantNumeric:'tabular-nums',fontSize:11}}>{t.dist}</span>
        </div>
      ))}
      <div style={{marginTop:10,paddingTop:9,borderTop:'1.5px solid #111827',display:'flex',justifyContent:'space-between',alignItems:'baseline',animation:'pa-gold-pop 0.55s 0.55s cubic-bezier(0.22,1,0.36,1) both'}}>
        <span style={{fontSize:10,color:'#6B7280'}}>Est. annual deduction</span>
        <span style={{fontWeight:800,fontSize:18,fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",color:'#C9A96E',lineHeight:1,animation:'pa-gold-glow 2s 1.1s ease-in-out infinite'}}>{p.deduction}</span>
      </div>
      <div style={{marginTop:10,fontSize:9,color:'#9CA3AF',textAlign:'center',animation:'pa-fade 0.4s 0.9s ease both'}}>{s.complianceLabel}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SolHeroAnim — auto-rotating persona animation (for hub hero)
───────────────────────────────────────────────────────────────── */
const SolHeroAnim = ({locale}) => {
  const [personaIdx, setPersonaIdx] = React.useState(0);
  const [beat, setBeat] = React.useState(SOL_REDUCED ? 3 : 0);
  const [tick, setTick] = React.useState(0);
  const persona = SOL_PERSONA_SLUGS[personaIdx];
  const meta = SOL_BEAT_META[beat];

  React.useEffect(() => {
    if (SOL_REDUCED) return;
    const t = setTimeout(() => {
      const next = (beat + 1) % 4;
      setBeat(next);
      setTick(k => k + 1);
      if (next === 0) setPersonaIdx(i => (i + 1) % SOL_PERSONA_SLUGS.length);
    }, SOL_BEAT_MS);
    return () => clearTimeout(t);
  }, [beat]);

  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
      <div className="pa-phone">
        <div className="pa-notch" aria-hidden="true"/>
        <div className="pa-screen">
          {beat===0 && <SolBeatDetect key={'d'+tick}/>}
          {beat===1 && <SolBeatClassify key={'c'+tick} persona={persona} locale={locale}/>}
          {beat===2 && <SolBeatLog key={'l'+tick} persona={persona} locale={locale}/>}
          {beat===3 && <SolBeatDeduct key={'x'+tick} persona={persona} locale={locale}/>}
        </div>
      </div>
      <div key={'chip'+tick} className="pa-chip" style={{color:meta.color,background:meta.bg,borderColor:meta.border}}>
        <span className="pa-chip-dot" style={{background:meta.color}}/>
        <span style={{fontSize:10,opacity:0.5,marginRight:2}}>{meta.step}</span>
        {meta.label}
      </div>
      <div style={{display:'flex',gap:6}} role="tablist" aria-label="Animation steps">
        {SOL_BEAT_META.map((m,i) => (
          <button key={i} role="tab" aria-selected={i===beat} aria-label={m.label}
            onClick={()=>{setBeat(i);setTick(k=>k+1)}}
            style={{width:i===beat?20:6,height:6,borderRadius:3,background:i===beat?'#1B4DDB':i<beat?'#C7D6FB':'#E5E7EB',border:'none',padding:0,cursor:'pointer',transition:'all 0.25s ease'}}/>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SolNav — solutions nav with locale toggle, root-relative links
───────────────────────────────────────────────────────────────── */
const SolNav = () => {
  const [open, setOpen] = React.useState(false);
  const [solOpen, setSolOpen] = React.useState(false);
  const solDropRef = React.useRef(null);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setSolOpen(false); setOpen(false); } };
    const onOut = (e) => { if (solDropRef.current && !solDropRef.current.contains(e.target)) setSolOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOut);
    };
  }, []);
  const links = [
    {label:'Features',      href:'/features.html'},
    {label:'How It Works',  href:'/how-it-works.html'},
    {label:'Pricing',       href:'/pricing.html'},
    {label:'Blog',          href:'/blog.html'},
    {label:'About',         href:'/about.html'},
  ];
  const here = typeof window !== 'undefined' ? window.location.pathname : '';
  const isSolutions = here.startsWith('/solutions');

  return (
    <nav className="sol-nav" aria-label="Site navigation">
      <div className="sol-nav-inner">
        <a href="/" style={{textDecoration:'none',color:'inherit'}} aria-label="MyMilesAI home"><MSLogo size={22}/></a>

        <div className="sol-nav-links">
          <div style={{position:'relative'}} ref={solDropRef}>
            <button
              aria-haspopup="true"
              aria-expanded={solOpen}
              onClick={() => setSolOpen(o => !o)}
              className={isSolutions ? 'active' : ''}
              style={{display:'flex',alignItems:'center',gap:5,border:'none',background:'none',cursor:'pointer',fontSize:'inherit',fontFamily:'inherit',fontWeight:'inherit',color:'inherit',padding:0,paddingBottom:2}}
            >
              Solutions
              <svg viewBox="0 0 10 6" width={8} height={8} fill="none" style={{transform:solOpen?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0}} aria-hidden="true">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {solOpen && (
              <div role="menu" aria-label="Solutions pages" style={{position:'absolute',top:'calc(100% + 12px)',left:0,background:'#fff',border:'1px solid #E5E7EB',borderRadius:14,padding:8,boxShadow:'0 12px 32px -8px rgba(0,0,0,0.14)',zIndex:200,minWidth:280,display:'grid',gridTemplateColumns:'1fr',gap:2}}>
                {SOL_PERSONA_SLUGS.map(slug => (
                  <a key={slug} href={`/solutions/${slug}/`} role="menuitem"
                    style={{display:'block',padding:'8px 12px',borderRadius:8,fontSize:13,fontWeight:500,color:'#374151',textDecoration:'none'}}
                    onMouseOver={e=>{e.currentTarget.style.background='#F8F9FA'}}
                    onMouseOut={e=>{e.currentTarget.style.background='transparent'}}
                  >{SOL_PERSONA_META[slug].name}</a>
                ))}
                <a href="/solutions/" role="menuitem"
                  style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 12px',borderRadius:8,borderTop:'1px solid #F3F4F6',marginTop:4,fontSize:13,fontWeight:600,color:'#1B4DDB',textDecoration:'none'}}
                  onMouseOver={e=>{e.currentTarget.style.background='#EFF3FF'}}
                  onMouseOut={e=>{e.currentTarget.style.background='transparent'}}
                >
                  All solutions
                  <svg viewBox="0 0 16 16" width={11} height={11} fill="none" aria-hidden="true"><path d="M3 8H13M8 3L13 8L8 13" stroke="#1B4DDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
            )}
          </div>
          {links.map(l => {
            const active = !isSolutions && here.split('/').pop() === l.href.split('/').pop();
            return <a key={l.href} href={l.href} className={active?'active':''}
              onMouseOver={e=>{if(!active)e.currentTarget.style.opacity=1}}
              onMouseOut={e=>{if(!active)e.currentTarget.style.opacity=''}}>{l.label}</a>;
          })}
        </div>

        <div className="sol-nav-right">
          <MSRegionPill/>
          <a href="/signin/" style={{background:'#fff',color:'#0B0F0E',border:'1px solid #E5E7EB',padding:'9px 20px',borderRadius:100,fontSize:14,fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',transition:'border-color .15s'}}
            onMouseOver={e=>e.currentTarget.style.borderColor='#0B0F0E'}
            onMouseOut={e=>e.currentTarget.style.borderColor='#E5E7EB'}>Sign In</a>
        </div>

        <button className="sol-hamburger" onClick={()=>setOpen(o=>!o)} aria-label={open?'Close menu':'Open menu'} aria-expanded={open}>
          <svg viewBox="0 0 16 16" width={16} height={16} fill="none" aria-hidden="true">
            {open
              ? <path d="M4 4l8 8M12 4l-8 8" stroke="#0B0F0E" strokeWidth="1.6" strokeLinecap="round"/>
              : <path d="M2 4h12M2 8h12M2 12h12" stroke="#0B0F0E" strokeWidth="1.6" strokeLinecap="round"/>
            }
          </svg>
        </button>
      </div>

      <div className="sol-drawer" data-open={String(open)} aria-hidden={!open}>
        <a href="/solutions/" style={{fontWeight:700}}>Solutions</a>
        {SOL_PERSONA_SLUGS.map(slug => (
          <a key={slug} href={`/solutions/${slug}/`} style={{paddingLeft:18,fontSize:13,opacity:0.75}}>{SOL_PERSONA_META[slug].name}</a>
        ))}
        {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
        <div className="sol-drawer-foot">
          <MSRegionPill/>
          <a href="/signin/" style={{fontSize:14,fontWeight:600,color:'#0B0F0E',textDecoration:'none'}}>Sign In →</a>
        </div>
      </div>
    </nav>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SolPersonaCard — one card in the hub grid
───────────────────────────────────────────────────────────────── */
const SOL_VALUE_PROPS = {
  realtors:        (d, u) => `Track every showing and open house. Deduct up to ${d} in business ${u}.`,
  rideshare:       (d, u) => `Capture deadhead and delivery ${u}. Deduct up to ${d} per year.`,
  freelancers:     (d, u) => `Log client ${u} by project. Deduct up to ${d} per year.`,
  'small-business':(d, u) => `Track every business run and delivery. Deduct up to ${d} in ${u}.`,
  construction:    (d, u) => `Log job site, materials, and equipment ${u}. Deduct up to ${d}.`,
  'sales-reps':    (d, u) => `Track territory ${u} by account. Deduct up to ${d} per year.`,
};

const SolPersonaCard = ({slug, locale}) => {
  const p = window.MM.personas[slug][locale];
  const s = window.MM.strings[locale];
  const meta = SOL_PERSONA_META[slug];
  const valueProp = SOL_VALUE_PROPS[slug](p.deduction, s.unit);
  return (
    <a href={`/solutions/${slug}/`} className="sol-persona-card">
      <div className="sol-card-icon">{SOL_ICONS[slug]}</div>
      <div className="sol-card-name">{meta.name}</div>
      <p className="sol-card-prop">{valueProp}</p>
      <div className="sol-card-cta">See how it works →</div>
    </a>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SolPersonaGrid — 6-card grid section (hub page)
───────────────────────────────────────────────────────────────── */
const SolPersonaGrid = ({locale}) => (
  <section className="sol-grid-section">
    <div className="sol-grid-inner">
      <div className="sol-grid-head">
        <div style={{fontSize:14,fontWeight:700,color:'#1B4DDB',marginBottom:12}}>— Choose your profession</div>
        <h2>Which kind of driver are you?</h2>
        <p>Select your profession and see how MyMilesAI captures every deductible mile automatically.</p>
      </div>
      <div className="sol-persona-grid">
        {SOL_PERSONA_SLUGS.map(slug => <SolPersonaCard key={slug} slug={slug} locale={locale}/>)}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   SolHubHero — hub page hero (2-col: copy + animation)
───────────────────────────────────────────────────────────────── */
const SolHubHero = ({locale}) => {
  const s = window.MM.strings[locale];
  return (
    <section style={{background:'linear-gradient(180deg,#F0F4FF 0%,#FFFFFF 55%)',borderBottom:'1px solid #E5E7EB'}}>
      <div className="sol-hub-hero">
        <div className="sol-hub-copy">
          <div className="sol-hub-eyebrow">— Solutions</div>
          <h1 className="sol-hub-h1">Built for how<br/>you actually drive.</h1>
          <p className="sol-hub-sub">
            Tax-ready mileage tracking for every profession. Every mile captured automatically — no buttons, no manual entries, no missed deductions.
          </p>
          <div className="sol-hub-ctas">
            <a href="/signup/" style={{background:'#1B4DDB',color:'#fff',padding:'15px 30px',borderRadius:100,fontSize:15,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 12px 28px -10px rgba(27,77,219,0.45)',whiteSpace:'nowrap'}}>
              Start Free Trial
              <svg viewBox="0 0 16 16" width={13} height={13} fill="none" aria-hidden="true"><path d="M3 8H13M8 3L13 8L8 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#solutions" style={{background:'#fff',color:'#0B0F0E',border:'1px solid #E5E7EB',padding:'14px 26px',borderRadius:100,fontSize:15,fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,whiteSpace:'nowrap'}}>
              Choose your profession
            </a>
          </div>
          <div className="sol-hub-trust">
            {s.trustStrip}
          </div>
        </div>
        <div className="sol-hub-anim">
          <SolHeroAnim locale={locale}/>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SolHubPage — full hub page (rendered by solutions/index.html)
───────────────────────────────────────────────────────────────── */
const SolHubPage = () => {
  const locale = useLocale();
  return (
    <>
      <SolNav/>
      <SolHubHero locale={locale}/>
      <div id="solutions">
        <SolPersonaGrid locale={locale}/>
      </div>
      <MSCTA/>
      <MSFooter/>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Persona page shared components (Checkpoint 4)
   These are stubs — fully fleshed out in Checkpoint 4.
───────────────────────────────────────────────────────────────── */

const SolTrustStrip = ({locale}) => {
  const s = window.MM.strings[locale];
  return (
    <div className="sol-trust-strip" role="note">{s.trustStrip}</div>
  );
};

const SolExportPreview = ({persona, locale}) => {
  const s = window.MM.strings[locale];
  const p = window.MM.personas[persona][locale];
  const totalDist = p.trips.reduce((sum,t)=>sum+parseFloat(t.dist),0).toFixed(1);
  const totalAmt  = p.trips.reduce((sum,t)=>sum+parseFloat(t.amount),0).toFixed(2);
  return (
    <div className="sol-export-card">
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:14,paddingBottom:14,borderBottom:'1px solid #E5E7EB'}}>
        <div>
          <div style={{fontSize:9,color:'#9CA3AF',marginBottom:3,letterSpacing:'0.05em'}}>{s.formHeader}</div>
          <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700,fontSize:14,color:'#111827'}}>Mileage Log · Sample Export</div>
        </div>
        <div style={{padding:'5px 10px',background:'#1B4DDB',color:'#fff',borderRadius:100,fontSize:9,fontWeight:700,alignSelf:'flex-start'}}>✓ Verified</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'52px 1fr 44px 52px',gap:6,fontSize:9,color:'#9CA3AF',marginBottom:8,fontWeight:600}}>
        <div>Date</div><div>Route</div><div style={{textAlign:'right'}}>{s.unitShort.toUpperCase()}</div><div style={{textAlign:'right'}}>$</div>
      </div>
      {p.trips.map((t,i) => (
        <div key={i} style={{display:'grid',gridTemplateColumns:'52px 1fr 44px 52px',gap:6,padding:'6px 0',borderBottom:'1px solid #F3F4F6',fontSize:10}}>
          <div style={{color:'#6B7280'}}>{t.date}</div>
          <div style={{color:'#374151',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{t.route}</div>
          <div style={{textAlign:'right'}}>{t.dist}</div>
          <div style={{textAlign:'right',color:'#1B4DDB',fontWeight:600}}>${t.amount}</div>
        </div>
      ))}
      <div style={{marginTop:12,paddingTop:10,borderTop:'1.5px solid #111827',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div>
          <div style={{fontSize:9,color:'#9CA3AF',marginBottom:2}}>Sample total · {p.trips.length} trips</div>
          <div style={{fontSize:11,color:'#374151',fontWeight:600}}>{totalDist} {s.unitShort}</div>
        </div>
        <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:16,color:'#C9A96E'}}>${totalAmt}</div>
      </div>
    </div>
  );
};

const SolFAQ = ({faqs, locale}) => {
  const [open, setOpen] = React.useState(null);
  const s = window.MM.strings[locale];
  return (
    <section className="sol-faq-section">
      <div className="sol-faq-inner">
        <div style={{fontSize:14,fontWeight:700,color:'#1B4DDB',marginBottom:16}}>— FAQ</div>
        <h2 className="sol-faq-h2">Questions about tracking your miles.</h2>
        <div style={{border:'1px solid #E5E7EB',borderRadius:14,overflow:'hidden'}}>
          {faqs.map((f, i) => (
            <div key={i} className="sol-faq-item" style={{borderBottom:i<faqs.length-1?'1px solid #E5E7EB':'none'}}>
              <button className="sol-faq-q" onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}>
                <span>{typeof f.q === 'function' ? f.q(s) : f.q}</span>
                <svg viewBox="0 0 16 16" width={15} height={15} fill="none" style={{flexShrink:0,transform:open===i?'rotate(180deg)':'none',transition:'transform 0.2s'}} aria-hidden="true">
                  <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {open===i && <div className="sol-faq-a">{typeof f.a === 'function' ? f.a(s) : f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SolTestimonial = ({data}) => (
  <section className="sol-testimonial">
    {/* <!-- PLACEHOLDER: Replace with real customer testimonial --> */}
    <div style={{maxWidth:680,margin:'0 auto'}}>
      <svg viewBox="0 0 40 32" width={36} height={28} fill="none" style={{marginBottom:20}} aria-hidden="true">
        <path d="M0 32V18.7C0 8.4 6.5 2.3 19.5 0l2 3.8C14.3 5.5 10.3 9 9.7 14.7H18V32H0zm22 0V18.7C22 8.4 28.5 2.3 41.5 0l2 3.8C36.3 5.5 32.3 9 31.7 14.7H40V32H22z" fill="rgba(201,169,110,0.35)"/>
      </svg>
      <blockquote style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:700,fontSize:'clamp(1.25rem,2.2vw,1.6rem)',lineHeight:1.35,color:'#F8F9FA',marginBottom:24,letterSpacing:'-0.02em'}}>
        "{data.quote}"
      </blockquote>
      <div style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center'}}>
        <div style={{width:40,height:40,borderRadius:'50%',background:'rgba(248,249,250,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:700,color:'#F8F9FA'}}>{data.initials}</div>
        <div style={{textAlign:'left'}}>
          <div style={{fontSize:14,fontWeight:700,color:'#F8F9FA'}}>{data.name}</div>
          <div style={{fontSize:12,color:'rgba(248,249,250,0.55)'}}>{data.role}</div>
        </div>
      </div>
    </div>
  </section>
);

const SolPageCTA = ({personaName, locale}) => {
  const s = window.MM.strings[locale];
  return (
    <section className="sol-page-cta">
      <div style={{maxWidth:640,margin:'0 auto'}}>
        <div style={{fontSize:14,fontWeight:700,color:'rgba(248,249,250,0.5)',marginBottom:20}}>— Start today</div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(1.75rem,3vw,2.25rem)',lineHeight:1.1,letterSpacing:'-0.025em',color:'#F8F9FA',marginBottom:14}}>
          Start tracking {personaName} miles today.
        </h2>
        <p style={{fontSize:'1.0625rem',color:'#94A3B8',maxWidth:440,margin:'0 auto 32px',lineHeight:1.65}}>{s.trustStrip}</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a href="/signup/" style={{background:'#1B4DDB',color:'#fff',padding:'15px 32px',borderRadius:12,fontSize:'1.0625rem',fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>
            Start Free Trial
            <svg viewBox="0 0 16 16" width={13} height={13} fill="none" aria-hidden="true"><path d="M3 8H13M8 3L13 8L8 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="/pricing.html" style={{background:'transparent',color:'rgba(248,249,250,0.7)',border:'1px solid rgba(248,249,250,0.2)',padding:'14px 28px',borderRadius:12,fontSize:'1.0625rem',fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center'}}>See pricing</a>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────────
   SolFeatureSection — alternating feature section template
   feat: { eyebrow, h, p, visual: JSX, flip: bool }
───────────────────────────────────────────────────────────────── */
const SolFeatureSection = ({feat, index}) => (
  <section className="sol-feat-section">
    <div className="sol-feat-inner" style={{direction: index % 2 === 1 ? 'rtl' : 'ltr'}}>
      <div className="sol-feat-copy" style={{direction:'ltr'}}>
        <div className="sol-feat-copy-eyebrow">{feat.eyebrow}</div>
        <h2>{feat.h}</h2>
        <p>{feat.p}</p>
        {feat.stat && (
          <div style={{display:'flex',alignItems:'baseline',gap:12,paddingTop:16,borderTop:'1px solid #E5E7EB',marginTop:4}}>
            <span style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'2.5rem',color:'#1B4DDB',lineHeight:1}}>{feat.stat}</span>
            <span style={{fontSize:'0.9375rem',color:'#6B7280',lineHeight:1.4}}>{feat.statLabel}</span>
          </div>
        )}
      </div>
      <div className="sol-feat-visual" style={{direction:'ltr',background:feat.visualBg||'#EFF3FF'}}>
        {feat.visual || <div style={{color:'#6B7280',fontSize:13}}>Visual</div>}
      </div>
    </div>
  </section>
);

/* ─────────────────────────────────────────────────────────────────
   SolPersonaPage — full persona page wrapper (Checkpoint 4)
   persona: { slug, name, heroSub, features[], faqs[], testimonial }
───────────────────────────────────────────────────────────────── */
const SolPersonaPage = ({persona}) => {
  const locale = useLocale();
  const s = window.MM.strings[locale];
  const p = window.MM.personas[persona.slug][locale];

  return (
    <>
      <SolNav/>

      {/* Hero */}
      <section className="sol-page-hero">
        <div className="sol-page-hero-inner">
          <div>
            <div className="sol-page-eyebrow">— {SOL_PERSONA_META[persona.slug].name}</div>
            <h1 className="sol-page-h1">
              {SOL_PERSONA_META[persona.slug].name} miss{' '}
              <em>{p.deduction}</em> in deductions every year.<br/>You won't.
            </h1>
            <p className="sol-page-sub">{typeof persona.heroSub === 'function' ? persona.heroSub(s) : persona.heroSub}</p>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:24}}>
              <a href="/signup/" style={{background:'#1B4DDB',color:'#fff',padding:'14px 28px',borderRadius:100,fontSize:15,fontWeight:700,textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 12px 28px -10px rgba(27,77,219,0.4)',whiteSpace:'nowrap'}}>
                Start free trial
                <svg viewBox="0 0 16 16" width={13} height={13} fill="none" aria-hidden="true"><path d="M3 8H13M8 3L13 8L8 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#how" style={{background:'#fff',color:'#0B0F0E',border:'1px solid #E5E7EB',padding:'13px 24px',borderRadius:100,fontSize:15,fontWeight:600,textDecoration:'none',display:'inline-flex',alignItems:'center',whiteSpace:'nowrap'}}>See how it works</a>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
            <SolHeroAnim locale={locale}/>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <SolTrustStrip locale={locale}/>

      {/* Feature sections */}
      <div id="how">
        {persona.features.map((feat, i) => (
          <SolFeatureSection key={i} feat={typeof feat === 'function' ? feat(s, p) : feat} index={i}/>
        ))}
      </div>

      {/* Export preview */}
      <section style={{padding:'72px 56px',background:'#F8F9FA',borderTop:'1px solid #E5E7EB'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:40}}>
            <div style={{fontSize:14,fontWeight:700,color:'#1B4DDB',marginBottom:12}}>— Sample export</div>
            <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(1.5rem,2.5vw,2rem)',letterSpacing:'-0.025em',color:'#111827',marginBottom:10}}>
              One tap. Tax-ready. Done.
            </h2>
            <p style={{fontSize:'1rem',color:'#6B7280',maxWidth:480,margin:'0 auto',lineHeight:1.6}}>{s.auditLabel} · {s.form2} ready</p>
          </div>
          <SolExportPreview persona={persona.slug} locale={locale}/>
        </div>
      </section>

      {/* Testimonial */}
      <SolTestimonial data={persona.testimonial}/>

      {/* Pricing */}
      <MSPricing/>

      {/* FAQ */}
      <SolFAQ faqs={persona.faqs} locale={locale}/>

      {/* CTA */}
      <SolPageCTA personaName={SOL_PERSONA_META[persona.slug].name} locale={locale}/>

      <MSFooter/>
    </>
  );
};

/* ─────────────────────────────────────────────────────────────────
   Exports
───────────────────────────────────────────────────────────────── */
window.SolNav          = SolNav;
window.SolHeroAnim     = SolHeroAnim;
window.SolPersonaCard  = SolPersonaCard;
window.SolPersonaGrid  = SolPersonaGrid;
window.SolHubHero      = SolHubHero;
window.SolHubPage      = SolHubPage;
window.SolTrustStrip   = SolTrustStrip;
window.SolExportPreview= SolExportPreview;
window.SolFAQ          = SolFAQ;
window.SolTestimonial  = SolTestimonial;
window.SolPageCTA      = SolPageCTA;
window.SolFeatureSection=SolFeatureSection;
window.SolPersonaPage  = SolPersonaPage;
