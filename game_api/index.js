const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const gamerRouter = require("./routes/gamer");
// const connection = require('./db')

const PORT =process.env.PORT || 5000

const options ={
  definition:{
    openapi: "3.0.0",
    info:{
       title: "GAME",
       version: "1.0.0 " ,
       description: "GAMERS details api",
    },
    servers: [
      {
       url: "http://localhost:5000",
      },
    ],
  },
  apis:["./routes/*.js"],
};

const specs = swaggerJsDoc(options)
const app = express();
// app.get('/',(req,res)=>{
//   res.send("game");
// }); 

app.get('/api/gamer',(req,res)=>{
  let sql ="select * from gamer";
  connection.query(sql,function(err,results){
    if(err) return err;
    res.send(results);
  })
});



app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs));

app.use(cors()); 
app.use(express.json());
app.use(morgan("dev")); 

app.use("/gamer",gamerRouter)

app.listen(PORT,()=>{
    console.log('server is runningon port ${PORT}');
});