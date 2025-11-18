'use client';

import { useState } from 'react';
import { 
  calculateIndividualBusinessTax, 
  checkTaxExemption,
  formatVND, 
  BUSINESS_TAX_RATES, 
  type BusinessCategory 
} from '@/lib/individualBusinessTaxCalculator';

export default function IndividualBusinessTaxCalculator() {
  const [revenue, setRevenue] = useState<number>(0);
  const [businessCategory, setBusinessCategory] = useState<BusinessCategory>('retail');
  const [year, setYear] = useState<number>(2025);
  const [result, setResult] = useState<any>(null);

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue) || 0;
    setRevenue(Math.min(numValue, 3_000_000_000)); // Max 3 tỷ
    setResult(null);
  };

  const handleCategoryChange = (category: BusinessCategory) => {
    setBusinessCategory(category);
    setResult(null);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(parseInt(e.target.value));
    setResult(null);
  };

  const handleCalculate = () => {
    if (revenue <= 0) {
      alert('Vui lòng nhập doanh thu');
      return;
    }

    const exemption = checkTaxExemption(revenue, year);
    if (exemption.isExempt) {
      setResult({
        revenue,
        businessCategory,
        isExempt: true,
        exemptionReason: exemption.reason,
        vatTax: 0,
        incomeTax: 0,
        totalTax: 0,
        netIncome: revenue,
        vatRate: 0,
        incomeRate: 0
      });
      return;
    }

    const taxResult = calculateIndividualBusinessTax(revenue, businessCategory);
    setResult({
      ...taxResult,
      businessCategory,
      isExempt: false,
      exemptionReason: null
    });
  };

  return (
    <div className="content">
      <section className="input-section">
        <h2 className="section-title">Thông tin hộ kinh doanh</h2>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">💰</span>
            Tổng doanh thu (VNĐ)
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              className="input-field"
              value={revenue > 0 ? revenue.toLocaleString('vi-VN') : ''}
              onChange={handleRevenueChange}
              placeholder="Nhập doanh thu"
            />
            <span className="input-suffix">₫</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-gray)' }}>
            Tối đa: 3,000,000,000 ₫
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">📅</span>
            Năm tính thuế
          </label>
          <select 
            value={year} 
            onChange={handleYearChange}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
          <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-gray)' }}>
            {year < 2026 ? 'Miễn thuế nếu doanh thu < 100 triệu/năm' : 'Miễn thuế nếu doanh thu < 200 triệu/năm'}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">
            <span className="icon">🏢</span>
            Ngành nghề kinh doanh
          </label>
          <div className="business-type-grid">
            {BUSINESS_TAX_RATES.map((item) => (
              <button
                key={item.category}
                type="button"
                className={`business-type-button ${businessCategory === item.category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(item.category)}
              >
                <div className="business-type-name">{item.name}</div>
                <div className="business-type-rate">
                  VAT {item.vatRate}% + TNCN {item.incomeRate}%
                </div>
              </button>
            ))}
          </div>
        </div>

        <button className="calculate-button" onClick={handleCalculate}>
          Tính thuế
        </button>
      </section>

      {result && (
        <section className="result-section">
          <h2 className="section-title">Kết quả tính thuế</h2>

          {result.isExempt ? (
            <div style={{ 
              padding: '20px', 
              background: '#e8f5e9', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#2e7d32', marginBottom: '8px' }}>
                ✅ Được miễn thuế
              </div>
              <div style={{ fontSize: '14px', color: '#558b2f' }}>
                {result.exemptionReason}
              </div>
            </div>
          ) : null}

          <div className="result-table-container">
            <table className="result-table">
              <tbody>
                <tr>
                  <td>Doanh thu</td>
                  <td className="value">{formatVND(result.revenue)}</td>
                </tr>
                <tr className="even-row">
                  <td>Ngành nghề</td>
                  <td className="value">{BUSINESS_TAX_RATES.find(b => b.category === result.businessCategory)?.name || ''}</td>
                </tr>
                <tr>
                  <td>Thuế VAT ({result.vatRate}%)</td>
                  <td className="value">{formatVND(result.vatTax)}</td>
                </tr>
                <tr className="even-row">
                  <td>Thuế TNCN ({result.incomeRate}%)</td>
                  <td className="value">{formatVND(result.incomeTax)}</td>
                </tr>
                <tr>
                  <td className="bold">Tổng thuế phải nộp</td>
                  <td className="value bold" style={{ color: 'var(--primary-color)' }}>
                    {formatVND(result.totalTax)}
                  </td>
                </tr>
                <tr className="even-row">
                  <td className="bold">Thu nhập ròng</td>
                  <td className="value bold" style={{ color: '#1976d2' }}>
                    {formatVND(result.netIncome)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            background: '#fff3e0', 
            borderRadius: '8px',
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', color: '#e65100' }}>
              📌 Lưu ý:
            </div>
            <ul style={{ marginLeft: '20px', color: '#ef6c00' }}>
              <li>Mức thuế áp dụng theo Thông tư 40/2021/TT-BTC</li>
              <li>Thuế VAT và TNCN được tính trên tổng doanh thu</li>
              <li>Năm 2024-2025: Miễn thuế nếu doanh thu &lt; 100 triệu/năm</li>
              <li>Từ năm 2026: Miễn thuế nếu doanh thu &lt; 200 triệu/năm</li>
              <li>Kết quả chỉ mang tính chất tham khảo</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
