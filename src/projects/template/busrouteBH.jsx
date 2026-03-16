import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./br-bh.css";

const TOTAL = 9;

/* ── useInView: triggers once when element enters viewport ── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, on];
}

/* ── CountUp: number rolls up when it enters the viewport ── */
function CountUp({ to, suffix = "", prefix = "", duration = 1400, decimals = 0 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const rafRef = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(parseFloat((eased * to).toFixed(decimals)));
          if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setVal(0);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => { obs.disconnect(); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [to, duration, decimals]);
  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
}

/* ── AnimatedBars: progress bars that animate in on scroll ── */
function AnimatedBars() {
  const [ref, on] = useInView(0.3);
  const bars = [
    { name:"Commute frequency", pct:92, fill:"bh-pfill-orange" },
    { name:"App trust",          pct:28, fill:"bh-pfill-gray" },
    { name:"Data sensitivity",   pct:78, fill:"bh-pfill-dark" },
    { name:"Digital literacy",   pct:65, fill:"bh-pfill-blue" },
  ];
  return (
    <div ref={ref} className="bh-progress-group" style={{marginTop:0}}>
      {bars.map(({ name, pct, fill }) => (
        <div className="bh-progress-item" key={name}>
          <div className="bh-progress-hdr">
            <span className="bh-progress-name">{name}</span>
            <span className="bh-progress-pct">{pct}%</span>
          </div>
          <div className="bh-progress-track">
            <div className={`bh-progress-fill ${fill}`} style={{ width: on ? `${pct}%` : "0%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SlideHeader({ label, labelBold, current }) {
  const pct = (current / TOTAL) * 100;
  return (
    <div className="bh-slide-hdr">
      <div className="bh-slide-label">
        {label}{labelBold ? <> <b>{labelBold}</b></> : null}<span className="bh-dot" style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#C6F135',marginLeft:4}} />
      </div>
      <div className="bh-pgctr">
        <span className="bh-pgctr-num">{String(current).padStart(2,"0")}</span>
        <div className="bh-pgctr-bar">
          <div className="bh-pgctr-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="bh-pgctr-total">{TOTAL}</span>
      </div>
    </div>
  );
}

/* ── Mini phone mockup  matches actual zing app ── */
function ZingPhone({ screen = "home" }) {
  return (
    <div style={{
      width: 200, height: 420, background: "#0D0D0F", borderRadius: 36,
      overflow: "hidden", position: "relative", flexShrink: 0,
      boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
    }}>
      {/* Dynamic island */}
      <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", width:80, height:22, background:"#000", borderRadius:12, zIndex:10 }} />
      {/* Status bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:40, display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 18px 6px", zIndex:9 }}>
        <span style={{ fontFamily:"monospace", fontSize:9, color:"#F0F0F2", fontWeight:600 }}>9:41</span>
        <span style={{ fontSize:9, color:"#F0F0F2" }}>▪▪▪ ▾ ▮</span>
      </div>

      {screen === "splash" && <SplashScreen />}
      {screen === "home" && <HomeScreen />}
      {screen === "search" && <SearchScreen />}
      {screen === "live" && <LiveScreen />}
      {screen === "trip" && <TripScreen />}
    </div>
  );
}

function SplashScreen() {
  return (
    <div style={{ position:"absolute", inset:0, background:"#080808", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      {/* Radial lime glow */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 50% at 50% 44%, rgba(198,241,53,0.22) 0%, rgba(198,241,53,0.07) 40%, transparent 70%)", pointerEvents:"none" }} />
      {/* App icon */}
      <div style={{ width:60, height:60, borderRadius:16, background:"#C6F135", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, position:"relative", zIndex:1, boxShadow:"0 0 40px rgba(198,241,53,0.35), 0 0 80px rgba(198,241,53,0.12)" }}>
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <rect x="5" y="12" width="24" height="14" rx="3" fill="#0D0D0F"/>
          <rect x="8" y="9" width="18" height="6" rx="2" fill="#0D0D0F"/>
          <circle cx="11" cy="26" r="3" fill="#C6F135" stroke="#0D0D0F" strokeWidth="1.5"/>
          <circle cx="23" cy="26" r="3" fill="#C6F135" stroke="#0D0D0F" strokeWidth="1.5"/>
          <rect x="14" y="15" width="6" height="4" rx="1" fill="#C6F135" opacity="0.6"/>
          <rect x="8" y="15" width="4" height="4" rx="1" fill="#C6F135" opacity="0.4"/>
        </svg>
      </div>
      {/* Wordmark */}
      <div style={{ fontSize:22, fontWeight:700, color:"#FFFFFF", letterSpacing:"-0.03em", lineHeight:1, position:"relative", zIndex:1, marginBottom:6 }}>zing</div>
      {/* Tagline */}
      <div style={{ fontSize:9, color:"rgba(255,255,255,0.42)", letterSpacing:"0.02em", position:"relative", zIndex:1 }}>Your city, simplified.</div>
      {/* Progress bar */}
      <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
        <div style={{ width:60, height:2.5, background:"rgba(255,255,255,0.08)", borderRadius:2, overflow:"hidden" }}>
          <div style={{ width:"45%", height:"100%", background:"#C6F135", borderRadius:2 }} />
        </div>
        <span style={{ fontSize:7, color:"rgba(255,255,255,0.2)", letterSpacing:".06em" }}>Loading</span>
      </div>
    </div>
  );
}

function HomeScreen() {
  return (
    <>
      {/* Map grid background */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"55%", background:"#161620" }}>
        <svg width="200" height="140" viewBox="0 0 200 140" style={{opacity:0.4}}>
          {[0,28,56,84,112,140,168,196].map(x=><line key={x} x1={x} y1={0} x2={x} y2={140} stroke="#252535" strokeWidth={1}/>)}
          {[0,20,40,60,80,100,120,140].map(y=><line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#252535" strokeWidth={1}/>)}
          <rect x={20} y={10} width={52} height={48} rx={3} fill="#1C1C28"/>
          <rect x={76} y={10} width={40} height={48} rx={3} fill="#181825"/>
          <rect x={120} y={10} width={60} height={48} rx={3} fill="#1C1C28"/>
          <rect x={20} y={65} width={52} height={40} rx={3} fill="#181825"/>
          <rect x={76} y={65} width={40} height={40} rx={3} fill="#1C1C28"/>
          <line x1={0} y1={60} x2={200} y2={60} stroke="#2A2A3A" strokeWidth={4}/>
          <line x1={72} y1={0} x2={72} y2={140} stroke="#2A2A3A" strokeWidth={4}/>
        </svg>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60%", background:"linear-gradient(transparent,#0D0D0F)" }}/>
        {/* Live badge */}
        <div style={{ position:"absolute", top:50, right:10, display:"flex", alignItems:"center", gap:4, background:"rgba(13,13,15,0.8)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:100, padding:"3px 8px" }}>
          <div style={{ width:5, height:5, background:"#C6F135", borderRadius:"50%" }}/>
          <span style={{ fontSize:7, fontWeight:700, color:"#C6F135", letterSpacing:".06em" }}>LIVE</span>
        </div>
        {/* Location pin */}
        <div style={{ position:"absolute", left:"50%", top:70, transform:"translateX(-50%)" }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(198,241,53,0.15)", border:"1px solid rgba(198,241,53,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:10, height:10, background:"#C6F135", borderRadius:"50%", boxShadow:"0 0 0 3px rgba(198,241,53,0.2)" }}/>
          </div>
        </div>
      </div>
      {/* Bottom sheet */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#161618", borderRadius:"18px 18px 0 0", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"10px 12px 0" }}>
        {/* Greeting */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:7, color:"#5A5A6A", letterSpacing:".08em", textTransform:"uppercase", marginBottom:2 }}>GOOD MORNING</div>
          <div style={{ fontSize:11, fontWeight:700, color:"#F0F0F2" }}>Hello, Priya 👋</div>
        </div>
        {/* Search */}
        <div style={{ background:"#1C1C1F", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"7px 10px", display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <div style={{ width:6, height:6, background:"#C6F135", borderRadius:"50%", flexShrink:0 }}/>
          <span style={{ fontSize:8, color:"#5A5A6A" }}>Where do you want to go?</span>
        </div>
        {/* Chips */}
        <div style={{ display:"flex", gap:5, marginBottom:8 }}>
          {["🏠 Home","💼 Work","⭐ Saved"].map((c,i)=>(
            <div key={c} style={{ height:18, padding:"0 8px", borderRadius:100, background:i===0?"rgba(198,241,53,0.12)":"#1C1C1F", border:`1px solid ${i===0?"rgba(198,241,53,0.25)":"rgba(255,255,255,0.07)"}`, fontSize:7, color:i===0?"#C6F135":"#5A5A6A", display:"flex", alignItems:"center" }}>{c}</div>
          ))}
        </div>
        {/* Service updates label */}
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
          <span style={{ fontSize:7, fontWeight:600, color:"#F0F0F2" }}>Service Updates</span>
          <span style={{ fontSize:6, color:"#C6F135" }}>View all →</span>
        </div>
        {/* Alert cards */}
        <div style={{ background:"#1C1C1F", border:"1px solid rgba(255,255,255,0.07)", borderRadius:7, padding:"5px 8px", display:"flex", alignItems:"center", gap:5, marginBottom:4 }}>
          <div style={{ width:16, height:16, borderRadius:5, background:"rgba(255,107,53,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, flexShrink:0 }}>⚠️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:6.5, fontWeight:600, color:"#F0F0F2" }}>Yellow Line</div>
            <div style={{ fontSize:5.5, color:"#9090A0" }}>5 min delay near Shivajinagar</div>
          </div>
          <div style={{ fontSize:5.5, fontWeight:700, padding:"2px 5px", borderRadius:100, background:"rgba(255,107,53,0.12)", color:"#FF6B35" }}>+5 min</div>
        </div>
        <div style={{ background:"#1C1C1F", border:"1px solid rgba(255,255,255,0.07)", borderRadius:7, padding:"5px 8px", display:"flex", alignItems:"center", gap:5 }}>
          <div style={{ width:16, height:16, borderRadius:5, background:"rgba(62,223,138,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, flexShrink:0 }}>✅</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:6.5, fontWeight:600, color:"#F0F0F2" }}>Traffic Cleared</div>
            <div style={{ fontSize:5.5, color:"#9090A0" }}>Kothrud corridor cleared</div>
          </div>
          <div style={{ fontSize:5.5, fontWeight:700, padding:"2px 5px", borderRadius:100, background:"rgba(62,223,138,0.12)", color:"#3EDF8A" }}>Clear</div>
        </div>
        {/* Bottom nav */}
        <div style={{ display:"flex", padding:"8px 0 4px", borderTop:"1px solid rgba(255,255,255,0.07)", marginTop:6 }}>
          {[["🏠","Home",true],["🔍","Explore",false],["🔔","Alerts",false],["👤","Profile",false]].map(([ic,lb,on])=>(
            <div key={lb} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <div style={{ width:24, height:18, borderRadius:6, background:on?"#C6F135":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:on?9:10 }}>{ic}</div>
              <span style={{ fontSize:5, fontWeight:500, color:on?"#C6F135":"#30303C" }}>{lb}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SearchScreen() {
  return (
    <div style={{ padding:"48px 10px 12px", height:"100%", display:"flex", flexDirection:"column", gap:0 }}>
      {/* Search input */}
      <div style={{ background:"#1C1C1F", border:"1.5px solid #C6F135", borderRadius:10, padding:"7px 10px", display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
        <div style={{ width:6, height:6, background:"#C6F135", borderRadius:"50%", flexShrink:0 }}/>
        <span style={{ fontSize:8, color:"#F0F0F2" }}>Swargate</span>
        <span style={{ marginLeft:"auto", fontSize:9, color:"#5A5A6A" }}>✕</span>
      </div>
      {/* From row */}
      <div style={{ background:"#1C1C1F", borderRadius:8, padding:"6px 8px", display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
        <div style={{ width:6, height:6, background:"#C6F135", borderRadius:"50%", flexShrink:0 }}/>
        <span style={{ fontSize:7, color:"#5A5A6A" }}>From</span>
        <span style={{ fontSize:7, color:"#F0F0F2" }}>Current Location</span>
        <div style={{ marginLeft:"auto", fontSize:7, color:"#5A5A6A", background:"rgba(198,241,53,0.1)", border:"1px solid rgba(198,241,53,0.2)", borderRadius:100, padding:"1px 6px" }}>• Nearby</div>
      </div>
      {/* Mode chips */}
      <div style={{ display:"flex", gap:4, marginBottom:10 }}>
        {["All","Metro","Bus","Walk","Cab"].map((m,i)=>(
          <div key={m} style={{ padding:"3px 7px", borderRadius:100, background:i===0?"#C6F135":"#1C1C1F", border:`1px solid ${i===0?"#C6F135":"rgba(255,255,255,0.07)"}`, fontSize:6, fontWeight:i===0?700:400, color:i===0?"#0D0D0F":"#9090A0" }}>{m}</div>
        ))}
      </div>
      {/* Recent */}
      <div style={{ fontSize:6, fontWeight:700, color:"#5A5A6A", letterSpacing:".08em", textTransform:"uppercase", marginBottom:6 }}>RECENT</div>
      {[["🏠","Home","Kothrud, Pune","4.2 km"],["💼","Hinjewadi IT Park","Phase 1, Hinjewadi","18 km"],["☕","FC Road","Fergusson College Road","3.1 km"]].map(([ic,nm,sub,dist])=>(
        <div key={nm} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ width:22, height:22, borderRadius:8, background:"#1C1C1F", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0 }}>{ic}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:7, fontWeight:600, color:"#F0F0F2" }}>{nm}</div>
            <div style={{ fontSize:5.5, color:"#5A5A6A" }}>{sub}</div>
          </div>
          <span style={{ fontSize:6, color:"#5A5A6A" }}>{dist}</span>
        </div>
      ))}
      {/* Suggestions */}
      <div style={{ fontSize:6, fontWeight:700, color:"#5A5A6A", letterSpacing:".08em", textTransform:"uppercase", margin:"8px 0 4px" }}>SUGGESTIONS</div>
      {[["🚉","Pune Station","Near Sambhaji Garden","5.8 km"],["🛍","Koregaon Park","Lane 6, KP","3.4 km"]].map(([ic,nm,sub,dist])=>(
        <div key={nm} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ width:22, height:22, borderRadius:8, background:"#1C1C1F", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, flexShrink:0 }}>{ic}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:7, fontWeight:600, color:"#F0F0F2" }}>{nm}</div>
            <div style={{ fontSize:5.5, color:"#5A5A6A" }}>{sub}</div>
          </div>
          <span style={{ fontSize:6, color:"#5A5A6A" }}>{dist}</span>
        </div>
      ))}
    </div>
  );
}

function LiveScreen() {
  return (
    <>
      {/* Map */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"55%", background:"#161620" }}>
        <svg width="200" height="140" viewBox="0 0 200 140" style={{opacity:0.5}}>
          {[0,28,56,84,112,140,168,196].map(x=><line key={x} x1={x} y1={0} x2={x} y2={140} stroke="#252535" strokeWidth={1}/>)}
          {[0,20,40,60,80,100,120,140].map(y=><line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#252535" strokeWidth={1}/>)}
          <polyline points="40,130 40,60 100,60 100,20" stroke="#C6F135" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx={40} cy={130} r={5} fill="#C6F135"/>
          <circle cx={100} cy={20} r={5} fill="rgba(255,107,53,0.9)"/>
          {/* Bus icon */}
          <rect x={34} y={74} width={12} height={8} rx={2} fill="#C6F135"/>
        </svg>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:"linear-gradient(transparent,#0D0D0F)" }}/>
      </div>
      {/* Route sheet */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#161618", borderRadius:"18px 18px 0 0", borderTop:"1px solid rgba(255,255,255,0.07)", padding:"10px 12px" }}>
        <div style={{ width:22, height:2.5, background:"#2C2C32", borderRadius:2, margin:"0 auto 10px" }}/>
        {/* Best route */}
        <div style={{ background:"rgba(198,241,53,0.1)", border:"1px solid rgba(198,241,53,0.2)", borderRadius:10, padding:"8px 10px", marginBottom:6 }}>
          <div style={{ fontSize:6, fontWeight:700, color:"rgba(198,241,53,0.6)", letterSpacing:".05em", textTransform:"uppercase", marginBottom:3 }}>✦ BEST ROUTE</div>
          <div style={{ fontSize:18, fontWeight:800, color:"#C6F135", letterSpacing:"-.03em", lineHeight:1 }}>32 min</div>
          <div style={{ fontSize:6, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Arrives 10:13 AM</div>
          <div style={{ display:"flex", gap:3, marginTop:5 }}>
            {[["🚌 PMT 151","bus"],["🚶 4 min","walk"],["🚇 Metro","metro"]].map(([l,t])=>(
              <div key={l} style={{ height:14, padding:"0 5px", borderRadius:100, fontSize:5, fontWeight:500, display:"flex", alignItems:"center", background:t==="bus"?"rgba(198,241,53,0.12)":t==="walk"?"#242428":"rgba(75,141,255,0.12)", color:t==="bus"?"#C6F135":t==="walk"?"#9090A0":"#4B8DFF" }}>{l}</div>
            ))}
          </div>
        </div>
        {/* Fastest */}
        <div style={{ background:"#1C1C1F", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"8px 10px" }}>
          <div style={{ fontSize:6, fontWeight:700, color:"rgba(75,141,255,0.6)", letterSpacing:".05em", textTransform:"uppercase", marginBottom:3 }}>⚡ FASTEST</div>
          <div style={{ fontSize:18, fontWeight:800, color:"#F0F0F2", letterSpacing:"-.03em", lineHeight:1 }}>26 min</div>
          <div style={{ fontSize:6, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Arrives 10:07 AM</div>
        </div>
      </div>
    </>
  );
}

function TripScreen() {
  const stops = [
    { name:"Shivajinagar", detail:"Current location", curr:true },
    { name:"FC Road", detail:"2 stops away", done:false },
    { name:"Kothrud Depot", detail:"4 stops away", done:false },
    { name:"Swargate", detail:"Destination", done:false },
  ];
  return (
    <>
      {/* Map */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:"45%", background:"#161620" }}>
        <svg width="200" height="110" viewBox="0 0 200 110" style={{opacity:0.45}}>
          {[0,28,56,84,112,140,168,196].map(x=><line key={x} x1={x} y1={0} x2={x} y2={110} stroke="#252535" strokeWidth={1}/>)}
          {[0,20,40,60,80,100].map(y=><line key={y} x1={0} y1={y} x2={200} y2={y} stroke="#252535" strokeWidth={1}/>)}
          <polyline points="30,100 70,55 130,55 160,20" stroke="#C6F135" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,3"/>
        </svg>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"50%", background:"linear-gradient(transparent,#0D0D0F)" }}/>
        {/* Instruction chip */}
        <div style={{ position:"absolute", top:48, left:10, right:10, background:"#C6F135", borderRadius:12, padding:"7px 10px", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#0D0D0F", letterSpacing:"-.03em", lineHeight:1 }}>2</div>
          <div>
            <div style={{ fontSize:7, fontWeight:700, color:"#0D0D0F" }}>stops to go</div>
            <div style={{ fontSize:5.5, color:"rgba(0,0,0,0.5)" }}>Board at next stop</div>
          </div>
        </div>
      </div>
      {/* Journey sheet */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"#161618", borderRadius:"18px 18px 0 0", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ padding:"8px 10px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:22, fontWeight:800, color:"#F0F0F2", letterSpacing:"-.04em", lineHeight:1 }}>18</div>
            <div style={{ fontSize:8, color:"#9090A0" }}>min remaining</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:9, fontWeight:600, color:"#F0F0F2" }}>10:13 AM</div>
            <div style={{ fontSize:5.5, color:"#5A5A6A" }}>arrival</div>
          </div>
        </div>
        <div style={{ padding:"8px 10px" }}>
          {stops.map((s,i)=>(
            <div key={s.name} style={{ display:"flex", alignItems:"flex-start", gap:8, paddingBottom:i<stops.length-1?10:0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, paddingTop:2 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:s.curr?"#C6F135":"#2C2C32", border:s.curr?"none":"1.5px solid rgba(255,255,255,0.12)" }}/>
                {i<stops.length-1 && <div style={{ width:1, height:16, background:s.curr?"rgba(198,241,53,0.3)":"rgba(255,255,255,0.07)", margin:"2px 0" }}/>}
              </div>
              <div>
                <div style={{ fontSize:7, fontWeight:s.curr?700:400, color:s.curr?"#F0F0F2":"#9090A0" }}>{s.name}</div>
                <div style={{ fontSize:5.5, color:s.curr?"#C6F135":"#5A5A6A" }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
function ProcessGrid() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const phases = [
    { n:"01", title:"Discovery", body:"Field rides, stop observations, and behaviour mapping in Pune. Established the baseline: GPS data exists but no consumer product surfaces it." },
    { n:"02", title:"Research", body:"12 user interviews, n=86 survey, 4-app competitive audit (PMPML, Moovit, Citymapper, Transit). Validated the core hypothesis in week three." },
    { n:"03", title:"Define", body:"Insight synthesis yielding 3 composite personas grounded in real stop observations. Reframed the problem as a product gap, not an infrastructure gap." },
    { n:"04", title:"Design", body:"3 prototype iterations, moderated testing n=10, hypothesis sign-off. Every screen justified by a specific research finding." },
  ];
  return (
    <div ref={ref} style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:0}}>
      {phases.map(({n, title, body}, i) => (
        <div key={n} className={`bh-process-card${on ? " bh-process-card--on" : ""}`} style={{
          borderTop: "2px solid rgba(255,255,255,0.15)",
          paddingTop: 24,
          paddingRight: i < 3 ? 36 : 0,
        }}>
          <div style={{fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.35)", marginBottom:16, letterSpacing:"0.04em"}}>{n}</div>
          <div style={{fontSize:18, fontWeight:700, color:"#F0F0F2", marginBottom:12, lineHeight:1.2}}>{title}</div>
          <div style={{fontSize:14, color:"#B4B4C4", lineHeight:1.75}}>{body}</div>
        </div>
      ))}
    </div>
  );
}

export function BusrouteBHPage({ project }) {
  const navigate = useNavigate();
  const [outcomesRef, outcomesOn] = useInView(0.1);
  const [priorityRef, priorityOn] = useInView(0.1);

  useEffect(() => {
    const els = document.querySelectorAll('.bh-cs .bh-slide');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.setAttribute('data-v', ''); obs.unobserve(e.target); }
      }),
      { threshold: 0.06 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bh-cs">
      <button className="bh-back" onClick={() => navigate("/?section=work")}>← All Work</button>

      {/* ─────────────────────────────────────
          SLIDE 01  Overview quote
      ───────────────────────────────────── */}
      <div className="bh-slide">
        <SlideHeader label="Overview" labelBold="zing" current={1} />

        <div className="bh-intro-wrap">
          <div className="bh-intro-kicker">Independent Mobile Design Study · Pune · 2026</div>
          <div className="bh-h" style={{maxWidth:680, animation:"bh-fadeup 0.9s cubic-bezier(0.22,1,0.36,1) both", animationDelay:"0.2s"}}>
            <span className="b">India has 70M+ daily bus riders.</span><br />
            <span className="g">No usable real-time product exists for them.</span>
          </div>
          <p className="bh-body" style={{maxWidth:580}}>
            zing is an independent, research-led design study, not affiliated with PMPML or BEST.
            12 weeks of field research in Pune, 12 in-depth interviews, and an 86-person
            survey to answer: why has no consumer product been built on India's existing GPS infrastructure?
          </p>
          <div className="bh-intro-chips">
            {["Solo Lead Designer","iOS & Android","12 weeks","Mobile Design","Concept Study"].map(c => (
              <span key={c} className="bh-intro-chip">{c}</span>
            ))}
          </div>
        </div>

        <div className="bh-3col">
          <div>
            <div className="bh-3col-label">Problem</div>
            <div className="bh-3col-title">Zero visibility</div>
            <div className="bh-3col-body">70M+ daily bus riders in India's major cities have no usable real-time product. The GPS infrastructure exists. The consumer layer does not.</div>
          </div>
          <div>
            <div className="bh-3col-label">Solution</div>
            <div className="bh-3col-title">zing, live transit</div>
            <div className="bh-3col-body">A concept: a lightweight (6.2 MB), zero-login design surfacing live bus ETAs, route options, and turn-by-turn guidance, designed for mid-range Android devices first.</div>
          </div>
          <div>
            <div className="bh-3col-label">Validated Outcomes</div>
            <div className="bh-3col-title">Research-backed impact</div>
            <div className="bh-3col-body">90% first-session task success (n=10). 4.6 trust rating vs 2.1 for the PMPML official app. Same underlying data feed, radically different product decisions.</div>
          </div>
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 02  Hero dark card + split stat
      ───────────────────────────────────── */}
      <div className="bh-slide">
        <SlideHeader label="What is this" labelBold="zing" current={2} />

        {/* ── Hero: zing.png full-bleed bg · text bottom-left · quote top-right ── */}
        <div style={{
          position:"relative", borderRadius:24, overflow:"hidden", minHeight:680,
          display:"flex", alignItems:"stretch", justifyContent:"space-between",
          padding:"40px 40px",
        }}>
          {/* Background image - full bleed */}
          <img src="/assets/projects/zing.png" alt="" aria-hidden="true"
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}
          />
          {/* Gradient: strong bottom-left, light middle, medium top-right */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.6) 100%)" }} />
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"55%", background:"linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />

          {/* LEFT - big headline pinned to top */}
          <div style={{ position:"relative", zIndex:1, alignSelf:"flex-start", maxWidth:420 }}>
            <div style={{ fontSize:"clamp(40px,5.5vw,68px)", fontWeight:800, color:"#FFFFFF", letterSpacing:"-0.04em", lineHeight:1.0 }}>
              Your city,<br />simplified.
            </div>
          </div>

          {/* RIGHT - quote card pinned to top */}
          <div style={{ position:"relative", zIndex:1, alignSelf:"flex-start", flexShrink:0 }}>
            <div style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:16, padding:"20px 18px", width:210, border:"1px solid rgba(255,255,255,0.2)", boxShadow:"0 16px 48px rgba(0,0,0,0.3)" }}>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.88)", lineHeight:1.6, margin:"0 0 14px", fontWeight:400 }}>
                "I used to stand at the stop and guess. Now I know exactly when to leave."
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:8, borderTop:"1px solid rgba(255,255,255,0.15)", paddingTop:12 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#C6F135,#8FB800)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>👨‍🔧</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:"#FFFFFF", lineHeight:1.2 }}>Rajan, 52</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.45)", lineHeight:1.3 }}>Factory supervisor, Pune</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:12 }}>
          {[
            { to:70, suffix:"M+", label:"Daily bus riders in India with no usable real-time app" },
            { to:34, suffix:" min", label:"Average daily wait time wasted per commuter" },
            { to:90, suffix:"%", label:"First-session task success rate in prototype testing" },
          ].map(({ to, suffix, label }) => (
            <div key={label} style={{ background:"#111115", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:"24px 20px" }}>
              <div style={{ fontSize:28, fontWeight:800, color:"#C6F135", letterSpacing:"-0.04em", lineHeight:1, marginBottom:8 }}>
                <CountUp to={to} suffix={suffix} />
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.38)", lineHeight:1.5 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 03  Problem & Solution
      ───────────────────────────────────── */}
      <div className="bh-slide bh-slide-dark">
        <SlideHeader label="Problem & Solution" labelBold="" current={3} />

        {/* Big quote */}
        <div style={{marginBottom:56}}>
          <div style={{display:"flex", alignItems:"flex-start", gap:12, marginBottom:28}}>
            <span style={{fontSize:48, fontWeight:900, color:"#F0F0F2", lineHeight:1, flexShrink:0, marginTop:-8}}>"</span>
            <div style={{fontSize:"clamp(24px,3.2vw,40px)", lineHeight:1.25, letterSpacing:"-0.02em"}}>
              <span style={{fontWeight:400, color:"rgba(255,255,255,0.38)"}}>I just stand at the stop and </span>
              <span style={{fontWeight:800, color:"#F0F0F2"}}>hope the bus comes soon.</span>
              <span style={{fontWeight:400, color:"rgba(255,255,255,0.38)"}}> Sometimes I wait 40 minutes, sometimes 3. There's no way to know."</span>
            </div>
          </div>
          {/* Attribution */}
          <div style={{display:"flex", alignItems:"center", gap:14, paddingLeft:60}}>
            <div style={{width:44, height:44, borderRadius:"50%", overflow:"hidden", flexShrink:0}}>
              <img src="/assets/projects/persona.jpg" alt="Priya" style={{width:"100%", height:"100%", objectFit:"cover"}} />
            </div>
            <div>
              <div style={{fontSize:14, fontWeight:600, color:"#F0F0F2"}}>Priya, 28</div>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)"}}>Daily commuter · Pune</div>
            </div>
          </div>
        </div>

        {/* /1 Problem  /2 Solution  /3 Impact */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:48, borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:40}}>
          {[
            {
              n:"/1", label:"Problem",
              body:"No consumer-facing product existed on top of PMPML's live GPS data. Commuters were left guessing ETAs, missing buses, and defaulting to Ola out of anxiety, not preference.",
            },
            {
              n:"/2", label:"Solution",
              body:"zing surfaces live bus arrivals, stop-level ETAs, and route intelligence in a zero-friction interface. Location-first, no login required, confidence-first design language.",
            },
            {
              n:"/3", label:"Impact",
              body:"3 prototype iterations validated with n=10. Users reduced estimated time-at-stop by 40%. Trust in public transit rose measurably across all test sessions.",
            },
          ].map(({n, label, body}) => (
            <div key={n}>
              <div style={{fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.38)", marginBottom:8}}>{n} {label}</div>
              <div style={{fontSize:14, color:"#B4B4C4", lineHeight:1.75}}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 04  Project Strategy
      ───────────────────────────────────── */}
      <div className="bh-slide bh-slide-dark">
        <SlideHeader label="Project Strategy" labelBold="" current={4} />

        <div style={{fontSize:"clamp(28px,3.8vw,48px)", lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:64}}>
          <span style={{fontWeight:300, color:"rgba(255,255,255,0.38)"}}>Four phases.</span>
          {" "}<span style={{fontWeight:800, color:"#F0F0F2"}}>One hypothesis tested.</span>
        </div>

        <ProcessGrid />
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 05  Research insights / survey
      ───────────────────────────────────── */}
      <div className="bh-slide bh-slide-dark">
        <SlideHeader label="Research" labelBold="" current={5} />

        <div className="bh-section-row v-center" style={{marginBottom:48}}>
          <div className="bh-h" style={{marginBottom:0}}>
            <span className="g">Every decision</span><br />
            <span className="b">backed by data.</span>
          </div>
          <p className="bh-body">
            Field research in Pune across three methods: a screened survey, intercept interviews at bus stands, and moderated prototype testing. Each finding directly constrained a design decision.
          </p>
        </div>

        {/* Staggered stat cards - open layout, no borders/shadows */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 48px", alignItems:"start", marginBottom:12}}>

          {/* LEFT column - card 1 top, card 3 below */}
          <div style={{display:"flex", flexDirection:"column", gap:64}}>

            {/* Card 1 */}
            <div>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)", letterSpacing:"0.05em", marginBottom:8}}>Users</div>
              <div style={{fontSize:52, fontWeight:700, color:"#F0F0F2", letterSpacing:"-0.03em", lineHeight:1, marginBottom:16}}><CountUp to={78} suffix="%" /></div>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)", marginBottom:8}}>Insight</div>
              <div style={{fontSize:18, fontWeight:600, color:"#F0F0F2", lineHeight:1.35, maxWidth:260, marginBottom:28}}>Prefer real-time data over schedule estimates.</div>
              <div style={{height:52, borderRadius:999, background:"repeating-linear-gradient(90deg, #C6F135 0px, #C6F135 1.5px, transparent 1.5px, transparent 7px)"}} />
            </div>

            {/* Card 3 */}
            <div>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)", letterSpacing:"0.05em", marginBottom:8}}>Users</div>
              <div style={{fontSize:52, fontWeight:700, color:"#F0F0F2", letterSpacing:"-0.03em", lineHeight:1, marginBottom:16}}><CountUp to={46} suffix="%" /></div>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)", marginBottom:8}}>Insight</div>
              <div style={{fontSize:18, fontWeight:600, color:"#F0F0F2", lineHeight:1.35, maxWidth:260, marginBottom:28}}>Need bus information in their native language.</div>
              <div style={{height:52, borderRadius:999, background:"repeating-linear-gradient(90deg, #FF7A63 0px, #FF7A63 1.5px, transparent 1.5px, transparent 7px)"}} />
            </div>

          </div>

          {/* RIGHT column - description top-right, card 2 shifted down */}
          <div style={{display:"flex", flexDirection:"column"}}>

            {/* Description */}
            <p style={{fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.75, margin:"0 0 0 auto", maxWidth:220, textAlign:"right"}}>
              Every design decision in zing was constrained by field research, not studio intuition.
            </p>

            {/* Card 2 - offset down */}
            <div style={{marginTop:120}}>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)", letterSpacing:"0.05em", marginBottom:8}}>Users</div>
              <div style={{fontSize:52, fontWeight:700, color:"#F0F0F2", letterSpacing:"-0.03em", lineHeight:1, marginBottom:16}}><CountUp to={90} suffix="%" /></div>
              <div style={{fontSize:12, color:"rgba(255,255,255,0.38)", marginBottom:8}}>Insight</div>
              <div style={{fontSize:18, fontWeight:600, color:"#F0F0F2", lineHeight:1.35, maxWidth:260, marginBottom:28}}>Task success on first session with zero onboarding.</div>
              <div style={{height:52, borderRadius:999, background:"repeating-linear-gradient(90deg, #4B6BFF 0px, #4B6BFF 1.5px, transparent 1.5px, transparent 7px)"}} />
            </div>

          </div>

        </div>

        {/* Interview findings - clean list, no card boxes */}
        <div style={{marginTop:8}}>
          <div style={{fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.35)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:32}}>Key findings from 12 interviews</div>
          {[
            { n:"01", title:"Infrastructure is not product", body:"PMPML and BEST have live GPS feeds. The gap is the consumer product layer on top. This is a product and design problem, not an engineering one. That reframe unlocked the entire direction." },
            { n:"02", title:"Trust is the primary design constraint", body:"Every participant had been burned by inaccurate official apps. Trust had to be made visible and earned incrementally, not assumed. This became the north star for every screen-level decision." },
            { n:"03", title:"Field presence over studio assumptions", body:"Rich maps and complex animations failed with real users at real stops. Two weeks at Shivajinagar and Swargate bus stands invalidated the initial design direction entirely." },
          ].map(({n, title, body}, i, arr) => (
            <div key={n} style={{display:"grid", gridTemplateColumns:"64px 1fr", gap:0, borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:28, paddingBottom: i < arr.length-1 ? 28 : 0}}>
              <div style={{fontSize:13, fontWeight:500, color:"rgba(255,255,255,0.25)", paddingTop:2}}>{n}</div>
              <div>
                <div style={{fontSize:17, fontWeight:700, color:"#F0F0F2", lineHeight:1.3, marginBottom:10}}>{title}</div>
                <div style={{fontSize:14, color:"#B4B4C4", lineHeight:1.75}}>{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 06  User Persona
      ───────────────────────────────────── */}
      <div className="bh-slide bh-slide-dark">
        <SlideHeader label="User Persona" labelBold="" current={6} />

        <div className="bh-h-sm">
          <span className="g">Composite persona</span><br />
          <span className="b">from 12 interviews.</span>
        </div>

        {/* Persona card */}
        <div style={{display:"flex", borderRadius:16, overflow:"hidden", border:"1px solid var(--dark-border)", marginTop:36, minHeight:420}}>

          {/* Left - photo fills full card height */}
          <div style={{width:260, flexShrink:0, position:"relative"}}>
            <img src="/assets/projects/persona.jpg" alt="Priya" style={{width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center", display:"block", position:"absolute", inset:0}} />
          </div>

          {/* Right - quote + bars + bio */}
          <div style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between", padding:"40px 48px", background:"var(--dark-surface)", borderLeft:"1px solid var(--dark-border)"}}>

            {/* Quote at top */}
            <div className="bh-persona-quote-blk" style={{margin:0, padding:0, marginBottom:36}}>
              When I'm late, I need to know right now if my bus is 2 minutes away or 20. Fast answers and a reliable ETA really matter to me.
            </div>

            {/* Progress bars - animated on scroll */}
            <AnimatedBars />

            {/* Bio at bottom */}
            <div className="bh-persona-desc" style={{marginTop:32}}>
              <strong style={{color:"#F0F0F2"}}>Priya, 28 · Software Engineer, Pune.</strong> Takes PMT 151 every morning. High digital literacy, deeply frustrated that public transit apps don't match the quality of her other tools. Spends ₹300/day on Ola, not by preference, but to avoid the anxiety of not knowing when her bus will arrive. Represents a high-value segment: willing to switch fully if trust is earned in the first week.
            </div>
          </div>
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 07  Iterations
      ───────────────────────────────────── */}
      <div className="bh-slide">
        <SlideHeader label="Design Iterations" labelBold="" current={7} />

        <div className="bh-section-row v-center" style={{marginBottom:0}}>
          <div>
            <div className="bh-h">
              <span className="g">Three hypothesis</span><br />
              <span className="b">pivots, with evidence.</span>
            </div>
          </div>
          <div className="bh-body">Three major design pivots, each triggered by field validation data, not opinion. Every assumption was tested before advancing to the next iteration.</div>
        </div>

        <div className="bh-iters">
          {[
            { v:"1", badge:"k", badgeLabel:"Killed", title:"Search-led home screen", body:"Hypothesis: users want to search first. Tested with 6 participants. Finding: daily commuters do not search. They know their bus. Search-first had 0% spontaneous usage. Assumption killed." },
            { v:"2", badge:"c", badgeLabel:"Pivoted", title:"Full-screen map default", body:"Hypothesis: a rich map surface builds confidence. Finding: senior users could not orientate, low-RAM devices lagged 4 to 6 seconds. Map demoted to a secondary, opt-in surface. Feature scope cut." },
            { v:"3", badge:"s", badgeLabel:"Validated", title:"List + contextual map", body:"Hypothesis: lead with buses at your nearest stop, map on demand. Validated with 10 participants in Pune. 9/10 rated very easy on first session (SUS adapted). Hypothesis confirmed." },
          ].map(({ v, badge, badgeLabel, title, body }) => (
            <div className="bh-iter" key={v}>
              <div>
                <div className={`bh-iter-badge ${badge}`}>{badgeLabel}</div>
                <div className="bh-iter-title">{title}</div>
                <div className="bh-iter-body">{body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 08  Key Screens (actual zing app)
      ───────────────────────────────────── */}
      <div className="bh-slide bh-slide-dark">
        <SlideHeader label="Key Screens" labelBold="" current={8} />

        {/* 4 feature rows: big phone left, callout labels, title+desc right */}
        <div style={{display:"flex", flexDirection:"column", gap:80}}>
          {[
            {
              screen:"home", img:"/assets/projects/1.png", n:"01",
              title:"Zero-tap access.",
              titleBold:"Nearest buses, instantly.",
              desc:"Opens directly to buses near you. No login, no search required. LIVE badge with pulsing dot distinguishes GPS-confirmed ETAs from schedule estimates.",
              callouts:[
                { label:"LIVE ETA badge", top:"22%", left:"62%" },
                { label:"Nearby stops", top:"52%", left:"62%" },
              ],
            },
            {
              screen:"search", n:"02",
              title:"Search that",
              titleBold:"understands commuters.",
              desc:"Progressive mode filters appear only after a destination is typed. Recent locations and stop suggestions reduce typing to near-zero for habitual commuters.",
              callouts:[
                { label:"Mode filter chips", top:"28%", left:"62%" },
                { label:"Recent locations", top:"58%", left:"62%" },
              ],
            },
            {
              screen:"live", n:"03",
              title:"Best route.",
              titleBold:"Not just fastest.",
              desc:"Two clear options above the fold: Best (optimal mix) and Fastest. Fare shown alongside Ola/Uber cost so users can justify the switch to public transit.",
              callouts:[
                { label:"Cost vs cab", top:"30%", left:"62%" },
                { label:"Leg breakdown", top:"55%", left:"62%" },
              ],
            },
            {
              screen:"trip", n:"04",
              title:"Live tracking,",
              titleBold:"zero anxiety.",
              desc:"Bus position refreshes every 15 seconds. Stop timeline shows exactly where the bus is. One-tap arrival alert works in the background, no setup needed.",
              callouts:[
                { label:"Stop timeline", top:"26%", left:"62%" },
                { label:"Arrival alert", top:"56%", left:"62%" },
              ],
            },
          ].map(({ screen, img, n, title, titleBold, desc, callouts }) => (
            <div key={screen} style={{display:"grid", gridTemplateColumns:"auto 1fr", gap:64, alignItems:"center"}}>

              {/* LEFT - phone + dashed callouts */}
              <div style={{position:"relative", width:200, flexShrink:0}}>
                {img
                  ? <img src={img} alt={title} style={{width:200, height:420, objectFit:"cover", borderRadius:36, display:"block", boxShadow:"0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)"}} />
                  : <ZingPhone screen={screen} />
                }
                {callouts.map(c => (
                  <div key={c.label} style={{position:"absolute", top:c.top, left:c.left, display:"flex", alignItems:"center", gap:8, pointerEvents:"none"}}>
                    {/* dashed connector line */}
                    <svg style={{position:"absolute", right:"100%", top:"50%", transform:"translateY(-50%)", overflow:"visible", pointerEvents:"none"}} width="40" height="1">
                      <line x1="0" y1="0" x2="40" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3"/>
                    </svg>
                    <div style={{background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:100, padding:"5px 12px", fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.7)", whiteSpace:"nowrap", backdropFilter:"blur(8px)"}}>
                      {c.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT - title + desc + decisions */}
              <div>
                <div style={{fontSize:11, fontWeight:600, color:"#C6F135", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16}}>{n}</div>
                <div style={{fontSize:"clamp(28px,3.5vw,44px)", lineHeight:1.15, letterSpacing:"-0.02em", marginBottom:20}}>
                  <span style={{fontWeight:300, color:"rgba(255,255,255,0.4)"}}>{title} </span>
                  <span style={{fontWeight:800, color:"#F0F0F2"}}>{titleBold}</span>
                </div>
                <p style={{fontSize:15, color:"#B4B4C4", lineHeight:1.75, maxWidth:440, margin:0}}>{desc}</p>
              </div>

            </div>
          ))}
        </div>
      </div>

      <hr className="bh-divider" />

      {/* ─────────────────────────────────────
          SLIDE 09  Outcomes
      ───────────────────────────────────── */}
      <div className="bh-slide">
        <SlideHeader label="Outcomes" labelBold="" current={9} />

        <div className="bh-h">
          <span className="g">Validation outcomes.</span><br />
          <span className="b">What the data showed.</span>
        </div>
        <p style={{color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:8}}>Moderated usability testing · n=10 participants · Pune · Sessions 30 to 45 min · Think-aloud protocol · SUS-adapted scale · Independent research, unaffiliated with PMPML</p>

        <div className={`bh-outcomes-grid${outcomesOn ? " bh-anim--on" : ""}`} ref={outcomesRef}>
          {[
            { to:90,  suffix:"%",      label:"First-session task success",  desc:"Participants found ETA for their regular route with zero instruction. Benchmark for zero-onboarding usability.", star:false },
            { to:4.6, suffix:" / 5",   decimals:1, label:"Trust rating",  desc:"vs 2.1 for the PMPML official app in the same prototype test. Same GPS data feed, radically different product decisions.", star:true },
            { to:9,   suffix:" / 10",  label:"Ease of use",  desc:"Pune participants rated the prototype very easy on first session using a SUS-adapted scale. Validates the zero-onboarding hypothesis.", star:false },
            { to:3,   suffix:"",       label:"Prototype iterations", desc:"Three major design pivots, each triggered by field validation data. Every assumption was tested before advancing to the next round.", star:false },
            { to:86,  prefix:"n=",     label:"Survey respondents",   desc:"Screened survey across Pune and Mumbai commuters. Established the quantitative baseline before any screen was designed.", star:false },
            { to:12,  suffix:"",       label:"User interviews",       desc:"Semi-structured sessions with daily public transit users. Surfaced the trust gap, the ETA anxiety, and the language barrier.", star:false },
          ].map(({ to, suffix = "", prefix = "", decimals = 0, label, desc, star }) => (
            <div className={`bh-oc${star ? " featured" : ""}`} key={label}>
              <div className="bh-oc-num"><CountUp to={to} suffix={suffix} prefix={prefix} decimals={decimals} /></div>
              <div className="bh-oc-label">{label}</div>
              <div className="bh-oc-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────
          WHAT'S NEXT  (between Outcomes + Footer)
      ───────────────────────────────────── */}
      <div className="bh-slide bh-slide-gray" style={{paddingTop:64, paddingBottom:64}}>
        <div style={{maxWidth:760, margin:"0 auto"}}>
          <div style={{fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.35)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:20}}>If this were a real product</div>
          <div className="bh-h" style={{marginBottom:28}}>
            <span className="g">What I'd prioritise</span><br />
            <span className="b">at scale.</span>
          </div>
          <div ref={priorityRef} className="bh-priority-grid" style={{display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16, marginTop:8}}>
            {[
              { n:"01", title:"Ship and measure", body:"A live pilot on the PMPML Pune network, where GPS infrastructure already exists. Instrument retention, task completion rate, and trust signals in the first 30 days." },
              { n:"02", title:"Data partnership strategy", body:"Build a standardised GTFS-RT data contract with one municipal operator. Prove the model works before scaling to more cities. Beachhead before broad expansion." },
              { n:"03", title:"Operator-side product", body:"Research surfaced that bus drivers receive late-running alerts 40 minutes after the fact. An operator dashboard is the second product. Real-time data needs to flow both ways." },
              { n:"04", title:"Monetisation hypothesis", body:"Zero-login consumer app funded by B2B data licensing to route planners, real-estate platforms, and city planning tools - not ads or subscription friction for users." },
            ].map(({n, title, body}) => (
              <div key={n} className={`bh-priority-card${priorityOn ? " bh-anim--on" : ""}`} style={{background:"var(--dark-surface)", borderRadius:16, padding:"36px 40px", border:"1px solid var(--dark-border)", display:"flex", flexDirection:"column", gap:12}}>
                <div style={{fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.25)", letterSpacing:".1em"}}>{n}</div>
                <div style={{fontSize:16, fontWeight:600, color:"#F0F0F2", lineHeight:1.3, letterSpacing:"-0.01em"}}>{title}</div>
                <div style={{width:32, height:2, background:"#C6F135", borderRadius:2}} />
                <div style={{fontSize:14, color:"#B4B4C4", lineHeight:1.75}}>{body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────
          FOOTER
      ───────────────────────────────────── */}
      <footer className="bh-footer">
        <div className="bh-footer-h">
          Thank you for<br />reading <span>zing</span>
        </div>
        <div className="bh-footer-sub">
          An independent 12-week research-led mobile design study · Mobile Design · Solo Lead Designer · Pune · 2026
        </div>
        <button className="bh-footer-btn" onClick={() => navigate("/?section=work")}>
          ← Back to all work
        </button>
        <div className="bh-footer-meta">
          <span>Mobile Design</span>
          <span>Mobile · iOS · Android</span>
          <span>Civic Tech · India</span>
          <span>2026</span>
        </div>
      </footer>
    </div>
  );
}
