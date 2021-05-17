import { useUser } from 'context/user'
import { useRouter } from 'next/router'
import Head from "next/head"
import React, { useEffect, useState } from 'react'
import { refreshToken } from 'utils/refresh_token'
import Login from '../components/Login/index'
import '../sass/index.module.scss'
import style from "../sass/Login.module.scss"
const Home = () => {

    const router = useRouter()
    const { setCurrentUser } = useUser()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const decoded = await refreshToken()
            if (decoded) {
                const { user } = decoded
                if (setCurrentUser) {
                    setCurrentUser(user)
                }
                router.push("/dash")
            } else {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className={style.container}>
                <Login disable={loading} />
            </div>
        </>
    )


}

export default Home
