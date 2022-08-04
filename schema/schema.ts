import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
} from "graphql";
import Course from "../models/Course";
import Lecturer from "../models/Lecturer";

//  Lecturer type
const LecturerType = new GraphQLObjectType({
  name: "Lecturer",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

const CourseType = new GraphQLObjectType({
  name: "Course",
  fields: () => ({
    id: { type: GraphQLID },
    lecturer: {
      type: LecturerType,
      resolve(parent, args) {
        return Lecturer.findById(parent.lecturer);
      },
    },
    name: { type: GraphQLString },
    code: { type: GraphQLString },
    description: { type: GraphQLString },
    credits: { type: GraphQLInt },
    semester: { type: GraphQLInt },
    status: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    lecturer: {
      type: LecturerType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Lecturer.findById(args.id);
      },
    },
    lecturers: {
      type: new GraphQLList(LecturerType),
      resolve() {
        return Lecturer.find();
      },
    },
    courses: {
      type: new GraphQLList(CourseType),
      resolve(parent, args) {
        return Course.find();
      },
    },

    course: {
      type: CourseType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return Course.findById(args.id);
      },
    },
  },
});

// Mutations

const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    addLecturer: {
      type: LecturerType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const lecturer = new Lecturer({
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
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Course.find({ lecturer: args.id }).then((courses) =>
          courses.forEach((course) => course.remove())
        );

        return Lecturer.findByIdAndDelete(args.id);
      },
    },

    addCourse: {
      type: CourseType,
      args: {
        lecturer: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        code: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        credits: { type: GraphQLNonNull(GraphQLInt) },
        semester: {
          type: GraphQLNonNull(
            new GraphQLEnumType({
              name: "Semester",
              values: {
                ONE: { value: 1 },
                TWO: { value: 2 },
                THREE: { value: 3 },
              },
            })
          ),
        },
        status: {
          type: GraphQLNonNull(
            new GraphQLEnumType({
              name: "Status",
              values: {
                PENDING: { value: "Pending" },
                IN_PROGRESS: { value: "In Progress" },
                COMPLETED: { value: "Completed" },
              },
            })
          ),
        },
      },
      resolve(parents, args) {
        const newCourse = new Course({
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
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parents, args) {
        return Course.findByIdAndDelete(args.id);
      },
    },
    updateCourse: {
      type: CourseType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        code: { type: GraphQLString },
        description: { type: GraphQLString },
        credits: { type: GraphQLInt },
        semester: {
          type: new GraphQLEnumType({
            name: "SemesterUpdate",
            values: {
              ONE: { value: 1 },
              TWO: { value: 2 },
              THREE: { value: 3 },
            },
          }),
        },
        status: {
          type: new GraphQLEnumType({
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
        const { id, ...update } = args;
        return Course.findByIdAndUpdate(id, update, { new: true });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default schema;
