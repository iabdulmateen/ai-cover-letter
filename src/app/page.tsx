"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    jobRole: "",
    skills: "",
    jobDescription: "",
    tone: "Formal",
    length: "Standard",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const popularSkills = [
    "React.js", "Next.js", "TypeScript", "JavaScript", 
    "Tailwind CSS", "Node.js", "Prompt Engineering", "HTML/CSS"
  ];

  // Timer Effect: Manages the step progression interval cleanly without sync setState warnings
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : 3));
      }, 1500); 
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSkillTagClick = (skill: string) => {
    setFormData((prev) => {
      const currentSkills = prev.skills ? prev.skills.split(", ").map(s => s.trim()) : [];
      if (!currentSkills.includes(skill)) {
        const updatedSkills = [...currentSkills, skill].join(", ");
        return { ...prev, skills: updatedSkills };
      }
      return prev;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(1); // Safely initialize step here inside user action handler
    setGeneratedLetter("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedLetter(data.data); 
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setErrorMessage(data.error || "Failed to generate letter. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Network error or server unavailable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ name: "", jobRole: "", skills: "", jobDescription: "", tone: "Formal", length: "Standard" });
    setErrorMessage("");
  };

  const handleCloseResult = () => {
    setGeneratedLetter("");
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    if (generatedLetter) {
      const element = document.createElement("a");
      const file = new Blob([generatedLetter], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${formData.name || "Cover_Letter"}_Cover_Letter.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const getLoadingText = () => {
    if (loadingStep === 1) return "Step 1/3: Generating initial professional draft...";
    if (loadingStep === 2) return "Step 2/3: Reviewing & polishing tone & job keywords...";
    return "Step 3/3: Performing final grammar and impact polish...";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">AI Cover Letter Pro</h1>
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
            Powered by Google Gemini AI (3-Pass Refinement)
          </span>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-semibold">Create Your Cover Letter</h2>
            
            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs text-gray-500 hover:text-red-600 underline transition-colors cursor-pointer"
            >
              Reset Form
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            Our 3-pass AI engine crafts, reviews, and polishes your cover letter for maximum impact.
          </p>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex justify-between items-center">
              <span>⚠️ {errorMessage}</span>
              <button onClick={() => setErrorMessage("")} className="font-bold text-red-500 hover:text-red-800 cursor-pointer">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="e.g. Abdul Mateen Azeemi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Job Role
                </label>
                <input
                  type="text"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="e.g. Next.js Frontend Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Writing Tone
                </label>
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white cursor-pointer"
                >
                  <option value="Formal">Formal & Corporate</option>
                  <option value="Casual">Casual & Approachable</option>
                  <option value="Enthusiastic">Enthusiastic & Energetic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Letter Length
                </label>
                <select
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-black bg-white cursor-pointer"
                >
                  <option value="Short">Short & Concise (~150 words)</option>
                  <option value="Standard">Standard (~250 words)</option>
                  <option value="Detailed">Detailed & Comprehensive (~400 words)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Posting / Description (Optional)
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
                placeholder="Paste the company's job description here..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Key Skills
                </label>
                <span className="text-xs text-gray-400">{formData.skills.length} chars</span>
              </div>
              
              <div className="mb-2 flex flex-wrap gap-1.5">
                {popularSkills.map((skill, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSkillTagClick(skill)}
                    className="text-xs bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 px-2.5 py-1 rounded border border-gray-200 transition-colors cursor-pointer"
                  >
                    + {skill}
                  </button>
                ))}
              </div>

              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                rows={2}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="e.g. React, Next.js, Tailwind CSS"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? getLoadingText() : "Generate Cover Letter (3-Pass AI)"}
            </button>
          </form>

          {isLoading && (
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-blue-200 rounded w-1/2 animate-bounce"></div>
                <span className="text-xs font-semibold text-blue-600">Step {loadingStep} of 3</span>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          )}

          {generatedLetter && !isLoading && (
            <div ref={resultRef} className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Your Polished Cover Letter:</h3>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadTxt}
                    className="bg-green-600 text-white hover:bg-green-700 font-medium py-1 px-3 rounded text-sm transition-colors cursor-pointer"
                  >
                    Download TXT
                  </button>

                  <button
                    onClick={handleCopy}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium py-1 px-3 rounded text-sm transition-colors cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy Text"}
                  </button>

                  <button
                    onClick={handleCloseResult}
                    title="Close Result"
                    className="text-gray-400 hover:text-red-600 bg-white border border-gray-200 hover:border-red-300 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {generatedLetter}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        Built with Next.js & Tailwind CSS
      </footer>
    </div>
  );
}