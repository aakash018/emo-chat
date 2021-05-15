// import { useUser } from "context/user"

import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"
import jwt_decode from "jwt-decode";
import { useUser } from "context/user";

interface IJWT {
    user: IUser,
    iat: number,
    exp: number

}

const Dash: React.FC = () => {
    const router = useRouter()
    const { currentUser, setCurrentUser } = useUser()

    useEffect(() => {
        (async () => {
            const res = await axios.get<{ token: string }>("http://localhost:5000/auth/getToken", {
                withCredentials: true
            })
            console.log(res.data)
            if (!res.data.token) {
                router.push("/")
            } else {
                localStorage.setItem("token", res.data.token)
                const decoded: IJWT = jwt_decode(res.data.token);
                console.log(decoded)
                const { user } = decoded

                //! Bad Code, I KNOW

                if (setCurrentUser) {
                    setCurrentUser(user)
                }
            }
        })()
    }, [])


    const handleCheck = async () => {
        const res = await axios.post("http://localhost:5000/auth/test", { token: localStorage.getItem("token") })
        console.log(res.data)
    }

    return (
        <div>
            This is dash board. <h1 style={{ color: "white" }}>{currentUser?.displayName}</h1>
            <button onClick={handleCheck}>TEST</button>
        </div>
    )
}

export default Dash;
