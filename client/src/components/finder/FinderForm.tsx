useEffect(() => {
    const handleSetStep = (event: CustomEvent) => {
      console.log('FinderForm - Received setStep event:', event.detail);
      if (event.detail && typeof event.detail.step === 'number') {
        setCurrentStep(event.detail.step);
      }
    };

    window.addEventListener('agentFinder:setStep', handleSetStep as EventListener);
    return () => window.removeEventListener('agentFinder:setStep', handleSetStep as EventListener);
  }, [setCurrentStep]);