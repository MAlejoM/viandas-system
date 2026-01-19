import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req,res)=>{
    res.json({
    status: 'OK',
    message: 'api andando',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, ()=>{
  console.log('server running IN http://localhost:${PORT}');
  console.log('ENVIRONMENT: ${PROCESS.ENV.node_env}');
});