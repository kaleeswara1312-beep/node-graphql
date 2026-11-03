import { randomUUID } from "node:crypto";
import { students } from "../data/students.js";
import { GraphQLError } from "graphql";

// READ ALL STUDENTS
export const getAllStudents = () => {
  return students;
};

// READ ONE STUDENT
export const getStudentById = (id) => {
  return students.find((student) => student.id === id) || null;
};

// CREATE STUDENT
export const createStudent = (input) => {

  const existingStudent = students.find(
    (student) => student.email === input.email
  );

  if (existingStudent) {
    throw new GraphQLError("Email already exists", {
      extensions: {
        code: "BAD_USER_INPUT",
        http:{
          status: 400
        }
      }
    });
  }

  if (input.age <= 0) {
    throw new GraphQLError("Age must be greater than zero", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  const newStudent = {
    id: randomUUID(),
    ...input,
    createdAt: new Date().toISOString()
  };

  students.push(newStudent);

  return newStudent;
};

// UPDATE STUDENT
export const updateStudent = (id, input) => {

  const studentIndex = students.findIndex(
    (student) => student.id === id
  );

  if (studentIndex === -1) {
    throw new GraphQLError("Student not found", {
      extensions: {
        code: "NOT_FOUND"
      }
    });
  }

  if (
    Object.hasOwn(input, "age") &&
    input.age !== null &&
    input.age <= 0
  ) {
    throw new GraphQLError("Age must be greater than zero", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  if (
    Object.hasOwn(input, "email") &&
    input.email !== null &&
    students.some(
      (student) =>
        student.email === input.email && student.id !== id
    )
  ) {
    throw new GraphQLError("Email already exists", {
      extensions: {
        code: "BAD_USER_INPUT"
      }
    });
  }

  const updatedStudent = {
    ...students[studentIndex],
    ...input
  };

  students[studentIndex] = updatedStudent;

  return updatedStudent;
};

// DELETE STUDENT
export const deleteStudent = (id) => {

  const studentIndex = students.findIndex(
    (student) => student.id === id
  );

  if (studentIndex === -1) {
    throw new GraphQLError("Student not found", {
      extensions: {
        code: "NOT_FOUND"
      }
    });
  }

  const deletedStudent = students[studentIndex];

  students.splice(studentIndex, 1);

  return deletedStudent;
};