'use client';

import { useState, useEffect } from 'react';

interface MonthlyIncomeInputProps {
  month: number;
  value: number;
  onChange: (month: number, value: number) => void;
}

export default function MonthlyIncomeInput({ month, value, onChange }: MonthlyIncomeInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === 0 && displayValue === '') return;
    setDisplayValue(value > 0 ? value.toString() : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue) || 0;
    const limitedValue = Math.min(numValue, 3_000_000_000);
    
    setDisplayValue(rawValue);
    onChange(month, limitedValue);
  };

  const handleBlur = () => {
    setDisplayValue(value > 0 ? value.toString() : '');
  };

  const formatDisplay = (): string => {
    if (!displayValue) return '';
    const num = parseInt(displayValue);
    return num > 0 ? num.toLocaleString('vi-VN') : '';
  };

  return (
    <div className="monthly-input-item">
      <label className="monthly-label">Tháng {month}</label>
      <div className="input-wrapper-small">
        <input
          type="text"
          className="input-field"
          value={formatDisplay()}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          inputMode="numeric"
        />
        <span className="input-suffix-small">VND</span>
      </div>
    </div>
  );
}
