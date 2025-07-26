
'use client';

import { useState } from 'react';

export function PasswordStrength({ password }: { password?: string }) {
  const [strength, setStrength] = useState(0);

  const getStrength = (password: string) => {
    let score = 0;
    if (!password) return score;

    // award every unique letter that is not a number
    const letters = new Set(password.match(/[a-zA-Z]/g));
    score += letters.size * 0.5;

    // award every unique number
    const numbers = new Set(password.match(/[0-9]/g));
    score += numbers.size * 0.5;

    // award every unique symbol
    const symbols = new Set(password.match(/[^a-zA-Z0-9]/g));
    score += symbols.size * 0.5;

    const variations = {
      digits: /\d/.test(password),
      lower: /[a-z]/.test(password),
      upper: /[A-Z]/.test(password),
      nonWords: /\W/.test(password),
    };

    let variationCount = 0;
    for (const check in variations) {
      variationCount += variations[check as keyof typeof variations] ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return Math.min(100, Math.trunc(score));
  };

  const strengthPercentage = getStrength(password || '');

  const getStrengthColor = () => {
    if (strengthPercentage < 25) return 'bg-red-500';
    if (strengthPercentage < 50) return 'bg-orange-500';
    if (strengthPercentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-full h-2 bg-muted rounded-full">
        <div
          className={`h-full rounded-full ${getStrengthColor()}`}
          style={{ width: `${strengthPercentage}%` }}
        ></div>
      </div>
      <span className="text-xs text-muted-foreground">
        {strengthPercentage}% 
      </span>
    </div>
  );
}
