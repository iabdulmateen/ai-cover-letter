"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    jobRole: "",
    skills: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedLetter("");

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
      } else {
        alert(data.error || "Failed to generate letter.");
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formData.name && formData.jobRole && formData.skills) {
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">AI Cover Letter Pro</h1>
          <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium border border-blue-100">
            Powered by Google Gemini AI
          </span>
        </div>
      </nav>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-2xl font-semibold mb-2">Create Your Cover Letter</h2>
          <p className="text-gray-600 mb-6">
            Provide your details below and let AI craft a professional cover letter tailored to your skills.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Junior Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Skills (Comma separated)
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. React, Next.js, Prompt Engineering, HTML, CSS (Press Enter to submit)"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {/* Real dynamic loading message */}
              {isLoading ? "Crafting your cover letter, please wait..." : "Generate Cover Letter"}
            </button>
          </form>

          {generatedLetter && (
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Your Cover Letter:</h3>
                
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium py-1 px-3 rounded text-sm transition-colors"
                >
                  {copied ? "Copied!" : "Copy Text"}
                </button>
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