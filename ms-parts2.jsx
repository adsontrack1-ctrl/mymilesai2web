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
    {t:'Real Estate',s:'Showings, inspections & closings',c:'#1B4DDB',i:'home'},
    // Row 2
    {t:'Health Aides',s:'Patient visits & care routes',c:'#1B4DDB',i:'heart'},
    {t:'Field Inspectors',s:'Compliance routes & site audits',c:'#34D399',i:'map'},
    {t:'Sales Representatives',s:'Territory coverage & demos',c:'#C9A96E',i:'user'},
    {t:'Electricians & Plumbers',s:'Emergency calls & service jobs',c:'#C9A96E',i:'bolt'},
    {t:'Nonprofit & Charity Workers',s:'Outreach drives & charity miles',c:'#378ADD',i:'globe'},
    {t:'Accountants & Bookkeepers',s:'Client office visits & engagement work',c:'#378ADD',i:'chart'},
    {t:'Insurance Adjusters',s:'Claim sites & damage assessments',c:'#1B4DDB',i:'shield'},
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
                <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700,fontSize:15,letterSpacing:'-0.005em',color:'#F8F9FA',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.t}</div>
                <div style={{fontSize:14,color:'rgba(246,243,238,0.55)',marginTop:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{a.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <section style={{padding:'96px 0 110px',background:'#0B0F0E',color:'#F8F9FA',overflow:'hidden',position:'relative'}}>
      <style>{`
        @keyframes ms-marq-r { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes ms-marq-l { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        .ms-marq-right { animation: ms-marq-r 60s linear infinite; }
        .ms-marq-left  { animation: ms-marq-l 60s linear infinite; }
        .ms-marq-right:hover, .ms-marq-left:hover { animation-play-state: paused; }
      `}</style>
      <div style={{textAlign:'center',marginBottom:48,padding:'0 56px'}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 14px',border:'1px solid rgba(248,249,250,0.18)',borderRadius:100,fontSize:14,fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:600,color:'rgba(248,249,250,0.85)',marginBottom:28,background:'rgba(248,249,250,0.06)'}}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>
          Who it's for
        </div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(28px,3.4vw,42px)',lineHeight:1.1,letterSpacing:'-0.025em',margin:0}}>
          Built for every professional<br/>who <span style={{color:'#C9A96E'}}>drives to earn.</span>
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
  const features = [
    'Unlimited automatic trip tracking',
    'AI business/personal classification',
    'Tax-ready PDF exports',
    'CSV export for QuickBooks, Xero, FreshBooks',
    'Real-time deduction counter ($0.725/mi or $0.73/km)',
    'US + Canada with standard mileage rates built in',
    'Works offline — syncs when back online',
    'Client and purpose tagging',
    'Multi-vehicle support',
    'Privacy-first: on-device processing, no data selling',
  ];
  return (
    <section id="pricing" style={{padding:'120px 56px'}}>
      <div style={{textAlign:'center',marginBottom:64}}>
        <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:14,fontWeight:600,color:'#1B4DDB',marginBottom:20}}>— Pricing</div>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(28px,3.6vw,46px)',lineHeight:1.1,letterSpacing:'-0.025em',maxWidth:760,margin:'0 auto'}}>
          One plan. Everything included. Costs less than one forgotten drive per month.
        </h2>
      </div>
      <div style={{display:'flex',justifyContent:'center',maxWidth:1200,margin:'0 auto'}}>
        <div style={{background:'#0B0F0E',color:'#F8F9FA',border:'1px solid #0B0F0E',borderRadius:20,padding:40,position:'relative',display:'flex',flexDirection:'column',width:'100%',maxWidth:480}}>
          <div style={{position:'absolute',top:-12,left:40,background:'#1B4DDB',color:'#FFFFFF',padding:'4px 10px',borderRadius:100,fontSize:11,fontFamily:"'DM Sans',system-ui,sans-serif",fontWeight:700}}>MyMilesAI Pro</div>
          <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:700,fontSize:22,marginBottom:6}}>MyMilesAI Pro</div>
          <div style={{fontSize:17,color:'rgba(246,243,238,0.65)',marginBottom:24}}>Everything a serious driver needs. No tiers, no surprises.</div>
          <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4}}>
            <span style={{fontSize:15,color:'rgba(246,243,238,0.4)',textDecoration:'line-through',fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace'}}>$699/yr</span>
            <span style={{fontSize:11,color:'rgba(246,243,238,0.4)',fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.08em'}}>founding member</span>
          </div>
          <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:4}}>
            <span style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:52,lineHeight:1}}>$6.99</span>
            <span style={{fontSize:16,color:'rgba(246,243,238,0.7)',fontWeight:500}}>/month</span>
          </div>
          <div style={{fontSize:14,color:'rgba(246,243,238,0.55)',marginBottom:6}}>or <strong style={{color:'#C9A96E'}}>$69.99/year</strong> — save ~17%</div>
          <div style={{fontSize:12,color:'rgba(246,243,238,0.5)',fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.08em',marginBottom:28}}>7 DAYS FREE · CANCEL ANYTIME</div>
          <a href="signup/" style={{background:'#1B4DDB',color:'#FFFFFF',border:'none',padding:'16px',borderRadius:100,fontSize:15,fontWeight:700,cursor:'pointer',marginBottom:32,textAlign:'center',textDecoration:'none',display:'block',boxShadow:'0 12px 28px -10px rgba(27,77,219,0.5)'}}>Start Free Trial →</a>
          <div style={{display:'flex',flexDirection:'column',gap:12,paddingTop:24,borderTop:'1px solid rgba(246,243,238,0.15)'}}>
            {features.map(f=>(
              <div key={f} style={{display:'flex',gap:10,fontSize:17,alignItems:'flex-start'}}>
                <svg viewBox="0 0 16 16" width={15} height={15} style={{flexShrink:0,marginTop:2}} fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="#1B4DDB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{textAlign:'center',marginTop:40,fontSize:14,color:'#6B7280'}}>
        Cancel anytime from the app. No questions asked.
      </div>
    </section>
  );
};

const MSBlog = () => {
  const posts = [
    {cat:'Tax Guide',title:'The 2026 IRS mileage rate, explained in plain English',read:'6 min',d:'Apr 2026',u:'blog/irs-mileage-rate-2026.html'},
    {cat:'For Rideshare',title:'Uber drivers: what your 1099-K doesn\'t tell you about deductions',read:'9 min',d:'Apr 2026',u:'blog/uber-driver-deductions-2026.html'},
    {cat:'Audit Prep',title:'What an IRS mileage audit actually looks like (and how to survive)',read:'12 min',d:'Mar 2026',u:'blog/irs-mileage-audit-guide.html'},
    {cat:'For Realtors',title:'Every showing, every open house: the realtor deduction map',read:'7 min',d:'Mar 2026',u:'blog/realtor-mileage-deductions.html'},
  ];
  return (
    <section style={{padding:'120px 56px',background:'#FAFAFA',borderTop:'1px solid #E8EAED',borderBottom:'1px solid #E8EAED'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginBottom:56}}>
        <div>
          <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:14,fontWeight:600,color:'#1B4DDB',marginBottom:20}}>— Journal</div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(28px,3.2vw,42px)',lineHeight:1.1,letterSpacing:'-0.025em'}}>
            Tax guides from people<br/>who actually drive for work.
          </h2>
        </div>
        <a href="blog.html" style={{fontSize:14,color:'#0B0F0E',textDecoration:'underline',textUnderlineOffset:4}}>All articles →</a>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20}}>
        {posts.map((p,i)=>(
          <a key={i} href={p.u} style={{background:'#FFFFFF',border:'1px solid #E5E7EB',borderRadius:16,padding:24,display:'flex',flexDirection:'column',gap:16,textDecoration:'none',color:'inherit',cursor:'pointer'}}>
            <div style={{aspectRatio:'4/3',background:`linear-gradient(135deg, hsl(${25+i*40},35%,70%), hsl(${25+i*40},45%,85%))`,borderRadius:8}}/>
            <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:13,fontWeight:600,color:'#1B4DDB'}}>{p.cat}</div>
            <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:700,fontSize:22,lineHeight:1.3,letterSpacing:'-0.01em',flex:1}}>{p.title}</div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#6B7280',fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.05em'}}>
              <span>{p.d}</span><span>{p.read}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

const MSAbout = () => {
  return (
    <section style={{padding:'100px 56px',background:'#F8F9FA',color:'#0B0F0E'}}>
      <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:14,fontWeight:600,color:'#1B4DDB',marginBottom:24}}>— About MyMilesAI</div>
      <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:80,alignItems:'start',marginBottom:80}}>
        <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(30px,3.4vw,44px)',lineHeight:1.1,letterSpacing:'-0.025em'}}>
          Built by people who got tired of losing deductions.
        </h2>
        <div style={{fontSize:16,lineHeight:1.7,color:'#374151',display:'flex',flexDirection:'column',gap:20}}>
          <p>We drove for work. We forgot to log. We lost thousands at tax time — and we knew exactly where the money went. Just nowhere. Unclaimed. Gone.</p>
          <p>So we built the app we wished existed. MyMilesAI is a product of Harijas LLC, based in Canada and serving self-employed professionals across the US and Canada. Every feature exists because a real driver asked for it.</p>
          <p>We built it privacy-first because we don't want your location data — we want you to keep your deductions. On-device processing, no data selling, no cloud tracking. Your trips stay yours.</p>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:32,padding:'40px 0',borderTop:'1px solid #E5E7EB',borderBottom:'1px solid #E5E7EB',marginBottom:64}}>
        {[
          {label:'Privacy-first by design',desc:'On-device processing. We never sell your location data or driving history.'},
          {label:'Simple and affordable',desc:'$6.99/month. Less than what you\'d lose by forgetting a single client visit.'},
          {label:'Built for real workers',desc:'Not enterprise fleet management. Built for freelancers, realtors, and gig drivers.'},
        ].map(v=>(
          <div key={v.label}>
            <div style={{width:32,height:32,background:'#1B4DDB',borderRadius:8,marginBottom:14,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg viewBox="0 0 16 16" width={15} height={15} fill="none"><path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:700,fontSize:17,marginBottom:8}}>{v.label}</div>
            <div style={{fontSize:16,color:'#374151',lineHeight:1.55}}>{v.desc}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:16,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{fontSize:15,color:'#374151'}}>Questions? We're real people.</div>
        <a href="mailto:support@mymilesai.com" style={{color:'#1B4DDB',fontWeight:600,fontSize:15,textDecoration:'underline',textUnderlineOffset:3}}>support@mymilesai.com</a>
        <a href="mailto:hello@mymilesai.com" style={{color:'#1B4DDB',fontWeight:600,fontSize:15,textDecoration:'underline',textUnderlineOffset:3}}>hello@mymilesai.com</a>
      </div>
    </section>
  );
};

const MSCTA = () => (
  <section style={{padding:'120px 56px',background:'radial-gradient(ellipse at 50% 100%, rgba(27,77,219,0.12), transparent 60%), #0B0F0E',color:'#F8F9FA',textAlign:'center',position:'relative',overflow:'hidden'}}>
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:14,fontWeight:600,color:'rgba(248,249,250,0.6)',marginBottom:32}}>— Start today</div>
    <h2 style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",fontWeight:800,fontSize:'clamp(32px,5vw,64px)',lineHeight:1.05,letterSpacing:'-0.03em',marginBottom:40,maxWidth:900,margin:'0 auto 32px'}}>
      The next mile you drive<br/>could be <span style={{color:'#C9A96E'}}>deductible.</span>
    </h2>
    <p style={{fontSize:20,color:'rgba(246,243,238,0.65)',maxWidth:520,margin:'0 auto 16px'}}>
      Your first 7 days are free. Cancel anytime from the app.
    </p>
    <p style={{fontSize:15,color:'rgba(246,243,238,0.4)',maxWidth:520,margin:'0 auto 40px',fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.05em'}}>
      Switching from MileIQ? We support CSV import.
    </p>
    <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
      <a href="signup/" style={{background:'#1B4DDB',color:'#FFFFFF',border:'none',padding:'20px 36px',borderRadius:100,fontSize:16,fontWeight:700,cursor:'pointer',boxShadow:'0 12px 32px -8px rgba(27,77,219,0.5)',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8}}>
        Start Free Trial
        <svg viewBox="0 0 16 16" width={14} height={14} fill="none"><path d="M3 8H13M8 3L13 8L8 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </a>
    </div>
  </section>
);

const MSFooter = () => (
  <footer style={{padding:'80px 56px 40px',background:'#0B0F0E',color:'rgba(246,243,238,0.6)',borderTop:'1px solid rgba(246,243,238,0.1)'}}>
    <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr',gap:40,marginBottom:64}}>
      <div>
        <MSLogo onDark={true} size={22}/>
        <p style={{fontSize:16,marginTop:20,maxWidth:280,lineHeight:1.55,color:'rgba(246,243,238,0.6)'}}>The automatic mileage tracker for self-employed professionals in the US and Canada.</p>
        <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:6,fontSize:15}}>
          <a href="mailto:support@mymilesai.com" style={{color:'rgba(246,243,238,0.6)',textDecoration:'none'}}>support@mymilesai.com</a>
          <a href="mailto:hello@mymilesai.com" style={{color:'rgba(246,243,238,0.6)',textDecoration:'none'}}>hello@mymilesai.com</a>
        </div>
      </div>
      {[
        {h:'Product',l:[{t:'Features',u:'features.html'},{t:'How It Works',u:'how-it-works.html'},{t:'Pricing',u:'pricing.html'}]},
        {h:'Resources',l:[{t:'Blog',u:'blog.html'},{t:'About',u:'about.html'},{t:'Sign In',u:'signin/'},{t:'Start Free Trial',u:'signup/'}]},
        {h:'Legal',l:[{t:'Privacy Policy',u:'privacy/'},{t:'Terms of Service',u:'terms/'}]},
      ].map(c=>(
        <div key={c.h}>
          <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",fontSize:14,fontWeight:600,color:'rgba(248,249,250,0.6)',marginBottom:20}}>{c.h}</div>
          {c.l.map(x=><a key={x.t} href={x.u} style={{display:'block',fontSize:15,marginBottom:10,color:'rgba(246,243,238,0.7)',textDecoration:'none'}}>{x.t}</a>)}
        </div>
      ))}
    </div>
    <div style={{display:'flex',justifyContent:'space-between',paddingTop:32,borderTop:'1px solid rgba(246,243,238,0.1)',fontSize:13,fontFamily:'ui-monospace,\'SF Mono\',Menlo,monospace',letterSpacing:'0.05em'}}>
      <span>© 2026 Harijas LLC · All rights reserved</span>
      <span>US + CANADA</span>
    </div>
    <div style={{paddingTop:24,fontSize:14,lineHeight:1.6,color:'rgba(246,243,238,0.45)',maxWidth:900}}>
      <strong style={{color:'rgba(246,243,238,0.7)'}}>Disclaimer:</strong> MyMilesAI is a recordkeeping tool, not a tax preparer or tax-advice service. Mileage rates and deduction calculations shown are based on publicly available guidance and may not reflect your specific tax situation. Consult a qualified tax professional for tax advice. Use of MyMilesAI does not guarantee tax-authority acceptance of your records or your tax return.
    </div>
  </footer>
);

window.MSAudience=MSAudience; window.MSTestimonials=MSTestimonials; window.MSPricing=MSPricing; window.MSBlog=MSBlog; window.MSAbout=MSAbout; window.MSCTA=MSCTA; window.MSFooter=MSFooter;
