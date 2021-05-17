import axios from "axios";
import jwt_decode from "jwt-decode"

interface IJWT {
    user: IUser,
    iat: number,
    exp: number

}

export const refreshToken = async () => {
    const res = await axios.get<{ token: string }>("http://localhost:5000/auth/getToken", {
        withCredentials: true
    })
    if (!res.data.token) {
        return null
    } else {
        localStorage.setItem("token", res.data.token)
        return jwt_decode(res.data.token) as IJWT;
    }
}
