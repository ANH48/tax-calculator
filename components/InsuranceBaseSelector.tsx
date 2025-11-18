'use client';

import { useState, useEffect } from 'react';

interface InsuranceBaseSelectorProps {
  selectedType: 'official' | 'custom';
  customValue: number;
  grossIncome: number;
  onTypeChange: (type: 'official' | 'custom') => void;
  onCustomValueChange: (value: number) => void;
}

export default function InsuranceBaseSelector({
  selectedType,
  customValue,
  grossIncome,
  onTypeChange,
  onCustomValueChange
}: InsuranceBaseSelectorProps) {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (customValue === 0 && displayValue === '') return;
    setDisplayValue(customValue > 0 ? customValue.toString() : '');
  }, [customValue]);

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
    const numValue = parseInt(rawValue) || 0;
    
    // Giới hạn tối đa 3 tỷ
    const limitedValue = Math.min(numValue, 3_000_000_000);
    
    setDisplayValue(rawValue);
    onCustomValueChange(limitedValue);
  };

  const handleBlur = () => {
    // Validate khi blur
    if (customValue > grossIncome && grossIncome > 0) {
      alert('Mức lương đóng bảo hiểm không được lớn hơn thu nhập Gross');
      onCustomValueChange(grossIncome);
      setDisplayValue(grossIncome.toString());
    } else {
      // Format lại khi blur
      setDisplayValue(customValue > 0 ? customValue.toString() : '');
    }
  };

  const formatDisplay = (): string => {
    if (!displayValue) return '';
    const num = parseInt(displayValue);
    return num > 0 ? num.toLocaleString('vi-VN') : '';
  };

  return (
    <div className="input-group">
      <label className="input-label">Mức lương đóng bảo hiểm</label>
      
      <div className="radio-group">
        <label className="radio-option">
          <input
            type="radio"
            name="insurance-base"
            value="official"
            checked={selectedType === 'official'}
            onChange={() => onTypeChange('official')}
          />
          <span className="radio-label">Trên lương chính thức</span>
        </label>
        
        <label className="radio-option">
          <input
            type="radio"
            name="insurance-base"
            value="custom"
            checked={selectedType === 'custom'}
            onChange={() => onTypeChange('custom')}
          />
          <span className="radio-label">Khác</span>
        </label>
      </div>

      {selectedType === 'custom' && (
        <div className={`input-wrapper custom-insurance-input ${customValue > grossIncome && grossIncome > 0 ? 'error' : ''}`}>
          <span className="icon">💵</span>
          <input
            type="text"
            className="input-field"
            value={formatDisplay()}
            onChange={handleCustomChange}
            onBlur={handleBlur}
            placeholder="0"
            inputMode="numeric"
          />
          <span className="input-suffix">VND</span>
        </div>
      )}
    </div>
  );
}
