import socketClient from 'socket.io-client'

const socket = socketClient('http://localhost:5000/');

export default socket