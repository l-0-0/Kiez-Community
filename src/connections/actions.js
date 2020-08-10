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
