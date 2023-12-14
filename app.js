require('dotenv').config();

const express=require('express');
const expressLayout=require('express-ejs-layouts');
const connectDB=require('./server/config/db');

const app=express();
const PORT=5000 || process.env.PORT;

//connect to database
connectDB();

// middleware to pass data trough forms
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static('public'));

//template engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.use('/',require('./server/routes/main'));



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});