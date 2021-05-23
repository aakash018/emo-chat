interface Props {
    type: 'error' | 'message'
}
import style from "./style.module.scss"
const AlertBox: React.FC<Props> = ({ type, children }) => {
    return (
        <div className={`${style.alert} ${style}`}>
            {children}
        </div>
    )
}

export default AlertBox
