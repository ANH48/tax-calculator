'use client';

import { useState } from 'react';
import MonthlyIncomeInput from '@/components/MonthlyIncomeInput';
import InsuranceBaseSelector from '@/components/InsuranceBaseSelector';
import UnionFeeCheckbox from '@/components/UnionFeeCheckbox';
import DependentsInput from '@/components/DependentsInput';
import { calculateTax, formatVND } from '@/lib/taxCalculator';

export default function YearlyCalculator() {
  const [monthlyIncomes, setMonthlyIncomes] = useState<number[]>(Array(12).fill(0));
  const [yearEndBonus, setYearEndBonus] = useState<number>(0);
  const [insuranceBaseType, setInsuranceBaseType] = useState<'official' | 'custom'>('official');
  const [customInsuranceBase, setCustomInsuranceBase] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(0);
  const [hasUnionFee, setHasUnionFee] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleMonthlyIncomeChange = (month: number, value: number) => {
    const newIncomes = [...monthlyIncomes];
    newIncomes[month - 1] = value;
    setMonthlyIncomes(newIncomes);
    setResult(null);
  };

  const handleYearEndBonusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue) || 0;
    setYearEndBonus(Math.min(numValue, 3_000_000_000));
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
    const totalIncome = monthlyIncomes.reduce((sum, income) => sum + income, 0);
    const totalGross = totalIncome + yearEndBonus;

    if (totalGross <= 0) {
      alert('Vui lòng nhập thu nhập cho ít nhất 1 tháng');
      return;
    }

    // Tính thuế cho từng tháng
    const monthlyResults = monthlyIncomes.map((income) => {
      if (income === 0) return null;
      
      const insuranceBase = insuranceBaseType === 'official' ? income : Math.min(customInsuranceBase, income);
      return calculateTax(income, insuranceBase, dependents, hasUnionFee);
    });

    // Tính thuế cho thưởng năm (nếu có)
    let bonusTax = 0;
    if (yearEndBonus > 0) {
      const bonusInsuranceBase = insuranceBaseType === 'official' ? yearEndBonus : Math.min(customInsuranceBase, yearEndBonus);
      const bonusResult = calculateTax(yearEndBonus, bonusInsuranceBase, 0, hasUnionFee); // Thưởng không có giảm trừ
      bonusTax = bonusResult.tax;
    }

    // Tổng hợp kết quả
    const totalTax = monthlyResults.reduce((sum, result) => sum + (result ? result.tax : 0), 0) + bonusTax;
    const totalInsurance = monthlyResults.reduce((sum, result) => sum + (result ? result.totalInsurance : 0), 0);
    const totalDeductions = totalInsurance + totalTax;
    const netSalary = totalGross - totalDeductions;

    setResult({
      totalGross,
      monthlyIncomes,
      yearEndBonus,
      monthlyResults,
      bonusTax,
      totalTax,
      totalInsurance,
      totalDeductions,
      netSalary
    });
  };

  return (
    <div className="content">
      <section className="input-section">
        <h2 className="section-title">Thông tin thu nhập cả năm</h2>
        
        <div className="monthly-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <MonthlyIncomeInput
              key={month}
              month={month}
              value={monthlyIncomes[month - 1]}
              onChange={handleMonthlyIncomeChange}
            />
          ))}
        </div>

        <div className="input-group" style={{ marginTop: '24px' }}>
          <label className="input-label">
            <span className="icon">🎁</span> Thưởng năm
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              value={yearEndBonus > 0 ? yearEndBonus.toLocaleString('vi-VN') : ''}
              onChange={handleYearEndBonusChange}
              placeholder="0"
              inputMode="numeric"
            />
            <span className="input-suffix">VND</span>
          </div>
        </div>

        <InsuranceBaseSelector
          selectedType={insuranceBaseType}
          customValue={customInsuranceBase}
          grossIncome={Math.max(...monthlyIncomes)}
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
          Tính thuế cả năm
        </button>
      </section>

      {result && (
        <section className="result-section">
          <h2 className="section-title">Kết quả tổng hợp cả năm</h2>
          
          <table className="result-table">
            <tbody>
              <tr>
                <td>Tổng thu nhập cả năm</td>
                <td className="value bold">{formatVND(result.totalGross)}</td>
              </tr>
              <tr className="even-row">
                <td>Tổng bảo hiểm phải đóng</td>
                <td className="value">{formatVND(result.totalInsurance)}</td>
              </tr>
              <tr>
                <td className="bold">Tổng thuế TNCN phải nộp</td>
                <td className="value bold">{formatVND(result.totalTax)}</td>
              </tr>
              <tr className="even-row">
                <td className="bold">Tổng tiền bị trừ</td>
                <td className="value bold">{formatVND(result.totalDeductions)}</td>
              </tr>
              <tr>
                <td className="bold">Tổng lương thực nhận</td>
                <td className="value bold">{formatVND(result.netSalary)}</td>
              </tr>
            </tbody>
          </table>

          <div className="monthly-breakdown" style={{ marginTop: '24px' }}>
            <h3 className="section-title" style={{ fontSize: '16px' }}>Chi tiết theo tháng</h3>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Tháng</th>
                  <th>Thu nhập</th>
                  <th>Bảo hiểm</th>
                  <th>Thuế TNCN</th>
                  <th>Thực nhận</th>
                </tr>
              </thead>
              <tbody>
                {result.monthlyResults.map((monthResult: any, index: number) => {
                  if (!monthResult) return null;
                  const netMonthly = result.monthlyIncomes[index] - monthResult.totalInsurance - monthResult.tax;
                  return (
                    <tr key={index} className={index % 2 === 1 ? 'even-row' : ''}>
                      <td>Tháng {index + 1}</td>
                      <td className="value">{formatVND(result.monthlyIncomes[index])}</td>
                      <td className="value">{formatVND(monthResult.totalInsurance)}</td>
                      <td className="value">{formatVND(monthResult.tax)}</td>
                      <td className="value">{formatVND(netMonthly)}</td>
                    </tr>
                  );
                })}
                {result.yearEndBonus > 0 && (
                  <tr className={result.monthlyResults.filter((r: any) => r).length % 2 === 1 ? 'even-row' : ''}>
                    <td>Thưởng năm</td>
                    <td className="value">{formatVND(result.yearEndBonus)}</td>
                    <td className="value">0</td>
                    <td className="value">{formatVND(result.bonusTax)}</td>
                    <td className="value">{formatVND(result.yearEndBonus - result.bonusTax)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
