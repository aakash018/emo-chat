"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.pushOnlineClient = exports.getOnlineClients = void 0;
let OnlineClients = [];
const getOnlineClients = (roomID) => {
    const OnlineRoomData = OnlineClients.filter(client => client.roomID === roomID);
    return OnlineRoomData[0].onlineClients;
};
exports.getOnlineClients = getOnlineClients;
const pushOnlineClient = (roomID, userID, displayName, profilePic) => {
    if (OnlineClients.some(clients => clients.roomID === roomID)) {
        OnlineClients.forEach(clients => {
            if (clients.roomID === roomID) {
                clients.onlineClients.push({
                    displayName,
                    profilePic,
                    userID
                });
                return;
            }
        });
    }
    else {
        OnlineClients.push({
            roomID,
            onlineClients: [
                {
                    displayName,
                    profilePic,
                    userID
                }
            ]
        });
    }
};
exports.pushOnlineClient = pushOnlineClient;
const removeUser = (roomID, userID) => {
    console.log(roomID, userID, "Hello");
    console.log("CL", OnlineClients[0].onlineClients);
};
exports.removeUser = removeUser;
//# sourceMappingURL=onlineClients.js.map