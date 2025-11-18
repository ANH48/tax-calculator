'use client';

import { TaxBreakdownItem, formatVND } from '@/lib/taxCalculator';

interface TaxBreakdownTableProps {
  breakdown: TaxBreakdownItem[];
}

export default function TaxBreakdownTable({ breakdown }: TaxBreakdownTableProps) {
  return (
    <div className="tax-breakdown-container">
      <p className="breakdown-title">(*) Chi tiết thuế thu nhập cá nhân (VND)</p>
      
      <table className="breakdown-table">
        <thead>
          <tr>
            <th>Mức chịu thuế</th>
            <th>Thuế suất</th>
            <th>Tiền nộp</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.map((item, index) => (
            <tr key={index} className={index % 2 === 1 ? 'even-row' : ''}>
              <td>{item.label}</td>
              <td className="center">{item.rate}</td>
              <td className="value">{formatVND(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
