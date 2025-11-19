'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface AxisSliderProps {
  name: string;
  icon?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function AxisSlider({
  name,
  icon,
  value,
  onChange,
  min = 0,
  max = 5,
  disabled = false,
}: AxisSliderProps) {
  const getEmoji = () => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage <= 20) return '😔';
    if (percentage <= 40) return '😐';
    if (percentage <= 60) return '🙂';
    if (percentage <= 80) return '😊';
    return '😄';
  };

  return (
    <div className="space-y-2 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <span className="font-medium text-gray-700">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getEmoji()}</span>
          <span className="text-lg font-semibold text-gray-900 min-w-[3rem] text-right">
            {value.toFixed(1)}
          </span>
        </div>
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={0.5}
        disabled={disabled}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
