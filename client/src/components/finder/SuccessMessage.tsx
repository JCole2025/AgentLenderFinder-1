import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { FinderType } from "@/types/finder";

interface SuccessMessageProps {
  finderType: FinderType;
  onStartOver: () => void;
}

export default function SuccessMessage({ finderType, onStartOver }: SuccessMessageProps) {
  const professionalType = finderType === "agent" ? "real estate agent" : "lender";
  
  return (
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
              <p>We'll match you with the perfect {professionalType} and connect you with them.</p>
            </div>
          </li>
          
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">3</span>
            <div>
              <p>You should expect a text message shortly from 720-902-8552 and an email from concierge@biggerpockets.com</p>
            </div>
          </li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
          <p className="text-sm text-blue-800">
            Our concierge team will immediately text and email you to confirm we're matching you with the 
            right {professionalType}. If you have specific requirements, please reply to their message.
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-6">
        <Button onClick={onStartOver} variant="outline">Start a new search</Button>
      </CardFooter>
    </Card>
  );
}