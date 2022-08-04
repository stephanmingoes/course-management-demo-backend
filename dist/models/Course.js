"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const types_1 = require("../types");
const CourseSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
    semester: {
        type: Number,
        enum: types_1.Semester,
        required: true,
    },
    status: {
        type: String,
        enum: types_1.Status,
        required: true,
    },
    lecturer: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Lecturer",
        required: true,
    },
});
exports.default = mongoose_1.default.model("Course", CourseSchema);
//# sourceMappingURL=Course.js.map