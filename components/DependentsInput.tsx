'use client';

interface DependentsInputProps {
  value: number;
  onChange: (value: number) => void;
}

export default function DependentsInput({ value, onChange }: DependentsInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value) || 0;
    onChange(Math.max(0, numValue));
  };

  return (
    <div className="input-group">
      <label className="input-label">
        <span className="icon">👥</span> Số người phụ thuộc
      </label>
      <div className="input-wrapper">
        <input
          type="number"
          className="input-field"
          value={value}
          onChange={handleChange}
          min="0"
          placeholder="0"
        />
        <span className="input-suffix">Người</span>
      </div>
    </div>
  );
}
