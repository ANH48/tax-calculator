'use client';

interface UnionFeeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function UnionFeeCheckbox({ checked, onChange }: UnionFeeCheckboxProps) {
  return (
    <div className="checkbox-container">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="checkbox-input"
        />
        Có đóng đoàn phí (1% trên lương đóng bảo hiểm)
      </label>
    </div>
  );
}
