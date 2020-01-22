var cors = require('cors');
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');


//construct schema using GQL schema language
var schema = buildSchema(`
    type Query {
        costEmp(name: String): Int,
        costDep(names: [String]): Int
    }
`);

// add resolvers for both to root object
var root = {
    costEmp: (args) => {
        if (args.name) {
            let nombre = args.name;
            nombre = nombre.toUpperCase();
            return nombre.startsWith('A') ? 900 : 1000
        } else {
            return 0;
        }
    },
    costDep: (args) => {
        if (args.names) {
            let nombres = args.names;
            //convert to upper
            nombres = nombres.map(x => x.toUpperCase());
            // hash to cost
            let values = nombres.map(n => {
                if (/^[a-zA-Z][a-zA-Z\s.-]*$/.test(n)) {
                    return n.startsWith('A') ? 450 : 500
                } else {
                    return 0;
                }
            });
            // sum up!
            return values.reduce((a,b) => a + b, 0);
        } else {
            return 0;
        }
    }
};

// set up  GQL API server with express
//enable graph i tool
var app = express();
app.use(cors({credentials: true, origin: true}));
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');


