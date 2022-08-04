"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const Course_1 = __importDefault(require("../models/Course"));
const Lecturer_1 = __importDefault(require("../models/Lecturer"));
//  Lecturer type
const LecturerType = new graphql_1.GraphQLObjectType({
    name: "Lecturer",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        name: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
        phone: { type: graphql_1.GraphQLString },
    }),
});
const CourseType = new graphql_1.GraphQLObjectType({
    name: "Course",
    fields: () => ({
        id: { type: graphql_1.GraphQLID },
        lecturer: {
            type: LecturerType,
            resolve(parent, args) {
                return Lecturer_1.default.findById(parent.lecturer);
            },
        },
        name: { type: graphql_1.GraphQLString },
        code: { type: graphql_1.GraphQLString },
        description: { type: graphql_1.GraphQLString },
        credits: { type: graphql_1.GraphQLInt },
        semester: { type: graphql_1.GraphQLInt },
        status: { type: graphql_1.GraphQLString },
    }),
});
const RootQuery = new graphql_1.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        lecturer: {
            type: LecturerType,
            args: {
                id: { type: graphql_1.GraphQLID },
            },
            resolve(parent, args) {
                return Lecturer_1.default.findById(args.id);
            },
        },
        lecturers: {
            type: new graphql_1.GraphQLList(LecturerType),
            resolve() {
                return Lecturer_1.default.find();
            },
        },
        courses: {
            type: new graphql_1.GraphQLList(CourseType),
            resolve(parent, args) {
                return Course_1.default.find();
            },
        },
        course: {
            type: CourseType,
            args: {
                id: { type: graphql_1.GraphQLID },
            },
            resolve(parent, args) {
                return Course_1.default.findById(args.id);
            },
        },
    },
});
// Mutations
const RootMutation = new graphql_1.GraphQLObjectType({
    name: "RootMutation",
    fields: {
        addLecturer: {
            type: LecturerType,
            args: {
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                email: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                phone: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
            },
            resolve(parent, args) {
                const lecturer = new Lecturer_1.default({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });
                return lecturer.save();
            },
        },
        deleteLecturer: {
            type: LecturerType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
            },
            resolve(parent, args) {
                Course_1.default.find({ lecturer: args.id }).then((courses) => courses.forEach((course) => course.remove()));
                return Lecturer_1.default.findByIdAndDelete(args.id);
            },
        },
        addCourse: {
            type: CourseType,
            args: {
                lecturer: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                name: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                code: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                description: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLString) },
                credits: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLInt) },
                semester: {
                    type: (0, graphql_1.GraphQLNonNull)(new graphql_1.GraphQLEnumType({
                        name: "Semester",
                        values: {
                            ONE: { value: 1 },
                            TWO: { value: 2 },
                            THREE: { value: 3 },
                        },
                    })),
                },
                status: {
                    type: (0, graphql_1.GraphQLNonNull)(new graphql_1.GraphQLEnumType({
                        name: "Status",
                        values: {
                            PENDING: { value: "Pending" },
                            IN_PROGRESS: { value: "In Progress" },
                            COMPLETED: { value: "Completed" },
                        },
                    })),
                },
            },
            resolve(parents, args) {
                const newCourse = new Course_1.default({
                    name: args.name,
                    lecturer: args.lecturer,
                    description: args.description,
                    code: args.code,
                    credits: args.credits,
                    semester: args.semester,
                    status: args.status,
                });
                return newCourse.save();
            },
        },
        deleteCourse: {
            type: CourseType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
            },
            resolve(parents, args) {
                return Course_1.default.findByIdAndDelete(args.id);
            },
        },
        updateCourse: {
            type: CourseType,
            args: {
                id: { type: (0, graphql_1.GraphQLNonNull)(graphql_1.GraphQLID) },
                name: { type: graphql_1.GraphQLString },
                code: { type: graphql_1.GraphQLString },
                description: { type: graphql_1.GraphQLString },
                credits: { type: graphql_1.GraphQLInt },
                semester: {
                    type: new graphql_1.GraphQLEnumType({
                        name: "SemesterUpdate",
                        values: {
                            ONE: { value: 1 },
                            TWO: { value: 2 },
                            THREE: { value: 3 },
                        },
                    }),
                },
                status: {
                    type: new graphql_1.GraphQLEnumType({
                        name: "StatusUpdate",
                        values: {
                            PENDING: { value: "Pending" },
                            IN_PROGEESS: { value: "In Progress" },
                            COMPLETED: { value: "Completed" },
                        },
                    }),
                },
            },
            resolve(parents, args) {
                const { id } = args, update = __rest(args, ["id"]);
                return Course_1.default.findByIdAndUpdate(id, update, { new: true });
            },
        },
    },
});
const schema = new graphql_1.GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});
exports.default = schema;
//# sourceMappingURL=schema.js.map