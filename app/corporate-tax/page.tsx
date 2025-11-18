'use client';

import Link from 'next/link';
import IndividualBusinessTaxCalculator from '@/components/IndividualBusinessTaxCalculator';

export default function CorporateTaxPage() {
  return (
    <div className="container">
      <Link href="/" className="back-button">
        ← Quay lại trang chủ
      </Link>
      
      <header className="header">
        <h1>TÍNH THUẾ HỘ KINH DOANH CÁ THỂ</h1>
        <p style={{ color: 'var(--text-gray)', marginTop: '8px', fontSize: '14px' }}>
          Tính thuế VAT và TNCN cho hộ kinh doanh cá thể theo Thông tư 40/2021/TT-BTC
        </p>
      </header>

      <IndividualBusinessTaxCalculator />
    </div>
  );
}
