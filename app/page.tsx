import Link from 'next/link';

export default function Home() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <h1 className="landing-title">Công cụ Tính Thuế Miễn Phí</h1>
          <p className="landing-subtitle">
            Hỗ trợ tính toán thuế và các khoản đóng bảo hiểm chính xác, nhanh chóng
          </p>
        </header>

        <div className="tools-grid">
          <Link href="/tax-calculator" className="tool-card">
            <div className="tool-icon">💰</div>
            <h2 className="tool-title">Tính Thuế Thu Nhập Cá Nhân</h2>
            <p className="tool-description">
              Tính thuế TNCN theo tháng hoặc theo năm với công thức mới nhất
            </p>
            <div className="tool-features">
              <span className="feature-tag">✓ Tính theo tháng</span>
              <span className="feature-tag">✓ Tính theo năm</span>
              <span className="feature-tag">✓ Bảo hiểm & đoàn phí</span>
            </div>
            <div className="tool-cta">Bắt đầu tính →</div>
          </Link>

          <Link href="/corporate-tax" className="tool-card">
            <div className="tool-icon">�</div>
            <h2 className="tool-title">Tính Thuế Hộ Kinh Doanh Cá Thể</h2>
            <p className="tool-description">
              Tính thuế VAT và TNCN cho hộ kinh doanh cá thể (spa, làm đẹp, bán lẻ...)
            </p>
            <div className="tool-features">
              <span className="feature-tag">✓ 11 ngành nghề</span>
              <span className="feature-tag">✓ VAT + TNCN</span>
              <span className="feature-tag">✓ Miễn thuế tự động</span>
            </div>
            <div className="tool-cta">Bắt đầu tính →</div>
          </Link>

          <div className="tool-card disabled">
            <div className="tool-icon">🏠</div>
            <h2 className="tool-title">Tính Thuế Bất Động Sản</h2>
            <p className="tool-description">
              Tính thuế mua bán, chuyển nhượng bất động sản
            </p>
            <div className="coming-soon">Sắp ra mắt</div>
          </div>

          <div className="tool-card disabled">
            <div className="tool-icon">📊</div>
            <h2 className="tool-title">Tính Thuế VAT</h2>
            <p className="tool-description">
              Tính thuế giá trị gia tăng cho hóa đơn và giao dịch
            </p>
            <div className="coming-soon">Sắp ra mắt</div>
          </div>
        </div>

        <footer className="landing-footer">
          <p>© 2025 Tax Calculator. Công cụ hỗ trợ tính thuế miễn phí.</p>
        </footer>
      </div>
    </div>
  );
}

