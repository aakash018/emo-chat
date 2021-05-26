import { useRouter } from "next/router"
import { useContext, useEffect } from "react";
import Image from "next/image"
import Head from "next/head"
import { useUser } from "context/user";
import RoomProvider from "context/room"
import style from "../sass/dash.module.scss"
import UserProfile from "components/UserProfile";
import { refreshToken } from "utils/refresh_token";
import ChatContainer from "components/ChatContainer";
import RoomContainer from "components/RoomsContainer";





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

    return (
        <>
            <Head>
                <title>EmoChat</title>
            </Head>
            <div className={style.dash}>
                {currentUser?.picture &&

                    <div className={style.dash__head}>
                        <div className={style.logo}>
                            <Image src="/assets/logo.svg" alt="logo" width="50px" height="50px" />
                            <h1>EmoChat</h1>
                        </div>
                        {console.log(currentUser!.picture)}
                        <UserProfile picture={currentUser!.picture} displayName={currentUser!.displayName} />
                    </div>
                }
                <div className="main">

                </div>
                <div className={style.body}>
                    <RoomProvider>
                        <RoomContainer />
                        <ChatContainer />
                    </RoomProvider>
                </div>

            </div>
        </>
    )
}

export default Dash;
