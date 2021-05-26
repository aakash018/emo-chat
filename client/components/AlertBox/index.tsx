interface Props {
    type: 'error' | 'message'
}
import style from "./style.module.scss"
const AlertBox: React.FC<Props> = ({ type, children }) => {
    return (
        <div className={style.alertWraper} >
            <div className={`${style.alert} ${style[type]}`}>
                {children}
            </div>
        </div>
    )
}

export default AlertBox
