import express from "express";
import cors from "cors";
import crypto from 'crypto'
const PORT = 8080;
const app = express();
const database = { data: "Hello World" };
app.use(cors());
app.use(express.json());
const generateHash=(data:string)=>{
  return crypto.createHash('sha256').update(data).digest('hex')
}
const backup={...database,hash:generateHash(database.data)}

// Routes

app.get("/", (req, res) => {
  res.json({...database,hash:generateHash(database.data)});
});

app.post("/", (req, res) => {
  database.data = req.body.data;
  res.sendStatus(200);
});
app.get("/recover",(req,res)=>{
  if(backup.data && backup.hash){
    res.json({ data: backup.data, hash: backup.hash });
  }else{
    res.sendStatus(404).send('No backup data found');
  }
})
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
