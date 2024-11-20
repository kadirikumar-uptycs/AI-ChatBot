require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const clc = require("cli-color");
const connectDB = require('./config/mongodb.js');
const router = require('./routes/routes.js');
const authRouter = require('./routes/auth-routes.js');
const requestModel = require('./models/requests.js');
const isAdmin = require('./middleware/isAdmin.js');
const isAuthenticated = require('./middleware/isAuthenticated.js');
const userRouter = require('./routes/user.js');
const userModel = require('./models/user.js');
require('./passport-setup.js');


// Colors to highlight
let info = clc.blue;
let highlight = clc.yellowBright.bgWhiteBright.bold.underline;


const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:17293", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));

app.use(
    (req, res, next) => {
        let message = info(req?.method, " request to route");
        let route = highlight(req?.path);
        console.log(message, route, '');

        const origin = req?.headers?.origin;
        let cookieInfo = {
            maxAge: 1000 * 60 * 60 * 24,
        }

        if (process.env.PRODUCTION_ENV === 'true') {
            // set response headers for Cross Domain Requests
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", origin);
            res.header("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override, Set-Cookie, Cookie");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            // set sameSite to none for cross domain requests
            cookieInfo.sameSite = 'none';
            cookieInfo.secure = true;
        }

        return session({
            name: 'TherapyBot',
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                autoRemove: 'native',
                collectionName: 'sessions',
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24,
            },
        })(req, res, next);
    })

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// api endpoints
app.use('/api', router);
app.use('/auth', authRouter);
app.use('/user', isAuthenticated, isAdmin, userRouter);


const PORT = 17291;

app.post('/request', async (req, res) => {
    try {
        let { email } = req.body;
        await connectDB();
        let user = await userModel.findOne({ email })
        if (user) return res.status(409).send({ error: "User Already Exists" });
        let requests = await requestModel.findOne({
            email, status: 'pending',
        })
        if (requests) {
            return res.status(200).send({ message: 'Request Already Exists, Wait until Admin Approves' });
        }
        await requestModel.create({ email });
        return res.status(200).send({ message: 'Request has been sent to Admin!' });
    } catch (error) {
        console.log(`error while adding New User Request\n${error}`);
        return res.status(500).send({ message: error?.message || 'Internal Server Error' });
    }
})

// Connect to MongoDB and then start the server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server listening at port ${PORT}`);
        });
    } catch (err) {
        console.error('⛔ Failed to start the server:', err);
    }
};
startServer();