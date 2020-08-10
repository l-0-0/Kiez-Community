import React, { useEffect } from "react";
import axios from "../axios";

import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    unfriend,
    acceptFriendRequest,
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted == true)
    );
    const wannaBes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((wannaBe) => wannaBe.accepted == false)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    return (
        <>
            <h2>My Friends: </h2>
            {friends &&
                friends.map((eachFriend, id) => {
                    return (
                        <div key={id}>
                            <img src={eachFriend.profile_pic} />
                            <p>
                                {eachFriend.first} {eachFriend.last}
                            </p>
                            <button
                                onClick={() =>
                                    dispatch(unfriend(eachFriend.id))
                                }
                            >
                                Put an end to this friendship
                            </button>
                        </div>
                    );
                })}

            <h2>Pending Friendship Requests: </h2>
            {wannaBes &&
                wannaBes.map((eachOne, id) => {
                    return (
                        <div key={id}>
                            <img src={eachOne.profile_pic} />
                            <p>
                                {eachOne.first} {eachOne.last}
                            </p>
                            <button
                                onClick={() =>
                                    dispatch(acceptFriendRequest(eachOne.id))
                                }
                            >
                                Accept the friendship request
                            </button>
                        </div>
                    );
                })}
        </>
    );
}
