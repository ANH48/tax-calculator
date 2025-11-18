// Individual Business Tax Calculator - Tính thuế hộ kinh doanh cá thể
// Theo Thông tư 40/2021/TT-BTC

export interface IndividualBusinessTaxResult {
  revenue: number;              // Doanh thu
  vatTax: number;               // Thuế GTGT
  incomeTax: number;            // Thuế TNCN
  totalTax: number;             // Tổng thuế phải nộp
  netIncome: number;            // Thu nhập sau thuế
  vatRate: number;              // Tỷ lệ thuế GTGT (%)
  incomeRate: number;           // Tỷ lệ thuế TNCN (%)
}

export type BusinessCategory =
  | 'retail'                    // Bán buôn, bán lẻ
  | 'retail_exempt'             // Bán hàng không chịu VAT
  | 'service'                   // Dịch vụ
  | 'service_exempt'            // Dịch vụ không chịu VAT
  | 'rental'                    // Cho thuê tài sản
  | 'insurance_agent'           // Đại lý bảo hiểm
  | 'production'                // Sản xuất, gia công
  | 'transport'                 // Vận tải
  | 'food_service'              // Dịch vụ ăn uống
  | 'repair'                    // Sửa chữa
  | 'construction';             // Xây dựng

/**
 * Bảng thuế suất hộ kinh doanh theo ngành nghề
 * Theo Thông tư 40/2021/TT-BTC
 */
export const BUSINESS_TAX_RATES = [
  {
    category: 'retail' as BusinessCategory,
    name: 'Bán buôn, bán lẻ hàng hóa',
    description: 'Bao gồm thưởng, hoa hồng, chiết khấu khi phân phối hàng hóa',
    vatRate: 1,
    incomeRate: 0.5,
  },
  {
    category: 'retail_exempt' as BusinessCategory,
    name: 'Bán hàng không chịu VAT',
    description: 'Hàng hóa không chịu thuế GTGT hoặc thuế suất 0%',
    vatRate: 0,
    incomeRate: 0.5,
  },
  {
    category: 'service' as BusinessCategory,
    name: 'Dịch vụ (Spa, Làm đẹp, Cắt tóc, Massage, Internet...)',
    description: 'May đo, giặt là, cắt tóc, gội đầu, massage, tắm hơi, bi-a, internet, game, karaoke',
    vatRate: 5,
    incomeRate: 2,
  },
  {
    category: 'service_exempt' as BusinessCategory,
    name: 'Dịch vụ không chịu VAT',
    description: 'Dịch vụ y tế, giáo dục, hỗ trợ nông nghiệp',
    vatRate: 0,
    incomeRate: 2,
  },
  {
    category: 'rental' as BusinessCategory,
    name: 'Cho thuê tài sản',
    description: 'Cho thuê nhà, đất, cửa hàng, kho, xưởng, máy móc',
    vatRate: 5,
    incomeRate: 5,
  },
  {
    category: 'insurance_agent' as BusinessCategory,
    name: 'Đại lý bảo hiểm, xổ số',
    description: 'Kinh doanh đại lý bảo hiểm, đại lý xổ số, bán hàng đa cấp',
    vatRate: 0,
    incomeRate: 5,
  },
  {
    category: 'production' as BusinessCategory,
    name: 'Sản xuất, gia công, chế biến',
    description: 'Gia công, sản xuất, chế biến sản phẩm, khai thác khoáng sản',
    vatRate: 3,
    incomeRate: 1.5,
  },
  {
    category: 'transport' as BusinessCategory,
    name: 'Vận tải hàng hóa/hành khách',
    description: 'Vận chuyển hàng hóa, hành khách bằng các phương tiện',
    vatRate: 3,
    incomeRate: 1.5,
  },
  {
    category: 'food_service' as BusinessCategory,
    name: 'Dịch vụ ăn uống',
    description: 'Nhà hàng, quán ăn, cafe, trà sữa',
    vatRate: 3,
    incomeRate: 1.5,
  },
  {
    category: 'repair' as BusinessCategory,
    name: 'Sửa chữa xe, máy móc',
    description: 'Bảo dưỡng, sửa chữa máy móc thiết bị, phương tiện giao thông',
    vatRate: 3,
    incomeRate: 1.5,
  },
  {
    category: 'construction' as BusinessCategory,
    name: 'Xây dựng, lắp đặt',
    description: 'Xây dựng, lắp đặt có bao thầu nguyên vật liệu',
    vatRate: 3,
    incomeRate: 1.5,
  },
];

/**
 * Tính thuế cho hộ kinh doanh cá thể
 * @param revenue - Doanh thu trong kỳ
 * @param category - Loại hình kinh doanh
 * @returns IndividualBusinessTaxResult
 */
export function calculateIndividualBusinessTax(
  revenue: number,
  category: BusinessCategory
): IndividualBusinessTaxResult {
  // Tìm thuế suất theo ngành nghề
  const taxInfo = BUSINESS_TAX_RATES.find(t => t.category === category);
  
  if (!taxInfo) {
    throw new Error('Không tìm thấy thông tin thuế suất cho ngành nghề này');
  }

  const { vatRate, incomeRate } = taxInfo;

  // Tính thuế GTGT
  const vatTax = Math.round(revenue * (vatRate / 100));

  // Tính thuế TNCN
  const incomeTax = Math.round(revenue * (incomeRate / 100));

  // Tổng thuế
  const totalTax = vatTax + incomeTax;

  // Thu nhập sau thuế
  const netIncome = revenue - totalTax;

  return {
    revenue,
    vatTax,
    incomeTax,
    totalTax,
    netIncome,
    vatRate,
    incomeRate,
  };
}

/**
 * Kiểm tra mức miễn thuế
 * @param revenue - Doanh thu năm
 * @param year - Năm tính thuế
 */
export function checkTaxExemption(revenue: number, year: number = 2025): {
  isExempt: boolean;
  reason: string;
} {
  if (year < 2026) {
    // Trước 2026: miễn thuế nếu doanh thu <= 100 triệu/năm
    if (revenue <= 100_000_000) {
      return {
        isExempt: true,
        reason: 'Doanh thu dưới 100 triệu đồng/năm được miễn thuế GTGT và TNCN (trước 2026)',
      };
    }
  } else {
    // Từ 2026: miễn thuế nếu doanh thu < 200 triệu/năm
    if (revenue < 200_000_000) {
      return {
        isExempt: true,
        reason: 'Doanh thu dưới 200 triệu đồng/năm được miễn thuế GTGT và TNCN (từ 2026)',
      };
    }
  }

  return {
    isExempt: false,
    reason: '',
  };
}

/**
 * Format số tiền VND
 */
export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN');
}
