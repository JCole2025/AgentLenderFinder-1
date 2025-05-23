
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";

interface SuccessMessageProps {
  onStartOver: () => void;
}

export default function SuccessMessage({ onStartOver }: SuccessMessageProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const professionalType = "real estate agent";
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Stop confetti after 5 seconds
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="bg-primary/5 border-b pb-8">
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-center text-2xl">Submission Complete!</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 px-8">
          <h2 className="text-xl font-bold mb-4">What's next?</h2>
          
          <ul className="space-y-4 mb-6">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">1</span>
              <div>
                <p>A trained BiggerPockets concierge is searching our network of licensed {professionalType}s.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">2</span>
              <div>
                <p>We'll hand match you with up to 2 investor friendly {professionalType}s and connect you with them.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">3</span>
              <div>
                <p>You should expect a text message shortly from 720-902-8552 and an email from concierge@biggerpockets.com</p>
              </div>
            </li>
          </ul>
        </CardContent>
        
        <CardFooter className="flex justify-center border-t pt-6">
          <Button onClick={onStartOver} variant="outline">Start a new search</Button>
        </CardFooter>
      </Card>
    </>
  );
}
