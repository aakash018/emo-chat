import { AppProps } from 'next/app'
import UserProvider from '../context/user'
import '../sass/sass_imports.scss'
import '../sass/globals.scss'
import { useEffect } from 'react'
import { refreshToken } from 'utils/refresh_token'


const MyApp = ({ Component, pageProps }: AppProps) => {

  useEffect(() => {
    const tokenReq = setInterval(async () => {
      //? Dont Run if it is in logio page
      if (!(window.location.pathname === "/")) {
        console.log(await refreshToken())
      }
    }, 1000 * 60 * 13) // 13 minutes
    return (() => clearInterval(tokenReq))
  }, [])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
