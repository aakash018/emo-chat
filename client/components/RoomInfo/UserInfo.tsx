import Image from "next/image";
import style from "./style.module.scss"


interface Props {
    displayName: string,
    picture: string,
    online: boolean
}

const UserInfo: React.FC<Props> = ({ displayName, picture, online }) => {
    return (
        <div className={style.room_user_info}>
            <section className={`${style.profilePic} ${online ? style.online : ""}`}>
                <Image src={picture} width="40px" height="40px" />
            </section>
            <section className={`${style.displayName} ${online ? style.online_displayName : ""}`}>
                {displayName}
            </section>
        </div>
    )
}

export default UserInfo
