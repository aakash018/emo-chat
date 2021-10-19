import socketClient from 'socket.io-client'

const socket = socketClient(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/`);

export default socket