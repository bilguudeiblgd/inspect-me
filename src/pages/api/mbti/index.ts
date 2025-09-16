import type { NextApiRequest, NextApiResponse } from "next";
import mongooseConnect from "@/lib/mongooseConnect";
import MBTITest from "@/models/MBTITest";
import User, { DbUser } from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await mongooseConnect();
    if (req.method !== 'GET') {
        return res.status(405).json({ data: null, message: "Method Not Allowed" });
    }
    try {
        const { receiver, giver } = req.query;
        if (!receiver || !giver) {
            return res.status(400).json({ data: null, message: "Missing required fields" });
        }
        const testReceiverObject = await User.findOne<DbUser>({ userHandle: receiver });
        const testGiverObject = await User.findOne<DbUser>({ userHandle: giver });
        if (!testReceiverObject || !testGiverObject) {
            return res.status(404).json({ data: null, message: "Test receiver or giver not found" });
        }
        const test = await MBTITest.findOne({ testReceiver: testReceiverObject, testGiver: testGiverObject });
        return res.status(200).json({ data: test, message: test ? "successful" : "test doesn't exist" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ data: null, message: "Internal Server Error" });
    }
}


