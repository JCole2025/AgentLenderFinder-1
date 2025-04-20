import { useState, useEffect, useRef } from "react";
import ProgressBar from "@/components/finder/ProgressBar";
import FinderForm from "@/components/finder/FinderForm";
import SuccessMessage from "@/components/finder/SuccessMessage";

interface FinderAppProps {
  embedded?: boolean;
}

export default function FinderApp({ embedded = false }: FinderAppProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset form to initial state
  const resetForm = () => {
    setShowSuccess(false);
    setCurrentStep(1);
  };

  // State to track parent origin for secure messaging
  const [parentOrigin, setParentOrigin] = useState<string>('*');
  
  // Function to send messages to parent window
  const sendMessageToParent = (message: any) => {
    if (embedded && window.parent !== window) {
      try {
        window.parent.postMessage(message, parentOrigin);
      } catch (error) {
        console.error("Error sending message to parent:", error);
      }
    }
  };
  
  // Function to send height updates to parent window if embedded
  const sendHeightToParent = () => {
    if (embedded && containerRef.current) {
      const height = containerRef.current.scrollHeight;
      sendMessageToParent({ 
        type: 'resize',
        height: height
      });
    }
  };

  // Listen for messages from the parent window
  useEffect(() => {
    if (embedded) {
      // Handler for messages from parent window
      const handleMessage = (event: MessageEvent) => {
        // Skip messages from the same window
        if (event.source === window) return;
        
        if (event.data && typeof event.data === 'object') {
          // Handle message types
          switch (event.data.type) {
            case 'init':
              // Store parent origin for secure messaging
              if (event.data.parentOrigin) {
                setParentOrigin(event.data.parentOrigin);
              }
              
              // Send ready confirmation
              sendMessageToParent({
                type: 'ready',
                widgetVersion: '1.0.1'
              });
              
              // Also send initial height
              if (containerRef.current) {
                sendMessageToParent({
                  type: 'resize',
                  height: containerRef.current.scrollHeight
                });
              }
              break;
              
            case 'reset':
              resetForm();
              break;
              
            case 'getState':
              // Send form state back to parent
              sendMessageToParent({
                type: 'state',
                step: currentStep,
                completed: showSuccess
              });
              break;
          }
        }
      };

      // Add message listener
      window.addEventListener('message', handleMessage);
      
      // Initial ready message (in case parent missed our response)
      setTimeout(() => {
        sendMessageToParent({
          type: 'ready',
          widgetVersion: '1.0.1'
        });
      }, 1000);
      
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [embedded, currentStep, showSuccess, parentOrigin]);

  // Update height when content changes
  useEffect(() => {
    if (embedded) {
      // Send initial height
      sendHeightToParent();
      
      // Setup observer to detect content changes
      const resizeObserver = new ResizeObserver(() => {
        sendHeightToParent();
      });
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [embedded, currentStep, showSuccess]);

  // Monitor step changes to update parent
  useEffect(() => {
    if (embedded) {
      sendMessageToParent({
        type: 'stepChange',
        step: currentStep
      });
    }
  }, [embedded, currentStep, parentOrigin]);

  return (
    <div 
      ref={containerRef}
      className={`${embedded ? 'min-h-full' : 'min-h-screen'} flex flex-col`}
    >
      {/* Header */}
      {!embedded && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <img 
                  src="/images/BPlogo.png" 
                  alt="BiggerPockets Logo" 
                  className="h-6"
                />
                <span className="ml-3 text-xl font-semibold">Agent Finder</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-grow ${embedded ? 'py-4' : 'py-8'}`}>
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
                onSuccess={() => {
                  setShowSuccess(true);
                  
                  // Notify parent window on successful submission
                  if (embedded) {
                    sendMessageToParent({ 
                      type: 'formSubmitted',
                      success: true
                    });
                  }
                }}
              />
            </>
          ) : (
            <SuccessMessage onStartOver={resetForm} />
          )}
        </div>
      </main>

      {/* Footer */}
      {!embedded && (
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
      )}
    </div>
  );
}
