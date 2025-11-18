'use client';

import { useState, useEffect } from 'react';

interface GrossIncomeInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function GrossIncomeInput({ value, onChange }: GrossIncomeInputProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === 0 && displayValue === '') return;
    setDisplayValue(value > 0 ? value.toString() : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
    const numValue = parseInt(rawValue) || 0;
    
    // Giới hạn tối đa 3 tỷ
    const limitedValue = Math.min(numValue, 3_000_000_000);
    
    setDisplayValue(rawValue);
    onChange(limitedValue);
  };

  const handleBlur = () => {
    // Format lại khi blur
    setDisplayValue(value > 0 ? value.toString() : '');
  };

  const formatDisplay = (): string => {
    if (!displayValue) return '';
    const num = parseInt(displayValue);
    return num > 0 ? num.toLocaleString('vi-VN') : '';
  };

  return (
    <div className="input-group">
      <label className="input-label">
        <span className="icon">💵</span> Thu nhập (Gross)
      </label>
      <div className="input-wrapper">
        <input
          type="text"
          className="input-field"
          value={formatDisplay()}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          inputMode="numeric"
        />
        <span className="input-suffix">VND</span>
      </div>
    </div>
  );
}
