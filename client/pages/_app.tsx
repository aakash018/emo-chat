import { AppProps } from 'next/app'
import UserProvider from '../context/user'
import '../sass/sass_imports.scss'
import '../sass/globals.scss'
// import { useEffect } from 'react'


const MyApp = ({ Component, pageProps }: AppProps) => {

  // useEffect(() => {
  //   const tokenReq = setInterval(() => {
  //     //? Dont Run if it is in logio page
  //     if (!(window.location.pathname === "/")) {
  //       console.log("it is running")
  //     }
  //   }, 1000 * 80)
  //   return (() => clearInterval(tokenReq))
  // }, [])

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
