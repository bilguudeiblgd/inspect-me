import type {NextApiRequest, NextApiResponse} from "next";
import mongooseConnect from '../../lib/mongooseConnect'
import User from "@/models/User";
import {TypeScoreType} from "@/components/Test/Properties";

type Data = {
    data: {
        result: TypeScoreType[]
        tests_for_me_size: number;
        tests_given_size: number;
    } | null;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    // #TODO just instead get the user and use service to get the data. Minimize the APIs
    await mongooseConnect()
    const query = JSON.parse(req.body)
    try {
        const user = await User.findOne(query);
        if(!user)
            return res.status(500).json({ data: null });
        const testsForMeCount = (Array.isArray((user as any).tests_for_me) ? (user as any).tests_for_me.length : 0)
            + (Array.isArray((user as any).mbti_tests_for_me) ? (user as any).mbti_tests_for_me.length : 0);
        const testsGivenCount = (Array.isArray((user as any).tests_given) ? (user as any).tests_given.length : 0)
            + (Array.isArray((user as any).mbti_tests_given) ? (user as any).mbti_tests_given.length : 0);
        return res.status(200).json({
            data: {
                result: user.results,
                tests_for_me_size: testsForMeCount,
                tests_given_size: testsGivenCount,
            }
        });
    } catch(e) {
        return res.status(500).json({ data: null });
    }
}
