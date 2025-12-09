import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = '' }: PasswordStrengthProps) {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  
  // Calculate score 0-4
  const checks = [hasMinLength, hasNumber, hasSpecial, hasUpper];
  const score = checks.filter(Boolean).length;
  
  let label = 'Weak';
  let colorClass = 'bg-red-500';
  
  if (score === 0) {
      // default
  } else if (score < 3) {
      label = 'Weak';
      colorClass = 'bg-red-500';
  } else if (score === 3) {
      label = 'Fair';
      colorClass = 'bg-yellow-500';
  } else {
      label = 'Strong';
      colorClass = 'bg-green-500';
  }

  return (
    <div className="space-y-1 mt-1">
      <div className="flex gap-1 h-1">
        {[1, 2, 3, 4].map((level) => (
            <div
            key={level}
            className={cn(
                "h-full w-full rounded-full transition-colors duration-300",
                score >= level ? colorClass : "bg-gray-200"
            )}
            />
        ))}
      </div>
      <p className="text-[10px] text-gray-500 text-right">
        Strength: <span className={cn("font-medium", 
             score < 3 ? "text-red-500" : score === 3 ? "text-yellow-600" : "text-green-600"
        )}>{label}</span>
      </p>
    </div>
  );
}
