import { TestTypeDb } from "@/components/Test/Properties";
import mongooseConnect from "@/lib/mongooseConnect";
import { DbUser } from "@/models/User";
import Test from "@/models/Test";
import User from "@/models/User";
import { NextApiRequest, NextApiResponse } from "next";

type Data = {
    data: TestTypeDb | null;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    await mongooseConnect();

    if (req.method !== 'GET') {
        return res.status(405).json({data: null, message: "Method Not Allowed"});
    }

    try {
        const { receiver, giver, group } = req.query;

        if(!receiver || !giver) {
            return res.status(400).json({data: null, message: "Missing required fields"});
        }

        const testReceiverObject = await User.findOne<DbUser>({userHandle: receiver});
        const testGiverObject = await User.findOne<DbUser>({userHandle: giver});

        if(!testReceiverObject || !testGiverObject) {
            return res.status(404).json({data: null, message: "Test receiver or giver not found"});
        }

        const query : any = {testReceiver: testReceiverObject, testGiver: testGiverObject};
        if (group && typeof group === 'string') {
            query.group = group;
        }
        const test = await Test.findOne<TestTypeDb>(query);

        if(test) {
            return res.status(200).json({data: test, message: "successful"});
        }

        return res.status(200).json({data: null, message: "test doesn't exist"});
    } catch (error) {
        console.log(error);
    return res.status(500).json({data: null, message: "Internal Server Error"});
    }
}