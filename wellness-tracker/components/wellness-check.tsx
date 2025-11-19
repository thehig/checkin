'use client';

import { useState } from 'react';
import { AxisSlider } from './axis-slider';

interface WellnessCheckProps {
  onComplete: (values: { mental: number; physical: number; emotional: number }) => void;
  onSkip: () => void;
}

export function WellnessCheck({ onComplete, onSkip }: WellnessCheckProps) {
  const [values, setValues] = useState({
    mental: 2.5,
    physical: 2.5,
    emotional: 2.5,
  });

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">How are you feeling?</h3>
        <p className="text-sm text-gray-600">Optional wellness check-in</p>
      </div>

      <div className="space-y-4">
        <AxisSlider
          name="Mental"
          icon="🧠"
          value={values.mental}
          onChange={(value) => setValues({ ...values, mental: value })}
        />
        
        <AxisSlider
          name="Physical"
          icon="💪"
          value={values.physical}
          onChange={(value) => setValues({ ...values, physical: value })}
        />
        
        <AxisSlider
          name="Emotional"
          icon="❤️"
          value={values.emotional}
          onChange={(value) => setValues({ ...values, emotional: value })}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onSkip}
          className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 active:scale-95 transition-all"
        >
          Skip
        </button>
        <button
          onClick={() => onComplete(values)}
          className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 active:scale-95 transition-all shadow-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
}
