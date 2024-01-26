import express from "express";
import cors from "cors";
import { createHash } from 'crypto';

const PORT = 8080;
const app = express();

const database = { 
  data: "Hello World",
  version: 2, 
  previous: [
    {
      data: 'Hello World :)',
      version: 1
    }
  ]
};

app.use(cors());
app.use(express.json());


const generateHash = async(data: string) =>{
  return await createHash('sha256').update(data).digest('hex');
}


// Routes
app.get("/", (req, res) => {
  res.json({data: database.data});
});

app.post("/", async (req, res) => {
  const {data, hash} = req.body;

  const hashData = await generateHash(data);

  console.log('data', data, hashData, hash)

  if(hashData === hash){
    const nextVersion = database.version+1;
    database.previous.push({
      data: database.data,
      version: database.version
    })
    database.data = req.body.data;
    database.version = nextVersion;
    res.sendStatus(200);
  }else
    res.sendStatus(400)
});

app.post("/recover", async (req, res) => {
  const lastElement = database.previous.pop()
  if(lastElement){  
    database.data = lastElement.data;
    database.version = lastElement.version;
   res.json({data: database.data})
  }else{
    res.sendStatus(400);
  }
});


app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
