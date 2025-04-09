import { useState } from "react";
import ProgressBar from "@/components/finder/ProgressBar";
import FinderForm from "@/components/finder/FinderForm";
import SuccessMessage from "@/components/finder/SuccessMessage";

export default function FinderApp() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const resetForm = () => {
    setShowSuccess(false);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img 
                src="/images/BPlogo.png" 
                alt="BiggerPockets Logo" 
                className="h-8"
              />
              <span className="ml-3 text-xl font-semibold">Agent Finder</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showSuccess ? (
            <>
              <ProgressBar 
                currentStep={currentStep} 
                totalSteps={3}
              />
              
              <FinderForm 
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                onSuccess={() => setShowSuccess(true)}
              />
            </>
          ) : (
            <SuccessMessage onStartOver={resetForm} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-medium">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <p className="text-sm text-neutral-dark">&copy; {new Date().getFullYear()} BiggerPockets, Inc. All rights reserved.</p>
            </div>
            <div className="flex justify-center md:justify-end mt-4 md:mt-0">
              <a href="#" className="text-sm text-neutral-dark hover:text-primary mx-3">Privacy Policy</a>
              <a href="#" className="text-sm text-neutral-dark hover:text-primary mx-3">Terms of Service</a>
              <a href="#" className="text-sm text-neutral-dark hover:text-primary mx-3">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
