import User from "../models/User.js"
import bcrypt from 'bcryptjs';

// Register user
export const register = async (req, res) => {
   try {
      const {username, password} = req.body;

      const isUsed = await User.findOne({ username });
      if(isUsed) {
         return res.json({
            massage: 'Цей username вже зайнятий'
         });
      }

      //Складність хешування паролю
      const salt = bcrypt.genSaltSync(10);
      //Створюю хеш, хешируэмо password
      const hash = bcrypt.hashSync(password, salt);

      //Створюю нового юзера по схемі User
      const newUser = new User({
         username,
         password: hash,
      });

      //Зберігаю нового юзера
      await newUser.save();

      res.json({
         newUser,
         massage: 'Реєстрація пройшла успішно.',
      })
   } catch (error) {
      res.json({massage: 'Помилка при реєстрації.'});
   }
}

// Login user
export const login = async (req, res) => {
   try {

   } catch (error) {}
}

//Get me
export const getMe = async (req, res) => {
   try {

   } catch (error) {}
}