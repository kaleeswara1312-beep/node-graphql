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

  type AuthUser {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: AuthUser!
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
    login(email: String!, password: String!): AuthPayload!

    createStudent(input: CreateStudentInput!): Student!

    updateStudent(
      id: ID!
      input: UpdateStudentInput!
    ): Student

    deleteStudent(id: ID!): Student
  }
`;