import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  // hashSync is used like a await function ... hme await function use karne ki jarurat nhi hai
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    // yeh response mei show hoga...ThunderClienr k
    res.status(201).json('User created successfully!');
  } catch (error) {
    // to apn errorHandler ka bhi use krke message show kr sakte hai jo apne duara banaya gaya hai ... yeh file utls mei error.js k naam save hai or apn isme statusCode or msg send kar rahe hai ... isme hamesha msg error from the function hi show hoga
    // next(errorHandler(550, 'error from the function'));

    // jab bhi thunderclient mei jab user signup karta hai tb yadi email same hai to yeh error show karta hai to vo error middleware ki through show hota hai
    next(error);
  }
  // console.log(req.body);
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    // if the email is not correct 
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    // bycryptjs is used beacuse if we are writing normal password but in database there is a hash password so bycryptjs will compare the password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // hm jab signin karte hai thunderclient k response mei uska pura data show ho jaata hai but hm password ko nhi chahte vo show ho bhale hi password hashpassword ho but we want that rest things will show so we are using validUser._doc
    const { password: pass, ...rest } = validUser._doc;
    // we are just saving the token in our cookies and httpOnly is used so that no one can access out token
    // access_token is created by JWT_SECRET key  
    res.cookie('access_token', token, { httpOnly: true }).status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          // to yadi hme name ko uppercase mei add karna hai to m toUpperCase() yeh use karenge or yadi lowercase mei show karna hai to toLowerCase() mei show karenge  
          // req.body.name.toUpperCase() ,
          req.body.name.split(' ').join('').toLowerCase() ,
          // yaha hmne jaha p bhi split ho raha tha usko join kr diya ab username bina space k show hoga or hme yadi username ko unique banane hai to username k aage randomly no generate kr do
          // + Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
