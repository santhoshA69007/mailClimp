//jshint esversion:6
const express=require('express');
const https=require('https');
const app=express();
require('dotenv').config();
console.log(process.env.API_KEY )
app.use(express.urlencoded({ extended: true }));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})
app.post("/signup",function(req,res){
    const email= req.body.email;
    const password= req.body.password;
    const fName=req.body.firstName;
    const lName=req.body.lastName;
    // This part of the code for sending object that contains values that we are sending it to destination api server or requesting to store the values 
    const data={
        members:[
            {
        email_address: email,
        status: "subscribed",
        merge_fields:{
            FNAME: fName,
            LNAME: lName,
        }
        }
        ]
    };
    const jsonData=JSON.stringify(data);
    //https request using this option object what kind of request in this case post and also for accesing we need key that is the api key
    const options={
        method:"POST",
        auth:process.env.API_KEY,
    }
    const url="https://us21.api.mailchimp.com/3.0/lists/843903887f";
    const request=https.request(url,options,function(response){
        
        if(response.statusCode===200){
            console.log("sucess");
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        console.log(response);
        console.log(response.statusCode);
         response.on("data",function(){
            console.log(data);
        });

    });
    request.write(jsonData)
    request.end()
   
})
//failure route
app.post("/failure",function(req,res){
    res.redirect("/");
})
//this for heroku server
app.listen(process.env.PORT,function(){
    console.log("sever is runing on port 3000");
});


// 15c2b3debb61eeac37e4aa74f4b2ea7c-us21
// 843903887f