const passport = require('passport');
const {Strategy} = require('passport-local');
const bcrypt = require('bcrypt');

const User = require('../models/user');


passport.use(new Strategy({usernameField:"email"},async (email,password,done)=>{
    try {
        const user = await User.findOne({email});
        if(!user){
            return done(null,false,{message:"کاربری با این ایمیل ثبت نشده است."});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            return done(null,user);//req.user
        }else{
            return done(null,false,{message:"رمز عبور یا نام کاربری اشتباه است."});
        }
    } catch (err) {
        console.log(err)
    }
}));

passport.serializeUser((user,done)=>{
    done(null,user)
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    })
})

