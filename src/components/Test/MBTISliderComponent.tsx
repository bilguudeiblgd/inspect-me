import React, { useState } from 'react';
import { SLIDER_DIMENSIONS, MBTITestInfo } from './MBTIProperties';
import TextEdgy from '@/components/TextEdgy';

interface Props {
    handleContinueButton: (testInfo: MBTITestInfo) => void;
    testInfo: MBTITestInfo;
    testReceiver: string;
}

const MBTISliderComponent: React.FC<Props> = ({ handleContinueButton, testInfo, testReceiver }) => {
    const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>({});
    const [canContinue, setCanContinue] = useState(false);

    const handleSliderChange = (dimensionName: string, value: number) => {
        const newValues = { ...sliderValues, [dimensionName]: value };
        setSliderValues(newValues);
        
        // Check if all sliders have been set
        const allSet = SLIDER_DIMENSIONS.every(dim => newValues[dim.name] !== undefined);
        setCanContinue(allSet);
    };

    const handleContinue = () => {
        testInfo.sliders = sliderValues;
        handleContinueButton(testInfo);
    };

    const renderSlider = (dimension: typeof SLIDER_DIMENSIONS[0], index: number) => {
        const value = sliderValues[dimension.name]; // No default selection
        
        return (
            <div key={dimension.name}>
                {index > 0 && (
                    <div className="flex items-center justify-center my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                    </div>
                )}
                <div className="rounded-xl">
                    <div className="mb-6">
                        <TextEdgy className="text-white text-lg text-center mb-2">
                            {dimension.question}
                        </TextEdgy>
                      
                    </div>
                
                    <div className="flex justify-center items-center space-x-2 mb-6">
                        <div className="flex items-center space-x-4">
                            {[1, 2, 3, 4, 5].map((point) => {
                                // Border colors for each position
                                const borderColors = [
                                    'border-secondary',     // Point 1 - Left accent  
                                    'border-secondary',     // Point 2 - Left accent
                                    'border-stone-300',     // Point 3 - Neutral gray
                                    'border-accent',        // Point 4 - Right accent
                                    'border-accent'         // Point 5 - Right accent
                                ];
                                
                                // Size classes based on distance from center (point 3)
                                const sizeClasses = [
                                    'w-12 h-12',  // Point 1 - Largest (distance 2 from center)
                                    'w-10 h-10',  // Point 2 - Large (distance 1 from center) 
                                    'w-8 h-8',    // Point 3 - Smallest (center/neutral)
                                    'w-10 h-10',  // Point 4 - Large (distance 1 from center)
                                    'w-12 h-12'   // Point 5 - Largest (distance 2 from center)
                                ];
                                
                                return (
                                    <button
                                        key={point}
                                        onClick={() => handleSliderChange(dimension.name, point)}
                                        className={`${sizeClasses[point - 1]} rounded-full border-2 transition-all duration-200 ${borderColors[point - 1]} ${
                                            value === point 
                                                ? `border-[16px]` 
                                                : `bg-transparent`
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex justify-between items-center w-full">
                            <TextEdgy className="text-secondary font-bold text-xs">{dimension.leftLabel}</TextEdgy>
                            <TextEdgy className="text-accent font-bold text-xs">{dimension.rightLabel}</TextEdgy>
                        </div>
                  
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-lg mx-auto px-4">
            <div className="text-center mb-8">
                <TextEdgy className="text-accent text-2xl font-bold mb-4">
                    MBTI Assessment - Part 1
                </TextEdgy>
            </div>

            <div className="space-y-0">
                {SLIDER_DIMENSIONS.map((dimension, index) => renderSlider(dimension, index))}
            </div>

            <div className="text-center mt-6 mb-12">
                <button 
                    onClick={canContinue ? handleContinue : undefined}
                    disabled={!canContinue}
                    className={`btn px-8 transition-all duration-200 ${
                        canContinue 
                            ? 'btn-secondary hover:btn-secondary' 
                            : 'btn-disabled bg-gray-600 border-gray-600 cursor-not-allowed opacity-50'
                    }`}
                >
                    <TextEdgy className={canContinue ? "text-white" : "text-gray-400"}>
                        Continue to Part 2
                    </TextEdgy>
                </button>
            </div>
        </div>
    );
};

export default MBTISliderComponent; 