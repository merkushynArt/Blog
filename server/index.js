import expess from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

const app = expess();
dotenv.config();

//Constants
const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

//Middleware
//Ми можемо відправляти запроси до нашого бекенда з різних ір адрес
app.use(cors());
//Express буде розуміти що дані з фронту будуть приходити у форматі json
app.use(expess.json());

//Routes
//http://localhost:3002/
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
   res.json({message: 'All is fine'});
});

async function start() {
   try{
      await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.sso7a4s.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`);

      app.listen(PORT, () => console.log(`Server started on port: ${PORT}, http://localhost:3002/`));
   } catch(error) {
      console.log(error);
   }
}
start();