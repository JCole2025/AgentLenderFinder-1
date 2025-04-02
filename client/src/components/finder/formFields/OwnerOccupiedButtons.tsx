import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Building } from 'lucide-react';

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
    onChange(value);
    
    // Auto advance to next step after selection
    if (onNext) {
      setTimeout(onNext, 300); // Small delay for better UX
    }
  };

  return (
    <div className="w-full flex justify-center gap-4">
      <Button
        type="button"
        variant={isOwnerOccupied === true ? "default" : "outline"}
        className={`flex-1 h-auto py-6 px-4 flex flex-col items-center justify-center text-center gap-3 ${
          isOwnerOccupied === true ? 'border-2 border-primary' : ''
        }`}
        onClick={() => handleClick(true)}
      >
        <Home className="h-10 w-10" />
        <div>
          <p className="font-semibold text-lg">Yes</p>
          <p className="text-sm mt-1">I plan to live in this property</p>
        </div>
      </Button>
      
      <Button
        type="button"
        variant={isOwnerOccupied === false ? "default" : "outline"}
        className={`flex-1 h-auto py-6 px-4 flex flex-col items-center justify-center text-center gap-3 ${
          isOwnerOccupied === false ? 'border-2 border-primary' : ''
        }`}
        onClick={() => handleClick(false)}
      >
        <Building className="h-10 w-10" />
        <div>
          <p className="font-semibold text-lg">No</p>
          <p className="text-sm mt-1">This is an investment property</p>
        </div>
      </Button>
    </div>
  );
}