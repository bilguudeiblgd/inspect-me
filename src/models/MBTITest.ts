import mongoose, { Schema } from 'mongoose';
import { MBTIScoreType, MBTI_TYPES } from "@/components/Test/MBTIProperties";

export interface MBTITestDb {
    testReceiver: string | null;
    testGiver: string | null;
    info: MBTIScoreType[];
    group?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const mbtiTestSchema = new Schema<MBTITestDb>({
    testReceiver: { type: Schema.Types.ObjectId, ref: "users", required: true },
    testGiver: { type: Schema.Types.ObjectId, ref: "users", required: true },
    info: [{
        personality_type: {
            type: String,
            required: true,
            enum: [...Object.values(MBTI_TYPES)]
        },
        score: Number,
    }],
    group: { type: Schema.Types.String, required: false, default: 'mbti' }
}, { timestamps: true });

mbtiTestSchema.index({ testReceiver: 1, testGiver: 1 }, { unique: true });

export default mongoose.models.mbtitests || mongoose.model<MBTITestDb>('mbtitests', mbtiTestSchema);


