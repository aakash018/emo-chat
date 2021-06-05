import style from "./style.module.scss"
import { FaArrowRight } from 'react-icons/fa'

interface Props {
    toggle: boolean,
    toggleSetState: React.Dispatch<React.SetStateAction<boolean>>
}

const ToggleSlider: React.FC<Props> = ({ toggleSetState, toggle }) => {
    return (
        <div>
            <button
                className={style.roomsToggle}
                onClick={() => toggleSetState(prev => !prev)}>
                {toggle ? "x" : <FaArrowRight />}
            </button>
        </div>
    )
}

export default ToggleSlider
