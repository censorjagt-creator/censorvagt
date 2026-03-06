import { useState, useEffect, useRef } from "react";

const STRIPE_LINK = "https://buy.stripe.com/6oUbJ37Sc4t1fHpeVX0RG00";

/* ── Helpers ── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function useIsMobile(breakpoint = 600) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [breakpoint]);
  return mobile;
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delay}s,
                   transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function WaveSvg() {
  return (
    <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none"
      style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100px", opacity: 0.13, pointerEvents: "none" }}>
      <path d="M0 50 C240 90 480 10 720 50 C960 90 1200 10 1440 50 L1440 100 L0 100 Z" fill="#c9a84c" />
      <path d="M0 70 C360 30 720 90 1080 50 C1260 30 1380 60 1440 70 L1440 100 L0 100 Z" fill="#1a3a6b" opacity="0.6" />
    </svg>
  );
}

function LivePulse() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      background: "rgba(34,197,94,0.09)", border: "1px solid rgba(34,197,94,0.22)",
      borderRadius: "100px", padding: "5px 16px",
      fontSize: "11px", color: "rgba(134,239,172,0.85)",
      letterSpacing: "0.14em", fontFamily: "'Crimson Pro', serif",
    }}>
      <span style={{
        width: "7px", height: "7px", borderRadius: "50%",
        background: "#22c55e", flexShrink: 0,
        animation: "pulse 2s infinite",
      }} />
      SERVICE AKTIV
    </span>
  );
}

const FAQ_ITEMS = [
  { q: "Hvornår modtager jeg notifikationer?", a: "Så snart vores scraper opdager en ny prøve uden censor. Vi tjekker løbende — typisk inden for få minutter efter den dukker op på DYU." },
  { q: "Hvilke prøvetyper dækker I?", a: "Vi dækker alle prøver på DYU's platform der mangler en censor — speedbådsprøver, duelighedsprøver og øvrige søfartsprøver." },
  { q: "Kan jeg opsige når som helst?", a: "Ja. Ingen binding. Opsig direkte via dit Stripe-dashboard, og din adgang stopper ved den betalte periodes udløb." },
  { q: "Er CensorVagt affilieret med DYU?", a: "Nej. CensorVagt er en uafhængig notifikationsservice og er ikke tilknyttet Danish Yacht Union på nogen måde." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", textAlign: "left", background: "none", border: "none",
        padding: "20px 0", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
        color: "#e8e0d0", fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(15px,2.5vw,18px)", fontWeight: 400,
      }}>
        <span>{q}</span>
        <span style={{
          color: "#c9a84c", fontSize: "22px", lineHeight: 1, flexShrink: 0,
          transition: "transform 0.3s cubic-bezier(.22,1,.36,1)",
          transform: open ? "rotate(45deg)" : "rotate(0deg)", display: "block",
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? "300px" : "0", overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(.22,1,.36,1)",
      }}>
        <p style={{ paddingBottom: "20px", color: "rgba(232,224,208,0.55)", fontSize: "clamp(14px,2vw,16px)", lineHeight: 1.85, fontWeight: 300 }}>{a}</p>
      </div>
    </div>
  );
}

/* ── Email input + CTA button — shared between hero and pricing ── */
function EmailCTA({ email, setEmail, emailError, submitted, onSubmit, fullWidth = false }) {
  const isMobile = useIsMobile(520);
  if (submitted) {
    return (
      <div style={{
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.28)",
        borderRadius: "2px", padding: "16px 20px",
        color: "rgba(134,239,172,0.9)", fontFamily: "'Playfair Display', serif",
        fontSize: "15px", textAlign: "center",
      }}>
        ✓ Du er sendt videre til Stripe — tjek din email bagefter
      </div>
    );
  }
  const border = emailError ? "1px solid rgba(239,68,68,0.7)" : "1px solid rgba(201,168,76,0.3)";
  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "8px" : "0" }}>
      <input
        className={emailError ? "shake" : ""}
        style={{
          flex: 1, padding: "15px 18px",
          background: "rgba(255,255,255,0.055)",
          border,
          borderRight: isMobile ? border : "none",
          borderRadius: isMobile ? "2px" : "2px 0 0 2px",
          color: "#e8e0d0", fontFamily: "'Crimson Pro', serif",
          fontSize: "16px", outline: "none",
          width: fullWidth || isMobile ? "100%" : "auto",
          transition: "border-color 0.2s",
        }}
        type="email"
        placeholder="din@email.dk"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSubmit()}
      />
      <button
        className="gold-btn"
        onClick={onSubmit}
        style={{
          padding: "15px 26px",
          background: "#c9a84c", border: "none",
          borderRadius: isMobile ? "2px" : "0 2px 2px 0",
          color: "#080f1e", fontFamily: "'Playfair Display', serif",
          fontSize: "15px", fontWeight: 700, letterSpacing: "0.05em",
          cursor: "pointer", whiteSpace: "nowrap",
          width: isMobile ? "100%" : "auto",
        }}
      >
        Start nu →
      </button>
    </div>
  );
}

/* ── Main component ── */
export default function CensorVagt() {
  const [email, setEmail]         = useState("");
  const [emailError, setEmailError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY]     = useState(0);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pricingRef = useRef(null);
  const isMobile   = useIsMobile(640);

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToPricing = () => {
    setMenuOpen(false);
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToFaq = () => {
    setMenuOpen(false);
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 500);
      return;
    }
    window.open(`${STRIPE_LINK}?prefilled_email=${encodeURIComponent(email)}`, "_blank");
    setSubmitted(true);
  };

  const navSolid = scrollY > 50;
  const P = "clamp(20px,4vw,80px)"; // horizontal page padding

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body { background: #080f1e; overflow-x: hidden; }
        ::selection { background: rgba(201,168,76,0.25); color: #e8e0d0; }
        input::placeholder { color: rgba(232,224,208,0.28); }
        input { -webkit-appearance: none; appearance: none; }

        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-5px); }
          40%,80% { transform: translateX(5px); }
        }
        @keyframes slideDown {
          from { opacity:0; transform: translateY(-8px); }
          to   { opacity:1; transform: translateY(0); }
        }

        .anim-1 { animation: fadeUp 0.85s cubic-bezier(.22,1,.36,1) 0.1s  both; }
        .anim-2 { animation: fadeUp 0.85s cubic-bezier(.22,1,.36,1) 0.28s both; }
        .anim-3 { animation: fadeUp 0.85s cubic-bezier(.22,1,.36,1) 0.44s both; }
        .anim-4 { animation: fadeUp 0.85s cubic-bezier(.22,1,.36,1) 0.58s both; }
        .anim-5 { animation: fadeIn 1.1s ease 0.8s both; }
        .shake  { animation: shake 0.4s ease; }

        .gold-btn  { transition: filter 0.2s; }
        .gold-btn:hover  { filter: brightness(1.1); }
        .ghost-btn { transition: background 0.2s, color 0.2s; }
        .ghost-btn:hover { background: rgba(201,168,76,0.08) !important; }
        .how-card  { transition: background 0.25s; }
        .how-card:hover { background: rgba(201,168,76,0.04) !important; }
        a.footer-link:hover { color: #c9a84c !important; }

        /* global content cap on ultra-wide */
        .page-wrap { max-width: 1200px; margin: 0 auto; }

        /* mobile menu */
        nav { box-sizing: border-box; }
        .nav-inner {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }
        .mobile-menu {
          animation: slideDown 0.25s cubic-bezier(.22,1,.36,1) both;
        }

        /* stats bar */
        .stats-bar-outer {
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
        }
        .stats-bar {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
          max-width: 1280px;
          margin: 0 auto;
        }
        .stat-item {
          padding: 36px 48px;
          text-align: center;
          flex: 1 1 160px;
          min-width: 130px;
        }
        @media (max-width: 600px) {
          .stat-item { padding: 28px 20px; flex: 1 1 120px; }
          .stat-item-border { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); }
        }

        /* how grid */
        .how-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          border: 1px solid rgba(255,255,255,0.07);
          margin-top: 52px;
        }
        .how-card {
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .how-card:last-child {
          border-right: none;
        }
        @media (max-width: 700px) {
          .how-grid { grid-template-columns: 1fr; }
          .how-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .how-card:last-child { border-bottom: none; }
        }

        /* pricing card full-width on tiny screens */
        .pricing-card {
          max-width: 420px;
          width: 100%;
          margin: 52px auto 0;
        }
        @media (max-width: 460px) {
          .pricing-card { padding: 40px 24px !important; }
        }

        /* footer stacks on mobile */
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 20px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }

        /* hero eyebrow lines hide on very small screens */
        @media (max-width: 400px) {
          .eyebrow-line { display: none !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Crimson Pro', Georgia, serif", background: "#080f1e", color: "#e8e0d0", minHeight: "100vh" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          height: "64px", padding: `0 ${P}`,
          display: "flex", alignItems: "center",
          background: navSolid || menuOpen ? "rgba(8,15,30,0.97)" : "transparent",
          backdropFilter: navSolid || menuOpen ? "blur(16px)" : "none",
          borderBottom: navSolid || menuOpen ? "1px solid rgba(201,168,76,0.13)" : "none",
          transition: "background 0.35s, border 0.35s",
        }}>
          <div className="nav-inner">
          {/* Logo */}
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", fontWeight: 700, color: "#c9a84c", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
            ⚓ CensorVagt
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button className="ghost-btn" onClick={scrollToPricing} style={{ background: "none", border: "none", color: "rgba(232,224,208,0.5)", fontFamily: "'Crimson Pro', serif", fontSize: "15px", cursor: "pointer", letterSpacing: "0.06em", padding: "6px 14px", borderRadius: "2px" }}>Pris</button>
              <button className="ghost-btn" onClick={scrollToFaq} style={{ background: "none", border: "none", color: "rgba(232,224,208,0.5)", fontFamily: "'Crimson Pro', serif", fontSize: "15px", cursor: "pointer", letterSpacing: "0.06em", padding: "6px 14px", borderRadius: "2px" }}>FAQ</button>
              <button className="gold-btn" onClick={scrollToPricing} style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.45)", color: "#c9a84c", padding: "8px 22px", borderRadius: "2px", cursor: "pointer", fontFamily: "'Crimson Pro', serif", fontSize: "15px", letterSpacing: "0.08em", marginLeft: "6px" }}>Tilmeld →</button>
            </div>
          )}

          {/* Hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: "block", width: "22px", height: "2px", background: "#c9a84c", borderRadius: "1px",
                  transition: "transform 0.25s, opacity 0.25s",
                  transform: menuOpen
                    ? i === 0 ? "translateY(7px) rotate(45deg)"
                    : i === 2 ? "translateY(-7px) rotate(-45deg)"
                    : "scaleX(0)"
                    : "none",
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          )}
          </div>
        </nav>

        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <div className="mobile-menu" style={{
            position: "fixed", top: "60px", left: 0, right: 0, zIndex: 190,
            background: "rgba(8,15,30,0.98)", backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(201,168,76,0.13)",
            padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: "4px",
          }}>
            <button onClick={scrollToPricing} style={{ background: "none", border: "none", color: "rgba(232,224,208,0.7)", fontFamily: "'Crimson Pro', serif", fontSize: "18px", cursor: "pointer", padding: "12px 0", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)", letterSpacing: "0.05em" }}>Pris</button>
            <button onClick={scrollToFaq} style={{ background: "none", border: "none", color: "rgba(232,224,208,0.7)", fontFamily: "'Crimson Pro', serif", fontSize: "18px", cursor: "pointer", padding: "12px 0", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)", letterSpacing: "0.05em" }}>FAQ</button>
            <button className="gold-btn" onClick={scrollToPricing} style={{ background: "#c9a84c", border: "none", color: "#080f1e", fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.06em", padding: "14px", borderRadius: "2px", cursor: "pointer", marginTop: "12px" }}>
              Start abonnement →
            </button>
          </div>
        )}

        {/* ── HERO ── */}
        <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `clamp(100px,15vh,140px) ${P} 80px`, position: "relative", overflow: "hidden", width: "100%" }}>
          {/* bg layers */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(201,168,76,0.10) 0%, transparent 55%), radial-gradient(ellipse 50% 50% at 15% 85%, rgba(20,50,100,0.4) 0%, transparent 55%), linear-gradient(175deg, #0d1b35 0%, #080f1e 60%)" }} />
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.022, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />
          <div style={{ position: "absolute", bottom: "22%", left: "5%", right: "5%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.18), rgba(201,168,76,0.18), transparent)", pointerEvents: "none" }} />
          <WaveSvg />

          {/* eyebrow */}
          <div className="anim-1" style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontFamily: "'Crimson Pro', serif", fontSize: "11px", letterSpacing: "0.26em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "24px" }}>
              <span className="eyebrow-line" style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.5)", display: "block", flexShrink: 0 }} />
              Notifikationsservice for DYU-censorer
              <span className="eyebrow-line" style={{ width: "32px", height: "1px", background: "rgba(201,168,76,0.5)", display: "block", flexShrink: 0 }} />
            </div>
          </div>

          {/* headline */}
          <h1 className="anim-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(44px, 7vw, 88px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.025em", position: "relative" }}>
            Gå aldrig glip af
            <span style={{ fontStyle: "italic", color: "#c9a84c", display: "block" }}>en prøve igen</span>
          </h1>

          {/* sub */}
          <p className="anim-3" style={{ fontSize: "clamp(15px, 2.5vw, 20px)", color: "rgba(232,224,208,0.58)", maxWidth: "480px", margin: "24px auto 44px", lineHeight: 1.8, fontWeight: 300 }}>
            Vi holder øje med Danish Yacht Union døgnet rundt og sender dig en direkte mail,
            så snart en ny prøve mangler censor.
          </p>

          {/* CTA */}
          <div className="anim-4" style={{ width: "100%", maxWidth: "460px", display: "flex", flexDirection: "column" }}>
            <EmailCTA email={email} setEmail={setEmail} emailError={emailError} submitted={submitted} onSubmit={handleSubmit} />
            <p style={{ marginTop: "14px", fontSize: "11px", color: "rgba(232,224,208,0.3)", letterSpacing: "0.12em" }}>
              100 KR / MÅNED &nbsp;·&nbsp; OPSIG NÅR SOM HELST &nbsp;·&nbsp; INGEN BINDING
            </p>
          </div>

          <div className="anim-5" style={{ marginTop: "36px", position: "relative" }}>
            <LivePulse />
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <Reveal>
          <div className="stats-bar-outer">
            <div className="stats-bar">
              {[
                { num: "< 5 min", label: "Reaktionstid" },
                { num: "24/7",    label: "Overvågning" },
                { num: "100%",    label: "DYU-dækning" },
                { num: "100 kr",   label: "Pr. måned" },
              ].map((s, i) => (
                <div key={i} className={`stat-item stat-item-border`} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: "11px", color: "rgba(232,224,208,0.36)", letterSpacing: "0.14em", marginTop: "8px", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: "1280px", margin: "0 auto", padding: `80px ${P}` }}>
          <Reveal>
            <div style={{ fontSize: "11px", letterSpacing: "0.26em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "12px" }}>Sådan fungerer det</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "16px" }}>
              Tre trin til<br />din næste opgave
            </h2>
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(232,224,208,0.55)", lineHeight: 1.85, maxWidth: "500px", fontWeight: 300 }}>
              Vi overvåger DYU's prøvekalender automatisk og notificerer dig i det øjeblik
              en ny prøve mangler censor.
            </p>
          </Reveal>

          <div className="how-grid">
            {[
              { num: "01", icon: "📬", title: "Tilmeld med email", body: "Opret dit abonnement på under 60 sekunder. Kun din email — ingen apps, ingen konti at huske." },
              { num: "02", icon: "🔭", title: "Vi holder øje", body: "Vores system tjekker DYU løbende. Nye prøver uden censor fanges automatisk, dag og nat." },
              { num: "03", icon: "⚡", title: "Du får besked straks", body: "En klar email med prøvenavn, dato, sted og direkte tilmeldingslink. Klik og book." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="how-card" style={{ background: "#080f1e", padding: "44px 36px", position: "relative", overflow: "hidden", height: "100%" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "60px", fontWeight: 700, color: "rgba(201,168,76,0.07)", position: "absolute", top: "10px", right: "16px", lineHeight: 1, pointerEvents: "none" }}>{item.num}</span>
                  <span style={{ fontSize: "24px", marginBottom: "16px", display: "block" }}>{item.icon}</span>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(16px,2vw,19px)", fontWeight: 700, marginBottom: "10px" }}>{item.title}</div>
                  <div style={{ fontSize: "clamp(14px,1.5vw,15px)", color: "rgba(232,224,208,0.52)", lineHeight: 1.75 }}>{item.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent)", margin: `0 ${P}` }} />

        {/* ── PRICING ── */}
        <section id="pricing" ref={pricingRef} style={{ maxWidth: "1280px", margin: "0 auto", padding: `80px ${P}` }}>
          <Reveal>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.26em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "12px" }}>Abonnement</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, lineHeight: 1.1 }}>
                Én pris.<br />Ingen overraskelser.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="pricing-card" style={{
              background: "linear-gradient(145deg, rgba(201,168,76,0.07) 0%, rgba(13,27,53,0.6) 100%)",
              border: "1px solid rgba(201,168,76,0.22)", borderRadius: "4px",
              padding: "48px 36px", textAlign: "center", position: "relative",
            }}>
              <div style={{ position: "absolute", top: "-13px", left: "50%", transform: "translateX(-50%)", background: "#c9a84c", color: "#080f1e", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", padding: "4px 18px", fontFamily: "'Crimson Pro', serif", whiteSpace: "nowrap", borderRadius: "1px" }}>
                LANCERINGSTILBUD
              </div>

              <div style={{ marginTop: "8px" }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "82px", fontWeight: 700, color: "#e8e0d0", lineHeight: 1 }}>100</span>
                <span style={{ color: "rgba(232,224,208,0.4)", fontSize: "22px", fontFamily: "'Playfair Display', serif" }}> kr</span>
              </div>
              <div style={{ color: "rgba(232,224,208,0.36)", fontSize: "12px", letterSpacing: "0.1em", marginBottom: "32px", textTransform: "uppercase" }}>
                Per måned &nbsp;·&nbsp; Forny månedligt
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", textAlign: "left" }}>
                {["Øjeblikkelig email-notifikation", "Alle prøvetyper og skoler hos DYU", "Direkte tilmeldingslink i mailen", "Opsig selv via dit Stripe-dashboard", "Ingen binding eller minimumsperiode"].map((f, i) => (
                  <li key={i} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px", fontSize: "clamp(14px,2vw,16px)", color: "rgba(232,224,208,0.75)" }}>
                    <span style={{ color: "#c9a84c", fontSize: "9px", flexShrink: 0 }}>✦</span>{f}
                  </li>
                ))}
              </ul>

              {submitted ? (
                <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.28)", borderRadius: "2px", padding: "16px", color: "rgba(134,239,172,0.9)", fontFamily: "'Playfair Display', serif", fontSize: "15px" }}>
                  ✓ Tjek din email for bekræftelse!
                </div>
              ) : (
                <>
                  <input
                    className={emailError ? "shake" : ""}
                    style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.055)", border: emailError ? "1px solid rgba(239,68,68,0.7)" : "1px solid rgba(201,168,76,0.3)", borderRadius: "2px", color: "#e8e0d0", fontFamily: "'Crimson Pro', serif", fontSize: "16px", outline: "none", marginBottom: "10px", transition: "border-color 0.2s" }}
                    type="email" placeholder="din@email.dk"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                  <button className="gold-btn" onClick={handleSubmit} style={{ width: "100%", padding: "16px", background: "#c9a84c", border: "none", borderRadius: "2px", color: "#080f1e", fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
                    Start abonnement →
                  </button>
                </>
              )}
              <p style={{ marginTop: "12px", fontSize: "11px", color: "rgba(232,224,208,0.25)", letterSpacing: "0.06em" }}>
                🔒 Sikker betaling via Stripe &nbsp;·&nbsp; SSL krypteret
              </p>
            </div>
          </Reveal>
        </section>

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent)", margin: `0 ${P}` }} />

        {/* ── FAQ ── */}
        <section id="faq" style={{ maxWidth: "860px", margin: "0 auto", padding: `80px ${P}` }}>
          <Reveal>
            <div style={{ fontSize: "11px", letterSpacing: "0.26em", color: "#c9a84c", textTransform: "uppercase", marginBottom: "12px" }}>Spørgsmål & svar</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "44px" }}>
              Ofte stillede<br />spørgsmål
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div>{FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}</div>
          </Reveal>
        </section>

        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.18), transparent)", margin: `0 ${P}` }} />

        {/* ── FINAL CTA ── */}
        <section style={{ padding: `80px ${P}`, textAlign: "center", background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.04) 50%, transparent)" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, lineHeight: 1.1, marginBottom: "14px" }}>
              Tilmeld dig i dag
            </h2>
            <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(232,224,208,0.52)", maxWidth: "380px", margin: "0 auto 40px", lineHeight: 1.8, fontWeight: 300 }}>
              Én censoropgave er langt mere værd end 100 kr om måneden.
            </p>
            <button className="gold-btn" onClick={scrollToPricing} style={{ padding: "17px clamp(32px,6vw,52px)", background: "#c9a84c", border: "none", borderRadius: "2px", color: "#080f1e", fontFamily: "'Playfair Display', serif", fontSize: "clamp(15px,2vw,17px)", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer" }}>
              Start abonnement →
            </button>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: `28px ${P}` }}>
          <div className="footer-inner" style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#c9a84c", letterSpacing: "0.06em", flexShrink: 0 }}>
              ⚓ CensorVagt
            </div>
            <div className="footer-links" style={{ fontSize: "12px", color: "rgba(232,224,208,0.26)", letterSpacing: "0.04em" }}>
              <a href="mailto:kontakt@censorvagt.dk" className="footer-link" style={{ color: "rgba(232,224,208,0.26)", textDecoration: "none", transition: "color 0.2s" }}>
                kontakt@censorvagt.dk
              </a>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Ikke affilieret med Danish Yacht Union</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>© {new Date().getFullYear()} CensorVagt</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}