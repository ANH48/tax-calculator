// Corporate Tax Calculator - Tính thuế thu nhập doanh nghiệp (TNDN)
// Theo Luật Thuế TNDN Việt Nam

export interface CorporateTaxResult {
  totalRevenue: number;          // Tổng doanh thu
  deductibleExpenses: number;    // Chi phí được trừ
  taxableIncome: number;         // Thu nhập chịu thuế (Doanh thu - Chi phí)
  taxRate: number;               // Thuế suất (%)
  corporateTax: number;          // Thuế TNDN phải nộp
  netIncome: number;             // Thu nhập sau thuế
}

export type BusinessType = 
  | 'standard'           // 20% - Tiêu chuẩn
  | 'small'              // 17% - SME ưu đãi
  | 'service'            // 20% - Dịch vụ (spa, làm đẹp, sửa chữa)
  | 'oil_gas'            // 32-50% - Dầu khí
  | 'mining'             // 40-50% - Khai khoáng
  | 'exploration'        // 32-40% - Thăm dò
  | 'prospecting'        // 40-50% - Tìm kiếm
  | 'education'          // 10% - Giáo dục
  | 'healthcare'         // 10% - Y tế
  | 'culture'            // 10% - Văn hóa, thể thao
  | 'high_tech'          // 10% - Công nghệ cao
  | 'software'           // 10% - Phần mềm
  | 'agriculture'        // 15% - Nông nghiệp
  | 'processing'         // 15% - Chế biến nông sản
  | 'science'            // 10% - Nghiên cứu khoa học
  | 'environment';       // 10% - Bảo vệ môi trường

/**
 * Thông tin ngành nghề và thuế suất
 */
export const BUSINESS_SECTORS = [
  { 
    type: 'standard' as BusinessType, 
    name: 'Doanh nghiệp thông thường', 
    rate: 20,
    description: 'Thuế suất tiêu chuẩn cho các doanh nghiệp'
  },
  { 
    type: 'small' as BusinessType, 
    name: 'Doanh nghiệp nhỏ và vừa (SME)', 
    rate: 17,
    description: 'Ưu đãi cho DN nhỏ và vừa đủ điều kiện'
  },
  {
    type: 'service' as BusinessType,
    name: 'Dịch vụ (Spa, Làm đẹp, Sửa chữa)',
    rate: 20,
    description: 'Kinh doanh dịch vụ spa, thẩm mỹ, sửa chữa nhỏ'
  },
  {
    type: 'education' as BusinessType,
    name: 'Giáo dục - Dạy nghề',
    rate: 10,
    description: 'Hoạt động giáo dục, dạy nghề'
  },
  {
    type: 'healthcare' as BusinessType,
    name: 'Y tế',
    rate: 10,
    description: 'Dịch vụ y tế, chăm sóc sức khỏe'
  },
  {
    type: 'high_tech' as BusinessType,
    name: 'Doanh nghiệp công nghệ cao',
    rate: 10,
    description: 'Sản xuất sản phẩm công nghệ cao'
  },
  {
    type: 'software' as BusinessType,
    name: 'Phần mềm - CNTT',
    rate: 10,
    description: 'Phát triển phần mềm, công nghệ thông tin'
  },
  {
    type: 'science' as BusinessType,
    name: 'Nghiên cứu khoa học',
    rate: 10,
    description: 'Nghiên cứu và phát triển khoa học công nghệ'
  },
  {
    type: 'culture' as BusinessType,
    name: 'Văn hóa - Thể thao',
    rate: 10,
    description: 'Hoạt động văn hóa, nghệ thuật, thể thao'
  },
  {
    type: 'environment' as BusinessType,
    name: 'Bảo vệ môi trường',
    rate: 10,
    description: 'Xử lý chất thải, tái chế, bảo vệ môi trường'
  },
  {
    type: 'agriculture' as BusinessType,
    name: 'Nông nghiệp',
    rate: 15,
    description: 'Sản xuất nông nghiệp, lâm nghiệp, thủy sản'
  },
  {
    type: 'processing' as BusinessType,
    name: 'Chế biến nông sản',
    rate: 15,
    description: 'Chế biến, bảo quản nông lâm thủy sản'
  },
  {
    type: 'exploration' as BusinessType,
    name: 'Thăm dò dầu khí',
    rate: 32,
    description: 'Hoạt động thăm dò dầu khí (32-40%)'
  },
  {
    type: 'oil_gas' as BusinessType,
    name: 'Khai thác dầu khí',
    rate: 40,
    description: 'Khai thác dầu khí (32-50%)'
  },
  {
    type: 'mining' as BusinessType,
    name: 'Khai khoáng',
    rate: 40,
    description: 'Khai thác tài nguyên khoáng sản (40-50%)'
  },
  {
    type: 'prospecting' as BusinessType,
    name: 'Tìm kiếm tài nguyên',
    rate: 40,
    description: 'Tìm kiếm, thăm dò tài nguyên (40-50%)'
  },
];

/**
 * Tính thuế thu nhập doanh nghiệp
 * @param totalRevenue - Tổng doanh thu trong kỳ
 * @param deductibleExpenses - Tổng chi phí được trừ hợp lý
 * @param businessType - Loại hình doanh nghiệp/ngành nghề
 * @returns CorporateTaxResult
 */
export function calculateCorporateTax(
  totalRevenue: number,
  deductibleExpenses: number,
  businessType: BusinessType = 'standard'
): CorporateTaxResult {
  // Thu nhập chịu thuế = Doanh thu - Chi phí được trừ
  const taxableIncome = Math.max(0, totalRevenue - deductibleExpenses);

  // Tìm thuế suất theo ngành nghề
  const sector = BUSINESS_SECTORS.find(s => s.type === businessType);
  const taxRate = sector ? sector.rate : 20; // Default 20% nếu không tìm thấy

  // Tính thuế TNDN
  const corporateTax = Math.round(taxableIncome * (taxRate / 100));

  // Thu nhập sau thuế
  const netIncome = taxableIncome - corporateTax;

  return {
    totalRevenue,
    deductibleExpenses,
    taxableIncome,
    taxRate,
    corporateTax,
    netIncome,
  };
}

/**
 * Format số tiền VND
 */
export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN');
}

/**
 * Kiểm tra điều kiện doanh nghiệp nhỏ và vừa
 * Theo Nghị định 39/2018/NĐ-CP
 */
export function isSmallMediumEnterprise(
  totalRevenue: number,
  employees: number,
  sector: 'agriculture' | 'industry' | 'service'
): boolean {
  const revenueInBillion = totalRevenue / 1_000_000_000;
  
  switch (sector) {
    case 'agriculture':
      // Nông nghiệp: Doanh thu <= 50 tỷ, số lao động <= 200
      return revenueInBillion <= 50 && employees <= 200;
    case 'industry':
      // Công nghiệp: Doanh thu <= 200 tỷ, số lao động <= 200
      return revenueInBillion <= 200 && employees <= 200;
    case 'service':
      // Thương mại dịch vụ: Doanh thu <= 100 tỷ, số lao động <= 50
      return revenueInBillion <= 100 && employees <= 50;
    default:
      return false;
  }
}

/**
 * Gợi ý chi phí được trừ hợp lý
 */
export const DEDUCTIBLE_EXPENSE_CATEGORIES = [
  { id: 'cogs', name: 'Giá vốn hàng bán', description: 'Chi phí mua hàng, nguyên vật liệu' },
  { id: 'salary', name: 'Chi phí nhân viên', description: 'Lương, BHXH, BHYT, BHTN' },
  { id: 'depreciation', name: 'Khấu hao tài sản', description: 'Khấu hao TSCĐ, TSBĐ' },
  { id: 'operating', name: 'Chi phí hoạt động', description: 'Điện, nước, văn phòng phẩm' },
  { id: 'marketing', name: 'Chi phí marketing', description: 'Quảng cáo, khuyến mãi' },
  { id: 'interest', name: 'Lãi vay', description: 'Chi phí lãi vay (có giới hạn)' },
  { id: 'other', name: 'Chi phí khác', description: 'Các chi phí hợp lý khác' },
];

/**
 * Lưu ý về chi phí không được trừ
 */
export const NON_DEDUCTIBLE_NOTES = [
  'Chi phí không hợp lý, không có chứng từ hợp lệ',
  'Chi phí phạt vi phạm hành chính, chậm nộp thuế',
  'Chi phí trích trước bảo hành sản phẩm vượt quy định',
  'Lãi vay vượt định mức (lãi vay/VCSH > 1.5)',
  'Chi phí từ thiện vượt giới hạn (chưa quá 10% thu nhập)',
  'Chi phí không liên quan đến hoạt động kinh doanh',
];
