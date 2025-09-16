import { useRouter } from 'next/router'
import { signIn, useSession } from "next-auth/react";
import AccessDenied from "@/components/AccessDenied";
import Skeleton from "@/components/Skeleton";
import { TypeScoreType } from "@/components/Test/Properties";
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/pages/_app";
import Loading from "@/components/Loading";
import TextEdgy from "@/components/TextEdgy";
import DisplayTopKResult from "@/components/Test/DisplayTopXResult";
import TestHistory from "@/components/TestHistory";
import Link from 'next/link';

const REQUIRED_TEST_FOR_ME = 1
const REQUIRED_TEST_FOR_OTHERS = 1
const NUMBER_OF_RESULT_SHOWN = 3

export default function Page() {
    const router = useRouter()
    const userName: string[] | string | undefined = router.query.user
    const GLOBALS = useContext(GlobalContext)
    const [testsForMeSize, setTestsForMeSize] = useState<number | null>(null)
    const [testsGivenSize, setTestsGivenSize] = useState<number | null>(null)
    const [typeResult, setTypeResult] = useState<TypeScoreType[]>([])
    const { data: session, status } = useSession()
    const targetUser = Array.isArray(userName) ? userName[0] : userName

    useEffect(() => {
        if (!router.isReady) return;
        const fetchResultScore = async () => {
            if (!session) return null
            if (!session?.user.userHandle) return null
            try {
                const response = await fetch(`/api/get-results`, {
                    method: 'POST',
                    body: JSON.stringify({ userHandle: session?.user.userHandle })
                })
                const data = await response.json()
                if (!data) {
                    setTestsForMeSize(0)
                    setTestsGivenSize(0)
                    return
                }
                if (!data.data) {
                    setTestsForMeSize(0)
                    setTestsGivenSize(0)
                    return
                }
                const results: TypeScoreType[] = data.data.result

                setTestsForMeSize(data.data.tests_for_me_size)
                setTestsGivenSize(data.data.tests_given_size)
                if (results) {
                    setTypeResult(results)
                } else {
                    console.log("Some error let's go")
                }
            } catch (e) {
                setTestsForMeSize(0)
                setTestsGivenSize(0)
                setTypeResult([])
            }
        }

        fetchResultScore()
        console.log(status)

    }, [router.isReady, GLOBALS.baseURL, session, session?.user.userHandle])


    if (status === "loading") {
        return <Loading />
    }

    if (!session) {
        signIn("google", {
            callbackUrl: `/${router.query.user}` || ""
        })
        return <Loading />
    }

    // If authenticated but missing handle, send them to handle setup
    if (session && !session.user.userHandle) {
        router.replace(`/auth/get-handle?callbackUrl=${encodeURIComponent(`/${targetUser || ''}`)}`)
        return <Loading />
    }

    if (session?.user.userHandle != targetUser) {
        return <AccessDenied />
    }

    if (testsGivenSize === null || testsForMeSize === null) {
        return <Loading />
    }


        return (
            <Skeleton showNavbar={true} noContainer={false} maxWidth={"lg"}>
                <div className={"flex flex-col items-center mt-12"}>
                    <NumberTestCard userName={userName as string} testsForMeSize={testsForMeSize} testsGivenSize={testsGivenSize} />

                    <div className={"mt-8"}>
                        <TextEdgy className={"text-primary mb-4"}>TASKS LEFT:</TextEdgy>
                        {testsForMeSize < REQUIRED_TEST_FOR_ME &&
                            <div className={"flex justify-start mb-2 items-center"}>
                                <input type="checkbox" disabled={true} checked={testsForMeSize >= 1}
                                    className="checkbox disabled:bg-accent checkbox-accent" />
                                <span className="ml-2 text-accent font-primary font-bold text-left">Ask {REQUIRED_TEST_FOR_ME} people to tests you.</span>
                            </div>
                        }
                        {testsGivenSize < REQUIRED_TEST_FOR_OTHERS &&
                            <div className={"flex justify-start items-center"}>
                                <input type="checkbox" disabled={true} checked={testsGivenSize >= 1}
                                    className="checkbox disabled:bg-accent checkbox-accent" />
                                <span
                                    className="ml-2 text-accent font-primary font-bold text-left">Give {REQUIRED_TEST_FOR_OTHERS} tests for other people.</span>
                            </div>
                        }
                    </div>
                </div>
            </Skeleton>
        )
}


interface NumberTestProps {
    userName: string
    testsForMeSize: number
    testsGivenSize: number
}

const NumberTestCard: React.FC<NumberTestProps> = ({ userName, testsForMeSize, testsGivenSize }) => {
    return (
        <Link href={`/${userName}/test`} className="bg-secondary rounded-2xl shadow border border-accent">
            <div className="stats bg-secondary shadow max-w-[400px]">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-6 w-6 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title font-bold font-primary text-primary">Tests for you</div>
                    <div className="stat-value text-primary">{testsForMeSize}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-6 w-6 stroke-current">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title font-bold font-primary text-primary">Total given</div>
                    <div className="stat-value text-primary">{testsGivenSize}</div>
                </div>
            </div>
            <div className="w-full my-2">
                <TextEdgy className="text-md text-center text-accent underline">
                    See all tests
                </TextEdgy>
            </div>
        </Link>
    )
}




