const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('./models/user.js');
const connectDB = require('./config/mongodb.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            await connectDB();
            const email = profile?.emails[0]?.value;
            if (!email) {
                return done(null, false, { message: 'Email not provided' });
            }
            let user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            if (user?.profileImage !== profile?.photos[0]?.value) {
                try {
                    await userModel.findByIdAndUpdate(user?.id, {
                        $set: {
                            profileImage: profile?.photos[0]?.value,
                            name: profile?.displayName,
                        }
                    });
                } catch (err) { }
            }
            done(null, user);
        } catch (err) {
            done(err, false, { message: err });
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        await connectDB();
        const user = await userModel.findById(id);
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        done(null, user);
    } catch (err) {
        done(err, false, { message: err?.message || err });
    }
});