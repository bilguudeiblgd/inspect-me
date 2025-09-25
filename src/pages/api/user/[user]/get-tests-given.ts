import type { NextApiRequest, NextApiResponse } from 'next';
import User, { DbUser } from "@/models/User";
import Test from "@/models/Test";
import MBTITest from "@/models/MBTITest";
import mongooseConnect from "@/lib/mongooseConnect";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await mongooseConnect()
        console.log("get-tests-given mongoose.modelNames(): ", mongoose.modelNames())
        // Ensure MBTI model is initialized if present
        if (!mongoose.modelNames().includes("mbtitests")) {
            // it's fine; user may have none
        }

        const { user } = req.query;
        if (!user || typeof user !== 'string') {
            return res.status(400).json({ error: 'User query parameter is required' });
        }

        const foundUser = await User.findOne<DbUser>({ userHandle: user })

        if (!foundUser)
            return res.status(404).json({ error: 'User not found' });

        // Fetch regular tests given
        const regularGiven = await Test.find({ testGiver: foundUser._id })
            .populate({ path: 'testReceiver' })
            .populate({ path: 'testGiver' });

        // Fetch MBTI tests given
        const mbtiGiven = await MBTITest.find({ testGiver: foundUser._id })
            .populate({ path: 'testReceiver' })
            .populate({ path: 'testGiver' });

        const normalTests = regularGiven.map((t: any) => ({ ...t.toObject?.() ?? t, group: t.group || 'default' }));
        const mbtiTests = mbtiGiven.map((t: any) => ({ ...t.toObject?.() ?? t, group: 'mbti' }));
        return res.status(200).json([...mbtiTests, ...normalTests]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
