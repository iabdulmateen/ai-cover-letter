"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback, createContext, useContext } from "react";
import { calculateReadability } from "@/lib/readability";
import {
  Sun,
  Moon,
  Trash2,
  Check,
  CircleHelp,
  Briefcase,
  Rocket,
  Zap,
  Palette,
  Sparkles,
  Printer,
  Copy,
  ArrowLeft,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  FileText,
  Clock,
  Mail,
  History,
  RotateCcw,
} from "lucide-react";

type Tone = "professional" | "enthusiastic" | "concise" | "creative";
type Len = "brief" | "standard" | "detailed";
type Opening = "direct" | "hook" | "story";
type Step = 1 | 2 | 3 | "output";
export type Theme = "light" | "dark";

export interface LetterHistoryItem {
  id: string;
  timestamp: number;
  jobTitle: string;
  company: string;
  applicantName: string;
  tone: Tone;
  content: string;
  wordCount: number;
}

export interface ColorScheme {
  ink: string;
  muted: string;
  dim: string;
  accent: string;
  accentLight: string;
  border: string;
  card: string;
  surface: string;
  inputBg: string;
  selectedCardBg: string;
  skeletonBg: string;
  progressInactive: string;
  tagBg: string;
  toastBg: string;
}

export const THEMES: Record<Theme, ColorScheme> = {
  light: {
    ink: "#1a1a2e",
    muted: "#5a5a7a",
    dim: "#8f8faa",
    accent: "#5046e4",
    accentLight: "#eeedfd",
    border: "#e0e0ea",
    card: "#ffffff",
    surface: "#f5f5f3",
    inputBg: "#ffffff",
    selectedCardBg: "#f8f7ff",
    skeletonBg: "#e2e2ea",
    progressInactive: "#ebebf0",
    tagBg: "#eeedfd",
    toastBg: "#1a1a2e",
  },
  dark: {
    ink: "#f8fafc",
    muted: "#cbd5e1",
    dim: "#94a3b8",
    accent: "#6366f1",
    accentLight: "rgba(99, 102, 241, 0.22)",
    border: "#334155",
    card: "#1e293b",
    surface: "#0f172a",
    inputBg: "#1e293b",
    selectedCardBg: "rgba(99, 102, 241, 0.18)",
    skeletonBg: "#334155",
    progressInactive: "#334155",
    tagBg: "rgba(99, 102, 241, 0.25)",
    toastBg: "#0f172a",
  },
};

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
  C: ColorScheme;
}>({
  theme: "light",
  toggleTheme: () => {},
  C: THEMES.light,
});

function useTheme() {
  return useContext(ThemeContext);
}

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

function getInputStyle(C: ColorScheme): React.CSSProperties {
  return {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: C.inputBg,
    fontSize: 14,
    color: C.ink,
    fontFamily: "Inter, system-ui, sans-serif",
  };
}

function ThemeToggle() {
  const { theme, toggleTheme, C } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        minHeight: 36,
        borderRadius: 20,
        border: `1.5px solid ${C.border}`,
        background: C.card,
        color: C.ink,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {isDark ? <Moon size={14} className="text-indigo-400" /> : <Sun size={14} className="text-amber-500" />}
      <span>{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}

function Mono({ children, size = 10, color }: { children: React.ReactNode; size?: number; color?: string }) {
  const { C } = useTheme();
  return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, letterSpacing: "0.1em", textTransform: "uppercase", color: color || C.dim }}>{children}</span>;
}

function Label({ label, hint }: { label: string; hint?: string }) {
  const { C } = useTheme();
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

function PrimaryBtn({ 
  id,
  label, 
  onClick, 
  disabled, 
  icon,
  isGenerating,
  className = "",
  shortcut
}: { 
  id?: string;
  label: string; 
  onClick: () => void; 
  disabled?: boolean; 
  icon?: React.ReactNode; 
  isGenerating?: boolean;
  className?: string;
  shortcut?: string;
}) {
  const { C } = useTheme();
  const active = !disabled && !isGenerating;
  return (
    <button 
      id={id}
      onClick={onClick} 
      disabled={!active} 
      className={`${isGenerating ? "btn-pulse" : ""} ${className}`.trim()}
      style={{ 
        width: "100%", 
        minHeight: 44,
        padding: "11px 18px", 
        borderRadius: 10, 
        border: "none", 
        background: isGenerating ? "#4338ca" : active ? C.accent : C.dim, 
        color: "#fff", 
        fontSize: 14, 
        fontWeight: 600, 
        cursor: active ? "pointer" : isGenerating ? "wait" : "not-allowed", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 8,
        transition: "all 0.25s ease"
      }}
    >
      {isGenerating ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>{label}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
          {shortcut && (
            <kbd style={{ fontSize: 10, padding: "2px 6px", background: "rgba(255,255,255,0.22)", borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, letterSpacing: "0.02em", color: "#ffffff", marginLeft: 4 }}>
              {shortcut}
            </kbd>
          )}
        </>
      )}
    </button>
  );
}

function GhostBtn({ 
  id,
  label, 
  onClick, 
  disabled, 
  icon,
  className = "",
  shortcut
}: { 
  id?: string;
  label: string; 
  onClick: () => void; 
  disabled?: boolean; 
  icon?: React.ReactNode;
  className?: string;
  shortcut?: string;
}) {
  const { C } = useTheme();
  const active = !disabled;
  return (
    <button 
      id={id}
      onClick={onClick} 
      disabled={!active} 
      className={className}
      style={{ 
        width: "100%", 
        minHeight: 44,
        padding: "11px 18px", 
        borderRadius: 10, 
        border: `1.5px solid ${C.border}`, 
        background: "transparent", 
        color: active ? C.muted : C.dim, 
        fontSize: 14, 
        fontWeight: 500,
        cursor: active ? "pointer" : "not-allowed", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        gap: 7 
      }}
    >
      {icon}
      <span>{label}</span>
      {shortcut && (
        <kbd style={{ fontSize: 10, padding: "2px 5px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.dim, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, letterSpacing: "0.02em", marginLeft: 4 }}>
          {shortcut}
        </kbd>
      )}
    </button>
  );
}

function StepProgress({ current }: { current: 1 | 2 | 3 }) {
  const { C } = useTheme();
  const steps = [{ n: 1, label: "The Role" }, { n: 2, label: "Your Story" }, { n: 3, label: "Your Style" }];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 28, overflowX: "auto", paddingBottom: 4 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: s.n <= current ? C.accent : C.progressInactive, color: s.n <= current ? "#fff" : C.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
              {s.n < current ? <Check size={14} strokeWidth={3} /> : s.n}
            </div>
            <Mono size={9} color={s.n === current ? C.accent : C.dim}>{s.label}</Mono>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: s.n < current ? C.accent : C.border, margin: "0 8px", marginBottom: 20 }} />}
        </div>
      ))}
    </div>
  );
}

function Step1({ f, up, onNext, onClear, modKey = "Ctrl" }: { f: Form; up: (k: keyof Form, v: string) => void; onNext: () => void; onClear?: () => void; modKey?: string }) {
  const { C } = useTheme();
  const inputStyle = getInputStyle(C);
  const can = f.jobTitle.trim() && f.company.trim();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono size={10} color={C.accent}>Step 1 of 3</Mono>
        {onClear && (
          <button
            id="clear-fields-step1-btn"
            type="button"
            onClick={onClear}
            style={{
              background: "none",
              border: "none",
              color: C.dim,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 8px",
              borderRadius: 6,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}
            title="Reset and clear all form inputs"
          >
            <Trash2 size={13} /> Clear All Fields
          </button>
        )}
      </div>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 24, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>What position are you applying for?</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>Pasting the job description helps tailor your letter.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <Field label="Job Title" hint="Required"><input style={inputStyle} placeholder="Frontend Developer" value={f.jobTitle} onChange={(e) => up("jobTitle", e.target.value)} /></Field>
          <Field label="Company" hint="Required"><input style={inputStyle} placeholder="Google" value={f.company} onChange={(e) => up("company", e.target.value)} /></Field>
        </div>
        <Field label="Hiring Manager" hint="Optional"><input style={inputStyle} placeholder="Jordan Lee" value={f.hiringManager} onChange={(e) => up("hiringManager", e.target.value)} /></Field>
        <Field label="Job Description" hint="Recommended"><textarea rows={4} style={{ ...inputStyle, resize: "none" }} placeholder="Paste job description..." value={f.jobDescription} onChange={(e) => up("jobDescription", e.target.value)} /></Field>
        <PrimaryBtn label="Continue →" onClick={onNext} disabled={!can} shortcut={`${modKey}+↵`} />
      </div>
    </div>
  );
}

function Step2({ f, up, onNext, onBack, onClear, modKey = "Ctrl" }: { f: Form; up: (k: keyof Form, v: string) => void; onNext: () => void; onBack: () => void; onClear?: () => void; modKey?: string }) {
  const { C, theme } = useTheme();
  const inputStyle = getInputStyle(C);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono size={10} color={C.accent}>Step 2 of 3</Mono>
        {onClear && (
          <button
            id="clear-fields-step2-btn"
            type="button"
            onClick={onClear}
            style={{
              background: "none",
              border: "none",
              color: C.dim,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 8px",
              borderRadius: 6,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}
            title="Reset and clear all form inputs"
          >
            <Trash2 size={13} /> Clear All Fields
          </button>
        )}
      </div>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 24, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>Tell us about yourself</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 20, lineHeight: 1.6 }}>Add your background and professional skills.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
          <Field label="Full Name" hint="Required"><input style={inputStyle} placeholder="Alex Morgan" value={f.applicantName} onChange={(e) => up("applicantName", e.target.value)} /></Field>
          <Field label="Email" hint="Optional"><input style={inputStyle} type="email" placeholder="alex@domain.com" value={f.email} onChange={(e) => up("email", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          <Field label="Experience"><select style={{ ...inputStyle, cursor: "pointer" }} value={f.yearsExp} onChange={(e) => up("yearsExp", e.target.value)}>{["Under 1 year", "1–2 years", "3–5 years", "5–8 years", "12+ years"].map(o => <option key={o}>{o}</option>)}</select></Field>
          <div style={{ position: "relative" }}>
            <Field label="Key Skills" hint="Search global skills"><input style={inputStyle} placeholder="Type skill..." value={skillInput} onChange={(e) => { setSkillInput(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)} /></Field>
            {showDropdown && skillInput.trim() && filtered.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 10, maxHeight: 140, overflowY: "auto", zIndex: 50, marginTop: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.18)" }}>
                {filtered.map(s => <div key={s} onClick={() => addSkill(s)} style={{ padding: "8px 12px", fontSize: 13, cursor: "pointer", borderBottom: `1px solid ${C.border}`, color: C.ink }}>+ {s}</div>)}
              </div>
            )}
          </div>
        </div>
        {f.skills && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {f.skills.split(",").map(s => s.trim()).filter(Boolean).map((skill, idx) => (
              <span key={idx} style={{ background: C.tagBg, color: theme === "dark" ? "#c7d2fe" : C.accent, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {skill} <span style={{ cursor: "pointer", fontWeight: 700 }} onClick={() => up("skills", f.skills.split(",").map(s => s.trim()).filter((_, i) => i !== idx).join(", "))}>×</span>
              </span>
            ))}
          </div>
        )}
        <Field label="Professional Background" hint="2–3 sentences">
          <textarea id="professional-background-input" rows={3} style={{ ...inputStyle, resize: "none" }} placeholder="Brief background summary..." value={f.background} onChange={(e) => up("background", e.target.value)} />
          <div id="background-char-count" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5, padding: "0 2px" }}>
            <span style={{ fontSize: 11, color: C.dim }}>Recommended: 100–500 characters</span>
            <span style={{ fontSize: 11, color: f.background.length > 600 ? "#ef4444" : f.background.length >= 100 ? C.accent : C.dim, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>
              {f.background.length} / 500
            </span>
          </div>
        </Field>
        <div style={{ display: "flex", gap: 10 }}>
          <GhostBtn label="Back" onClick={onBack} shortcut="Esc" icon={<ArrowLeft size={15} />} />
          <PrimaryBtn label="Continue →" onClick={onNext} disabled={!can} shortcut={`${modKey}+↵`} />
        </div>
      </div>
    </div>
  );
}

const TONE_EXPLANATIONS = [
  {
    key: "professional" as Tone,
    label: "Professional",
    badge: "Most Popular",
    Icon: Briefcase,
    bestFor: "Corporate, Finance, Law, Tech Enterprise, Healthcare",
    desc: "Polished, formal, and structured. Emphasizes respect, industry credibility, and a proven track record without colloquialisms.",
    example: "“With over four years of experience leading cross-functional engineering initiatives, I welcome the opportunity to contribute to...”"
  },
  {
    key: "enthusiastic" as Tone,
    label: "Enthusiastic",
    badge: "High Energy",
    Icon: Rocket,
    bestFor: "Startups, Growth-stage Companies, Creative Tech, Non-profits",
    desc: "Vibrant, passionate, and mission-aligned. Conveys genuine excitement about the company’s vision and team culture.",
    example: "“I have long followed Acme’s innovative work in AI tooling and would be thrilled to bring my passion and experience to the team...”"
  },
  {
    key: "concise" as Tone,
    label: "Concise",
    badge: "Fast Read",
    Icon: Zap,
    bestFor: "Busy Hiring Managers, Executive / Lead Roles, Fast-Paced Tech",
    desc: "Short, punchy, and metric-dense. Cuts introductory fluff and presents your top key metrics and achievements right away.",
    example: "“Delivering 35% faster render pipelines and scaling systems to 1M+ MAU, I am positioned to accelerate Acme’s core roadmap...”"
  },
  {
    key: "creative" as Tone,
    label: "Creative",
    badge: "Story-Driven",
    Icon: Palette,
    bestFor: "Design, Marketing, Copywriting, Media, Product Management",
    desc: "Distinctive and narrative-rich. Uses engaging storytelling to frame your problem-solving philosophy and unique perspective.",
    example: "“Designing products isn't just about interface craft — it's about solving the human problem behind every user journey...”"
  }
];

function ToneHelpModal({ 
  isOpen, 
  onClose, 
  selectedTone, 
  onSelectTone 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedTone: Tone; 
  onSelectTone: (t: Tone) => void;
}) {
  const { C } = useTheme();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="tone-help-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 15, 29, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1000,
      }}
    >
      <div
        id="tone-help-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tone-modal-title"
        className="modal-enter"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card,
          border: `1.5px solid ${C.border}`,
          borderRadius: 16,
          maxWidth: 620,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 48px rgba(0, 0, 0, 0.3)",
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Mono size={10} color={C.accent}>Guide & Recommendations</Mono>
            </div>
            <h3 id="tone-modal-title" style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, fontWeight: 600, color: C.ink, margin: 0 }}>
              Choosing the Right Tone
            </h3>
            <p style={{ fontSize: 13, color: C.muted, margin: "6px 0 0", lineHeight: 1.5 }}>
              Select a tone that matches the company culture and the impression you want to leave with the hiring team.
            </p>
          </div>
          <button
            id="close-tone-modal-btn"
            onClick={onClose}
            aria-label="Close tone guide"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: "50%",
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.muted,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Tone Cards Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {TONE_EXPLANATIONS.map((item) => {
            const isSelected = selectedTone === item.key;
            const IconComp = item.Icon;
            return (
              <div
                key={item.key}
                id={`tone-option-${item.key}`}
                onClick={() => {
                  onSelectTone(item.key);
                  onClose();
                }}
                style={{
                  border: `1.5px solid ${isSelected ? C.accent : C.border}`,
                  background: isSelected ? C.selectedCardBg : C.card,
                  borderRadius: 12,
                  padding: "14px 16px",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: C.accentLight, color: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconComp size={16} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: isSelected ? C.accent : C.ink }}>
                      {item.label}
                    </span>
                    <span style={{ background: C.accentLight, color: C.accent, fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 10 }}>
                      {item.badge}
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, display: "flex", alignItems: "center", gap: 4 }}>
                      <Check size={14} strokeWidth={3} /> Selected
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 12.5, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>

                <div style={{ background: C.surface, padding: "8px 12px", borderRadius: 8, fontSize: 11.5, color: C.ink }}>
                  <strong style={{ color: C.accent }}>Best for:</strong> <span style={{ color: C.muted }}>{item.bestFor}</span>
                </div>

                <div style={{ fontSize: 11.5, color: C.dim, fontStyle: "italic", borderLeft: `2px solid ${C.dim}`, paddingLeft: 8, margin: "2px 0 0" }}>
                  {item.example}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            id="done-tone-modal-btn"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              background: C.accent,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

function Step3({ f, up, onGenerate, onBack, isGenerating, modKey = "Ctrl" }: { f: Form; up: (k: keyof Form, v: string) => void; onGenerate: () => void; onBack: () => void; isGenerating?: boolean; modKey?: string }) {
  const { C, theme } = useTheme();
  const [showToneHelp, setShowToneHelp] = useState(false);
  const tones = [
    { key: "professional", label: "Professional", icon: Briefcase },
    { key: "enthusiastic", label: "Enthusiastic", icon: Rocket },
    { key: "concise", label: "Concise", icon: Zap },
    { key: "creative", label: "Creative", icon: Palette }
  ];
  const lengths = [{ key: "brief", label: "Brief (~150w)" }, { key: "standard", label: "Standard (~280w)" }, { key: "detailed", label: "Detailed (~380w)" }];
  return (
    <div>
      <Mono size={10} color={C.accent}>Step 3 of 3</Mono>
      <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 24, fontWeight: 500, color: C.ink, margin: "8px 0 6px" }}>Choose tone & style</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 16 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Mono>Tone</Mono>
              <button
                id="tone-help-btn"
                type="button"
                onClick={() => setShowToneHelp(true)}
                title="Explain tones"
                aria-label="Learn about tone options"
                style={{
                  background: "none",
                  border: "none",
                  color: C.accent,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  lineHeight: 1,
                  transition: "all 0.15s ease",
                }}
              >
                <CircleHelp size={16} />
              </button>
            </div>
            <button
              id="tone-guide-link-btn"
              type="button"
              onClick={() => setShowToneHelp(true)}
              style={{
                background: "none",
                border: "none",
                fontSize: 11,
                color: C.accent,
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Which tone should I choose?
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
            {tones.map(t => {
              const IconComp = t.icon;
              const isSel = f.tone === t.key;
              return (
                <button 
                  key={t.key} 
                  id={`tone-btn-${t.key}`} 
                  disabled={isGenerating} 
                  onClick={() => up("tone", t.key as Tone)} 
                  style={{ 
                    padding: "12px", 
                    borderRadius: 10, 
                    border: `1.5px solid ${isSel ? C.accent : C.border}`, 
                    background: isSel ? C.accentLight : C.card, 
                    color: isSel ? (theme === "dark" ? "#e0e7ff" : C.accent) : C.ink, 
                    fontWeight: 600, 
                    fontSize: 13, 
                    cursor: isGenerating ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6
                  }}
                >
                  <IconComp size={15} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <Label label="Length" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
            {lengths.map(l => (
              <button key={l.key} id={`length-btn-${l.key}`} disabled={isGenerating} onClick={() => up("length", l.key as Len)} style={{ padding: "12px", borderRadius: 10, border: `1.5px solid ${f.length === l.key ? C.accent : C.border}`, background: f.length === l.key ? C.accentLight : C.card, color: f.length === l.key ? (theme === "dark" ? "#e0e7ff" : C.accent) : C.ink, fontWeight: 600, fontSize: 13, cursor: isGenerating ? "not-allowed" : "pointer" }}>{l.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <GhostBtn id="step3-back-btn" label="Back" onClick={onBack} disabled={isGenerating} shortcut="Esc" icon={<ArrowLeft size={15} />} />
          <PrimaryBtn 
            id="generate-cover-letter-btn"
            label={isGenerating ? "Generating Cover Letter..." : "Generate Cover Letter"} 
            onClick={onGenerate} 
            isGenerating={isGenerating}
            shortcut={`${modKey}+↵`}
            icon={<Sparkles size={16} />} 
          />
        </div>
      </div>
      <ToneHelpModal
        isOpen={showToneHelp}
        onClose={() => setShowToneHelp(false)}
        selectedTone={f.tone}
        onSelectTone={(t) => up("tone", t)}
      />
    </div>
  );
}

function Toast({ message, visible, onDismiss }: { message: string; visible: boolean; onDismiss: () => void }) {
  const { C } = useTheme();
  if (!visible) return null;
  return (
    <div
      id="copy-toast-notification"
      role="status"
      aria-live="polite"
      className="toast-enter"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        backgroundColor: C.toastBg,
        color: "#ffffff",
        padding: "12px 18px",
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 13,
        fontWeight: 500,
        zIndex: 999,
        border: `1px solid ${C.border}`,
        maxWidth: "calc(100vw - 48px)",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: "#10b981",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        <Check size={14} strokeWidth={3} />
      </div>
      <span style={{ color: "#f8f8fc", letterSpacing: "-0.01em" }}>{message}</span>
      <button
        id="dismiss-toast-btn"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        style={{
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          marginLeft: 4,
          padding: "2px 6px",
          borderRadius: 4,
          fontSize: 14,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSec < 45) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString([], { month: "short", day: "numeric" });
}

function HistoryCard({
  history,
  activeContent,
  onSelect,
  onClear,
}: {
  history: LetterHistoryItem[];
  activeContent: string;
  onSelect: (item: LetterHistoryItem) => void;
  onClear: () => void;
}) {
  const { C, theme } = useTheme();

  if (!history || history.length === 0) {
    return (
      <div
        id="history-empty-card"
        style={{
          background: C.card,
          border: `1.5px solid ${C.border}`,
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <History size={14} className="text-indigo-500" />
            <Mono size={10} color={C.dim}>Recent History</Mono>
          </div>
          <span style={{ fontSize: 10, color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>0/3</span>
        </div>
        <p style={{ fontSize: 12, color: C.dim, margin: 0, lineHeight: 1.4 }}>
          Your last 3 generated letters will appear here for fast switching.
        </p>
      </div>
    );
  }

  return (
    <div
      id="history-card"
      style={{
        background: C.card,
        border: `1.5px solid ${C.border}`,
        borderRadius: 14,
        padding: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <History size={14} className="text-indigo-500" />
          <Mono size={10} color={C.accent}>Recent Iterations</Mono>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 10, color: C.dim, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
            {history.length}/3 SAVED
          </span>
          <button
            id="clear-history-btn"
            type="button"
            onClick={onClear}
            title="Clear saved letter history"
            aria-label="Clear letter history"
            style={{
              background: "transparent",
              border: "none",
              color: C.dim,
              cursor: "pointer",
              padding: "2px",
              display: "flex",
              alignItems: "center",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map((item, index) => {
          const isActive = item.content.trim() === activeContent.trim();
          return (
            <div
              key={item.id || index}
              id={`history-item-${index}`}
              onClick={() => onSelect(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(item);
                }
              }}
              style={{
                background: isActive ? C.selectedCardBg : C.surface,
                border: `1.5px solid ${isActive ? C.accent : C.border}`,
                borderRadius: 10,
                padding: "9px 12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: isActive ? C.accent : C.ink,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 180,
                  }}
                >
                  {item.jobTitle || "Cover Letter"}
                </span>
                <span style={{ fontSize: 10, color: C.dim, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {formatTimeAgo(item.timestamp)}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                <span style={{ color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 130 }}>
                  {item.company || "Company"}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: C.dim, fontSize: 10.5 }}>{item.wordCount}w</span>
                  {isActive ? (
                    <span style={{ color: C.accent, fontWeight: 700, display: "flex", alignItems: "center", gap: 2, fontSize: 10.5 }}>
                      <Check size={11} strokeWidth={3} /> Active
                    </span>
                  ) : (
                    <span style={{ color: theme === "dark" ? "#818cf8" : C.accent, fontSize: 10.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}>
                      <RotateCcw size={10} /> Load
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Output({ 
  editable, 
  isGenerating, 
  onChange, 
  onRefine, 
  onBack, 
  onCopy, 
  copied, 
  showToast, 
  toastMessage,
  onDismissToast, 
  wordCount, 
  form, 
  refineCount, 
  history,
  onSelectHistory,
  onClearHistory,
  modKey = "Ctrl" 
}: {
  editable: string; 
  isGenerating: boolean; 
  onChange: (v: string) => void; 
  onRefine: () => void; 
  onBack: () => void; 
  onCopy: () => void; 
  copied: boolean; 
  showToast: boolean; 
  toastMessage?: string;
  onDismissToast: () => void; 
  wordCount: number; 
  form: Form; 
  refineCount: number; 
  history: LetterHistoryItem[];
  onSelectHistory: (item: LetterHistoryItem) => void;
  onClearHistory: () => void;
  modKey?: string;
}) {
  const { C } = useTheme();
  const [showStatsDrawer, setShowStatsDrawer] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.max(380, ta.scrollHeight) + "px";
  }, [editable]);

  const readTime = wordCount < 100 ? "< 1 min" : `~${Math.max(1, Math.round(wordCount / 200))} min`;
  const readability = useMemo(() => calculateReadability(editable), [editable]);

  function handlePrint() {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Cover Letter</title><style>body{font-family:Georgia,serif;font-size:12pt;line-height:1.9;max-width:6.5in;margin:1in auto;color:#111}pre{white-space:pre-wrap;font-family:inherit;font-size:inherit;margin:0}</style></head><body><pre>${editable.replace(/</g, "&lt;")}</pre></body></html>`);
    win.document.close();
    win.print();
  }

  function handleDraftEmail() {
    let subjectText = "Cover Letter Application";
    if (form.jobTitle && form.company) {
      subjectText = `Application for ${form.jobTitle} - ${form.company}`;
    } else if (form.jobTitle) {
      subjectText = `Application for ${form.jobTitle}`;
    } else if (form.company) {
      subjectText = `Job Application - ${form.company}`;
    }
    const subject = encodeURIComponent(subjectText);
    const body = encodeURIComponent(editable);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  const maxReached = refineCount >= 3;

  const statsCardContent = (
    <div id="letter-stats-card" style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono size={10} color={C.dim}>Letter Stats</Mono>
        <span style={{ fontSize: 10, color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <div style={{ background: C.surface, borderRadius: 8, padding: "10px", display: "flex", alignItems: "center", gap: 10 }}>
          <FileText size={18} className="text-indigo-500 shrink-0" />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{wordCount}</div>
            <div style={{ fontSize: 11, color: C.dim }}>words</div>
          </div>
        </div>
        <div style={{ background: C.surface, borderRadius: 8, padding: "10px", display: "flex", alignItems: "center", gap: 10 }}>
          <Clock size={18} className="text-amber-500 shrink-0" />
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{readTime}</div>
            <div style={{ fontSize: 11, color: C.dim }}>read time</div>
          </div>
        </div>
      </div>

      {/* Readability Scoring Section */}
      <div id="readability-section" style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Mono size={10} color={C.accent}>Readability</Mono>
          </div>
          <span 
            style={{ 
              fontSize: 11, 
              fontWeight: 600, 
              color: readability.levelColor,
              background: `${readability.levelColor}18`,
              padding: "2px 8px",
              borderRadius: 12
            }}
          >
            {readability.levelLabel}
          </span>
        </div>

        {/* Score Display & Progress Bar */}
        <div style={{ background: C.surface, borderRadius: 10, padding: "12px", marginTop: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: 20, fontWeight: 700, color: readability.levelColor }}>{readability.readingEase}</span>
              <span style={{ fontSize: 11, color: C.dim }}> / 100</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>
              Grade {readability.gradeLevel}
            </div>
          </div>

          <div style={{ width: "100%", height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
            <div 
              style={{ 
                width: `${readability.readingEase}%`, 
                height: "100%", 
                background: readability.levelColor,
                borderRadius: 3,
                transition: "width 0.4s ease"
              }} 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10, fontSize: 11, color: C.muted }}>
            <div>
              <span style={{ color: C.dim }}>Sentences:</span> <strong style={{ color: C.ink }}>{readability.sentenceCount}</strong>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: C.dim }}>Avg length:</span> <strong style={{ color: C.ink }}>{readability.avgSentenceLength}w</strong>
            </div>
          </div>

          <p style={{ margin: "8px 0 0", fontSize: 11, lineHeight: 1.4, color: C.muted, fontStyle: "italic" }}>
            {readability.qualitySummary}
          </p>
        </div>
      </div>
    </div>
  );

  const shortcutGuide = (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 11, color: C.dim }}>
      <div style={{ fontWeight: 600, color: C.muted, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
        <Zap size={13} className="text-amber-500" />
        <span>Keyboard Shortcuts</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Copy full letter</span>
          <kbd style={{ fontFamily: "'JetBrains Mono', monospace" }}>{modKey}+Shift+C</kbd>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Refine letter</span>
          <kbd style={{ fontFamily: "'JetBrains Mono', monospace" }}>{modKey}+Enter</kbd>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Print / PDF</span>
          <kbd style={{ fontFamily: "'JetBrains Mono', monospace" }}>{modKey}+P</kbd>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Back to edit</span>
          <kbd style={{ fontFamily: "'JetBrains Mono', monospace" }}>Esc</kbd>
        </div>
      </div>
    </div>
  );

  return (
    <div id="output-view" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.surface }}>
      {/* Top Navigation Bar */}
      <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, background: C.card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "nowrap" }}>
        <button id="back-to-edit-btn" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 8 }}>
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Edit details</span>
          <kbd className="hidden sm:inline-block" style={{ fontSize: 10, padding: "1px 5px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.dim, fontFamily: "'JetBrains Mono', monospace" }}>Esc</kbd>
        </button>

        <div style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 8px" }}>
          <Mono size={10} color={C.dim}>{form.jobTitle || "Cover Letter"} · {form.company}</Mono>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Sticky / Compact Action Bar */}
      <div className="md:hidden" style={{ padding: "8px 12px", background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8, overflowX: "auto" }}>
        <button
          id="mobile-copy-btn"
          onClick={onCopy}
          style={{
            flex: "1 1 auto",
            minHeight: 40,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: copied ? "#10b981" : C.accent,
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {copied ? <Check size={15} strokeWidth={3} /> : <Copy size={15} />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>

        <button
          id="mobile-refine-btn"
          onClick={onRefine}
          disabled={maxReached || isGenerating}
          style={{
            flex: "1 1 auto",
            minHeight: 40,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1.5px solid ${C.border}`,
            background: "transparent",
            color: maxReached ? C.dim : C.ink,
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            cursor: maxReached || isGenerating ? "not-allowed" : "pointer",
            whiteSpace: "nowrap"
          }}
        >
          <Sparkles size={14} className="text-amber-500" />
          <span>Refine ({refineCount}/3)</span>
        </button>

        <button
          id="mobile-print-btn"
          onClick={handlePrint}
          aria-label="Print or download PDF"
          title="Print or PDF"
          style={{
            minHeight: 40,
            minWidth: 40,
            padding: "8px",
            borderRadius: 8,
            border: `1.5px solid ${C.border}`,
            background: "transparent",
            color: C.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <Printer size={16} />
        </button>

        <button
          id="mobile-draft-email-btn"
          onClick={handleDraftEmail}
          aria-label="Draft cover letter in default email client"
          title="Draft in Email"
          style={{
            minHeight: 40,
            minWidth: 40,
            padding: "8px",
            borderRadius: 8,
            border: `1.5px solid ${C.border}`,
            background: "transparent",
            color: C.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <Mail size={16} />
        </button>

        <button
          id="mobile-toggle-stats-btn"
          onClick={() => setShowStatsDrawer(prev => !prev)}
          aria-label="Toggle stats and readability breakdown"
          title="Letter Stats"
          style={{
            minHeight: 40,
            padding: "8px 10px",
            borderRadius: 8,
            border: `1.5px solid ${showStatsDrawer ? C.accent : C.border}`,
            background: showStatsDrawer ? C.accentLight : "transparent",
            color: showStatsDrawer ? C.accent : C.muted,
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Stats</span>
          {showStatsDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Mobile Collapsible Stats Drawer */}
      {showStatsDrawer && (
        <div className="md:hidden" style={{ padding: "12px 16px", background: C.surface, borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
          {statsCardContent}
          <HistoryCard history={history} activeContent={editable} onSelect={onSelectHistory} onClear={onClearHistory} />
          {shortcutGuide}
        </div>
      )}

      {/* Main Content Workspace */}
      <div style={{ flex: 1, display: "flex", flexWrap: "wrap", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "16px", gap: 20, boxSizing: "border-box" }}>
        {/* Desktop Sidebar Controls (Hidden on mobile to maximize editor canvas) */}
        <div className="hidden md:flex" style={{ flex: "1 1 300px", maxWidth: 340, flexDirection: "column", gap: 16 }}>
          {statsCardContent}

          <HistoryCard history={history} activeContent={editable} onSelect={onSelectHistory} onClear={onClearHistory} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <PrimaryBtn id="copy-letter-btn" label={copied ? "Copied to Clipboard!" : "Copy Full Letter"} onClick={onCopy} shortcut={`${modKey}+⇧+C`} icon={copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />} />
            <GhostBtn 
              id="refine-letter-btn"
              label={maxReached ? "Max Refinements (3/3)" : `Refine & Enhance (${refineCount}/3)`} 
              onClick={onRefine} 
              disabled={maxReached}
              shortcut={`${modKey}+↵`}
              icon={<Sparkles size={16} className="text-amber-500" />} 
            />
            <GhostBtn id="draft-email-btn" label="Draft in Email" onClick={handleDraftEmail} icon={<Mail size={16} />} />
            <GhostBtn id="print-letter-btn" label="Print / Download PDF" onClick={handlePrint} shortcut={`${modKey}+P`} icon={<Printer size={16} />} />
          </div>

          {shortcutGuide}
        </div>

        {/* Main Editor Canvas */}
        <div style={{ flex: "2 1 480px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "20px 16px", boxSizing: "border-box", minHeight: "calc(100vh - 170px)", display: "flex", flexDirection: "column", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
          {isGenerating ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "40px 12px", alignItems: "center" }}>
              <div style={{ height: 24, background: C.skeletonBg, borderRadius: 6, width: "70%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: C.skeletonBg, borderRadius: 6, width: "100%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: C.skeletonBg, borderRadius: 6, width: "95%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: C.skeletonBg, borderRadius: 6, width: "90%", animation: "pulse 1.5s infinite" }} />
              <div style={{ height: 16, background: C.skeletonBg, borderRadius: 6, width: "98%", animation: "pulse 1.5s infinite" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, color: C.accent, fontSize: 13, fontWeight: 500 }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Crafting tailored AI cover letter...</span>
              </div>
            </div>
          ) : (
            <textarea 
              ref={taRef} 
              value={editable} 
              onChange={(e) => onChange(e.target.value)} 
              placeholder="Your generated cover letter will appear here..."
              style={{ 
                width: "100%", 
                flex: 1, 
                border: "none", 
                background: "transparent", 
                resize: "none", 
                fontFamily: "'Lora', Georgia, serif", 
                fontSize: 15, 
                lineHeight: 1.85, 
                color: C.ink, 
                outline: "none", 
                boxSizing: "border-box",
                padding: "4px"
              }} 
            />
          )}
        </div>
      </div>

      <Toast message={toastMessage || "Cover letter copied to clipboard"} visible={showToast} onDismiss={onDismissToast} />
    </div>
  );
}

// ── Main App Controller ───────────────────────────────────────────────────────

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [form, setForm] = useState<Form>(BLANK);
  const [step, setStep] = useState<Step>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editable, setEditable] = useState("");
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Cover letter copied to clipboard");
  const [refineCount, setRefineCount] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [history, setHistory] = useState<LetterHistoryItem[]>([]);
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load theme safely on mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedTheme = localStorage.getItem("lettercraft_theme") as Theme | null;
        if (savedTheme === "dark" || savedTheme === "light") {
          setTheme(savedTheme);
        } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setTheme("dark");
        }
      } catch {
        // ignore
      }
    });
  }, []);

  // Load history safely on mount
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const savedHistory = localStorage.getItem("lettercraft_history");
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed)) {
            setHistory(parsed.slice(0, 3));
          }
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      try {
        localStorage.setItem("lettercraft_theme", next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const C = THEMES[theme];

  // Sync document body background
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = C.surface;
      document.body.style.color = C.ink;
    }
  }, [C]);

  useEffect(() => {
    queueMicrotask(() => {
      setIsMac(typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform));
    });
  }, []);

  const modKey = isMac ? "⌘" : "Ctrl";

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3200);
  }, []);

  const handleCopy = useCallback(() => {
    if (!editable) return;
    navigator.clipboard.writeText(editable);
    setCopied(true);
    triggerToast("Cover letter copied to clipboard");

    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [editable, triggerToast]);

  const saveToHistory = useCallback((content: string, currentForm: Form) => {
    if (!content || content.startsWith("Error:") || content.startsWith("Network error")) return;
    const wordCnt = content.trim().split(/\s+/).length;
    const newItem: LetterHistoryItem = {
      id: `letter_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      jobTitle: currentForm.jobTitle.trim() || "Cover Letter",
      company: currentForm.company.trim() || "Company",
      applicantName: currentForm.applicantName.trim() || "Applicant",
      tone: currentForm.tone,
      content,
      wordCount: wordCnt,
    };

    setHistory((prev) => {
      if (prev.length > 0 && prev[0].content === content) {
        return prev;
      }
      const updated = [newItem, ...prev.filter((item) => item.content !== content)].slice(0, 3);
      try {
        localStorage.setItem("lettercraft_history", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem("lettercraft_history");
    } catch {
      // ignore
    }
    triggerToast("Saved history cleared");
  }, [triggerToast]);

  const handleSelectHistory = useCallback((item: LetterHistoryItem) => {
    setEditable(item.content);
    setStep("output");
    triggerToast(`Loaded: ${item.jobTitle} · ${item.company}`);
  }, [triggerToast]);

  // Load from localStorage safely on mount
  useEffect(() => {
    const saved = localStorage.getItem("lettercraft_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => setForm(parsed));
      } catch {
        // Fallback
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

  function handleClear() {
    setForm(BLANK);
    try {
      localStorage.removeItem("lettercraft_form");
    } catch {
      // ignore
    }
  }

  const handleGenerate = useCallback(async (isRefine = false) => {
    if (isRefine && refineCount >= 3) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, mode: isRefine ? "refine" : "initial", existingLetter: editable })
      });
      const data = await res.json();
      if (data.success) {
        setEditable(data.data);
        saveToHistory(data.data, form);
        if (isRefine) {
          setRefineCount(prev => prev + 1);
        } else {
          setRefineCount(0);
          setStep("output");
        }
      } else {
        setEditable(`Error: ${data.error}`);
        setStep("output");
      }
    } catch {
      setEditable("Network error occurred.");
      setStep("output");
    } finally {
      setIsGenerating(false);
    }
  }, [form, editable, refineCount, saveToHistory]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === "Enter") {
        e.preventDefault();
        if (step === 1) {
          if (form.jobTitle.trim() && form.company.trim()) {
            setStep(2);
          }
        } else if (step === 2) {
          if (form.applicantName.trim() && form.background.trim()) {
            setStep(3);
          }
        } else if (step === 3) {
          if (!isGenerating) {
            handleGenerate(false);
          }
        } else if (step === "output") {
          if (!isGenerating && refineCount < 3) {
            handleGenerate(true);
          }
        }
        return;
      }

      if (isMod && e.shiftKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault();
        if (step === "output") {
          handleCopy();
        }
        return;
      }

      if (e.key === "Escape" && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (step === 2) {
          setStep(1);
        } else if (step === 3) {
          setStep(2);
        } else if (step === "output") {
          setStep(3);
        }
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, form, isGenerating, refineCount, editable, handleCopy, handleGenerate]);

  const wordCount = editable.trim() ? editable.trim().split(/\s+/).length : 0;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, C }}>
      <div style={{ minHeight: "100vh", background: C.surface, color: C.ink, boxSizing: "border-box", transition: "background-color 0.2s ease, color 0.2s ease" }}>
        {step !== "output" ? (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 16px", boxSizing: "border-box" }}>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 17, color: C.ink, letterSpacing: "-0.02em" }}>lettercraft</span>
                <Mono size={9} color={C.dim}>AI COVER LETTER</Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {history.length > 0 && (
                  <button
                    id="header-recent-history-btn"
                    onClick={() => handleSelectHistory(history[0])}
                    title="View last generated letter"
                    style={{
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderRadius: 8,
                      padding: "5px 10px",
                      fontSize: 12,
                      color: C.accent,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontWeight: 600,
                    }}
                  >
                    <History size={13} />
                    <span>Recent ({history.length})</span>
                  </button>
                )}
                <ThemeToggle />
              </div>
            </div>
            <StepProgress current={step} />
            <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "22px 18px", boxShadow: theme === "dark" ? "0 4px 24px rgba(0,0,0,0.35)" : "0 4px 24px rgba(0,0,0,0.02)", boxSizing: "border-box" }}>
              {step === 1 && <Step1 f={form} up={updateField} onNext={() => setStep(2)} onClear={handleClear} modKey={modKey} />}
              {step === 2 && <Step2 f={form} up={updateField} onNext={() => setStep(3)} onBack={() => setStep(1)} onClear={handleClear} modKey={modKey} />}
              {step === 3 && <Step3 f={form} up={updateField} onGenerate={() => handleGenerate(false)} onBack={() => setStep(2)} isGenerating={isGenerating} modKey={modKey} />}
            </div>
            <div style={{ textAlign: "center", marginTop: 18, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, fontSize: 11, color: C.dim }}>
              <span><kbd style={{ fontFamily: "'JetBrains Mono', monospace", background: C.card, border: `1px solid ${C.border}`, padding: "1px 5px", borderRadius: 4, color: C.dim }}>{modKey}+Enter</kbd> Next / Generate</span>
              <span>·</span>
              <span><kbd style={{ fontFamily: "'JetBrains Mono', monospace", background: C.card, border: `1px solid ${C.border}`, padding: "1px 5px", borderRadius: 4, color: C.dim }}>Esc</kbd> Back</span>
            </div>
          </div>
        ) : (
          <Output 
            editable={editable} 
            isGenerating={isGenerating} 
            onChange={setEditable} 
            onRefine={() => handleGenerate(true)} 
            onBack={() => setStep(3)} 
            onCopy={handleCopy} 
            copied={copied} 
            showToast={showToast}
            toastMessage={toastMessage}
            onDismissToast={() => setShowToast(false)}
            wordCount={wordCount} 
            form={form} 
            refineCount={refineCount} 
            history={history}
            onSelectHistory={handleSelectHistory}
            onClearHistory={handleClearHistory}
            modKey={modKey}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}
