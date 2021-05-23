import style from "./message.module.scss"

interface Props {

}

const MessageContainer: React.FC<Props> = ({ children }) => {
    return (
        <div className={style.messageContaienr}>
            <div className={style.profilePic} >
                <div></div>
            </div>
            <div className={style.message}>
                {children}
            </div>
        </div>
    )
}

export default MessageContainer
