import Test from "@/models/Test";
import { useRouter } from "next/router";
import Skeleton from "@/components/Skeleton";
import TextEdgy from "@/components/TextEdgy";
import { useSession } from "next-auth/react";
import AccessDenied from "@/components/AccessDenied";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { getDuoDescription, getFourLetterType, TestTypeDb, TYPES, TypeScoreType } from "@/components/Test/Properties";
import Link from "next/link";
import { lowerCase } from "lodash";

const CARD_COLORS = [
    "#ECC43F", // yellow
    "#EF6A3F", // orange
    "#9F3AF8", // purple
];

const TYPE_COLORS = [
    "#01502D", // green for 1
    "#FED33D", // yellow for 2
    "#8BD91B", // green for 3
];
export const processDuoDescription = (giverTopType: TYPES | null, receiverTopType: TYPES | null) => {
    if (!giverTopType || !receiverTopType) return "Can't determine duo dynamic...";
    return getDuoDescription(giverTopType, receiverTopType);
}

export default function Page() {
    const router = useRouter();
    const { giver, receiver, group } = router.query;
    const giverHandle = typeof giver === 'string' ? giver : Array.isArray(giver) ? giver[0] : undefined;
    const receiverHandle = typeof receiver === 'string' ? receiver : Array.isArray(receiver) ? receiver[0] : undefined;
    const groupParam = typeof group === 'string' ? group : Array.isArray(group) ? group[0] : undefined;
    const [testData, setTestData] = useState<TestTypeDb | null>(null);
    const [loading, setLoading] = useState(true);
    const [giverTopType, setGiverTopType] = useState<TYPES | null>(null);
    const [receiverTopType, setReceiverTopType] = useState<TYPES | null>(null);

    const { data: session } = useSession();
    const currentUserHandle = session?.user.userHandle;

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const isMbti = groupParam === 'mbti';
                const response = await fetch(`${isMbti ? '/api/mbti' : '/api/test'}?giver=${encodeURIComponent(giverHandle as string)}&receiver=${encodeURIComponent(receiverHandle as string)}`);
                const data = await response.json();
                setTestData(data.data);

                // Get giver's top type from their user data
                if (data.data?.testGiver && data.data?.group !== 'mbti') {
                    // First get the user data using the ObjectId
                    const giverResponse = await fetch(`/api/user/by-id/${data.data.testGiver}`);
                    const giverData = await giverResponse.json();
                    if (giverData.data?.results) {
                        const sortedResults = [...giverData.data.results].sort((a, b) => b.score - a.score);
                        if (sortedResults[0].score > 0) {
                            setGiverTopType(sortedResults[0].personality_type as TYPES);
                        }
                    }
                }

                // Get receiver's top type from test data
                if (data.data?.info && data.data?.group !== 'mbti') {
                    const sortedInfo = [...data.data.info].sort((a, b) => b.score - a.score);
                    if (sortedInfo[0].score > 0) {
                        setReceiverTopType(sortedInfo[0].personality_type as TYPES);
                    }
                }
            } catch (error) {
                console.error('Error fetching test:', error);
            } finally {
                setLoading(false);
            }
        }
        if (giverHandle && receiverHandle) {
            fetchTest();
        }
    }, [giverHandle, receiverHandle, groupParam]);

    if (giverHandle && receiverHandle && session?.user.userHandle !== giverHandle && session?.user.userHandle !== receiverHandle) {
        return <AccessDenied />
    }


    const renderTopTypes = (info: TypeScoreType[]) => {
        const topThree = info.slice(0, 3);
        const isMbti = (groupParam === 'mbti') || testData?.group === 'mbti';
        if (isMbti) {
            return (
                <div className="flex flex-col gap-4">
                    {topThree.map((type, index) => (
                        <div
                            key={`${type.personality_type}-${index}`}
                            className="p-4 rounded-3xl shadow-lg"
                            style={{ backgroundColor: CARD_COLORS[index] }}
                        >
                            <div className="flex flex-row justify-between">
                                <TextEdgy className="text-2xl font-bold">
                                    {index + 1}. {type.personality_type}
                                </TextEdgy>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-white/30 rounded-full h-2.5">
                                    <div
                                        className="h-2.5 rounded-full"
                                        style={{
                                            width: `${(type.score / topThree[0].score) * 100}%`,
                                            backgroundColor: TYPE_COLORS[index]
                                        }}
                                    ></div>
                                </div>
                                <TextEdgy className="text-sm mt-1 font-semibold">
                                    Score: {type.score.toFixed(2)}
                                </TextEdgy>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        return (
            <div className="flex flex-col gap-4">
                {topThree.map((type, index) => (
                    <Link key={type.personality_type} target="_blank" rel="noopener noreferrer" href={`/types/${lowerCase(type.personality_type)}`} className="">
                        <div
                            className="p-4 rounded-3xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
                            style={{ backgroundColor: CARD_COLORS[index] }}
                        >
                            <div className="flex flex-row justify-between">
                                <TextEdgy className="text-2xl font-bold">
                                    {index + 1}. {getFourLetterType(type.personality_type as TYPES)}
                                </TextEdgy>
                                <FaExternalLinkAlt className="text-xl" style={{ color: TYPE_COLORS[index] }} />
                            </div>

                            <div className="mt-2">
                                <div className="w-full bg-white/30 rounded-full h-2.5">
                                    <div
                                        className="h-2.5 rounded-full"
                                        style={{
                                            width: `${(type.score / topThree[0].score) * 100}%`,
                                            backgroundColor: TYPE_COLORS[index]
                                        }}
                                    ></div>
                                </div>
                                <TextEdgy
                                    className="text-sm mt-1 font-semibold"
                                >
                                    Score: {type.score.toFixed(2)}
                                </TextEdgy>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <Skeleton showNavbar={true} noContainer={false} maxWidth={"lg"}>
            <div className="py-4">
                {/* <TextEdgy className="text-2xl text-center text-secondary font-bold mb-6">
                    Your type: <span className="text-accent">{giverTopType}</span>
                </TextEdgy> */}

                {loading ? (
                    <div>Loading...</div>
                ) : testData ? (
                    <div className="space-y-10">
                        {
                            currentUserHandle === giver ? (
                                <div className="">
                                    <TextEdgy className="mt-2 mb-4 text-lg text-secondary text-center">
                                        What you think <span className="text-accent">{receiver}</span>{"'"}s type is:
                                    </TextEdgy>
                                    {renderTopTypes(testData.info)}
                                </div>
                            ) : (
                                <div className="">
                                    <TextEdgy className="mt-2 mb-4 text-lg text-secondary text-center">
                                        What {giver} thinks your type is:
                                    </TextEdgy>
                                    {renderTopTypes(testData.info)}
                                </div>
                            )
                        }
                        {((typeof group === 'string' && group !== 'mbti') || testData?.group !== 'mbti') && (
                        <div className="mt-20 card bg-accent/20 border-accent border-2 shadow-lg p-4">
                            <TextEdgy className="text-lg text-accent text-center">
                                Duo Description
                            </TextEdgy>
                            <div className="divider"></div>
                            {
                                currentUserHandle === giver ? (
                                    <>
                                        <TextEdgy className="text-lg text-accent text-center">
                                            Your type: <span className="text-secondary">{giverTopType ? getFourLetterType(giverTopType) : "<NOT IDENTIFIED>"}</span>
                                        </TextEdgy>
                                        <TextEdgy className="text-lg text-accent text-center">
                                            {receiver}{"'"}s type: <span className="text-secondary">{receiverTopType ? getFourLetterType(receiverTopType) : "NOT IDENTIFIED"}</span>
                                        </TextEdgy>
                                    </>
                                ) : (
                                    <>
                                        <TextEdgy className="text-lg text-accent text-center">
                                            Your type: <span className="text-secondary">{receiverTopType ? getFourLetterType(receiverTopType) : "NOT IDENTIFIED"}</span>
                                        </TextEdgy>
                                        <TextEdgy className="text-lg text-accent text-center">
                                            {receiver}{"'"}s type: <span className="text-secondary">{giverTopType ? getFourLetterType(giverTopType) : "NOT IDENTIFIED"}</span>
                                        </TextEdgy>
                                    </>

                                )
                            }
                            <div className="divider"></div>
                            <TextEdgy className="text-lg text-accent text-center">
                                <span className="text-secondary">match:</span> {processDuoDescription(giverTopType, receiverTopType)}
                            </TextEdgy>

                        </div>
                        )}

                    </div>
                ) : (
                    <TextEdgy className="text-lg text-gray-600">
                        No test data found
                    </TextEdgy>
                )}
            </div>
        </Skeleton>
    );
}
