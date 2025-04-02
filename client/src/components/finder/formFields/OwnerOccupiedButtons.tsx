
import React from 'react';
import { Button } from '@/components/ui/button';

interface OwnerOccupiedButtonsProps {
  isOwnerOccupied: boolean;
  onChange: (value: boolean) => void;
  onNext?: () => void;
}

export default function OwnerOccupiedButtons({ 
  isOwnerOccupied, 
  onChange,
  onNext
}: OwnerOccupiedButtonsProps) {
  
  const handleClick = (value: boolean) => {
    console.log('OwnerOccupiedButtons - Button clicked with value:', value);
    onChange(value);
    
    console.log('OwnerOccupiedButtons - onNext available:', !!onNext);
    
    // Auto advance to next step after selection
    if (onNext) {
      console.log('OwnerOccupiedButtons - Setting timeout to auto-advance');
      setTimeout(() => {
        console.log('OwnerOccupiedButtons - Executing onNext()');
        onNext();
      }, 300); // Small delay for better UX
    } else {
      console.log('OwnerOccupiedButtons - Cannot auto-advance: onNext is not available');
    }
  };

  return (
    <div className="w-full flex justify-center gap-4">
      <Button
        type="button"
        variant="outline"
        className={`flex-1 h-auto py-6 px-4 flex flex-col items-center justify-center text-center gap-3 ${
          isOwnerOccupied === true ? 'border-2 border-primary bg-primary/5' : ''
        }`}
        onClick={() => handleClick(true)}
      >
        <div>
          <p className="font-semibold text-lg">Yes</p>
          <p className="text-sm mt-1">I plan to live in this property</p>
        </div>
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className={`flex-1 h-auto py-6 px-4 flex flex-col items-center justify-center text-center gap-3 ${
          isOwnerOccupied === false ? 'border-2 border-primary bg-primary/5' : ''
        }`}
        onClick={() => handleClick(false)}
      >
        <div>
          <p className="font-semibold text-lg">No</p>
          <p className="text-sm mt-1">This is an investment property</p>
        </div>
      </Button>
    </div>
  );
}
