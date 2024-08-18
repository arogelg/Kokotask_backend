import mongoose, { Document, PopulatedDoc } from "mongoose";
import { ITask } from "./task";
import { IUser } from "./user";
export interface IProject extends Document {
    projectName: string;
    sectionName: string;
    description: string;
    tasks: PopulatedDoc<ITask & Document>[];
    manager: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}
declare const Project: mongoose.Model<IProject, {}, {}, {}, mongoose.Document<unknown, {}, IProject> & IProject & Required<{
    _id: unknown;
}>, any>;
export default Project;
