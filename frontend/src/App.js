import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import HeroSection from "./components/hero";
import FeaturesSection from "./components/features";
import HowItWorks from "./components/howitworks";
import Testimonials from "./components/testimonials";
import Pricing from "./components/pricing";
import CTA from "./components/CTA";
import Footer from "./components/footer";
import TaxForm from "./components/taxform";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AIChatbot from "./components/AIChatbot";
import PrivacyPolicy from "./components/privacy";
import TermsOfService from "./components/terms";
import ContactUs from "./components/contact";
import FloatingChatbot from "./components/FloatingChatbot";
import AuditRiskAnalyzer from "./components/AuditRiskAnalyzer";
import TaxFilingPage from "./components/TaxFiling";
import About from "./components/about";
import GlobalTaxFiling from "./components/GlobalTaxFiling";
import AIAnalysis from "./components/AIAnalysis";

function HomePage({
  handleTaxCalculation,
  taxResult,
  taxError,
  handleFileUpload,
  extractedText,
  fileUploadError,
  handleChatbotQuery,
  chatbotResponse
}) {
  return (
    <div className="bg-black text-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}

function App() {
  const [taxResult, setTaxResult] = useState(null);
  const [taxError, setTaxError] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [fileUploadError, setFileUploadError] = useState(null);
  const [chatbotResponse, setChatbotResponse] = useState("");

  // Handle Tax Calculation
  const handleTaxCalculation = async (formData) => {
    try {
      setTaxError(null);
      setTaxResult(null);

      const response = await fetch("http://127.0.0.1:8000/calculate-tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to calculate tax");

      const data = await response.json();
      setTaxResult(data);
    } catch (error) {
      console.error("Error:", error);
      setTaxError("Tax calculation failed. Please try again.");
    }
  };

  // Handle File Upload & OCR Extraction
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setExtractedText("");
    setFileUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      setExtractedText(data.extracted_text);
    } catch (error) {
      console.error("File Upload Error:", error);
      setFileUploadError("Failed to extract text. Please try again.");
    }
  };

  // Handle AI Chatbot Query
  const handleChatbotQuery = async (question) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extracted_text: extractedText, question }),
      });

      if (!response.ok) throw new Error("Chatbot request failed");

      const data = await response.json();
      setChatbotResponse(data.answer);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setChatbotResponse("AI failed to answer. Please try again.");
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              handleTaxCalculation={handleTaxCalculation}
              taxResult={taxResult}
              taxError={taxError}
              handleFileUpload={handleFileUpload}
              extractedText={extractedText}
              fileUploadError={fileUploadError}
              handleChatbotQuery={handleChatbotQuery}
              chatbotResponse={chatbotResponse}
            />
          }
        />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-chatbot" element={<AIChatbot />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/audit-risk-analyzer" element={<AuditRiskAnalyzer />} />
        <Route path="/taxfiling" element={<TaxFilingPage />} />

        {/* ✅ Additional Feature Routes */}
        <Route path="/tax-optimization" element={<GlobalTaxFiling />} />
        <Route path="/auto-filing" element={<TaxFilingPage />} />
        <Route path="/smart-wallet" element={<AIAnalysis />} />
        <Route path="/audit-analyzer" element={<AuditRiskAnalyzer />} />
        <Route path="/crowdsourced-insights" element={<GlobalTaxFiling />} />
      </Routes>

      <FloatingChatbot />
      <Footer />
    </Router>
  );
}

export default App;
