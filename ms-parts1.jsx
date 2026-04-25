/* Marketing site components — split for manageability */

/* Canonical "The Route" lockup (matches brand-logo.css) */
const MSLogo = ({size=22, onDark=false}) => (
  <div style={{display:'flex',alignItems:'center',gap:10,lineHeight:1}}>
    <svg viewBox="0 0 64 64" fill="none" style={{width:size*1.3,height:size*1.3,flexShrink:0}} aria-hidden="true">
      <circle cx="12" cy="50" r="4" fill={onDark?'#F6F3EE':'#0B0F0E'}/>
      <path d="M 12 50 Q 12 30 28 22 T 52 14" stroke="#DA0A7F" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="52" cy="14" r="5" fill="#DA0A7F"/>
      <circle cx="52" cy="14" r="2" fill="#F6F3EE"/>
    </svg>
    <span style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:size,letterSpacing:'-0.035em',color:onDark?'#F6F3EE':'#0B0F0E'}}>
      MyMiles<span style={{fontFamily:"'Instrument Serif',serif",fontStyle:'italic',fontWeight:400,background:onDark?'linear-gradient(90deg,#A78BFA,#F9A8D4)':'linear-gradient(90deg,#7C3AED,#EC4899)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent',letterSpacing:'-0.02em',paddingLeft:'0.03em'}}>AI</span>
    </span>
  </div>
);

const MSRegionPill = () => {
  const [region, setRegion] = React.useState(() => {
    try { return localStorage.getItem('mm_region') || 'US'; } catch(e) { return 'US'; }
  });
  const [open, setOpen] = React.useState(false);
  const choose = (r) => {
    setRegion(r);
    try { localStorage.setItem('mm_region', r); } catch(e) {}
    setOpen(false);
  };
  const opts = {
    US: {label:'MI', sub:'United States'},
    CA: {label:'KM', sub:'Canada'},
  };
  const Flag = ({code}) => code === 'US' ? (
    <span style={{width:18,height:12,display:'inline-block',background:'linear-gradient(180deg,#B22234 33%,#FFFFFF 33%,#FFFFFF 66%,#B22234 66%)',borderRadius:2,position:'relative',overflow:'hidden',flexShrink:0}}>
      <span style={{position:'absolute',top:0,left:0,width:7,height:6,background:'#3C3B6E'}}/>
    </span>
  ) : (
    <span style={{width:18,height:12,display:'inline-block',background:'linear-gradient(90deg,#D52B1E 0 25%,#FFFFFF 25% 75%,#D52B1E 75%)',borderRadius:2,position:'relative',overflow:'hidden',flexShrink:0}}>
      <span style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',color:'#D52B1E',fontSize:8,lineHeight:1,fontWeight:700}}>🍁</span>
    </span>
  );
  React.useEffect(() => {
    if(!open) return;
    const close = () => setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);
  return (
    <div style={{position:'relative'}} onClick={e=>e.stopPropagation()}>
      <button onClick={()=>setOpen(o=>!o)} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 10px 7px 12px',border:'1px solid #E6E1D8',borderRadius:100,fontSize:13,background:'#FFFFFF',cursor:'pointer',fontFamily:'inherit'}}>
        <Flag code={region}/>
        <span style={{fontWeight:600,letterSpacing:'0.02em'}}>{opts[region].label}</span>
        <span style={{fontSize:9,opacity:0.5,marginLeft:1}}>▾</span>
      </button>
      {open && (
        <div style={{position:'absolute',top:'calc(100% + 6px)',right:0,background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:12,padding:6,boxShadow:'0 14px 36px -10px rgba(11,15,14,0.18)',minWidth:200,zIndex:60}}>
          {['US','CA'].map(r=>(
            <button key={r} onClick={()=>choose(r)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',width:'100%',background:r===region?'#F6F3EE':'transparent',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'inherit',textAlign:'left'}}>
              <Flag code={r}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600}}>{opts[r].sub}</div>
                <div style={{fontSize:11,color:'#6B6862'}}>Distance in {opts[r].label === 'MI' ? 'miles' : 'kilometers'}</div>
              </div>
              {r===region && <span style={{color:'#DA0A7F',fontSize:13}}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MSNav = ({mobile}) => {
  const links = [
    {label:'Features', href:'features.html'},
    {label:'How It Works', href:'how-it-works.html'},
    {label:'Pricing', href:'pricing.html'},
    {label:'Blog', href:'blog.html'},
    {label:'About', href:'about.html'},
  ];
  const here = (typeof window!=='undefined' ? window.location.pathname.split('/').pop() : '') || 'index.html';
  if(mobile) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:'1px solid #E6E1D8'}}>
      <a href="index.html" style={{textDecoration:'none',color:'inherit'}}><MSLogo size={18}/></a>
      <button style={{background:'transparent',color:'#0B0F0E',border:'1px solid #0B0F0E',padding:'8px 16px',borderRadius:100,fontSize:12,fontWeight:500}}>Sign In</button>
    </div>
  );
  return (
    <div className="nav-links" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'22px 56px',position:'sticky',top:0,background:'rgba(246,243,238,0.88)',backdropFilter:'blur(14px)',zIndex:50,borderBottom:'1px solid rgba(11,15,14,0.05)'}}>
      <a href="index.html" style={{textDecoration:'none',color:'inherit'}}><MSLogo size={22}/></a>
      <div style={{display:'flex',gap:40,fontSize:14,color:'#1F1D1A'}}>
        {links.map(l=>{
          const active = here === l.href;
          return <a key={l.href} href={l.href} style={{color:'inherit',textDecoration:'none',fontWeight:active?700:500,opacity:active?1:0.7,position:'relative',paddingBottom:4,borderBottom:active?'2px solid #DA0A7F':'2px solid transparent',transition:'opacity .15s,border-color .15s'}} onMouseOver={e=>{if(!active)e.currentTarget.style.opacity=1}} onMouseOut={e=>{if(!active)e.currentTarget.style.opacity=0.7}}>{l.label}</a>;
        })}
      </div>
      <div className="nav-signin" style={{display:'flex',alignItems:'center',gap:14}}>
        <MSRegionPill/>
        <button style={{background:'#FFFFFF',color:'#0B0F0E',border:'1px solid #E6E1D8',padding:'10px 22px',borderRadius:100,fontSize:14,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'all .15s'}} onMouseOver={e=>{e.currentTarget.style.borderColor='#0B0F0E'}} onMouseOut={e=>{e.currentTarget.style.borderColor='#E6E1D8'}}>Sign In</button>
      </div>
    </div>
  );
};

/* HERO — new landing (matches www.mymilesai.com layout, our brand) */
const MSHero = () => {
  return (
    <section style={{padding:'72px 56px 110px',display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:56,alignItems:'center',position:'relative',overflow:'hidden',minHeight:720}}>
      {/* soft ambient glow */}
      <div style={{position:'absolute',top:'-10%',right:'-8%',width:720,height:720,background:'radial-gradient(circle at center, rgba(124,58,237,0.10), rgba(236,72,153,0.06) 40%, transparent 70%)',pointerEvents:'none',filter:'blur(20px)'}}/>
      <div style={{position:'relative',zIndex:2}}>
        <h1 style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:'clamp(40px,4.4vw,64px)',lineHeight:1.04,letterSpacing:'-0.025em',marginBottom:28}}>
          <span style={{display:'block',whiteSpace:'nowrap'}}>Track every mile.</span>
          <span style={{display:'block',whiteSpace:'nowrap'}}>Claim every <em style={{fontStyle:'normal',background:'linear-gradient(90deg,#7C3AED,#EC4899)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>dollar.</em></span>
        </h1>
        <p style={{fontSize:17,lineHeight:1.55,color:'#4A4843',maxWidth:520,marginBottom:40}}>
          MyMilesAI automatically logs your trips with GPS, classifies them with AI, and calculates your IRS tax deductions — all hands-free.
        </p>
        <div style={{display:'flex',gap:14,alignItems:'center',marginBottom:28,flexWrap:'wrap'}}>
          <button style={{background:'linear-gradient(90deg,#7C3AED,#EC4899)',color:'#FFFFFF',border:'none',padding:'17px 32px',borderRadius:100,fontSize:15,fontWeight:600,cursor:'pointer',boxShadow:'0 12px 28px -10px rgba(124,58,237,0.45)',display:'inline-flex',alignItems:'center',gap:8}}>
            Start Free Trial <span style={{fontSize:16}}>→</span>
          </button>
          <button style={{background:'#FFFFFF',color:'#0B0F0E',border:'1px solid #E6E1D8',padding:'16px 30px',borderRadius:100,fontSize:15,fontWeight:600,cursor:'pointer'}}>
            Calculate My Savings
          </button>
        </div>
        <div style={{display:'flex',gap:28,fontSize:13,color:'#4A4843',flexWrap:'wrap',alignItems:'center'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:7}}>
            <svg viewBox="0 0 16 16" width={14} height={14}><path d="M8 1 L13 3 V8 Q13 12 8 15 Q3 12 3 8 V3 Z" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinejoin="round"/><path d="M5.5 8 L7.3 9.8 L10.7 6" fill="none" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Privacy-first
          </span>
          <span style={{display:'inline-flex',alignItems:'center',gap:7}}>
            <svg viewBox="0 0 16 16" width={14} height={14}><circle cx="8" cy="8" r="6.5" fill="none" stroke="#4A4843" strokeWidth="1.4"/><path d="M2 8 H14 M8 2 Q11 5 11 8 Q11 11 8 14 Q5 11 5 8 Q5 5 8 2" fill="none" stroke="#4A4843" strokeWidth="1.2"/></svg>
            US + Canada
          </span>
          <span style={{display:'inline-flex',alignItems:'center',gap:7}}>
            <svg viewBox="0 0 16 16" width={14} height={14}><path d="M8 1 L9.5 6.5 L15 6.5 L10.5 10 L12 15.5 L8 12 L4 15.5 L5.5 10 L1 6.5 L6.5 6.5 Z" fill="#EC4899" opacity="0.9"/></svg>
            30-sec setup
          </span>
        </div>
      </div>
      {/* Right: phone mockup */}
      <div style={{position:'relative',zIndex:2,display:'flex',justifyContent:'center',alignItems:'center',minHeight:680}}>
        <HeroPhone/>
        {/* Floating chips */}
        <div style={{position:'absolute',top:'50%',left:-40,background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:14,padding:'11px 16px',boxShadow:'0 14px 36px -14px rgba(11,15,14,0.18)',display:'flex',alignItems:'center',gap:9,fontSize:13,fontWeight:500,animation:'float2 7s ease-in-out infinite'}}>
          <span style={{width:24,height:24,borderRadius:'50%',background:'#F0FDF4',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'#16A34A',fontSize:13,fontWeight:700}}>$</span>
          <span style={{color:'#16A34A',fontWeight:600}}>+$5.88 deduction</span>
        </div>
      </div>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float3 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
    </section>
  );
};

/* PRESS STRIP */
const MSPress = () => (
  <section style={{padding:'40px 56px',borderTop:'1px solid #E6E1D8',borderBottom:'1px solid #E6E1D8',display:'flex',alignItems:'center',gap:48}}>
    <div style={{fontFamily:'Geist Mono',fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'#6B6862',whiteSpace:'nowrap'}}>As seen in —</div>
    <div style={{display:'flex',gap:56,alignItems:'center',opacity:0.6,flex:1,justifyContent:'space-around'}}>
      {['FORBES','TECHCRUNCH','WSJ','THE VERGE','WIRED','Inc.'].map(p=><span key={p} style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:22,letterSpacing:'0.04em'}}>{p}</span>)}
    </div>
  </section>
);

/* HOW IT WORKS — 3 steps */
const MSHow = () => {
  const steps = [
    {n:'01',title:'You drive.',body:'Start your car. MyMilesAI detects motion via GPS + accelerometer and logs the trip silently — even with the app closed.',meta:'Zero taps · Background mode'},
    {n:'02',title:'You classify.',body:'At the end of the day, swipe each trip left for Personal, right for Business. Our AI learns your patterns and auto-classifies repeat routes.',meta:'~12 seconds / day'},
    {n:'03',title:'You deduct.',body:'Export an IRS-compliant PDF with dates, routes, odometer, purpose, and rates. Send to your CPA. Keep for audits. File with confidence.',meta:'One tap export'},
  ];
  return (
    <section style={{padding:'120px 56px',background:'#FFFFFF'}}>
      <div style={{fontFamily:'Geist Mono',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#6B6862',marginBottom:24}}>— How it works</div>
      <h2 style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:48,lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:56,maxWidth:780}}>
        Three steps between you and thousands in recovered deductions.
      </h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32}}>
        {steps.map(s=>(
          <div key={s.n} style={{borderTop:'1px solid #0B0F0E',paddingTop:24}}>
            <div style={{fontFamily:'Geist Mono',fontSize:12,color:'#0B0F0E',marginBottom:20}}>{s.n}</div>
            <h3 style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:30,lineHeight:1.1,marginBottom:14,letterSpacing:'-0.01em'}}>{s.title}</h3>
            <p style={{fontSize:15,lineHeight:1.55,color:'#4A4843',marginBottom:20}}>{s.body}</p>
            <div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:600,fontSize:11,letterSpacing:'0.14em',textTransform:'uppercase',color:'#6B6862'}}>{s.meta}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* FEATURE SHOWCASE — split visual + copy */
const MSFeatures = () => {
  const feats = [
    {k:'AUTO-DETECT',h:'The trip tracker that never forgets.',p:'Our motion engine runs at 1% battery cost and captures every drive — not just the ones you remember. Miss a trip, miss $20. We miss nothing.',stat:'99.4%',label:'of drives detected'},
    {k:'AI CLASSIFY',h:'Teaches itself your routes.',p:'After a week, 80% of your trips classify themselves. Recurring client visits, regular suppliers, the drive to your rental — all learned, all automated.',stat:'~12s',label:'daily review time'},
    {k:'AUDIT-READY',h:'Built to survive an IRS audit.',p:'Every log includes GPS traces, timestamps, odometer readings, purpose, and the IRS rate at the time of drive. A mileage log that a Revenue Agent actually respects.',stat:'98.7%',label:'audit pass rate'},
  ];
  return (
    <section style={{padding:'120px 56px'}}>
      <div style={{display:'flex',flexDirection:'column',gap:120}}>
        {feats.map((f,i)=>(
          <div key={f.k} style={{display:'grid',gridTemplateColumns:i%2===0?'1fr 1.1fr':'1.1fr 1fr',gap:80,alignItems:'center'}}>
            <div style={{order:i%2===0?1:2}}>
              <div style={{fontFamily:'Geist Mono',fontSize:11,letterSpacing:'0.18em',color:'#6B6862',marginBottom:20}}>— {f.k}</div>
              <h2 style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:44,lineHeight:1.05,letterSpacing:'-0.02em',marginBottom:20}}>{f.h}</h2>
              <p style={{fontSize:16,lineHeight:1.55,color:'#4A4843',maxWidth:480,marginBottom:28}}>{f.p}</p>
              <div style={{display:'flex',alignItems:'baseline',gap:16,paddingTop:24,borderTop:'1px solid #E6E1D8',maxWidth:280}}>
                <div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:38,color:'#1B5E3F',lineHeight:1}}>{f.stat}</div>
                <div style={{fontSize:13,color:'#6B6862'}}>{f.label}</div>
              </div>
            </div>
            {/* Visual mock */}
            <div style={{order:i%2===0?2:1,aspectRatio:'4/3',background:i===0?'#0B0F0E':i===1?'#FAFAF9':'#FFFFFF',border:i===1?'1px solid #EEEBE5':'none',borderRadius:20,padding:32,position:'relative',overflow:'hidden',color:i===0?'#F6F3EE':'#0B0F0E'}}>
              {i===0 && <FeatVisAutoDetect/>}
              {i===1 && <FeatVisClassify/>}
              {i===2 && <FeatVisAudit/>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FeatVisAutoDetect = () => (
  <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',fontFamily:'Geist Mono',fontSize:11}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <span style={{letterSpacing:'0.15em',color:'rgba(246,243,238,0.6)'}}>● BACKGROUND · TRACKING</span>
      <span style={{color:'rgba(246,243,238,0.4)'}}>09:41:08</span>
    </div>
    <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
      {/* Fake route line */}
      <svg viewBox="0 0 400 220" style={{width:'100%',maxWidth:500}}>
        <path d="M 30 180 Q 100 50, 180 120 T 370 60" fill="none" stroke="#DA0A7F" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round"/>
        <circle cx="30" cy="180" r="8" fill="#F6F3EE"/>
        <circle cx="370" cy="60" r="10" fill="#DA0A7F"/>
      </svg>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,paddingTop:16,borderTop:'1px solid rgba(246,243,238,0.15)'}}>
      {[['DISTANCE','4.2 mi'],['DURATION','11 min'],['STATUS','AUTO-LOGGED']].map(([k,v])=>(
        <div key={k}><div style={{color:'rgba(246,243,238,0.5)',marginBottom:4}}>{k}</div><div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:20,color:'#F6F3EE'}}>{v}</div></div>
      ))}
    </div>
  </div>
);

const FeatVisClassify = () => (
  <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',gap:10}}>
    {[
      {f:'Home',t:'Downtown Office',m:'12.1',cls:'biz',auto:true},
      {f:'Downtown Office',t:'Client — Acme Corp',m:'4.2',cls:'biz',auto:true},
      {f:'Acme Corp',t:'Starbucks',m:'0.8',cls:'pers',auto:false},
      {f:'Starbucks',t:'Office',m:'1.1',cls:'biz',auto:true},
    ].map((t,i)=>(
      <div key={i} style={{display:'flex',alignItems:'center',gap:16,padding:14,background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:12}}>
        <div style={{flex:1,fontSize:12}}>
          <div style={{color:'#6B6862',fontFamily:'Geist Mono',fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase'}}>{t.f} → {t.t}</div>
          <div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:20,marginTop:2}}>{t.m} mi</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          {t.auto && <span style={{fontFamily:'Geist Mono',fontSize:9,letterSpacing:'0.12em',color:'#DA0A7F'}}>AI</span>}
          <span style={{padding:'6px 12px',borderRadius:100,background:t.cls==='biz'?'#1B5E3F':'#E6E1D8',color:t.cls==='biz'?'#F6F3EE':'#0B0F0E',fontSize:11,fontWeight:500}}>{t.cls==='biz'?'Business':'Personal'}</span>
        </div>
      </div>
    ))}
  </div>
);

const FeatVisAudit = () => (
  <div style={{width:'100%',height:'100%',background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:14,padding:24,fontFamily:'Geist Mono',fontSize:10,position:'relative',overflow:'hidden'}}>
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:20,paddingBottom:16,borderBottom:'1px solid #E6E1D8'}}>
      <div>
        <div style={{color:'#6B6862',marginBottom:4}}>IRS FORM 2106 — 2026</div>
        <div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:18,fontStyle:'normal'}}>Mileage Log · Q1 Summary</div>
      </div>
      <div style={{padding:'6px 10px',background:'#1B5E3F',color:'#F6F3EE',borderRadius:100,fontFamily:"'Geist Mono','Geist',monospace",fontSize:9,fontWeight:600,letterSpacing:'0.1em'}}>✓ VERIFIED</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'60px 1fr 60px 60px',gap:8,fontSize:10,color:'#6B6862',marginBottom:10}}>
      <div>DATE</div><div>ROUTE</div><div style={{textAlign:'right'}}>MILES</div><div style={{textAlign:'right'}}>$</div>
    </div>
    {[['01/04','Home → Client A · Sales call','24.1','17.47'],['01/04','Client A → Client B · Consultation','12.8','9.28'],['01/05','Home → Warehouse · Supplies','8.4','6.09'],['01/06','Office → Airport · Conference travel','31.2','22.62']].map((r,i)=>(
      <div key={i} style={{display:'grid',gridTemplateColumns:'60px 1fr 60px 60px',gap:8,padding:'8px 0',borderBottom:'1px solid #F6F3EE',fontSize:11}}>
        <div>{r[0]}</div><div style={{color:'#0B0F0E'}}>{r[1]}</div><div style={{textAlign:'right'}}>{r[2]}</div><div style={{textAlign:'right',color:'#1B5E3F'}}>${r[3]}</div>
      </div>
    ))}
    <div style={{marginTop:16,paddingTop:12,borderTop:'1px solid #0B0F0E',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
      <span style={{color:'#6B6862'}}>Q1 TOTAL · 247 TRIPS</span>
      <span style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:24,color:'#1B5E3F'}}>$2,183.14</span>
    </div>
  </div>
);

/* HERO PHONE — iPhone frame with our dashboard */
const HeroPhone = () => (
  <div style={{width:340,height:680,background:'#0B0F0E',borderRadius:48,padding:10,boxShadow:'0 50px 120px -30px rgba(11,15,14,0.35), 0 20px 40px -20px rgba(11,15,14,0.2)',position:'relative'}}>
    {/* Screen */}
    <div style={{width:'100%',height:'100%',background:'#F6F3EE',borderRadius:40,overflow:'hidden',position:'relative',display:'flex',flexDirection:'column'}}>
      {/* Dynamic island */}
      <div style={{position:'absolute',top:10,left:'50%',transform:'translateX(-50%)',width:110,height:32,background:'#0B0F0E',borderRadius:100,zIndex:10}}/>
      {/* Status bar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 26px 0',fontFamily:'SF Pro Text, -apple-system, system-ui',fontSize:14,fontWeight:600,position:'relative',zIndex:5}}>
        <span>9:41</span>
        <span style={{opacity:0}}>_</span>
        <span style={{display:'inline-flex',gap:4,alignItems:'center'}}>
          <span style={{fontSize:10}}>●●●</span>
        </span>
      </div>
      {/* Trip completed notification */}
      <div style={{margin:'42px 14px 0',background:'rgba(255,255,255,0.95)',backdropFilter:'blur(8px)',border:'1px solid #E6E1D8',borderRadius:16,padding:'10px 14px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 8px 20px -8px rgba(11,15,14,0.08)'}}>
        <div style={{width:28,height:28,borderRadius:8,background:'linear-gradient(135deg,#7C3AED,#EC4899)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <svg viewBox="0 0 16 16" width={14} height={14}><path d="M3 8 L7 12 L13 4" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11.5,fontWeight:600,color:'#0B0F0E',lineHeight:1.2}}>Trip completed · 12.1 mi</div>
          <div style={{fontSize:10,color:'#6B6862',lineHeight:1.3,marginTop:1}}>Property Showing · +$8.77 deduction</div>
        </div>
        <span style={{fontSize:9,color:'#9A958D',fontFamily:'Geist Mono'}}>now</span>
      </div>
      {/* Dashboard card (purple/pink gauge) */}
      <div style={{margin:'12px 14px 0',background:'linear-gradient(165deg,#1B1036 0%,#2A1248 60%,#3D1A5A 100%)',borderRadius:18,padding:'16px 16px 14px',color:'#F6F3EE',position:'relative',overflow:'hidden'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:100,background:'rgba(110,231,199,0.15)',fontSize:9,fontFamily:'Geist Mono',color:'#6EE7C7',letterSpacing:'0.1em'}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:'#6EE7C7'}}/>
            GPS ACTIVE
          </span>
          <span style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontStyle:'normal',fontSize:11,opacity:0.55}}>MyMilesAI</span>
        </div>
        {/* Gauge */}
        <div style={{display:'flex',justifyContent:'center',padding:'4px 0 8px',position:'relative'}}>
          <svg viewBox="0 0 160 110" style={{width:200,height:138}}>
            <defs>
              <linearGradient id="hgauge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6EE7C7"/>
                <stop offset="40%" stopColor="#A855F7"/>
                <stop offset="100%" stopColor="#EC4899"/>
              </linearGradient>
            </defs>
            <path d="M 20 90 A 60 60 0 0 1 140 90" stroke="rgba(246,243,238,0.1)" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M 20 90 A 60 60 0 0 1 118 36" stroke="url(#hgauge)" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <text x="80" y="80" textAnchor="middle" fontFamily="'Geist','Inter',sans-serif" fontSize="44" fill="#EC4899" fontStyle="normal">42</text>
            <text x="80" y="98" textAnchor="middle" fontFamily='Geist Mono, Geist, monospace' fontSize="8" fill="rgba(246,243,238,0.55)" letterSpacing="0.15em">MPH</text>
          </svg>
        </div>
        {/* Three stat tiles */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
          {[['68.1','BUSINESS MI','#6EE7C7'],['23.1','PERSONAL MI','#A78BFA'],['$49.39','DEDUCTION','#F9A8D4']].map(([v,k,c])=>(
            <div key={k} style={{background:'rgba(11,6,25,0.5)',border:'1px solid rgba(168,85,247,0.15)',borderRadius:10,padding:'8px 6px',textAlign:'center'}}>
              <div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:17,color:c,lineHeight:1,fontStyle:v.startsWith('$')?'normal':'italic'}}>{v}</div>
              <div style={{fontFamily:'Geist Mono',fontSize:7,color:'rgba(246,243,238,0.55)',letterSpacing:'0.1em',marginTop:3}}>{k}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Mode toggles */}
      <div style={{display:'flex',gap:6,padding:'12px 14px 6px'}}>
        <button style={{flex:1,padding:'7px 0',borderRadius:100,background:'#0B0F0E',color:'#F6F3EE',border:'none',fontSize:10.5,fontWeight:600,display:'inline-flex',alignItems:'center',justifyContent:'center',gap:4}}>
          <svg viewBox="0 0 16 16" width={10} height={10}><circle cx="5" cy="8" r="3" fill="none" stroke="#F6F3EE" strokeWidth="1.4"/><path d="M8 8 L12 5 L14 7" stroke="#F6F3EE" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          Auto On
        </button>
        <button style={{flex:1,padding:'7px 0',borderRadius:100,background:'#FFFFFF',color:'#0B0F0E',border:'1px solid #E6E1D8',fontSize:10.5,fontWeight:500}}>+ Add Manual</button>
        <button style={{flex:1,padding:'7px 0',borderRadius:100,background:'#FFFFFF',color:'#0B0F0E',border:'1px solid #E6E1D8',fontSize:10.5,fontWeight:500}}>Map</button>
      </div>
      {/* Recent Trips header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',padding:'6px 18px 8px'}}>
        <span style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:15,letterSpacing:'-0.01em'}}>Recent Trips</span>
        <span style={{fontSize:10,color:'#7C3AED',fontWeight:500}}>See all →</span>
      </div>
      {/* Trip list */}
      <div style={{padding:'0 14px',display:'flex',flexDirection:'column',gap:6,flex:1,overflow:'hidden'}}>
        {[
          {time:'2:10 PM',dur:'18 min',tag:'BUSINESS',tagColor:'#A78BFA',tagBg:'#F3E8FF',from:'123 Main St, Downtown',to:'456 Oak Ave, Westside',ded:'8.4',stop:'Client Meeting',sub:'+$8.10'},
          {time:'11:15 AM',dur:'9 min',tag:'PERSONAL',tagColor:'#FB5E7E',tagBg:'#FCE7F3',from:'Home, Maple Drive',to:'Costco, Regent Ave',ded:'3.2',money:'$47.63',hint:'missed deduction so far'}
        ].map((t,i)=>(
          <div key={i} style={{background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:12,padding:'9px 12px',position:'relative'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontSize:9,color:'#6B6862',fontFamily:'Geist Mono'}}>{t.time} · {t.dur}</span>
              <span style={{fontSize:8,padding:'2px 7px',borderRadius:100,background:t.tagBg,color:t.tagColor,fontFamily:'Geist Mono',letterSpacing:'0.1em',fontWeight:600}}>{t.tag}</span>
            </div>
            <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',paddingTop:3}}>
                <span style={{width:6,height:6,borderRadius:'50%',background:'#0B0F0E'}}/>
                <span style={{width:1,height:14,background:'#E6E1D8',margin:'2px 0'}}/>
                <span style={{width:6,height:6,borderRadius:'50%',background:t.tagColor}}/>
              </div>
              <div style={{flex:1,minWidth:0,fontSize:10,lineHeight:1.35}}>
                <div style={{color:'#0B0F0E'}}>{t.from}</div>
                <div style={{color:'#0B0F0E',marginTop:2}}>{t.to}</div>
                {t.stop && <div style={{marginTop:4,fontSize:8.5,color:'#6B6862',fontFamily:'Geist Mono'}}>{t.stop} <span style={{color:'#16A34A'}}>{t.sub}</span></div>}
                {t.hint && <div style={{marginTop:4,fontSize:8,color:'#9A958D',fontStyle:'normal'}}>{t.hint}</div>}
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontFamily:"'Geist','Inter',sans-serif",fontWeight:700,fontSize:15,fontStyle:'normal',color:t.tagColor,lineHeight:1}}>{t.money||t.ded}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Tab bar */}
      <div style={{margin:'8px 14px 16px',padding:'8px',background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:100,display:'flex',gap:4,alignItems:'center',justifyContent:'space-around'}}>
        <button style={{padding:'7px 14px',borderRadius:100,background:'linear-gradient(90deg,#7C3AED,#EC4899)',color:'#FFF',border:'none',fontSize:11,fontWeight:600,display:'inline-flex',alignItems:'center',gap:5}}>
          <svg viewBox="0 0 16 16" width={11} height={11}><path d="M3 11 L5 6 L11 6 L13 11 M4 11 L12 11 M5.5 13 L5.5 13.5 M10.5 13 L10.5 13.5" stroke="#FFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/><rect x="4" y="11" width="8" height="2.5" rx="0.5" fill="#FFF"/></svg>
          Drive
        </button>
        {['Trips','Stats','Alerts'].map((t,i)=>(
          <button key={t} style={{padding:'7px 10px',borderRadius:100,background:'transparent',color:'#6B6862',border:'none',fontSize:11,fontWeight:500}}>{t}</button>
        ))}
      </div>
    </div>
  </div>
);

window.HeroPhone=HeroPhone;
window.MSLogo=MSLogo; window.MSNav=MSNav; window.MSHero=MSHero; window.MSPress=MSPress; window.MSHow=MSHow; window.MSFeatures=MSFeatures;
