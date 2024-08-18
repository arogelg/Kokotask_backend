"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DeskShiftSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
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
            validator: function (v) {
                return /\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/.test(v);
            },
            message: props => `${props.value} is not a valid time format!`
        },
        trim: true,
    },
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isCovered: {
        type: Boolean,
        default: true, // By default, shifts are covered by the original user
    },
    coverReason: {
        type: String,
        trim: true,
    },
    isCoverRequested: {
        type: Boolean,
        default: false, // Default is no cover requested
    },
    coverStatus: {
        type: String,
        enum: ["none", "pending", "approved & not covered", "approved & covered", "denied"],
        default: "pending", // Status is pending until reviewed
    },
    approvedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
    deniedBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true });
const DeskShift = mongoose_1.default.model("DeskShift", DeskShiftSchema);
exports.default = DeskShift;
//# sourceMappingURL=shift.js.map