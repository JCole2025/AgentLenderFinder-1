import { FinderType } from "@/types/finder";

interface FinderToggleProps {
  activeType: FinderType;
  onToggle: (type: FinderType) => void;
}

export default function FinderToggle({ activeType, onToggle }: FinderToggleProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
      <div className="grid grid-cols-2">
        <button 
          className={`py-4 font-medium text-center border-b-2 ${activeType === 'agent' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-neutral-dark hover:text-primary'}`}
          onClick={() => onToggle('agent')}
        >
          Agent Finder
        </button>
        <button 
          className={`py-4 font-medium text-center border-b-2 ${activeType === 'lender' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-neutral-dark hover:text-primary'}`}
          onClick={() => onToggle('lender')}
        >
          Lender Finder
        </button>
      </div>
    </div>
  );
}
