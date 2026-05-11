/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 * Confidential and proprietary. Unauthorized use prohibited.
 * MyMilesAI is a trademark of Harijas LLC.
 * MyMilesAI is a recordkeeping tool - not tax advice.
 * See LICENSE for full terms. harijasllc@outlook.com
 */

/* Marketing site — part 2: pricing, testimonials, calc, blog, CTA, footer */

const MSAudience = () => {
  // Each card: title, subtitle, icon (small SVG), accent color for icon tile.
  const Icon = ({d, c}) => (
    <div style={{width:36,height:36,borderRadius:8,background:`${c}22`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
    </div>
  );
  // SVG path snippets for each role.
  const ic = {
    truck:    <><path d="M3 7h11v8H3z"/><path d="M14 10h4l3 3v2h-7"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
    brief:   <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    wrench:  <><path d="M14 7a4 4 0 0 1-5 5l-6 6 3 3 6-6a4 4 0 0 1 5-5z"/></>,
    heart:   <><path d="M20.84 4.6a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.07a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.85a5.5 5.5 0 0 0 0-7.78z"/></>,
    car:     <><path d="M5 17h14"/><path d="M5 17v-4l2-5h10l2 5v4"/><circle cx="7.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/></>,
    cam:     <><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
    home:    <><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></>,
    map:     <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></>,
    user:    <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    bolt:    <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    globe:   <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/></>,
    chart:   <><path d="M3 20h18"/><rect x="6" y="12" width="3" height="6"/><rect x="11" y="8" width="3" height="10"/><rect x="16" y="4" width="3" height="14"/></>,
    shield:  <><path d="M12 2l8 4v6c0 5-3.5 9-8 10c-4.5-1-8-5-8-10V6l8-4z"/></>,
    crane:   <><path d="M3 18h18"/><path d="M6 18V8"/><path d="M6 8h12"/><path d="M18 8v6"/><circle cx="14" cy="18" r="2"/></>,
  };
  const cards = [
    // Row 1
    {t:'Drivers',s:'Daily routes & multi-stop drops',c:'#C9A96E',i:'truck'},
    {t:'Consultants',s:'Client meetings & site visits',c:'#34D399',i:'brief'},
    {t:'Contractors & Trades',s:'Job sites, supply runs & bids',c:'#1B4DDB',i:'wrench'},
    {t:'Medical & Pharma Reps',s:'Hospital rounds & territory coverage',c:'#378ADD',i:'heart'},
    {t:'Rideshare & Gig Drivers',s:'Uber, Lyft, DoorDash & more',c:'#C9A96E',i:'car'},
    {t:'Photographers',s:'Shoots, events & studio runs',c:'#378ADD',i:'cam'},
    {t:'Real Estate',s:'Showings, inspections & closings',c:'#F87171',i:'home'},
    // Row 2
    {t:'Health Aides',s:'Patient visits & care routes',c:'#1B4DDB',i:'heart'},
    {t:'Field Inspectors',s:'Compliance routes & site audits',c:'#34D399',i:'map'},
    {t:'Sales Representatives',s:'Territory coverage & demos',c:'#C9A96E',i:'user'},
    {t:'Electricians & Plumbers',s:'Emergency calls & service jobs',c:'#C9A96E',i:'bolt'},
    {t:'Nonprofit & Charity Workers',s:'Outreach drives & charity miles',c:'#378ADD',i:'globe'},
    {t:'Accountants & CPAs',s:'Client office visits & audits',c:'#378ADD',i:'chart'},
    {t:'Insurance Adjusters',s:'Claim sites & damage assessments',c:'#F87171',i:'shield'},
    {t:'Construction Foremen',s:'Site supervision & crew coordination',c:'#C9A96E',i:'crane'},
  ];
  const rowA = cards.slice(0, 7);
  const rowB = cards.slice(7);
  const Row = ({items, dir}) => {
    const loop = [...items, ...items];
    const cls = dir === 'left' ? 'ms-marq-left' : 'ms-marq-right';
    return (
      <div style={{position:'relative',overflow:'hidden'}}>
        <div className={cls} style={{display:'flex',gap:14,width:'max-content'}}>
          {loop.map((a,i)=>(
            <div key={i} style={{flex:'0 0 300px',background:'rgba(246,243,238,0.04)',border:'1px solid rgba(246,243,238,0.08)',borderRadius:14,padding:'20px 22px',display:'flex',gap:14,alignItems:'center'}}>
              <Icon d={ic[a.i]} c={a.c}/>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700,fontSize:15,letterSpacing:'-0.005em',color:'#F6F3EE',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.t}</div>
                <div style={{fontSize:12,color:'rgba(246,243,238,0.55)',marginTop:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <section style={{padding:'96px 0 110px',background:'#0B0F0E',color:'#F6F3EE',overflow:'hidden',position:'relative'}}>
      <style>{`
        @keyframes ms-marq-r { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ms-marq-l { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .ms-marq-right { animation: ms-marq-r 60s linear infinite; }
        .ms-marq-left  { animation: ms-marq-l 60s linear infinite; }
        .ms-marq-right:hover, .ms-marq-left:hover { animation-play-state: paused; }
      `}</style>
      <div style={{textAlign:'center',marginBottom:48,padding:'0 56px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 14px',border:'1px solid rgba(246,243,238,0.18)',borderRadius:100,fontSize:11,fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(246,243,238,0.85)',marginBottom:28,background:'rgba(246,243,238,0.04)'}}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
          Who it's for
        </div>
        <h2 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:42,lineHeight:1.1,letterSpacing:'-0.015em',margin:0}}>
          Built for every professional<br/>who <em style={{fontStyle:'italic',color:'#C9A96E'}}>drives to earn.</em>
        </h2>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:14,position:'relative'}}>
        <Row items={rowA} dir="right"/>
        <Row items={rowB} dir="left"/>
        <div style={{position:'absolute',top:0,left:0,bottom:0,width:120,background:'linear-gradient(to right, #0B0F0E, transparent)',pointerEvents:'none',zIndex:2}}/>
        <div style={{position:'absolute',top:0,right:0,bottom:0,width:120,background:'linear-gradient(to left, #0B0F0E, transparent)',pointerEvents:'none',zIndex:2}}/>
      </div>
    </section>
  );
};

const MSTestimonials = () => {
  // testimonials: removed pending real customer quotes — do not re-add without consent on file
  return null;
};

const MSPricing = () => {
  const t = {name:'Pro',price:'$6.99',sub:'/mo · $69.99/yr billed annually',desc:'The default. Everything a serious driver needs.',features:['Unlimited drives','AI auto-classify','IRS-ready PDF exports','Routes & work hours','Priority support','Multi-vehicle'],cta:'Start 10-day free trial',dark:true,badge:'MOST POPULAR'};
  return (
    <section id="pricing" style={{padding:'120px 56px'}}>
      <div style={{textAlign:'center',marginBottom:64}}>
        <div style={{fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#6B6862',marginBottom:20}}>— Pricing</div>
        <h2 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:46,lineHeight:1.05,letterSpacing:'-0.02em',maxWidth:760,margin:'0 auto'}}>
          Costs less than one forgotten drive per month.
        </h2>
      </div>
      <div style={{display:'flex',justifyContent:'center',maxWidth:1200,margin:'0 auto'}}>
        <div style={{background:t.dark?'#0B0F0E':'#FFFFFF',color:t.dark?'#F6F3EE':'#0B0F0E',border:`1px solid ${t.dark?'#0B0F0E':'#E6E1D8'}`,borderRadius:20,padding:40,position:'relative',display:'flex',flexDirection:'column',width:'100%',maxWidth:440}}>
          {t.badge && <div style={{position:'absolute',top:-12,left:40,background:'#1B4DDB',color:'#FFFFFF',padding:'4px 10px',borderRadius:100,fontSize:10,fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.15em'}}>{t.badge}</div>}
          <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700,fontSize:24,marginBottom:6}}>{t.name}</div>
          <div style={{fontSize:14,color:t.dark?'rgba(246,243,238,0.65)':'#6B6862',marginBottom:28,minHeight:40}}>{t.desc}</div>
          <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:4}}>
            <span style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:44,lineHeight:1}}>{t.price}</span>
          </div>
          <div style={{fontSize:12,fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.08em',color:t.dark?'rgba(246,243,238,0.55)':'#6B6862',marginBottom:28}}>{t.sub}</div>
          <button style={{background:'#1B4DDB',color:'#FFFFFF',border:'none',padding:'14px',borderRadius:100,fontSize:14,fontWeight:500,cursor:'pointer',marginBottom:32}}>{t.cta}</button>
          <div style={{display:'flex',flexDirection:'column',gap:12,paddingTop:24,borderTop:`1px solid ${t.dark?'rgba(246,243,238,0.15)':'#E6E1D8'}`}}>
            {t.features.map(f=>(
              <div key={f} style={{display:'flex',gap:10,fontSize:14}}>
                <span style={{color:'#1B4DDB'}}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{textAlign:'center',marginTop:40,fontSize:13,color:'#6B6862'}}>
        7-day money back · cancel anytime · no credit card for free trial
      </div>
    </section>
  );
};

const MSBlog = () => {
  const posts = [
    {cat:'Tax Guide',title:'The 2026 IRS mileage rate, explained in plain English',read:'6 min',d:'Apr 2026'},
    {cat:'For Rideshare',title:'Uber drivers: what your 1099-K doesn\'t tell you about deductions',read:'9 min',d:'Apr 2026'},
    {cat:'Audit Prep',title:'What an IRS mileage audit actually looks like (and how to survive)',read:'12 min',d:'Mar 2026'},
    {cat:'For Realtors',title:'Every showing, every open house: the realtor deduction map',read:'7 min',d:'Mar 2026'},
  ];
  return (
    <section style={{padding:'120px 56px',background:'#FAFAF9',borderTop:'1px solid #EEEBE5',borderBottom:'1px solid #EEEBE5'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginBottom:56}}>
        <div>
          <div style={{fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#6B6862',marginBottom:20}}>— Journal</div>
          <h2 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:44,lineHeight:1.05,letterSpacing:'-0.02em'}}>
            Guides from the people<br/>who actually read the tax code.
          </h2>
        </div>
        <a style={{fontSize:14,color:'#0B0F0E',textDecoration:'underline',textUnderlineOffset:4}}>All articles →</a>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
        {posts.map((p,i)=>(
          <a key={i} style={{background:'#FFFFFF',border:'1px solid #E6E1D8',borderRadius:16,padding:24,display:'flex',flexDirection:'column',gap:16,textDecoration:'none',color:'inherit',cursor:'pointer'}}>
            <div style={{aspectRatio:'4/3',background:`linear-gradient(135deg, hsl(${25+i*40},35%,70%), hsl(${25+i*40},45%,85%))`,borderRadius:8}}/>
            <div style={{fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'#6B6862'}}>{p.cat}</div>
            <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700,fontSize:18,lineHeight:1.3,letterSpacing:'-0.01em',flex:1}}>{p.title}</div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'#6B6862',fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.05em'}}>
              <span>{p.d}</span><span>{p.read}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

const MSAbout = () => {
  // stats + team arrays removed pending real numbers/people — do not re-add without substantiation
  return (
    <section style={{padding:'140px 56px',background:'#F6F3EE',color:'#0B0F0E'}}>
      <div style={{fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'#6B6862',marginBottom:24}}>— About MyMilesAI</div>
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:80,alignItems:'start',marginBottom:96}}>
        <h2 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:44,lineHeight:1.1,letterSpacing:'-0.02em'}}>
          Built by drivers, for the people who can't stop driving.
        </h2>
        <div style={{fontSize:16,lineHeight:1.65,color:'#4A4843'}}>
          <p>MyMilesAI started in 2026. A machine-learning engineer realized the average self-employed driver was leaving thousands of dollars on the table because manual mileage logging is broken. Tax expertise meets machine-learning engineering — every decision routed through both lenses. The people behind the algorithm.</p>
        </div>
      </div>
    </section>
  );
};

const MSCTA = () => (
  <section style={{padding:'120px 56px',background:'radial-gradient(ellipse at 50% 100%, rgba(27,77,219,0.12), transparent 60%), #0B0F0E',color:'#F6F3EE',textAlign:'center',position:'relative',overflow:'hidden'}}>
    <div style={{fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',fontSize:11,letterSpacing:'0.2em',textTransform:'uppercase',color:'rgba(246,243,238,0.5)',marginBottom:32}}>— Start today</div>
    <h2 style={{fontFamily:"'Instrument Serif',Georgia,serif",fontWeight:400,fontSize:64,lineHeight:1.0,letterSpacing:'-0.03em',marginBottom:40,maxWidth:1100,margin:'0 auto 40px'}}>
      The next mile you drive<br/>could be <em style={{color:'#C9A96E'}}>deductible.</em>
    </h2>
    <p style={{fontSize:17,color:'rgba(246,243,238,0.65)',maxWidth:540,margin:'0 auto 40px'}}>
      Ten days free. No credit card. Cancel before tax day and keep every log you made.
    </p>
    <div style={{display:'flex',gap:12,justifyContent:'center'}}>
      <button style={{background:'#1B4DDB',color:'#FFFFFF',border:'none',padding:'20px 32px',borderRadius:100,fontSize:16,fontWeight:600,cursor:'pointer',boxShadow:'0 12px 32px -8px rgba(27,77,219,0.5)'}}>Start tracking — free</button>
    </div>
  </section>
);

const MSFooter = () => (
  <footer style={{padding:'80px 56px 40px',background:'#0B0F0E',color:'rgba(246,243,238,0.6)',borderTop:'1px solid rgba(246,243,238,0.1)'}}>
    <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr',gap:40,marginBottom:64}}>
      <div>
        <MSLogo color="#F6F3EE" size={26}/>
        <p style={{fontSize:14,marginTop:20,maxWidth:280,lineHeight:1.5}}>The AI mileage tracker for people whose work happens between addresses.</p>
      </div>
      {[
        {h:'Product',l:['Features','Pricing','For Accountants','Integrations','Changelog']},
        {h:'Resources',l:['Blog','IRS Rate Tracker','Audit Guide','Deduction Calculator','Help Center']},
        {h:'Company',l:['About','Careers','Press','Contact']},
        {h:'Legal',l:['Privacy','Terms','IRS Compliance']},
      ].map(c=>(
        <div key={c.h}>
          <div style={{fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'rgba(246,243,238,0.45)',marginBottom:20}}>{c.h}</div>
          {c.l.map(x=><a key={x} style={{display:'block',fontSize:13,marginBottom:10,color:'#F6F3EE',textDecoration:'none',cursor:'pointer'}}>{x}</a>)}
        </div>
      ))}
    </div>
    <div style={{display:'flex',justifyContent:'space-between',paddingTop:32,borderTop:'1px solid rgba(246,243,238,0.1)',fontSize:12,fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.05em'}}>
      <span>© 2026 Harijas LLC · Manteca, CA</span>
      <span>IRS PUB. 463 FORMAT</span>
    </div>
    <div style={{paddingTop:24,fontSize:11,lineHeight:1.6,color:'rgba(246,243,238,0.45)',maxWidth:900}}>
      <strong style={{color:'rgba(246,243,238,0.7)'}}>Disclaimer:</strong> MyMilesAI is a recordkeeping tool, not a tax preparer or tax-advice service. Mileage rates and deduction calculations shown are based on publicly available IRS and CRA guidance and may not reflect your specific tax situation. Consult a qualified CPA or tax professional for tax advice. Use of MyMilesAI does not guarantee IRS or tax-authority acceptance of your records or your tax return.
    </div>
  </footer>
);

window.MSAudience=MSAudience; window.MSTestimonials=MSTestimonials; window.MSPricing=MSPricing; window.MSBlog=MSBlog; window.MSAbout=MSAbout; window.MSCTA=MSCTA; window.MSFooter=MSFooter;
