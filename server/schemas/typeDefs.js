const { gql } = require('apollo-server-express');


const typeDefs = gql`
    type Album {
        albumId: String
        title: String
    }
    type User {
        _id: ID
        username: String
        email: String
        albumCount: Int
        savedAlbums: [Album]
    }
    type Auth {
        token: ID!
        user: User
    }
    
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveAlbum(title: String!, albumId: String!): User
        removeAlbum(albumId: String!): User
    }
`;


module.exports = typeDefs;