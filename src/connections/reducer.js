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
    return state;
}
