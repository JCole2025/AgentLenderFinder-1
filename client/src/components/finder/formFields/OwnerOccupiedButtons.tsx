
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Building2 } from 'lucide-react';

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
    
    if (onNext) {
      console.log('OwnerOccupiedButtons - Setting timeout to auto-advance');
      setTimeout(() => {
        console.log('OwnerOccupiedButtons - Executing onNext()');
        onNext();
      }, 300);
    } else {
      console.log('OwnerOccupiedButtons - Cannot auto-advance: onNext is not available');
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row justify-center gap-6 px-2 sm:px-4 py-4">
      <Button
        type="button"
        variant="outline"
        className={`flex-1 h-auto py-8 px-6 flex flex-col items-center justify-center text-center gap-4 rounded-xl hover:border-primary hover:bg-primary/5 transition-all ${
          isOwnerOccupied === true ? 'border-2 border-primary bg-primary/5' : ''
        }`}
        onClick={() => handleClick(true)}
      >
        <Home className="w-16 h-16 text-gray-600" />
        <div>
          <p className="font-semibold text-lg">Primary Residence</p>
          <p className="text-sm mt-2">I will live in this property</p>
        </div>
      </Button>
      
      <Button
        type="button"
        variant="outline"
        className={`flex-1 h-auto py-8 px-6 flex flex-col items-center justify-center text-center gap-4 rounded-xl hover:border-primary hover:bg-primary/5 transition-all ${
          isOwnerOccupied === false ? 'border-2 border-primary bg-primary/5' : ''
        }`}
        onClick={() => handleClick(false)}
      >
        <Building2 className="w-16 h-16 text-gray-600" />
        <div>
          <p className="font-semibold text-lg">Investment Property</p>
          <p className="text-sm mt-2">I will not live in this property</p>
        </div>
      </Button>
    </div>
  );
}
