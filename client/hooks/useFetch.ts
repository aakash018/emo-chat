import axios, { AxiosResponse } from "axios";

type method = "GET" | "POST"

export const useFetch = async <T>(
    method: method,
    path: string,
    data?: { [key: string]: any })
    : Promise<AxiosResponse<T> | undefined> => {

    let res;
    if (method === "GET") {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            params: data
        })

        return res;
    }

    if (method === "POST") {
        res = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${path}`, data,
            {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },

            })

        return res;
    }

}