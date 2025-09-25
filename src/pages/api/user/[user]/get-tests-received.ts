import type { NextApiRequest, NextApiResponse } from 'next';
import User, { DbUser } from "@/models/User";
import Test from "@/models/Test";
import MBTITest from "@/models/MBTITest";
import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await mongooseConnect()
        console.log("get-tests-received mongoose.modelNames(): ", mongoose.modelNames())
        // It's okay if mbtitests is not present; user may have none
        if (!mongoose.modelNames().includes("tests")) {
            return res.status(500).json({ error: 'model tests has not been initialized' });
        }

        const { user } = req.query;
        if (!user || typeof user !== 'string') {
            return res.status(400).json({ error: 'User query parameter is required' });
        }

        const foundUser = await User.findOne<DbUser>({ userHandle: user })

        if (!foundUser)
            return res.status(404).json({ error: 'User not found' });

        // Fetch regular tests received
        const regularReceived = await Test.find({ testReceiver: foundUser._id })
            .populate({ path: 'testReceiver' })
            .populate({ path: 'testGiver' });

        // Fetch MBTI tests received
        const mbtiReceived = mongoose.modelNames().includes("mbtitests")
            ? await MBTITest.find({ testReceiver: foundUser._id })
                .populate({ path: 'testReceiver' })
                .populate({ path: 'testGiver' })
            : [];

        const normalTests = regularReceived.map((t: any) => ({ ...t.toObject?.() ?? t, group: t.group || 'default' }));
        const mbtiTests = mbtiReceived.map((t: any) => ({ ...t.toObject?.() ?? t, group: 'mbti' }));

        return res.status(200).json([...mbtiTests, ...normalTests]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 