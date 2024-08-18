import mongoose, { Document, Types } from "mongoose";
import { IUser } from "./user";
export interface IDeskShift extends Document {
    date: Date;
    startTime: string;
    endTime: string;
    user: Types.ObjectId | IUser;
    isCovered: boolean;
    coverReason?: string;
    isCoverRequested: boolean;
    coverStatus: "none" | "pending" | "approved & not covered" | "approved & covered" | "denied";
    approvedBy?: Types.ObjectId | IUser;
    deniedBy?: Types.ObjectId | IUser;
}
declare const DeskShift: mongoose.Model<IDeskShift, {}, {}, {}, mongoose.Document<unknown, {}, IDeskShift> & IDeskShift & Required<{
    _id: unknown;
}>, any>;
export default DeskShift;
