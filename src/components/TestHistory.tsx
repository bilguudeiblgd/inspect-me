import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {TestTypeDb} from './Test/Properties';
import TextEdgy from './TextEdgy';
import Text from './Text';

interface TestWithUser {
    testReceiver?: {
        userHandle: string;
    };
    testGiver?: {
        userHandle: string;
    };
    info: TestTypeDb['info'];
    group: string;
    createdAt: string;
}

interface TestHistoryProps {
    userHandle: string;
}

interface TestListProps {
    tests: TestWithUser[];
    direction: 'given' | 'received';
    page: number;
    setPage: (page: number) => void;
}

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
}

const PAGE_SIZE = 5;

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, setPage }) => (
    <div className="flex justify-center gap-2 mt-6 mb-8 bg-white rounded-xl py-2 px-4 shadow border border-accent">
        <button
            className="btn btn-sm bg-white text-primary border-primary hover:bg-primary hover:text-white"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
        >
            <Text className="text-primary font-bold">Prev</Text>
        </button>
        <Text className="px-2 py-1 text-primary font-bold">
            Page {page} of {totalPages}
        </Text>
        <button
            className="btn btn-sm bg-white text-primary border-primary hover:bg-primary hover:text-white"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
        >
            <Text className="text-primary font-bold">Next</Text>
        </button>
    </div>
);

const TestList: React.FC<TestListProps> = ({ tests, direction, page, setPage }) => {
    const router = useRouter();
    const list = Array.isArray(tests) ? tests : [];
    const totalPages = Math.ceil((list.length || 0) / PAGE_SIZE);
    const paginated = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    console.log(`tests ${direction}: `, tests)
    const getTestUrl = (test: TestWithUser) => {
        const giver = test.testGiver?.userHandle || '';
        const receiver = test.testReceiver?.userHandle || '';
        const group = test.group || 'default';
        return `/tests?giver=${encodeURIComponent(giver)}&receiver=${encodeURIComponent(receiver)}&group=${encodeURIComponent(group)}`;
    }

    return (
        <div className="space-y-4">
            {!list || list.length === 0 ? (
                <Text className="text-gray-500 text-center">No tests {direction === 'given' ? 'given' : 'received'} yet</Text>
            ) : (
                <>
                    {paginated.map((test, index) => {
                        const user = direction === 'given' ? test.testReceiver : test.testGiver;
                        const label = direction === 'given' ? 'To' : 'From';
                        const testUrl = getTestUrl(test);
                        return (
                            <div
                                key={index + (page - 1) * PAGE_SIZE}
                                className="bg-primary border-2 border-accent rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-200 p-5 flex justify-between items-center group"
                            >
                                <div>
                                    <TextEdgy className="text-lg text-accent font-bold mb-1">
                                        {label}: <span className="text-secondary text-xl font-extrabold underline underline-offset-4">{user?.userHandle || 'Unknown'}</span>
                                    </TextEdgy>
                                    {test.group === 'mbti' && (
                                        <span className="inline-block text-xs font-bold uppercase bg-secondary text-white px-2 py-1 rounded-md mr-2 mt-1">MBTI</span>
                                    )}
                                    <Text className="text-sm text-gray-400 mt-1">
                                        {new Date(test.createdAt).toLocaleDateString()}
                                    </Text>
                                </div>
                                <a
                                    href={testUrl}
                                    className="btn btn-accent btn-outline font-edgy px-6 py-2 text-lg shadow group-hover:scale-105 transition-transform duration-200"
                                >
                                    <TextEdgy className="text-lg">View Results</TextEdgy>
                                </a>
                            </div>
                        );
                    })}
                    {totalPages > 1 && (
                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    )}
                </>
            )}
        </div>
    );
};

const makeDummyTests = (type: 'given' | 'received', count: number): TestWithUser[] => {
    const now = Date.now();
    return Array.from({ length: count }).map((_, i) => ({
        testReceiver: type === 'given' ? { userHandle: `receiver${i + 1}` } : undefined,
        testGiver: type === 'received' ? { userHandle: `giver${i + 1}` } : undefined,
        info: [],
        group: 'All',
        createdAt: new Date(now - i * 86400000).toISOString(),
    }));
};

const TestHistory: React.FC<TestHistoryProps> = ({userHandle}) => {
    const [testsGiven, setTestsGiven] = useState<TestWithUser[]>([]);
    const [testsReceived, setTestsReceived] = useState<TestWithUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tab, setTab] = useState<'given' | 'received'>('given');
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1); // Reset page when tab changes
    }, [tab]);

    useEffect(() => {
        const fetchTestHistory = async () => {
            try {
                // Fetch tests given
                const givenResponse = await fetch(`/api/user/${userHandle}/get-tests-given`);
                let givenData = await givenResponse.json() as TestWithUser[] | null;
                setTestsGiven(givenData || []);

                // Fetch tests received
                const receivedResponse = await fetch(`/api/user/${userHandle}/get-tests-received`);
                let receivedData = await receivedResponse.json() as TestWithUser[] | null;
                setTestsReceived(receivedData || []);

                setLoading(false);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An error occurred');
                setLoading(false);
            }
        };

        fetchTestHistory();
    }, [userHandle]);

    if (loading) {
        return <div className="animate-pulse">Loading test history...</div>;
    }

    if (error) {
        return <div className="text-error text-center">{error}</div>;
    }

    return (
        <div className="w-full">
            <div role="tablist" className="tabs tabs-boxed w-full mb-6">
                <button
                    role="tab"
                    className={`tab flex-1 text-lg ${tab === 'given' ? 'tab-active' : ''}`}
                    aria-selected={tab === 'given'}
                    onClick={() => setTab('given')}
                >
                    Tests Given
                </button>
                <button
                    role="tab"
                    className={`tab flex-1 text-lg ${tab === 'received' ? 'tab-active' : ''}`}
                    aria-selected={tab === 'received'}
                    onClick={() => setTab('received')}
                >
                    Tests Received
                </button>
            </div>
            <div>
                {tab === 'given' ? (
                    <TestList tests={testsGiven} direction="given" page={page} setPage={setPage} />
                ) : (
                    <TestList tests={testsReceived} direction="received" page={page} setPage={setPage} />
                )}
            </div>
        </div>
    );
};

export default TestHistory; 
