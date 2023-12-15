require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');


const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');
const session = require('express-session');

const app = express();
const PORT = 5000 || process.env.PORT;

//connect to database
connectDB();

// middleware to pass data trough forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
    //cookie: { maxAge: new Date(Date.now() + (3600000)) }
}))

app.use(express.static('public'));

//template engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;


app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});