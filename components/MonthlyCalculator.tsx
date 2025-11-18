'use client';

import { useState } from 'react';
import GrossIncomeInput from '@/components/GrossIncomeInput';
import InsuranceBaseSelector from '@/components/InsuranceBaseSelector';
import DependentsInput from '@/components/DependentsInput';
import UnionFeeCheckbox from '@/components/UnionFeeCheckbox';
import ResultTable from '@/components/ResultTable';
import TaxBreakdownTable from '@/components/TaxBreakdownTable';
import { calculateTax, TaxResult } from '@/lib/taxCalculator';

export default function MonthlyCalculator() {
  const [grossIncome, setGrossIncome] = useState<number>(0);
  const [insuranceBaseType, setInsuranceBaseType] = useState<'official' | 'custom'>('official');
  const [customInsuranceBase, setCustomInsuranceBase] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(0);
  const [hasUnionFee, setHasUnionFee] = useState<boolean>(false);
  const [result, setResult] = useState<TaxResult | null>(null);

  const handleGrossIncomeChange = (value: number) => {
    setGrossIncome(value);
    setResult(null);
  };

  const handleInsuranceBaseTypeChange = (type: 'official' | 'custom') => {
    setInsuranceBaseType(type);
    setResult(null);
  };

  const handleCustomInsuranceBaseChange = (value: number) => {
    setCustomInsuranceBase(value);
    setResult(null);
  };

  const handleDependentsChange = (value: number) => {
    setDependents(value);
    setResult(null);
  };

  const handleUnionFeeChange = (checked: boolean) => {
    setHasUnionFee(checked);
    setResult(null);
  };

  const handleCalculate = () => {
    if (grossIncome <= 0) {
      alert('Vui lòng nhập thu nhập Gross hợp lệ');
      return;
    }

    const insuranceBase = insuranceBaseType === 'official' ? grossIncome : customInsuranceBase;

    if (insuranceBase <= 0) {
      alert('Vui lòng nhập mức lương đóng bảo hiểm hợp lệ');
      return;
    }

    if (insuranceBase > grossIncome) {
      alert('Mức lương đóng bảo hiểm không được lớn hơn thu nhập Gross');
      return;
    }

    const taxResult = calculateTax(grossIncome, insuranceBase, dependents, hasUnionFee);
    setResult(taxResult);
  };

  return (
    <div className="content">
      <section className="input-section">
        <h2 className="section-title">Thông tin đầu vào</h2>
        
        <GrossIncomeInput 
          value={grossIncome}
          onChange={handleGrossIncomeChange}
        />

        <InsuranceBaseSelector
          selectedType={insuranceBaseType}
          customValue={customInsuranceBase}
          grossIncome={grossIncome}
          onTypeChange={handleInsuranceBaseTypeChange}
          onCustomValueChange={handleCustomInsuranceBaseChange}
        />

        <UnionFeeCheckbox
          checked={hasUnionFee}
          onChange={handleUnionFeeChange}
        />

        <DependentsInput
          value={dependents}
          onChange={handleDependentsChange}
        />

        <button className="calculate-button" onClick={handleCalculate}>
          Tính thuế TNCN
        </button>
      </section>

      {result && (
        <section className="result-section">
          <h2 className="section-title">Kết quả</h2>
          
          <ResultTable data={result} />
          
          <TaxBreakdownTable breakdown={result.breakdown} />
        </section>
      )}
    </div>
  );
}
