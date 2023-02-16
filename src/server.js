// Imports de Express
import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
// Import de MongoStore
import MongoStore from 'connect-mongo';
// Imports de UTILS 
import { connectMongo, passportCall } from '../src/utils/index.js';
import { __dirname } from '../src/dirname.js';
import bodyParser from 'body-parser';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';
// Import Coustom Routes
import SessionRouter from './routers/session.router.js';
import ViewsRouter from './routers/views.router.js';
import ProductRouter from './routers/product.router.js';
import CartRouter from './routers/cart.router.js';
import UserRouter from './routers/user.router.js';
// Import variables de ent.
import config from '../src/config/config.js';


const app = express();

// Coustom Routers Config
const productRouter = new ProductRouter();
const cartRouter = new CartRouter();
const sessionRouter = new SessionRouter();
const userRouter = new UserRouter();
const viewsRouter = new ViewsRouter();

// Server 
// const PORT = 5000
const HTTPServer = app.listen(config.PORT, console.log(`Server running OK, in port ${config.PORT}`));

// Express 
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(config.COOKIE_SECRET)); // Misma key que la config de JWT

// Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// MongoDB
connectMongo();

// Session
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        dbName: config.DB_NAME,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 10000
    }),
    secret: 'S@nsa2018',
    resave: true,
    saveUninitialized: true
}));

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use('/', viewsRouter.getRouter());

app.use('/users', passportCall('jwt'), userRouter.getRouter());

app.use('/api/sessions', sessionRouter.getRouter());

app.use('/api/products', productRouter.getRouter());

app.use('/api/carts', cartRouter.getRouter());