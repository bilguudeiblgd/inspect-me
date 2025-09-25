import type {NextApiRequest, NextApiResponse} from "next";
import mongooseConnect from "@/lib/mongooseConnect";
import Test from "@/models/Test";
import User, {DbUser} from "@/models/User";
import {TestTypeDb} from "@/components/Test/Properties";
import { group } from "console";

type Data = {
    status: string;
    message: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
) {
    // Connect to the database
    await mongooseConnect();

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }

    try {
        const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { testReceiver, testGiver, info, group } = parsedBody;
        // Check if the necessary fields are present
        if (!info || !testReceiver || !testGiver) {
            return res.status(400).json({ status: "error", message: "Missing required fields" });
        }

        // Find the testReceiver in the User collection by userHandle
        const receiverUser = await User.findOne<DbUser>({ userHandle: testReceiver });
        if (!receiverUser) {
            return res.status(404).json({ status: "error", message: "Test receiver not found" });
        }

        // Find the testGiver in the User collection by userHandle
        const giverUser = await User.findOne<DbUser>({ userHandle: testGiver })

        if (!giverUser) {
            return res.status(404).json({ status: "error", message: "Test giver not found" });
        }

        // Check if a test already exists with the same giver, receiver, and group
        const existingTest = await Test.findOne({ testReceiver: receiverUser._id, testGiver: giverUser._id, group: group });
        if (existingTest) {
            return res.status(409).json({ status: "error", message: "A test between these users already exists." });
        }

        // Create the new test object based on the schema
        const newTest = new Test({
            testReceiver: receiverUser._id,
            testGiver: giverUser._id,
            info: info,
            group: group
        });

        // Save the test object to the database
        await newTest.save();

        giverUser.tests_given.push(newTest)
        receiverUser.tests_for_me.push(newTest)

        // Only update aggregate user results for non-MBTI tests
        if (group !== 'mbti') {
            updateResultScores(receiverUser, newTest)
        }
        await giverUser.save();
        await receiverUser.save();


        // Respond with success
        return res.status(200).json({ status: "success", message: "Test info saved successfully!" });
    } catch (error) {
        console.error("Error saving test info:", error);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
}

const updateResultScores = (user: DbUser, testInstance: TestTypeDb) => {
    const currentScores = user.results
    const typeToScore : Map<string, number> = new Map()
    for(const obj of testInstance.info) {
        typeToScore.set(obj.personality_type, obj.score)
    }
    if(!currentScores) return
    for(const obj of currentScores) {
        if(typeToScore.has(obj.personality_type)) {
            const scoreToAdd = typeToScore.get(obj.personality_type)
            if(scoreToAdd)
                obj.score += scoreToAdd;
        }
    }
}
