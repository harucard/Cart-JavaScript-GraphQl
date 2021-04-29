const {GraphQLServer} = require('graphql-yoga')
const mongoose = require('mongoose')

mongoose.connect('mongodb://root:123456@localhost:27017/shop?authSource=admin',{useNewUrlParser: true,useUnifiedTopology: true})

const Product= mongoose.model('Product', {
    name: String,
    description: String,
    quantity: Number, 
    price: Number 
});

const typeDefs = `
  type Query {
    getProduct(id: ID!): Product
    getProducts: [Product]
  }
  type Product{
    id:ID!
    name: String!
    description: String! 
    quantity: Int!
    price: Float!
  }
  type Mutation {
    addProduct(name: String!, description: String!, quantity: Int!, price: Float!): Product!,
    deleteProduct(id: ID!): String
  }
`

const resolvers = {
    Query: {
        getProducts: () => Product.find(),
        getProduct: async (_,{id}) => {
            var result = await Product.findById(id)
            return result;
        }
    },
    Mutation: {
        addProduct: async (_,{name,description, quantity,price}) => {
            const product = new Product({name,  description, quantity, price})
            await product.save()
            return product;
        },
        deleteProduct: async (_,{id}) => {
          await Product.findByIdAndRemove(id)
          return "Product deleted";
        }        
    }
}

const server = new GraphQLServer({typeDefs, resolvers})

mongoose.connection.once("open", function() {
  server.start(() => console.log('Sever is running in localhost:4000'))
})