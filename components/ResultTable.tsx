'use client';

import { TaxResult, formatVND } from '@/lib/taxCalculator';

interface ResultTableProps {
  data: TaxResult;
}

export default function ResultTable({ data }: ResultTableProps) {
  const totalDeductions = data.totalInsurance + data.tax;
  const netSalary = data.grossIncome - totalDeductions;

  const rows = [
    { label: 'Lương GROSS', value: data.grossIncome, bold: false },
    { label: 'Bảo hiểm xã hội (8%)', value: data.bhxh, bold: false },
    { label: 'Bảo hiểm y tế (1.5%)', value: data.bhyt, bold: false },
    { label: 'Bảo hiểm thất nghiệp (1%)', value: data.bhtn, bold: false },
  ];

  // Chỉ hiển thị đoàn phí nếu có
  if (data.unionFee > 0) {
    rows.push({ label: 'Đoàn phí (1%)', value: data.unionFee, bold: false });
  }

  rows.push(
    { label: 'Thu nhập trước thuế', value: data.preTaxIncome, bold: true },
    { label: 'Giảm trừ gia cảnh bản thân', value: data.personalDeduction, bold: false },
    { label: 'Giảm trừ gia cảnh người phụ thuộc', value: data.dependentDeduction, bold: false },
    { label: 'Thu nhập chịu thuế', value: data.taxableIncome, bold: true },
    { label: 'Thuế thu nhập cá nhân(*)', value: data.tax, bold: true },
    { label: 'Tổng tiền bị trừ', value: totalDeductions, bold: true },
    { label: 'Lương thực nhận', value: netSalary, bold: true }
  );

  return (
    <div className="result-table-container">
      <table className="result-table">
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? 'even-row' : ''}>
              <td className={row.bold ? 'bold' : ''}>{row.label}</td>
              <td className={`value ${row.bold ? 'bold' : ''}`}>{formatVND(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
