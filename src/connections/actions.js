import axios from "../axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/api/friends");
    // console.log("data", data);
    return {
        type: "RECEIVE_FRIENDSWANNABES",
        friendsWannabes: data,
    };
}

export async function unfriend(friendsId) {
    await axios.post("/end-friendship", { friendsId });
    return {
        type: "UNFRIEND",
        deletedId: friendsId,
    };
}

export async function acceptFriendRequest(personsId) {
    await axios.post("/accept-friendship", { personsId });
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        acceptedId: personsId,
    };
}

export async function chatMessages(msgs) {
    console.log("messages in the action: ", msgs);
    return {
        type: "RECEIVE_RECENT_CHATS",
        recentChats: msgs,
    };
}

export async function chatMessage(msg) {
    console.log("new message in the action: ", msg);
    return {
        type: "SENDING_SINGLE_CHATS",
        recentChats: msg,
    };
}
