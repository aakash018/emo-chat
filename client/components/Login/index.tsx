import MainButton from "../MainButton"
import { FaGoogle } from "react-icons/fa"

import style from "./style.module.scss"


const Login: React.FC<{ disable: boolean }> = ({ disable }) => {

    const handleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/google`
    }

    return (
        <div className={style.login}>
            <div className={style.welcomeText}>
                <span className={style.welcomeText__hey}><h1>Hey,</h1></span>
                <span className={style.welcomeText__welcome} >Welcome To <h3>EmoChat</h3></span>
            </div>
            <div className={style.loginButton}>
                <MainButton type="button" onClick={handleLogin} disable={disable}>
                    <FaGoogle /> Login with Google
                </MainButton>
            </div>
        </div>
    )
}

export default Login
