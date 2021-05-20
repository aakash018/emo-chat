import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import { User } from "../entities/Users";
import { getConnection } from "typeorm";

//? Google Auth
passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOODLE_CLIENT_SECRET, //IVvMi7-ERFHKj6NayInh5QBn
    callbackURL: `${process.env.SERVER_END_POINT}/auth/google/callback`,
    passReqToCallback: true,
},
    async (_: any, __: any, ___: any, profile: any, done: any) => {
        console.log(process.env.GOODLE_CLIENT_SECRET)
        const { displayName, given_name, family_name, email, picture } = profile
        try {
            if (await User.findOne({ where: { email } })) {
                done(null, profile)
            } else {
                await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values(
                        {
                            displayName,
                            firstName: given_name,
                            lastName: family_name,
                            email,
                            picture
                        }
                    )
                    .execute();
                done(null, profile)
            }
        } catch (e) {
            if (e.code === '23505') {
                console.log("User Exists")
            } else {
                console.error(e)
            }
        }
    }
));
