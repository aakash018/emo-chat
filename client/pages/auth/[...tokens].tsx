import { useRouter } from "next/router"
import React from "react"

const Auth: React.FC = () => {

    const route = useRouter()

    console.log(route.query)

    return (
        <div>

        </div>
    )
}

export default Auth
