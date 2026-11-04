import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService.js";
import { login, requireAuthenticated } from "../services/authService.js";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();
const STUDENT_CHANGED = "STUDENT_CHANGED";

export const resolvers = {
  Query: {
    students: (_, __, context) => {
      requireAuthenticated(context);
      return getAllStudents();
    },

    student: (_, { id }, context) => {
      requireAuthenticated(context);
      return getStudentById(id);
    }
  },

  Mutation: {
    login: (_, { email, password }) => login(email, password),

    createStudent: async (_, { input }, context) => {
      requireAuthenticated(context);
      const student = createStudent(input);
      await pubsub.publish(STUDENT_CHANGED, {
        studentChanged: { type: "CREATED", student }
      });
      return student;
    },

    updateStudent: async (_, { id, input }, context) => {
      requireAuthenticated(context);
      const student = updateStudent(id, input);

      if (student) {
        await pubsub.publish(STUDENT_CHANGED, {
          studentChanged: { type: "UPDATED", student }
        });
      }

      return student;
    },

    deleteStudent: async (_, { id }, context) => {
      requireAuthenticated(context);
      const student = deleteStudent(id);

      if (student) {
        await pubsub.publish(STUDENT_CHANGED, {
          studentChanged: { type: "DELETED", student }
        });
      }

      return student;
    }
  },

  Subscription: {
    studentChanged: {
      subscribe: (_, __, context) => {
        requireAuthenticated(context);
        return pubsub.asyncIterableIterator([STUDENT_CHANGED]);
      }
    }
  }
};
