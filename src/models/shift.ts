import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./user";

export interface IDeskShift extends Document {
    date: Date;
    startTime: string;  // e.g., "07:00 AM"
    endTime: string;    // e.g., "01:00 PM"
    user: Types.ObjectId | IUser;  // Reference to the User assigned to the shift
    isCovered: boolean;  // To track if the shift is covered by the original user
    coverReason?: string;  // Optional: Reason for shift cover request
    isCoverRequested: boolean;  // Indicates if a cover has been requested
    coverStatus: "none" | "pending" | "approved & not covered" | "approved & covered" | "denied";  // Status of the shift cover request
    approvedBy?: Types.ObjectId | IUser;  // User who approved the shift cover request
    deniedBy?: Types.ObjectId | IUser;  // User who denied the shift cover request
}

const DeskShiftSchema: Schema = new Schema({
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                return /\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/.test(v);
            },
            message: props => `${props.value} is not a valid time format!`
        },
        trim: true,
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string) {
                return /\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/.test(v);
            },
            message: props => `${props.value} is not a valid time format!`
        },
        trim: true,
    },
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    isCovered: {
        type: Boolean,
        default: true,  // By default, shifts are covered by the original user
    },
    coverReason: {
        type: String,
        trim: true,
    },
    isCoverRequested: {
        type: Boolean,
        default: false,  // Default is no cover requested
    },
    coverStatus: {
        type: String,
        enum: ["none", "pending", "approved & not covered", "approved & covered", "denied"],
        default: "pending",  // Status is pending until reviewed
    },
    approvedBy: {
        type: Types.ObjectId,
        ref: "User",
    },
    deniedBy: {
        type: Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });

const DeskShift = mongoose.model<IDeskShift>("DeskShift", DeskShiftSchema);
export default DeskShift;