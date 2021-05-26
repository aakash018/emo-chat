import React from 'react'
import style from "./style.module.scss"
import Image from "next/image"

interface Props {
    picture: string,
    displayName: string
}

const UserProfile: React.FC<Props> = ({ picture, displayName }) => {
    return (
        <>
            <div className={style.profile}>
                <section className={style.profilePic}>
                    <Image src={picture} alt="profile-pic" width="50px" height="50px" />
                </section>
                <section className={style.info}>
                    <h5>{displayName}</h5>
                    <span>online</span>
                </section>
            </div>
        </>
    )
}

export default UserProfile
