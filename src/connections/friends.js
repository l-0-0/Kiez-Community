import React, { useEffect } from "react";
import { Link } from "react-router-dom";

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
            <div className="friends">
                <h2> My Friends: </h2>
                <div className="requests">
                    {friends &&
                        friends.map((eachFriend, id) => {
                            return (
                                <div key={id}>
                                    <img src={eachFriend.profile_pic} />
                                    <h4>
                                        <Link to={`/user/${eachFriend.id}`}>
                                            {eachFriend.first} {eachFriend.last}
                                        </Link>
                                    </h4>
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
                </div>

                <h2> Pending Friendship Requests: </h2>
                <div className="requests">
                    {wannaBes &&
                        wannaBes.map((eachOne, id) => {
                            return (
                                <div key={id}>
                                    <img src={eachOne.profile_pic} />
                                    <h4>
                                        <Link to={`/user/${eachOne.id}`}>
                                            {eachOne.first} {eachOne.last}
                                        </Link>
                                    </h4>
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                acceptFriendRequest(eachOne.id)
                                            )
                                        }
                                    >
                                        Accept the friendship request
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
