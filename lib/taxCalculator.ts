// Types
export interface TaxBracket {
  label: string;
  limit: number;
  rate: number;
}

export interface TaxBreakdownItem {
  label: string;
  rate: string;
  amount: number;
}

export interface TaxResult {
  grossIncome: number;
  bhxh: number;
  bhyt: number;
  bhtn: number;
  unionFee: number;
  totalInsurance: number;
  preTaxIncome: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxableIncome: number;
  tax: number;
  breakdown: TaxBreakdownItem[];
}

// Constants
const PERSONAL_DEDUCTION = 11_000_000; // 11 triệu/tháng
const DEPENDENT_DEDUCTION = 4_400_000; // 4.4 triệu/người/tháng

const TAX_BRACKETS: TaxBracket[] = [
  { label: 'Đến 5 triệu VND', limit: 5_000_000, rate: 0.05 },
  { label: 'Trên 5 triệu VND đến 10 triệu VND', limit: 10_000_000, rate: 0.10 },
  { label: 'Trên 10 triệu VND đến 18 triệu VND', limit: 18_000_000, rate: 0.15 },
  { label: 'Trên 18 triệu VND đến 32 triệu VND', limit: 32_000_000, rate: 0.20 },
  { label: 'Trên 32 triệu VND đến 52 triệu VND', limit: 52_000_000, rate: 0.25 },
  { label: 'Trên 52 triệu VND đến 80 triệu VND', limit: 80_000_000, rate: 0.30 },
  { label: 'Trên 80 triệu VND', limit: Infinity, rate: 0.35 }
];

/**
 * Calculate progressive tax based on taxable income
 * @param taxableIncome - Thu nhập chịu thuế (sau giảm trừ)
 * @returns Total tax amount
 */
export function calculateProgressiveTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;

  let totalTax = 0;
  let previousLimit = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of TAX_BRACKETS) {
    const bracketRange = bracket.limit - previousLimit;
    const taxableInBracket = Math.min(remainingIncome, bracketRange);
    const taxAmount = taxableInBracket * bracket.rate;
    
    totalTax += taxAmount;
    remainingIncome -= taxableInBracket;
    previousLimit = bracket.limit;
    
    if (remainingIncome <= 0) break;
  }

  return Math.round(totalTax);
}

/**
 * Calculate tax breakdown for each tax bracket
 * @param taxableIncome - Thu nhập chịu thuế
 * @returns Array of breakdown items showing tax for each bracket
 */
export function calculateTaxBreakdown(taxableIncome: number): TaxBreakdownItem[] {
  const breakdown: TaxBreakdownItem[] = [];
  let previousLimit = 0;
  let remainingIncome = Math.max(0, taxableIncome);

  for (const bracket of TAX_BRACKETS) {
    const bracketRange = bracket.limit - previousLimit;
    const taxableInBracket = Math.min(remainingIncome, bracketRange);
    const taxAmount = taxableInBracket * bracket.rate;
    
    breakdown.push({
      label: bracket.label,
      rate: `${bracket.rate * 100}%`,
      amount: Math.round(taxAmount)
    });
    
    remainingIncome -= taxableInBracket;
    previousLimit = bracket.limit;
  }

  return breakdown;
}

/**
 * Calculate all tax-related values
 * @param grossIncome - Thu nhập Gross
 * @param insuranceBase - Mức lương đóng bảo hiểm (có thể khác gross)
 * @param dependents - Số người phụ thuộc
 * @param hasUnionFee - Có đóng đoàn phí hay không
 * @returns Complete tax calculation result
 */
export function calculateTax(
  grossIncome: number,
  insuranceBase: number,
  dependents: number,
  hasUnionFee: boolean = false
): TaxResult {
  // Calculate insurance (only on insuranceBase, not gross)
  const bhxh = Math.round(insuranceBase * 0.08); // 8%
  const bhyt = Math.round(insuranceBase * 0.015); // 1.5%
  const bhtn = Math.round(insuranceBase * 0.01); // 1%
  const unionFee = hasUnionFee ? Math.round(insuranceBase * 0.01) : 0; // 1% nếu có
  const totalInsurance = bhxh + bhyt + bhtn + unionFee;

  // Pre-tax income
  const preTaxIncome = grossIncome - totalInsurance;

  // Deductions
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;

  // Taxable income
  const taxableIncome = Math.max(0, preTaxIncome - personalDeduction - dependentDeduction);

  // Calculate progressive tax
  const tax = calculateProgressiveTax(taxableIncome);

  // Calculate breakdown
  const breakdown = calculateTaxBreakdown(taxableIncome);

  return {
    grossIncome,
    bhxh,
    bhyt,
    bhtn,
    unionFee,
    totalInsurance,
    preTaxIncome,
    personalDeduction,
    dependentDeduction,
    taxableIncome,
    tax,
    breakdown
  };
}

/**
 * Format number to VND currency string
 * @param value - Number to format
 * @returns Formatted string with thousand separators
 */
export function formatVND(value: number): string {
  return value.toLocaleString('vi-VN');
}
