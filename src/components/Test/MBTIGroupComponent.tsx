import React, { useState } from 'react';
import { VALUE_GROUPS, MBTITestInfo, ValueGroup } from './MBTIProperties';
import TextEdgy from '@/components/TextEdgy';
import Loading from '@/components/Loading';

interface Props {
    handleContinueButton: (testInfo: MBTITestInfo) => void;
    testInfo: MBTITestInfo;
    testReceiver: string;
}

const MBTIGroupComponent: React.FC<Props> = ({ handleContinueButton, testInfo, testReceiver }) => {
    const [currentRound, setCurrentRound] = useState(0);
    const [remainingGroups, setRemainingGroups] = useState<ValueGroup[]>([...VALUE_GROUPS]);
    const [selectedGroups, setSelectedGroups] = useState<ValueGroup[]>([]);
    const [loading, setLoading] = useState(false);

    const rounds = [
        { groups: [remainingGroups[0], remainingGroups[1]], title: "Round 1: Choose the group that better fits" },
        { groups: [remainingGroups[2], remainingGroups[3]], title: "Round 2: Choose the group that better fits" },
    ];

    const handleGroupSelect = (selectedGroup: ValueGroup) => {
        const newSelected = [...selectedGroups, selectedGroup];
        setSelectedGroups(newSelected);

        if (currentRound === 0) {
            // First round complete, move to second round
            setCurrentRound(1);
        } else if (currentRound === 1) {
            // Second round complete, now move to final round
            setCurrentRound(2);
        } else {
            // Final round complete - we have the ultimate winner
            setLoading(true);
            setTimeout(() => {
                testInfo.groups = [selectedGroup.name]; // Only the final winner
                handleContinueButton(testInfo);
            }, 1000);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Loading />
                <TextEdgy className="text-accent mt-4">Processing results...</TextEdgy>
            </div>
        );
    }

    // For the final round (round 2), we show the two selected groups
    const currentGroups = currentRound === 2 ? selectedGroups : rounds[currentRound]?.groups || [];

    return (
        <div className="h-screen flex flex-col px-4 max-w-md mx-auto">
            {/* Compact Header */}
            <div className="text-center pt-6 pb-4">
                <TextEdgy className="text-white text-sm mb-3">
                    {currentRound === 2 ? "Final Round: Choose the ultimate value group" : "Which values do they fit into most?"}
                </TextEdgy>
                <TextEdgy className="text-primary text-xs">
                    {currentRound === 2 ? "Final Round" : `Round ${currentRound + 1} of 3`}
                    {selectedGroups.length > 0 && ` | Selected: ${selectedGroups.map(g => g.name).join(', ')}`}
                </TextEdgy>
            </div>

            {/* Mobile-Optimized Group Cards */}
            <div className="flex-1 flex flex-col space-y-4 pb-6">
                {currentGroups.map((group, index) => (
                    <button
                        key={group.name}
                        onClick={() => handleGroupSelect(group)}
                        className="p-4 rounded-xl bg-secondary transition-colors duration-200 text-left active:bg-accent/30"
                    >
                        <div className="mb-3">
                            <TextEdgy className="text-white text-xl font-bold mb-1">
                                {group.name}
                            </TextEdgy>
                            <TextEdgy className="text-white text-sm mb-2">
                                {group.description}
                            </TextEdgy>
                        </div>
                    </button>
                ))}
                
                {currentRound === 2 && (
                    <div className="text-center pt-2">
                        <TextEdgy className="text-accent text-sm">
                            Choose the best fit!
                        </TextEdgy>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MBTIGroupComponent; 