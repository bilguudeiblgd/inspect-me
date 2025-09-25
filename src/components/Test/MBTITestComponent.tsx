import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { MBTI_PHASE, MBTITestInfo, MBTITestRequestPayload, calculateMBTIScores } from './MBTIProperties';
import MBTISliderComponent from './MBTISliderComponent';
import MBTIFunctionComponent from './MBTIFunctionComponent';
import MBTIGroupComponent from './MBTIGroupComponent';
import TextEdgy from '@/components/TextEdgy';

const defaultMBTITestInfo: MBTITestInfo = {
    sliders: {},
    traits: [],
    groups: []
};

interface Props {
    testReceiver: string;
}

const MBTITestComponent: React.FC<Props> = ({ testReceiver }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [stage, setStage] = useState<MBTI_PHASE>(MBTI_PHASE.PHASE1_SLIDERS);
    const [testInfo, setTestInfo] = useState<MBTITestInfo>(defaultMBTITestInfo);
    const [testObject, setTestObject] = useState<MBTITestRequestPayload | null>(null);

    const handlePhase1Continue = (updatedTestInfo: MBTITestInfo) => {
        setTestInfo(updatedTestInfo);
        setStage(MBTI_PHASE.PHASE2_TRAITS);
    };

    const handlePhase2Continue = (updatedTestInfo: MBTITestInfo) => {
        setTestInfo(updatedTestInfo);
        setStage(MBTI_PHASE.PHASE3_VALUES);
    };

    const handlePhase3Continue = (updatedTestInfo: MBTITestInfo) => {
        setTestInfo(updatedTestInfo);
        
        // Calculate the actual MBTI scores based on test responses
        const calculatedResults = calculateMBTIScores(updatedTestInfo);

        const newTestObject: MBTITestRequestPayload = {
            testReceiver: testReceiver,
            testGiver: undefined,
            info: calculatedResults,
            group: "mbti"
        };

        setTestObject(newTestObject);
        setStage(MBTI_PHASE.PHASE_DONE);
    };

    // Immediately redirect to login or to test-done handler after MBTI completion
    useEffect(() => {
        if (stage === MBTI_PHASE.PHASE_DONE && testObject) {
            const callbackPath = `/${testReceiver}/test-done?testObject=${encodeURIComponent(JSON.stringify(testObject))}`;
            if (session?.user) {
                router.replace(callbackPath);
            } else {
                signIn(undefined, { callbackUrl: callbackPath });
            }
        }
    }, [stage, testObject, session, router, testReceiver]);

    return (
        <div className="min-h-screen flex flex-col items-center mt-10">
            {stage === MBTI_PHASE.PHASE1_SLIDERS && (
                <MBTISliderComponent
                    handleContinueButton={handlePhase1Continue}
                    testInfo={testInfo}
                    testReceiver={testReceiver}
                />
            )}
            
            {stage === MBTI_PHASE.PHASE2_TRAITS && (
                <MBTIFunctionComponent
                    handleContinueButton={handlePhase2Continue}
                    testInfo={testInfo}
                    testReceiver={testReceiver}
                />
            )}
            
            {stage === MBTI_PHASE.PHASE3_VALUES && (
                <MBTIGroupComponent
                    handleContinueButton={handlePhase3Continue}
                    testInfo={testInfo}
                    testReceiver={testReceiver}
                />
            )}
            
            {stage === MBTI_PHASE.PHASE_DONE && testObject && (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <TextEdgy className="text-primary">Redirecting to results...</TextEdgy>
                </div>
            )}
        </div>
    );
};

export default MBTITestComponent; 