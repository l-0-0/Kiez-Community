export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDSWANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                (friend) => friend.id !== action.deletedId
            ),
        };
    }

    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (friend.id == action.acceptedId) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type == "RECEIVE_RECENT_CHATS") {
        state = {
            ...state,
            chatMessages: action.recentChats,
        };
    }

    if (action.type == "SENDING_SINGLE_CHATS") {
        state = {
            ...state,
            //add the new chat to the array of chats!
            chatMessages: [...state.chatMessages, action.recentChats[0]],
        };
    }

    return state;
}
