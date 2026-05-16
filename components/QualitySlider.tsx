'use client';

interface QualitySliderProps {
  quality: number;
  onChange: (quality: number) => void;
  disabled?: boolean;
}

export default function QualitySlider({ quality, onChange, disabled }: QualitySliderProps) {
  return (
    <div className="flex items-center gap-4 w-full max-w-md mx-auto">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        压缩质量
      </label>
      <input
        type="range"
        min={1}
        max={100}
        value={quality}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
      />
      <span className="text-sm font-semibold text-blue-600 min-w-[3rem] text-right">
        {quality}%
      </span>
    </div>
  );
}
