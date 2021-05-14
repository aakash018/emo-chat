import React, { useContext, useState } from 'react'


interface IUserData {
    currentUser: IUser | null,
    setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>> | null
}

const UserContext = React.createContext<IUserData>({
    currentUser: null,
    setCurrentUser: null
})
export const useUser = () => {
    return useContext(UserContext)
}

const UserProvider: React.FC = ({ children }) => {

    const [currentUser, setCurrentUser] = useState<IUser | null>(null)


    const value = {
        currentUser,
        setCurrentUser
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider
