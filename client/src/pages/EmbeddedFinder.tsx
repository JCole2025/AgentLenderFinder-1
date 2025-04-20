import React, { useEffect } from 'react';
import FinderForm from '@/components/finder/FinderForm';
import { useToast } from '@/hooks/use-toast';
import Confetti from 'react-confetti';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * EmbeddedFinder - Special version of the finder app optimized for embedding in iframes
 * Has embedded-specific styling and messaging
 */
export default function EmbeddedFinder() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check if we're inside an iframe
  const isIframe = window.self !== window.top;

  // Communicate with parent window if we're in an iframe
  useEffect(() => {
    if (isIframe) {
      // Send height updates to parent
      const sendHeightToParent = () => {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      };

      // Send height on step changes
      sendHeightToParent();
      window.addEventListener('resize', sendHeightToParent);

      return () => {
        window.removeEventListener('resize', sendHeightToParent);
      };
    }
  }, [isIframe, currentStep]);

  // Handle successful form submission
  const handleSuccess = () => {
    setShowSuccess(true);
    
    // Send completion message to parent if in iframe
    if (isIframe) {
      window.parent.postMessage({ type: 'form-complete' }, '*');
    }
    
    // Show success toast
    toast({
      title: "Successfully Submitted!",
      description: "Your information has been received. An agent will contact you soon.",
    });
    
    // Reset after confetti
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentStep(1);
    }, 5000);
  };

  return (
    <div className="embedded-finder-container">
      {showSuccess && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={isMobile ? 100 : 200}
        />
      )}
      
      <div className={`max-w-3xl mx-auto bg-white rounded-lg shadow-sm ${isIframe ? 'p-2' : 'p-6'}`}>
        {showSuccess ? (
          <div className="py-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">Agent Match Request Submitted!</h2>
            <p className="text-gray-600">
              Thank you for your submission. A qualified real estate agent will contact you shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <img 
                src="/assets/BPlogo.png" 
                alt="BiggerPockets Logo" 
                className="h-8 mx-auto mb-2" 
              />
              <h1 className="text-xl font-bold text-gray-900">Connect with a Real Estate Agent</h1>
              <p className="text-sm text-gray-500">
                Find a specialized agent who understands your real estate needs
              </p>
            </div>
            
            <FinderForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </div>
    </div>
  );
}