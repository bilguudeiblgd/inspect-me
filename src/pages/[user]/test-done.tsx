import React, { useEffect, useState } from 'react';
import { TestRequestPayload, TypeScoreType } from "@/components/Test/Properties";
import DisplayTopKResult from "@/components/Test/DisplayTopXResult";
import TextEdgy from "@/components/TextEdgy";
import { useRouter } from "next/router";
import { HomeButton } from "@/components/Test/PhaseDoneComponent";
import Skeleton from "@/components/Skeleton";
import { useSession } from 'next-auth/react';
import GetHandle from '@/components/GetHandle';

const NUMBER_OF_RESULT_SHOWN = 2;

const TestDonePage: React.FC = () => {
    const router = useRouter();
    const [testObject, setTestObject] = useState<TestRequestPayload | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [testSendResolved, setTestSendResolved] = useState<boolean>(false);

    const { data: session, status } = useSession();

    useEffect(() => {
        setError(null)
        
        if (status === "unauthenticated") {
            router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
            return;
        }

        if (status === "authenticated") {
            if (!session.user.userHandle) {
                router.replace(`/auth/get-handle?callbackUrl=${encodeURIComponent(router.asPath)}`);
                return;
            }

            const testObjectParam = router.query.testObject as string | undefined;
            if (!testObjectParam) {
                setError("No test results found");
                return;
            }
    
            try {
                const decodedTestObject = decodeURIComponent(testObjectParam);
                const parsedTestObject = JSON.parse(decodedTestObject) as TestRequestPayload;
                const giverUserHandle = session.user.userHandle;
                if(giverUserHandle) {
                    parsedTestObject.testGiver = giverUserHandle;
                    setTestObject(parsedTestObject);
                    console.log("testObject", parsedTestObject);
                }
            } catch (error) {
                console.error("Error parsing test object:", error);
                setError("Failed to load test results");
            }

        }
        
    }, [status, router, session]);

    useEffect(() => {
        if (!testObject || !session?.user?.userHandle) return;

        const testGiver = session.user.userHandle;
        const testReceiver = testObject.testReceiver;

        if (testGiver === testReceiver) {
            setError("You can't give a test to yourself.");
            return;
        }

    }, [testObject, session?.user?.userHandle]);

    useEffect(() => {
        // Only send if testObject is set, no error, and testGiver is present
        if (!testObject || error || !session?.user?.userHandle) return;

        // Prevent double submission
        let isSent = false;
        if (isSent) return;

        const sendTest = async () => {
            try {
                const isMbti = testObject.group === 'mbti';
                const endpoint = isMbti ? '/api/mbti/send' : '/api/test/send';
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(testObject),
                });
                const result = await response.json();
                setTestSendResolved(true)
            } catch (err) {
                setError("Failed to submit test.");
            }
            isSent = true;
        };

        sendTest();
    }, [testObject, error, session?.user?.userHandle]);

    // For MBTI: as soon as the test is submitted, go straight to /tests results
    useEffect(() => {
        if (!testSendResolved || !testObject) return;
        const isMbti = testObject.group === 'mbti';
        if (isMbti && testObject.testGiver && testObject.testReceiver) {
            const url = `/tests?giver=${encodeURIComponent(testObject.testGiver)}&receiver=${encodeURIComponent(testObject.testReceiver)}&group=mbti`;
            router.replace(url);
        }
    }, [testSendResolved, testObject, router]);

    if (error) {
        return (
            <Skeleton showNavbar={false} noContainer={true} maxWidth={"lg"}>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <TextEdgy className="text-error text-xl">{error}</TextEdgy>
                    <HomeButton />
                </div>
            </Skeleton>
        );
    }

    if (!testObject) {
        return (
            <Skeleton showNavbar={false} noContainer={true} maxWidth={"lg"}>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <TextEdgy className="text-primary text-xl">Loading results...</TextEdgy>
                </div>
            </Skeleton>
        );
    }

    return (
        <Skeleton showNavbar={false} noContainer={true} maxWidth={"lg"}>
            <div className="flex flex-col items-center mt-20">
                <div>
                    <TextEdgy className={"text-md font-bold text-center text-secondary"}>
                        You think <span className="text-accent">{testObject.testReceiver}</span> is:
                    </TextEdgy>
                    <DisplayTopKResult topK={NUMBER_OF_RESULT_SHOWN} typeResult={testObject.info} />
                </div>

                {testObject.group === 'mbti' ? (
                    <div className="flex flex-col items-center mt-6">
                        <TextEdgy className="text-primary">Redirecting to results...</TextEdgy>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <TextEdgy className={"text-lg mt-8 font-bold text-center text-secondary"}>
                            Your match with <span className="text-accent">{testObject.testReceiver}</span>:
                        </TextEdgy>
                        <a
                            target="_blank"
                            className={`btn btn-secondary mt-4${!testSendResolved ? ' pointer-events-none opacity-50' : ''}`}
                            href={`/tests?giver=${testObject.testGiver}&receiver=${testObject.testReceiver}&group=${encodeURIComponent(testObject.group || 'mbti')}`}
                            tabIndex={testSendResolved ? 0 : -1}
                            aria-disabled={!testSendResolved}
                        >
                            <TextEdgy className={"text-white font-bold"}>View Duo</TextEdgy>
                        </a>
                    </div>
                )}
                <HomeButton />
            </div>
        </Skeleton>
    );
};

export default TestDonePage; 