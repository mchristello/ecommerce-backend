// Imports de Express
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
// Imports de Mongo
import MongoStore from 'connect-mongo';
// Import de Utils 
import { PORT, MONGO_URI, dbName, connectMongo } from '../src/utils/index.js'
import { __dirname } from './dirname.js'
import bodyParser from 'body-parser';
import initializePassport from './config/passport.config.js';
// Import routes
import { sessionRouter, cartRouter, productRouter, viewsRouter } from './routes/index.js';
import passport from 'passport';


const app = express();

// Config del server
const httpServer = app.listen(PORT, console.log(`Server up & running on port ${PORT}`));

// Config de Express 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// MongoDB
connectMongo();

// Config de sessions
app.use(session({
    sotre: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: dbName,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100,
    }),
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));

// Inicializar Passport
initializePassport();
app.use(passport.initialize())
app.use(passport.session())

// Config de Handlebars 
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Rutas
// SESSIONS
app.use('/sessions', sessionRouter);


// PRODUCTS 
app.use('/api/products', productRouter);

// CART 
app.use('/api/carts', cartRouter);

// VIEWS 
app.use('/', viewsRouter);

app.get('/', (req, res) => { res.send(`This is working...go on.`)});
