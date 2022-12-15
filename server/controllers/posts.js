import Post from '../models//Post.js';
import User from '../models/User.js';
import path, { dirname } from 'path';
import { fileURLToPath }  from 'url';

// Create Post
export const createPost = async (req, res) => {
   try {
      const { title, text } = req.body;
      const user = await User.findById(req.userId);

      // Даю назву файлу та переміщаю файл в паку /uploads
      if(req.files) {
         // Формую назву файлу
         let fileName = Date.now().toString() + req.files.image.name;

         // Отримую ту папку де я находжуся(/controllers)
         const __dirname = dirname(fileURLToPath(import.meta.url));

         // За допомогою функції mv(), пореміщаю файл в паку /uploads
         req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

         const newPostWithImage = new Post({
            username: user.username,
            title,
            text,
            imgUrl: fileName,
            author: req.userId,
         });

         // Створюю пост
         await newPostWithImage.save();

         // Знаходжу User, та в його масив posts, пушу новий пост
         await User.findByIdAndUpdate(req.userId, {
            $push: { posts: newPostWithImage },
         });

         return res.json(newPostWithImage);
      }

      //Пост без картинки
      const newPostWithoutImage = new Post({
         username: user.username,
         title,
         text,
         imgUrl: '',
         author: req.userId,
      });

      await newPostWithoutImage.save();

      await User.findByIdAndUpdate(req.userId, {
         $push: { posts: newPostWithoutImage },
      });

      res.json(newPostWithoutImage);
   } catch (error) {
      res.json({ massage: 'Щось пішло не так.' });
   }
}