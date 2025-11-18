'use client';

import { useState } from 'react';
import Link from 'next/link';
import MonthlyCalculator from '@/components/MonthlyCalculator';
import YearlyCalculator from '@/components/YearlyCalculator';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="container">
      <Link href="/" className="back-button">
        ← Quay lại trang chủ
      </Link>
      
      <header className="header">
        <h1>TÍNH THUẾ THU NHẬP CÁ NHÂN (TNCN)</h1>
      </header>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
          onClick={() => setActiveTab('monthly')}
        >
          Tính theo tháng
        </button>
        <button
          className={`tab-button ${activeTab === 'yearly' ? 'active' : ''}`}
          onClick={() => setActiveTab('yearly')}
        >
          Tính theo năm
        </button>
      </div>

      {activeTab === 'monthly' ? <MonthlyCalculator /> : <YearlyCalculator />}
    </div>
  );
}
