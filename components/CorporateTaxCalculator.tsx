'use client';

import { useState } from 'react';
import { calculateCorporateTax, formatVND, BUSINESS_SECTORS, type BusinessType } from '@/lib/corporateTaxCalculator';

export default function CorporateTaxCalculator() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [deductibleExpenses, setDeductibleExpenses] = useState<number>(0);
  const [businessType, setBusinessType] = useState<BusinessType>('standard');
  const [result, setResult] = useState<any>(null);

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue) || 0;
    setTotalRevenue(Math.min(numValue, 1_000_000_000_000)); // Max 1,000 tỷ
    setResult(null);
  };

  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue) || 0;
    setDeductibleExpenses(Math.min(numValue, 1_000_000_000_000)); // Max 1,000 tỷ
    setResult(null);
  };

  const handleBusinessTypeChange = (type: BusinessType) => {
    setBusinessType(type);
    setResult(null);
  };

  const handleCalculate = () => {
    if (totalRevenue <= 0) {
      alert('Vui lòng nhập tổng doanh thu');
      return;
    }

    if (deductibleExpenses < 0) {
      alert('Chi phí không được âm');
      return;
    }

    if (deductibleExpenses > totalRevenue) {
      alert('Chi phí không thể vượt quá doanh thu');
      return;
    }

    const taxResult = calculateCorporateTax(totalRevenue, deductibleExpenses, businessType);
    setResult(taxResult);
  };

  return (
    <div className="input-section">
      <h2 className="section-title">Thông tin doanh nghiệp</h2>

      {/* Tổng doanh thu */}
      <div className="input-group">
        <label className="input-label">
          <span className="icon">💰</span> Tổng doanh thu trong kỳ
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            value={totalRevenue > 0 ? totalRevenue.toLocaleString('vi-VN') : ''}
            onChange={handleRevenueChange}
            placeholder="0"
            inputMode="numeric"
          />
          <span className="input-suffix">VND</span>
        </div>
      </div>

      {/* Chi phí được trừ */}
      <div className="input-group">
        <label className="input-label">
          <span className="icon">📊</span> Tổng chi phí được trừ
        </label>
        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            value={deductibleExpenses > 0 ? deductibleExpenses.toLocaleString('vi-VN') : ''}
            onChange={handleExpensesChange}
            placeholder="0"
            inputMode="numeric"
          />
          <span className="input-suffix">VND</span>
        </div>
        <p className="input-hint">
          Bao gồm: Giá vốn, lương, khấu hao, chi phí hoạt động, v.v.
        </p>
      </div>

      {/* Loại hình doanh nghiệp */}
      <div className="input-group">
        <label className="input-label">
          <span className="icon">🏢</span> Ngành nghề kinh doanh
        </label>
        <div className="business-type-grid">
          {BUSINESS_SECTORS.map((sector) => (
            <label key={sector.type} className={`business-type-card ${businessType === sector.type ? 'active' : ''}`}>
              <input
                type="radio"
                name="businessType"
                value={sector.type}
                checked={businessType === sector.type}
                onChange={() => handleBusinessTypeChange(sector.type)}
                style={{ display: 'none' }}
              />
              <div className="business-type-header">
                <strong>{sector.name}</strong>
                <span className="tax-rate-badge">{sector.rate}%</span>
              </div>
              <div className="business-type-description">{sector.description}</div>
            </label>
          ))}
        </div>
      </div>

      {/* Button tính thuế */}
      <button className="calculate-button" onClick={handleCalculate}>
        Tính thuế TNDN
      </button>

      {/* Hiển thị kết quả */}
      {result && (
        <div className="result-section" style={{ marginTop: '32px' }}>
          <h2 className="section-title">Kết quả tính thuế</h2>

          <div className="result-table-container">
            <table className="result-table">
              <tbody>
                <tr>
                  <td>Tổng doanh thu</td>
                  <td className="value">{formatVND(result.totalRevenue)} VND</td>
                </tr>
                <tr className="even-row">
                  <td>Chi phí được trừ</td>
                  <td className="value">{formatVND(result.deductibleExpenses)} VND</td>
                </tr>
                <tr>
                  <td className="bold">Thu nhập chịu thuế</td>
                  <td className="value bold">{formatVND(result.taxableIncome)} VND</td>
                </tr>
                <tr className="even-row">
                  <td>Thuế suất áp dụng</td>
                  <td className="value">{result.taxRate}%</td>
                </tr>
                <tr>
                  <td className="bold">Thuế TNDN phải nộp</td>
                  <td className="value bold" style={{ color: 'var(--primary-color)' }}>
                    {formatVND(result.corporateTax)} VND
                  </td>
                </tr>
                <tr className="even-row">
                  <td className="bold">Thu nhập sau thuế</td>
                  <td className="value bold">{formatVND(result.netIncome)} VND</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ghi chú */}
          <div className="tax-notes">
            <h3 className="breakdown-title">Lưu ý:</h3>
            <ul className="notes-list">
              <li>Thu nhập chịu thuế = Doanh thu - Chi phí được trừ hợp lý</li>
              <li>Chi phí phải có chứng từ hợp lệ và liên quan đến hoạt động kinh doanh</li>
              <li>Thuế suất áp dụng theo ngành nghề và loại hình doanh nghiệp</li>
              {(businessType === 'small') && (
                <li><strong>Ưu đãi SME:</strong> Doanh nghiệp nhỏ và vừa được giảm thuế còn 17%</li>
              )}
              {(['education', 'healthcare', 'high_tech', 'software', 'science', 'culture', 'environment'].includes(businessType)) && (
                <li><strong>Ưu đãi 10%:</strong> Ngành ưu tiên phát triển được hưởng thuế suất ưu đãi</li>
              )}
              {(businessType === 'agriculture' || businessType === 'processing') && (
                <li><strong>Ưu đãi 15%:</strong> Khuyến khích đầu tư vào nông nghiệp, chế biến nông sản</li>
              )}
              {(['oil_gas', 'mining', 'exploration', 'prospecting'].includes(businessType)) && (
                <li><strong>Thuế cao:</strong> Khai thác tài nguyên thiên nhiên chịu thuế cao (32-50%)</li>
              )}
              <li>Khai thuế theo quý hoặc năm tùy quy mô doanh nghiệp</li>
              <li>Kết quả chỉ mang tính chất tham khảo</li>
            </ul>
          </div>
        </div>
      )}

      {/* Hướng dẫn chi phí được trừ */}
      <div className="expense-guide" style={{ marginTop: '32px' }}>
        <h3 className="section-title" style={{ fontSize: '16px' }}>
          📋 Chi phí được trừ hợp lý
        </h3>
        <div className="guide-grid">
          <div className="guide-item">
            <strong>✓ Giá vốn hàng bán:</strong> Chi phí mua hàng, nguyên vật liệu
          </div>
          <div className="guide-item">
            <strong>✓ Chi phí nhân viên:</strong> Lương, BHXH, BHYT, BHTN
          </div>
          <div className="guide-item">
            <strong>✓ Khấu hao:</strong> Khấu hao tài sản cố định
          </div>
          <div className="guide-item">
            <strong>✓ Chi phí hoạt động:</strong> Điện, nước, văn phòng phẩm
          </div>
          <div className="guide-item">
            <strong>✓ Marketing:</strong> Quảng cáo, khuyến mãi
          </div>
          <div className="guide-item">
            <strong>✓ Lãi vay:</strong> Trong giới hạn cho phép
          </div>
        </div>

        <h3 className="section-title" style={{ fontSize: '16px', marginTop: '24px' }}>
          ❌ Chi phí không được trừ
        </h3>
        <ul className="notes-list">
          <li>Chi phí không có chứng từ hợp lệ</li>
          <li>Phạt vi phạm hành chính, chậm nộp thuế</li>
          <li>Lãi vay vượt định mức (Lãi vay/VCSH {'>'} 1.5)</li>
          <li>Chi phí từ thiện vượt 10% thu nhập chịu thuế</li>
          <li>Chi phí không liên quan hoạt động kinh doanh</li>
        </ul>
      </div>
    </div>
  );
}
