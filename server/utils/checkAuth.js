import jwt from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
   //шукаю токен
   const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

   if(token) {
      try{
         //Розшифровую токен
         const decoded = jwt.verify(token, process.env.JWT_SECRED);

         //Добавляю поле userId та вшиваю в нього розшифрований токен
         req.userId = decoded.id;

         //Ця функція дозволяє у роутах виконувати наступну функцію
         next()
      } catch(error) {
         return res.json({massage: 'Немає доступу',});
      }
   } else {
      return res.json({massage: 'Немає доступу',});
   }
}