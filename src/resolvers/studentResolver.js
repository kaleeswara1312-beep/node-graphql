import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService.js";

export const resolvers = {

  // READ OPERATIONS
  Query: {

    students: () => {
      return getAllStudents();
    },

    student: (_, { id }) => {
      return getStudentById(id);
    }

  },

  // WRITE OPERATIONS
  Mutation: {

    createStudent: (_, { input }) => {
      return createStudent(input);
    },

    updateStudent: (_, { id, input }) => {
      return updateStudent(id, input);
    },

    deleteStudent: (_, { id }) => {
      return deleteStudent(id);
    }

  }

};