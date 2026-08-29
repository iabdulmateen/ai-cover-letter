"use client";

import React, { useState, useRef, useEffect } from "react";

type Tone = "professional" | "enthusiastic" | "concise" | "creative";
type Len = "brief" | "standard" | "detailed";
type Opening = "direct" | "hook" | "story";
type Step = 1 | 2 | 3 | "output";

interface Form {
  jobTitle: string;
  company: string;
  hiringManager: string;
  jobDescription: string;
  applicantName: string;
  email: string;
  yearsExp: string;
  background: string;
  achievement1: string;
  achievement2: string;
  achievement3: string;
  skills: string;
  tone: Tone;
  length: Len;
  opening: Opening;
}

const BLANK: Form = {
  jobTitle: "",
  company: "",
  hiringManager: "",
  jobDescription: "",
  applicantName: "",
  email: "",
  yearsExp: "3–5 years",
  background: "",
  achievement1: "",
  achievement2: "",
  achievement3: "",
  skills: "",
  tone: "professional",
  length: "standard",
  opening: "direct",
};

const GLOBAL_SKILLS = [
  "JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "Python", "HTML5", "CSS3",
  "Tailwind CSS", "UI/UX Design", "Figma", "MongoDB", "SQL", "PostgreSQL", "Git & GitHub",
  "AI Prompt Engineering", "REST APIs", "GraphQL", "Docker", "AWS", "Agile Methodology",
  "Project Management", "Data Analysis", "Machine Learning", "Cybersecurity", "DevOps"
];

const C = {
  ink: "#1a1a2e",
  muted: "#5a5a7a",
  dim: "#8f8faa",
  accent: "#5046e4",
  accentLight: "#eeedfd",
  border: "#e0e0ea",
  card: "#ffffff",
  surface: "#f5f5f3",
};

const INPUT_S: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: `1.5px solid ${C.border}`,
  background: C.card,
  fontSize: 14,
  color: C.ink,
  fontFamily: "Inter, system-ui, sans-serif",
};

function Mono({ children, size = 10, color = C.dim }: { children: React.ReactNode; size?: number; color?: string }) {
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, letterSpacing: "0.1em", textTransform: "uppercase", color }}>{children}</span>;
}

function Label({ label, hint }: { label: string; hint?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
      <Mono>{label}</Mono>
      {hint && <span style={{ fontSize: 11, color: C.dim }}>{hint}</span>}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <div><Label label={label} hint={hint} />{children}</div>;
}

function PrimaryBtn({ label, onClick, disabled, icon }: { label: string; onClick: () => void; disabled?: boolean; icon?: React.ReactNode }) {
  const active = !disabled;
  return (
    <button onClick={onClick} disabled={!active} style={{ width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", background: active ? C.accent : C.dim, color: "#fff", fontSize: 14, fontWeight: 600, cursor: active ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {icon}{label}
    </button>
  );
}

function GhostBtn({ label, onClick, disabled, icon }: { label: string; onClick: () => void; disabled?: boolean; icon?: React.ReactNode }) {
  const active = !disabled;
  return (
    <button onClick={onClick} disabled={!active} style={{ width: "100%", padding: "12px 20px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "transparent", color: active ? C.muted : C.dim, fontSize: 14, cursor: active ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
      {icon}{label}
    </button>
  );
}

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  const steps = [{ n: 1, label: "The Role" }, { n: 2, label: "Your Story" }, { n: 3, label: "Your Style" }];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 32, overflowX: "auto", paddingBottom: 8 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.n <= current ? C.accent : "#ebebf0", color: s.n <= current ? "#fff" : C.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
              {s.n < current ? "✓" : s.n}
            </div>
            <Mono size={9} color={s.n === current ? C.accent : C.dim}>{s.label}</Mono>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: s.n < current ? C.accent : "#e0e0ea", margin: "0 8px", marginBottom: 20 }} />}
        </div>
      ))}
    </div>
  );
}

function Step1({ f, up, onNext }: { f: Form; up: (k: keyof Form, v: string) => void; onNext: () => void }) {
  const can = f.jobTitle.trim() && f.company.trim();
  return (
    <div>
      <Mono size={10} color={C.accent}>Step 1 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 26, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>What position are you applying for?</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>Pasting the job description helps tailor your letter.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <Field label="Job Title" hint="Required"><input style={INPUT_S} placeholder="Frontend Developer" value={f.jobTitle} onChange={(e) => up("jobTitle", e.target.value)} /></Field>
          <Field label="Company" hint="Required"><input style={INPUT_S} placeholder="Google" value={f.company} onChange={(e) => up("company", e.target.value)} /></Field>
        </div>
        <Field label="Hiring Manager" hint="Optional"><input style={INPUT_S} placeholder="Jordan Lee" value={f.hiringManager} onChange={(e) => up("hiringManager", e.target.value)} /></Field>
        <Field label="Job Description" hint="Recommended"><textarea rows={5} style={{ ...INPUT_S, resize: "none" }} placeholder="Paste job description..." value={f.jobDescription} onChange={(e) => up("jobDescription", e.target.value)} /></Field>
        <PrimaryBtn label="Continue →" onClick={onNext} disabled={!can} />
      </div>
    </div>
  );
}

function Step2({ f, up, onNext, onBack }: { f: Form; up: (k: keyof Form, v: string) => void; onNext: () => void; onBack: () => void }) {
  const [skillInput, setSkillInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const can = f.applicantName.trim() && f.background.trim();
  const filtered = GLOBAL_SKILLS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !f.skills.toLowerCase().includes(s.toLowerCase()));

  const addSkill = (s: string) => {
    const list = f.skills ? f.skills.split(",").map(x => x.trim()).filter(Boolean) : [];
    if (!list.includes(s)) list.push(s);
    up("skills", list.join(", "));
    setSkillInput("");
    setShowDropdown(false);
  };

  return (
    <div>
      <Mono size={10} color={C.accent}>Step 2 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 26, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>Tell us about yourself</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>Add your background and professional skills.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          <Field label="Full Name" hint="Required"><input style={INPUT_S} placeholder="Abdul Mateen" value={f.applicantName} onChange={(e) => up("applicantName", e.target.value)} /></Field>
          <Field label="Email" hint="Optional"><input style={INPUT_S} type="email" placeholder="email@domain.com" value={f.email} onChange={(e) => up("email", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <Field label="Experience"><select style={{ ...INPUT_S, cursor: "pointer" }} value={f.yearsExp} onChange={(e) => up("yearsExp", e.target.value)}>{["Under 1 year", "1–2 years", "3–5 years", "5–8 years", "12+ years"].map(o => <option key={o}>{o}</option>)}</select></Field>
          <div style={{ position: "relative" }}>
            <Field label="Key Skills" hint="Search global skills"><input style={INPUT_S} placeholder="Type skill..." value={skillInput} onChange={(e) => { setSkillInput(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} /></Field>
            {showDropdown && skillInput.trim() && filtered.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 10, maxHeight: 140, overflowY: "auto", zIndex: 50, marginTop: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                {filtered.map(s => <div key={s} onClick={() => addSkill(s)} style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderBottom: `1px solid ${C.surface}` }}>+ {s}</div>)}
              </div>
            )}
          </div>
        </div>
        {f.skills && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {f.skills.split(",").map(s => s.trim()).filter(Boolean).map((skill, idx) => (
              <span key={idx} style={{ background: C.accentLight, color: C.accent, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {skill} <span style={{ cursor: "pointer", fontWeight: 700 }} onClick={() => up("skills", f.skills.split(",").map(s => s.trim()).filter((_, i) => i !== idx).join(", "))}>×</span>
              </span>
            ))}
          </div>
        )}
        <Field label="Professional Background" hint="2–3 sentences"><textarea rows={3} style={{ ...INPUT_S, resize: "none" }} placeholder="Brief background summary..." value={f.background} onChange={(e) => up("background", e.target.value)} /></Field>
        <div style={{ display: "flex", gap: 10 }}>
          <GhostBtn label="Back" onClick={onBack} />
          <PrimaryBtn label="Continue →" onClick={onNext} disabled={!can} />
        </div>
      </div>
    </div>
  );
}

function Step3({ f, up, onGenerate, onBack }: { f: Form; up: (k: keyof Form, v: string) => void; onGenerate: () => void; onBack: () => void }) {
  const tones = [{ key: "professional", label: "Professional" }, { key: "enthusiastic", label: "Enthusiastic" }, { key: "concise", label: "Concise" }, { key: "creative", label: "Creative" }];
  const lengths = [{ key: "brief", label: "Brief (~150w)" }, { key: "standard", label: "Standard (~280w)" }, { key: "detailed", label: "Detailed (~380w)" }];
  return (
    <div>
      <Mono size={10} color={C.accent}>Step 3 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 26, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>Choose tone & style</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
        <div>
          <Label label="Tone" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
            {tones.map(t => (
              <button key={t.key} onClick={() => up("tone", t.key as Tone)} style={{ padding: "12px", borderRadius: 10, border: `1.5px solid ${f.tone === t.key ? C.accent : C.border}`, background: f.tone === t.key ? C.accentLight : C.card, color: f.tone === t.key ? C.accent : C.ink, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div>
          <Label label="Length" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
            {lengths.map(l => (
              <button key={l.key} onClick={() => up("length", l.key as Len)} style={{ padding: "12px", borderRadius: 10, border: `1.5px solid ${f.length === l.key ? C.accent : C.border}`, background: f.length === l.key ? C.accentLight : C.card, color: f.length === l.key ? C.accent : C.ink, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{l.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <GhostBtn label="Back" onClick={onBack} />
          <PrimaryBtn label="Generate Cover Letter" onClick={onGenerate} icon={<span>✒️</span>} />
        </div>
      </div>
    </div>
  );
}

function Output({ editable, isGenerating, onChange, onRefine, onBack, onCopy, copied, wordCount, form, refineCount }: {
  editable: string; isGenerating: boolean; onChange: (v: string) => void; onRefine: () => void; onBack: () => void; onCopy: () => void; copied: boolean; wordCount: number; form: Form; refineCount: number;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [editable]);

  const readTime = wordCount < 100 ? "< 1 min" : `~${Math.max(1, Math.round(wordCount / 200))} min`;

  function handlePrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Cover Letter</title><style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.9;max-width:6.5in;margin:1in auto;color:#111}pre{white-space:pre-wrap;font-family:inherit;font-size:inherit;margin:0}</style></head><body><pre>${editable.replace(/</g, "&lt;")}</pre></body></html>`);
    win.document.close();
    win.print();
  }

  const maxReached = refineCount >= 3;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.surface }}>
      <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 13 }}>← Edit details</button>
        <div style={{ flex: 1 }} />
        <Mono size={10} color={C.dim}>{form.jobTitle || "Cover Letter"} · {form.company}</Mono>
      </div>

      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "24px 16px", gap: 24, boxSizing: "border-box" }}>
        {/* Sidebar Controls */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "16px" }}>
            <Mono size={10} color={C.dim}>Letter Stats</Mono>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px" }}><div style={{ fontSize: 18, fontWeight: 700 }}>{wordCount}</div><div style={{ fontSize: 11, color: C.dim }}>words</div></div>
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px" }}><div style={{ fontSize: 18, fontWeight: 700 }}>{readTime}</div><div style={{ fontSize: 11, color: C.dim }}>read time</div></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PrimaryBtn label={copied ? "Copied!" : "Copy Letter"} onClick={onCopy} />
            <GhostBtn 
              label={maxReached ? "Max Refinements Reached (3/3)" : `✨ Refine & Enhance (${refineCount}/3)`} 
              onClick={onRefine} 
              disabled={maxReached}
              icon={<span>⚡</span>} 
            />
            <GhostBtn label="Print / Download PDF" onClick={handlePrint} icon={<span>📥</span>} />
          </div>
        </div>

        {/* Main Editor Canvas / Skeleton Loader */}
        <div style={{ flex: "2 1 500px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "32px 24px", boxSizing: "border-box", minHeight: 400 }}>
          {isGenerating ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "40px 0" }}>
              <div style={{ height: 24, background: "#e2e2ea", borderRadius: 6, width: "60%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: "#e2e2ea", borderRadius: 6, width: "100%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: "#e2e2ea", borderRadius: 6, width: "90%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: "#e2e2ea", borderRadius: 6, width: "95%", animation: "pulse 1.5s infinite" }} />
              <p style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 20 }}>Generating tailored AI cover letter...</p>
            </div>
          ) : (
            <textarea ref={taRef} value={editable} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", border: "none", background: "transparent", resize: "none", fontFamily: "'Lora', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: C.ink, outline: "none", boxSizing: "border-box" }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main App Controller ───────────────────────────────────────────────────────

export default function Home() {
  const [form, setForm] = useState<Form>(BLANK);
  const [step, setStep] = useState<Step>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editable, setEditable] = useState("");
  const [copied, setCopied] = useState(false);
  const [refineCount, setRefineCount] = useState(0);

  // Load from localStorage safely on mount without cascading renders
  useEffect(() => {
    const saved = localStorage.getItem("lettercraft_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setForm(parsed));
      } catch (e) {
        // Fallback if JSON is corrupted
      }
    }
  }, []);

  // Save to localStorage whenever form changes
  useEffect(() => {
    localStorage.setItem("lettercraft_form", JSON.stringify(form));
  }, [form]);

  function updateField(k: keyof Form, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function handleGenerate(isRefine = false) {
    if (isRefine && refineCount >= 3) return;
    setIsGenerating(true);
    setStep("output");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: isRefine ? "refine" : "initial", existingLetter: editable })
      });
      const data = await res.json();
      if (data.success) {
        setEditable(data.data);
        if (isRefine) {
          setRefineCount(prev => prev + 1);
        } else {
          setRefineCount(0); // Reset on fresh generation
        }
      } else {
        setEditable(`Error: ${data.error}`);
      }
    } catch (e) {
      setEditable("Network error occurred.");
    } finally {
      setIsGenerating(false);
    }
  }

  const wordCount = editable.trim() ? editable.trim().split(/\s+/).length : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.surface, color: C.ink, boxSizing: "border-box" }}>
      {step !== "output" ? (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 16px", boxSizing: "border-box" }}>
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 600, fontSize: 16, color: C.ink }}>lettercraft</span>
            <Mono size={9} color={C.dim}>AI COVER LETTER</Mono>
          </div>
          <StepProgress current={step} />
          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "24px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.02)", boxSizing: "border-box" }}>
            {step === 1 && <Step1 f={form} up={updateField} onNext={() => setStep(2)} />}
            {step === 2 && <Step2 f={form} up={updateField} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 f={form} up={updateField} onGenerate={() => handleGenerate(false)} onBack={() => setStep(2)} />}
          </div>
        </div>
      ) : (
        <Output editable={editable} isGenerating={isGenerating} onChange={setEditable} onRefine={() => handleGenerate(true)} onBack={() => setStep(3)} onCopy={() => { navigator.clipboard.writeText(editable); setCopied(true); setTimeout(() => setCopied(false), 2000); }} copied={copied} wordCount={wordCount} form={form} refineCount={refineCount} />
      )}
    </div>
  );
}