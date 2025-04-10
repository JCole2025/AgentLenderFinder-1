import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MIN_PROPERTY_PRICE } from "@/lib/priceValidator";

interface PriceWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PriceWarningDialog({
  isOpen,
  onClose,
  onConfirm
}: PriceWarningDialogProps) {
  // Format the minimum price for display
  const formattedMinPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(MIN_PROPERTY_PRICE);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Price Requirement</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">
              The minimum price that agents can work with is {formattedMinPrice}.
            </p>
            <p className="mb-4">
              Please enter a higher price value to continue.
            </p>
            <p className="text-sm text-gray-500">
              Our partner agents have a minimum property value requirement of {formattedMinPrice}.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Go Back
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Use {formattedMinPrice}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}