import ChatContainer from "components/ChatContainer";
import RoomContainer from "components/RoomsContainer";
import UserProfile from "components/UserProfile";
import { useUser } from "context/user";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import socket from "socket";
import { refreshToken } from "utils/refresh_token";
import style from "../sass/dash.module.scss";






const Dash: React.FC = () => {
    const router = useRouter()
    const { currentUser, setCurrentUser } = useUser()
    useEffect(() => {
        (async () => {
            if (!currentUser?.id) {
                const decoded = await refreshToken()
                if (decoded) {
                    const { user } = decoded
                    if (setCurrentUser) {
                        setCurrentUser(user)
                    }
                } else {
                    router.push("/")
                }
            }
        })()
    }, [])

    useEffect(() => {
        if (currentUser) {
            const payload = {
                userID: currentUser?.id
            }
            socket.emit("user-loged-on", payload)
        }
    }, [currentUser])

    return (
        <>
            <Head>
                <title>EmoChat</title>
            </Head>
            <div className={style.dash}>
                {currentUser?.picture &&
                    <>
                        <div className={style.dash__head}>
                            <div className={style.logo}>
                                <Image src="/assets/logo.svg" alt="logo" width="50px" height="50px" />
                                <h1>EmoChat</h1>
                            </div>
                            <UserProfile picture={currentUser!.picture} displayName={currentUser!.displayName} />
                        </div>
                        <div className="main">

                        </div>
                        <div className={style.body}>

                            <RoomContainer />
                            <ChatContainer />

                        </div>

                    </>
                }
            </div>
        </>
    )
}

export default Dash;
