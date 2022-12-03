import User from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register user
export const register = async (req, res) => {
   try {
      const {username, password} = req.body;

      const isUsed = await User.findOne({ username });
      if(isUsed) {
         return res.json({
            massage: 'Цей username вже зайнятий.'
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
      const {username, password} = req.body;

      const user = await User.findOne({username})
      if(!user) {
         return res.json({massage: 'Такого користувача немає.',});
      }

      //Функція compare дозволяє порівняти пароль котрий ввели та хешируваний пароль користувача
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if(!isPasswordCorrect) {
         return res.json({massage: 'Ви невірно ввели пароль.',})
      }

      //token потрібен для того щоб розуміти залогінились ми чи ні
      const token = jwt.sign(
         {
            id: user._id,
         },
         process.env.JWT_SECRED,
         { expiresIn: '30d' },
      );

      res.json({
         token,
         user,
         massage: 'Ви уійшли в систему.',
      });
   } catch (error) {
      res.json({massage: 'Помилка при авторізації',})
   }
}

//Get me цей роут завжди спрацьовувати при оновлювлені сторінки щоб не доводилося логінитись про кожному оновленю сторінки
export const getMe = async (req, res) => {
   try {
      //userId це той що я вшив де розшифровував токет (checkAuth.js 13 рядок)
      const user = await User.findById(req.userId);
      if(!user) {
         return res.json({massage: 'Такого користувача немає.',});
      }

      const token = jwt.sign(
         {
            id: user._id,
         },
         process.env.JWT_SECRED,
         { expiresIn: '30d' },
      );

      res.json({
         user,
         token,
      });
   } catch (error) {
      res.json({massage: 'Немає доступу',});
   }
}