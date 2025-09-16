import type { NextApiRequest, NextApiResponse } from "next";
import mongooseConnect from "@/lib/mongooseConnect";
import MBTITest from "@/models/MBTITest";
import User, { DbUser } from "@/models/User";

type Data = {
    status: string;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    await mongooseConnect();

    if (req.method !== 'POST') {
        return res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }

    try {
        const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { testReceiver, testGiver, info } = parsedBody;
        if (!info || !testReceiver || !testGiver) {
            return res.status(400).json({ status: "error", message: "Missing required fields" });
        }

        const receiverUser = await User.findOne<DbUser>({ userHandle: testReceiver });
        if (!receiverUser) {
            return res.status(404).json({ status: "error", message: "Test receiver not found" });
        }
        const giverUser = await User.findOne<DbUser>({ userHandle: testGiver });
        if (!giverUser) {
            return res.status(404).json({ status: "error", message: "Test giver not found" });
        }

        const existing = await MBTITest.findOne({ testReceiver: receiverUser._id, testGiver: giverUser._id });
        if (existing) {
            return res.status(409).json({ status: "error", message: "An MBTI test between these users already exists." });
        }

        const newTest = new MBTITest({
            testReceiver: receiverUser._id,
            testGiver: giverUser._id,
            info,
            group: 'mbti'
        });
        await newTest.save();

        // Track MBTI tests separately on the user
        if (!Array.isArray((giverUser as any).mbti_tests_given)) (giverUser as any).mbti_tests_given = [];
        if (!Array.isArray((receiverUser as any).mbti_tests_for_me)) (receiverUser as any).mbti_tests_for_me = [];
        (giverUser as any).mbti_tests_given.push(newTest as any);
        (receiverUser as any).mbti_tests_for_me.push(newTest as any);
        await giverUser.save();
        await receiverUser.save();

        return res.status(200).json({ status: "success", message: "MBTI test saved successfully!" });
    } catch (error) {
        console.error("Error saving MBTI test:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}


