import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService.js";
import { login, requireAuthenticated } from "../services/authService.js";

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

    createStudent: (_, { input }, context) => {
      requireAuthenticated(context);
      return createStudent(input);
    },

    updateStudent: (_, { id, input }, context) => {
      requireAuthenticated(context);
      return updateStudent(id, input);
    },

    deleteStudent: (_, { id }, context) => {
      requireAuthenticated(context);
      return deleteStudent(id);
    }
  }
};
