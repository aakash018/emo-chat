import { AppProps } from 'next/app'
import UserProvider from '../context/user'
import '../sass/sass_imports.scss'
import '../sass/globals.scss'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default MyApp
