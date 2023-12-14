const express=require('express');
const router=express.Router();

const locals={
    title:'Ninov Blog',
    description:'This is a blog website made with Node.js and Express.js and MongoDb',
};

router.get('/',(req,res)=>{  

    res.render('index',{locals});    
});

router.get('/about',(req,res)=>{

    res.render('about',{locals});    
});

router.get('/contact',(req,res)=>{

    res.render('contact',{locals});    
});


module.exports=router;