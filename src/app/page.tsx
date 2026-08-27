"use client";

import React, { useState, useRef, useEffect } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

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

// Global Worldwide Skills Database for Suggestions
const GLOBAL_SKILLS = [
  "JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", "Python", "HTML5", "CSS3",
  "Tailwind CSS", "UI/UX Design", "Figma", "MongoDB", "SQL", "PostgreSQL", "Git & GitHub",
  "AI Prompt Engineering", "REST APIs", "GraphQL", "Docker", "AWS", "Agile Methodology",
  "Project Management", "Data Analysis", "Machine Learning", "Cybersecurity", "DevOps",
  "Technical Writing", "Digital Marketing", "Business Strategy", "Cross-functional Leadership"
];

// ── Design tokens ─────────────────────────────────────────────────────────────

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
  transition: "border-color 0.15s, box-shadow 0.15s",
};

// ── Micro components ──────────────────────────────────────────────────────────

function Mono({
  children,
  size = 10,
  color = C.dim,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
}) {
  return (
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size,
        letterSpacing: "0.1em",
        textTransform: "uppercase" as const,
        color,
      }}
    >
      {children}
    </span>
  );
}

function Label({ label, hint }: { label: string; hint?: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 7,
      }}
    >
      <Mono>{label}</Mono>
      {hint && <span style={{ fontSize: 11, color: C.dim }}>{hint}</span>}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label label={label} hint={hint} />
      {children}
    </div>
  );
}

function PrimaryBtn({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  const active = !disabled;
  return (
    <button
      onClick={onClick}
      disabled={!active}
      style={{
        padding: "12px 28px",
        borderRadius: 10,
        border: "none",
        background: active ? C.accent : C.dim,
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: active ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "background 0.15s, transform 0.1s",
        letterSpacing: "0.01em",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function GhostBtn({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 20px",
        borderRadius: 10,
        border: `1.5px solid ${C.border}`,
        background: "transparent",
        color: C.muted,
        fontSize: 14,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

// ── Step Progress ─────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "The Role" },
    { n: 2, label: "Your Story" },
    { n: 3, label: "Your Style" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 44 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: s.n <= current ? C.accent : "#ebebf0",
                color: s.n <= current ? "#fff" : C.dim,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                boxShadow: s.n === current ? `0 0 0 4px ${C.accentLight}` : "none",
              }}
            >
              {s.n < current ? "✓" : s.n}
            </div>
            <Mono size={10} color={s.n === current ? C.accent : C.dim}>{s.label}</Mono>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: 1.5, background: s.n < current ? C.accent : "#e0e0ea", margin: "0 10px", marginBottom: 26 }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Step 1: The Role ──────────────────────────────────────────────────────────

function Step1({ f, up, onNext }: { f: Form; up: (k: keyof Form, v: string) => void; onNext: () => void }) {
  const can = f.jobTitle.trim() && f.company.trim();
  return (
    <div className="step-enter">
      <Mono size={10} color={C.accent}>Step 1 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 30, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>
        What position are you applying for?
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.7 }}>
        Pasting the job description lets us tailor your letter and show a match score.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Job Title" hint="Required">
            <input style={INPUT_S} placeholder="Senior Frontend Developer" value={f.jobTitle} onChange={(e) => up("jobTitle", e.target.value)} />
          </Field>
          <Field label="Company" hint="Required">
            <input style={INPUT_S} placeholder="Google" value={f.company} onChange={(e) => up("company", e.target.value)} />
          </Field>
        </div>
        <Field label="Hiring Manager" hint="Optional — personalises greeting">
          <input style={INPUT_S} placeholder="e.g. Jordan Lee" value={f.hiringManager} onChange={(e) => up("hiringManager", e.target.value)} />
        </Field>
        <Field label="Job Description" hint="Recommended">
          <textarea
            rows={6}
            style={{ ...INPUT_S, resize: "none", lineHeight: 1.65 }}
            placeholder="Paste the full job description here..."
            value={f.jobDescription}
            onChange={(e) => up("jobDescription", e.target.value)}
          />
        </Field>
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
          <PrimaryBtn label="Continue →" onClick={onNext} disabled={!can} />
        </div>
      </div>
    </div>
  );
}

// ── Step 2: Your Story (With Worldwide Skills Dropdown & Suggestions) ──────────

function Step2({ f, up, onNext, onBack }: { f: Form; up: (k: keyof Form, v: string) => void; onNext: () => void; onBack: () => void }) {
  const [skillInput, setSkillInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const can = f.applicantName.trim() && f.background.trim();
  const achKeys = ["achievement1", "achievement2", "achievement3"] as const;

  // Filter global skills based on user input
  const filteredSkills = GLOBAL_SKILLS.filter(
    (s) => s.toLowerCase().includes(skillInput.toLowerCase()) && !f.skills.toLowerCase().includes(s.toLowerCase())
  );

  const handleAddSkill = (skillToAdd: string) => {
    const currentSkills = f.skills ? f.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
    if (!currentSkills.includes(skillToAdd)) {
      currentSkills.push(skillToAdd);
      up("skills", currentSkills.join(", "));
    }
    setSkillInput("");
    setShowDropdown(false);
  };

  return (
    <div className="step-enter">
      <Mono size={10} color={C.accent}>Step 2 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 30, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>
        Tell us about yourself
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.7 }}>
        Add your background and select or type your professional skills from around the world.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Full Name" hint="Required">
            <input style={INPUT_S} placeholder="Abdul Mateen Azeemi" value={f.applicantName} onChange={(e) => up("applicantName", e.target.value)} />
          </Field>
          <Field label="Email" hint="Optional">
            <input style={INPUT_S} type="email" placeholder="mateen@email.com" value={f.email} onChange={(e) => up("email", e.target.value)} />
          </Field>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 16 }}>
          <Field label="Experience">
            <select style={{ ...INPUT_S, cursor: "pointer", appearance: "none" as const }} value={f.yearsExp} onChange={(e) => up("yearsExp", e.target.value)}>
              {["Under 1 year", "1–2 years", "3–5 years", "5–8 years", "8–12 years", "12+ years"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>

          {/* Worldwide Interactive Skills Input with Dropdown Suggestions */}
          <div style={{ position: "relative" }}>
            <Field label="Key Skills" hint="Select from dropdown or type custom">
              <input
                style={INPUT_S}
                placeholder="Type to search global skills (e.g., React, AI)..."
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
            </Field>

            {/* Dropdown Suggestions Box */}
            {showDropdown && skillInput.trim().length > 0 && filteredSkills.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: C.card,
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                maxHeight: 160,
                overflowY: "auto",
                zIndex: 50,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                marginTop: 4
              }}>
                {filteredSkills.map((s) => (
                  <div
                    key={s}
                    onClick={() => handleAddSkill(s)}
                    style={{
                      padding: "9px 14px",
                      fontSize: 13,
                      cursor: "pointer",
                      borderBottom: `1px solid ${C.surface}`,
                      color: C.ink,
                      transition: "background 0.1s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = C.accentLight}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    + Add {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Display Active Skills Tags */}
        {f.skills && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: -4 }}>
            {f.skills.split(",").map(s => s.trim()).filter(Boolean).map((skill, idx) => (
              <span key={idx} style={{
                background: C.accentLight,
                color: C.accent,
                padding: "4:px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 6
              }}>
                {skill}
                <span
                  style={{ cursor: "pointer", fontWeight: 700 }}
                  onClick={() => {
                    const updated = f.skills.split(",").map(s => s.trim()).filter((_, i) => i !== idx);
                    up("skills", updated.join(", "));
                  }}
                >×</span>
              </span>
            ))}
          </div>
        )}

        <Field label="Professional Background" hint="2–3 sentences">
          <textarea
            rows={3}
            style={{ ...INPUT_S, resize: "none", lineHeight: 1.7 }}
            placeholder="Frontend developer and AI prompt engineer with hands-on experience..."
            value={f.background}
            onChange={(e) => up("background", e.target.value)}
          />
        </Field>

        <div>
          <Label label="Top Achievements" hint="Quantify where possible" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {achKeys.map((k, i) => (
              <div key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: i === 0 ? C.accent : C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 9 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: i === 0 ? "#fff" : C.accent }}>{i + 1}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    style={{ ...INPUT_S, fontSize: 13 }}
                    placeholder={i === 0 ? "Redesigned web app, boosting user retention by 40%" : "Optional achievement..."}
                    value={f[k] as string}
                    onChange={(e) => up(k, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
          <GhostBtn label="← Back" onClick={onBack} />
          <PrimaryBtn label="Continue →" onClick={onNext} disabled={!can} />
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Your Style ────────────────────────────────────────────────────────

const TONES = [
  { key: "professional", label: "Professional", desc: "Formal, precise, confidence-inspiring", symbol: "◆" },
  { key: "enthusiastic", label: "Enthusiastic", desc: "Energetic, genuine, warm", symbol: "★" },
  { key: "concise", label: "Concise", desc: "Direct, clear, no filler", symbol: "→" },
  { key: "creative", label: "Creative", desc: "Distinctive voice, original", symbol: "◎" },
];

const LENS = [
  { key: "brief", label: "Brief", words: "~150 words", desc: "Short & punchy" },
  { key: "standard", label: "Standard", words: "~280 words", desc: "Balanced depth" },
  { key: "detailed", label: "Detailed", words: "~380 words", desc: "Full coverage" },
];

const OPENINGS = [
  { key: "direct", label: "Direct", desc: "State your purpose clearly from sentence one" },
  { key: "hook", label: "Hook", desc: "Open with a compelling observation or insight" },
  { key: "story", label: "Story", desc: "Begin with a brief personal turning point" },
];

function Step3({ f, up, onGenerate, onBack }: { f: Form; up: (k: keyof Form, v: string) => void; onGenerate: () => void; onBack: () => void }) {
  return (
    <div className="step-enter">
      <Mono size={10} color={C.accent}>Step 3 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 30, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>
        How do you want to sound?
      </h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.7 }}>
        These choices shape the voice, structure, and length of your letter.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <Label label="Tone" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {TONES.map((t) => (
              <button
                key={t.key}
                onClick={() => up("tone", t.key as Tone)}
                style={{
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: "1.5px solid",
                  borderColor: f.tone === t.key ? C.accent : C.border,
                  background: f.tone === t.key ? C.accentLight : C.card,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 6, color: f.tone === t.key ? C.accent : C.dim }}>{t.symbol}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: f.tone === t.key ? C.accent : C.ink, marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: C.dim }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label label="Letter Length" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {LENS.map((l) => (
              <button
                key={l.key}
                onClick={() => up("length", l.key as Len)}
                style={{
                  padding: "14px",
                  borderRadius: 10,
                  border: "1.5px solid",
                  borderColor: f.length === l.key ? C.accent : C.border,
                  background: f.length === l.key ? C.accentLight : C.card,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14, color: f.length === l.key ? C.accent : C.ink }}>{l.label}</div>
                <div style={{ fontSize: 11, color: C.dim, marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{l.words}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label label="Opening Style" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {OPENINGS.map((o) => (
              <button
                key={o.key}
                onClick={() => up("opening", o.key as Opening)}
                style={{
                  padding: "13px 18px",
                  borderRadius: 10,
                  border: "1.5px solid",
                  borderColor: f.opening === o.key ? C.accent : C.border,
                  background: f.opening === o.key ? C.accentLight : C.card,
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid", borderColor: f.opening === o.key ? C.accent : "#c8c8d8", background: f.opening === o.key ? C.accent : "transparent" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: f.opening === o.key ? C.accent : C.ink }}>{o.label}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 1 }}>{o.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 4 }}>
          <GhostBtn label="← Back" onClick={onBack} />
          <PrimaryBtn label="Generate My Cover Letter (3-Pass AI)" onClick={onGenerate} icon={<span>✒️</span>} />
        </div>
      </div>
    </div>
  );
}

// ── Output View ───────────────────────────────────────────────────────────────

function Output({ editable, isGenerating, onChange, onRegenerate, onBack, onCopy, copied, wordCount, readTime, form }: {
  editable: string; isGenerating: boolean; onChange: (v: string) => void; onRegenerate: () => void; onBack: () => void; onCopy: () => void; copied: boolean; wordCount: number; readTime: string; form: Form;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
  }, [editable]);

  return (
    <div className="fade-up" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 32px", borderBottom: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 13 }}>
          <span>←</span> Edit details
        </button>
        <div style={{ flex: 1 }} />
        <Mono size={10} color={C.dim}>{form.jobTitle || "Cover Letter"} · {form.company}</Mono>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "32px 32px 48px", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px" }}>
            <Mono size={10} color={C.dim}>Letter Stats</Mono>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>{wordCount}</div>
                <div style={{ fontSize: 11, color: C.dim }}>words</div>
              </div>
              <div style={{ background: C.surface, borderRadius: 8, padding: "10px" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.ink }}>~{readTime}</div>
                <div style={{ fontSize: 11, color: C.dim }}>min read</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={onCopy} disabled={isGenerating} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: C.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
              {copied ? "Copied!" : "Copy Letter"}
            </button>
            <button onClick={onRegenerate} disabled={isGenerating} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, color: C.muted, cursor: "pointer" }}>
              ↻ Re-run 3-Pass AI
            </button>
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "48px 56px", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}>
          {isGenerating ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: C.muted }}>
              <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Running 3-Pass AI Refinement Pipeline...</div>
              <p style={{ fontSize: 14, color: C.dim }}>Pass 1: Drafting structure → Pass 2: Tone & Targeting → Pass 3: Final Polish</p>
            </div>
          ) : (
            <textarea
              ref={taRef}
              value={editable}
              onChange={(e) => onChange(e.target.value)}
              style={{ width: "100%", border: "none", background: "transparent", resize: "none", fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.9, color: C.ink, outline: "none" }}
            />
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

  function updateField(k: keyof Form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setStep("output");
    setEditable("Initializing 3-Pass AI Refinement Pipeline...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (data.success) {
        setEditable(data.data);
      } else {
        setEditable(`Error: ${data.error || "Failed to generate letter."}`);
      }
    } catch (error) {
      console.error("API error:", error);
      setEditable("Network error. Please check your connection or server logs.");
    } finally {
      setIsGenerating(false);
    }
  }

  // Replace readTime calculation in Home or Output component:
  const wordCount = editable.trim() ? editable.trim().split(/\s+/).length : 0;
  const readTime = wordCount < 100 ? "< 1 min" : `~${Math.max(1, Math.round(wordCount / 200))} min`;
  return (
    <div style={{ minHeight: "100vh", background: C.surface, color: C.ink }}>
      {step !== "output" ? (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px" }}>
          <div style={{ marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: "-0.03em", color: C.ink }}>lettercraft</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.12em", color: C.dim }}>
              AI COVER LETTER GENERATOR
            </div>
          </div>

          <StepProgress current={step as 1 | 2 | 3} />

          <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
            {step === 1 && <Step1 f={form} up={updateField} onNext={() => setStep(2)} />}
            {step === 2 && <Step2 f={form} up={updateField} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 f={form} up={updateField} onGenerate={handleGenerate} onBack={() => setStep(2)} />}
          </div>
        </div>
      ) : (
        <Output
          editable={editable}
          isGenerating={isGenerating}
          onChange={setEditable}
          onRegenerate={handleGenerate}
          onBack={() => setStep(3)}
          onCopy={() => {
            navigator.clipboard.writeText(editable);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          copied={copied}
          wordCount={wordCount}
          readTime={readTime}
          form={form}
        />
      )}
    </div>
  );
}