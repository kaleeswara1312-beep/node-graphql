export const typeDefs = `#graphql

  # Student object type
  type Student {
    id: ID!
    name: String!
    email: String!
    age: Int!
    course: String!
    createdAt: String!
  }

  # Input for creating a student
  input CreateStudentInput {
    name: String!
    email: String!
    age: Int!
    course: String!
  }

  # Input for updating a student
  input UpdateStudentInput {
    name: String
    email: String
    age: Int
    course: String
  }

  # Read operations
  type Query {
    students: [Student!]!
    student(id: ID!): Student
  }

  # Write operations
  type Mutation {

    createStudent(input: CreateStudentInput!): Student!

    updateStudent(
      id: ID!
      input: UpdateStudentInput!
    ): Student

    deleteStudent(id: ID!): Student
  }
`;