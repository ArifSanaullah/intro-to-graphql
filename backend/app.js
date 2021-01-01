const express = require('express');
const { json } = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const grapchQlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');
const isAuth = require('./middlewares/auth');

const app = express();

app.use(json());
app.use(cors());
app.use(isAuth);

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);

	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}

	return next();
});

app.use(
	'/graphql',
	graphqlHTTP({
		schema: grapchQlSchema,
		rootValue: graphqlResolvers,
		graphiql: true,
	})
);

const PORT = 8000;

mongoose
	.connect(
		`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9noml.mongodb.net/events-app?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		}
	)
	.then(() => {
		console.log(
			'🚀 ~ file: app.js ~ line 73 ~ mongoose.connect.then ~ connected to DATABASE '
		);

		app.listen(PORT, null, () => {
			const log = `Listening on port ${PORT}`;
			console.log('🚀 ~ file: app.js ~ line 77 ~ app.listen ~ log', log);
		});
	})
	.catch(({ message: errorMessage }) => {
		console.log(
			'🚀 ~ file: app.js ~ line 76 ~ ).then ~ errorMessage',
			errorMessage
		);
	});

// for local db - comment above connect function && uncomment below one

// mongoose
// 	.connect(`mongodb://localhost:27017`, {
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useCreateIndex: true,
// 		useFindAndModify: false,
// 	})
// 	.then(() => {
// 		console.log(
// 			'🚀 ~ file: app.js ~ line 73 ~ mongoose.connect.then ~ connected to DATABASE '
// 		);

// 		app.listen(PORT, null, () => {
// 			const log = `Listening on port ${PORT}`;
// 			console.log('🚀 ~ file: app.js ~ line 77 ~ app.listen ~ log', log);
// 		});
// 	});
