import passport from "passport";
import { Strategy } from "passport-google-oauth2";
import { User } from "../entities/Users";
import { getConnection } from "typeorm";

//? Google Auth
passport.use(new Strategy({
    clientID: "134958429648-ivf670a18j39i6gpgpf4e1ge0lt19l4t.apps.googleusercontent.com",
    clientSecret: "G4YbR8xBDMby4yJW1LQ_IzP-",
    callbackURL: "http://localhost:5000/auth/google/callback",
    passReqToCallback: true,
},
    async (_: any, __: any, ___: any, profile: any, done: any) => {
        const { displayName, given_name, family_name, email, picture } = profile
        try {

            if (await User.find({ where: { email } })) {
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
