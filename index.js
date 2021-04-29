const {GraphQLServer} = require('graphql-yoga')
const mongoose = require('mongoose')

mongoose.connect('mongodb://root:123456@localhost:27017/shop?authSource=admin',{useNewUrlParser: true,useUnifiedTopology: true})

const User = mongoose.model('User', {
    fullname: String,
    username: String,
    phone_number: String,
    city: String
});

const typeDefs = `
  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }
  type User {
    id:ID!
    fullname: String!
    username: String!
    phone_number: String!
    city: String!
  }
  type Mutation {
    addUser(fullname: String!, username: String!, phone_number: String!, city: String!): User!,
    deleteUser(id: ID!): String
  }
`

const resolvers = {
    Query: {
        getUsers: () => User.find(),
        getUser: async (_,{id}) => {
            var result = await User.findById(id)
            return result;
        }
    },
    Mutation: {
        addUser: async (_,{fullname, username, phone_number, city}) => {
            const user = new User({fullname, username, phone_number, city})
            await user.save()
            return user;
        },
        deleteUser: async (_,{id}) => {
          await User.findByIdAndRemove(id)
          return "User deleted";
        }        
    }
}

const server = new GraphQLServer({typeDefs, resolvers})

mongoose.connection.once("open", function() {
  server.start(() => console.log('Sever is running in localhost:4000'))
})