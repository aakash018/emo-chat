import Login from '../components/Login/index'
import '../sass/index.module.scss'
import style from "../sass/Login.module.scss"
export default function Home() {

    return (
        <div className={style.container}>
            <Login />
        </div>
    )


}
