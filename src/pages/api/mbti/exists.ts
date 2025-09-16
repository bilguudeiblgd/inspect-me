import type { NextApiRequest, NextApiResponse } from "next";
import mongooseConnect from "@/lib/mongooseConnect";
import MBTITest from "@/models/MBTITest";
import User, { DbUser } from "@/models/User";

type Data = { data: any; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method !== 'POST') {
        return res.status(405).json({ data: null, message: "Method Not Allowed" });
    }
    try {
        await mongooseConnect();
        const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { testReceiver, testGiver } = parsedBody;
        if (!testReceiver || !testGiver) {
            return res.status(400).json({ data: null, message: "Missing required fields" });
        }
        const receiver = await User.findOne<DbUser>({ userHandle: testReceiver });
        const giver = await User.findOne<DbUser>({ userHandle: testGiver });
        if (!receiver || !giver) {
            return res.status(404).json({ data: null, message: "Test receiver or giver not found" });
        }
        const test = await MBTITest.findOne({ testReceiver: receiver, testGiver: giver });
        if (!test) return res.status(200).json({ data: null, message: "Test doesn't exist" });
        return res.status(200).json({ data: test, message: "Test exists" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ data: null, message: "Internal Server Error" });
    }
}


