"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOnlineClient = exports.addOnlienClients = exports.getOnlineClients = void 0;
let ListOfOnlineClients = [];
const getOnlineClients = () => {
    return ListOfOnlineClients;
};
exports.getOnlineClients = getOnlineClients;
const addOnlienClients = (userID, socketID) => {
    ListOfOnlineClients.push({
        socketID,
        userID
    });
};
exports.addOnlienClients = addOnlienClients;
const removeOnlineClient = (socketID) => {
    ListOfOnlineClients = ListOfOnlineClients.filter(clients => clients.socketID !== socketID);
};
exports.removeOnlineClient = removeOnlineClient;
//# sourceMappingURL=onlineClients.js.map