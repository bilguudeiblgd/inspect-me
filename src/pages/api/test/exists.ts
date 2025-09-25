import type {NextApiRequest, NextApiResponse} from "next";
import mongooseConnect from "@/lib/mongooseConnect";
import Test from "@/models/Test";
import {TestTypeDb} from "@/components/Test/Properties";
import User, {DbUser} from "@/models/User"; // Assuming this is the file where TestSchema is defined

type Data = {
    data: TestTypeDb | null;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
   

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({data: null, message: "Method Not Allowed"});
    }
     
    try {
        // Connect to the database
         await mongooseConnect();
        console.log("req.body", req.body);
        const {testReceiver, testGiver, group} = JSON.parse(req.body);
        console.log("test rec and giv and group:", testReceiver, testGiver, group);
        // Check if the necessary fields are present
        if (!testReceiver || !testGiver) {
            return res.status(400).json({data: null, message: "Missing required fields"});
        }

        // Find the testReceiver in the User collection by userHandle
        const receiverUserObject = await User.findOne<DbUser>({userHandle: testReceiver});
        if (!receiverUserObject) {
            return res.status(404).json({data: null, message: "Test receiver not found"});
        }

        // Find the testGiver in the User collection by userHandle
        const giverUserObject = await User.findOne<DbUser>({userHandle: testGiver})

        if (!giverUserObject) {
            return res.status(404).json({data: null, message: "Test giver not found"});
        }

        const query : any = {testReceiver: receiverUserObject, testGiver: giverUserObject};
        if (group) {
            query.group = group;
        }
        const test = await Test.findOne<TestTypeDb>(query)

        if (!test) {
            return res.status(200).json({data: null, message: "Test doesn't exist"});
        }
        return res.status(200).json({data: test, message: "Test exists"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({data: null, message: "Internal Server Error"});
    }
}

