"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOnlineClient = exports.addOnlienClients = exports.getOnlineClients = void 0;
const ListOfOnlineClients = [];
const getOnlineClients = () => {
    return ListOfOnlineClients;
};
exports.getOnlineClients = getOnlineClients;
const addOnlienClients = (userID) => {
    ListOfOnlineClients.push(userID);
};
exports.addOnlienClients = addOnlienClients;
const removeOnlineClient = (userID) => {
    ListOfOnlineClients.splice(ListOfOnlineClients.indexOf(userID), 1);
};
exports.removeOnlineClient = removeOnlineClient;
//# sourceMappingURL=onlineClients.js.map