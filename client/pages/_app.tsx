import { AppProps } from 'next/app'
import UserProvider from '../context/user'
import AlertBox from "../components/AlertBox/index"
import '../sass/sass_imports.scss'
import '../sass/globals.scss'
import { useEffect, useState } from 'react'
import { refreshToken } from 'utils/refresh_token'
import React from 'react'
import RoomProvider from 'context/room'

// ? For Global Alert ---

type TAlert = "error" | "message"

interface IAlert {
  alert: { type?: TAlert, message: string } | null,
  setAlert: React.Dispatch<React.SetStateAction<{ type?: TAlert, message: string } | null>> | null
}

export const AlertContext = React.createContext<IAlert>({
  alert: null,
  setAlert: null
})

// ? --- Ends

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [alert, setAlert] = useState<{ type?: TAlert, message: string } | null>({
    type: "error",
    message: ""
  })

  useEffect(() => {
    const tokenReq = setInterval(async () => {
      //? Dont Run if it is in logio page
      if (!(window.location.pathname === "/")) {
        console.log(await refreshToken())
      }
    }, 1000 * 60 * 13) // 13 minutes
    return (() => clearInterval(tokenReq))
  }, [])

  useEffect(() => {
    let resetAlert: any;
    if (alert?.message !== "") {
      resetAlert = setTimeout(() => {
        setAlert({
          message: ""
        })
      }, 2000) // 2 seconds

    }

    return (
      () => clearTimeout(resetAlert)
    )
  }, [alert])

  const value = {
    alert: alert,
    setAlert: setAlert
  }

  return (
    <UserProvider>
      <RoomProvider>
        <AlertContext.Provider value={value}>
          {alert?.message !== "" && <AlertBox type={alert!.type || "error"}>{alert?.message}</AlertBox>}
          <Component {...pageProps} />
        </AlertContext.Provider>
      </RoomProvider>
    </UserProvider>
  )
}

export default MyApp
