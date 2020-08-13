import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "./socket";

export default function Chat() {
    const [chatMessage, setChatMessage] = useState();
    const recentChats = useSelector((state) => state.chatMessages);
    console.log("recentChats", recentChats);

    return (
        <>
            <div className="chat-area">
                {recentChats &&
                    recentChats.map((chat, id) => {
                        return (
                            <div id="chat-text" key={id}>
                                <img src={chat.profile_pic} />
                                <h4>
                                    <Link to={`/user/${chat.sender_id}`}>
                                        {chat.first} {chat.last}
                                    </Link>
                                </h4>

                                <p>{chat.created_at}</p>
                                <p>{chat.message}</p>
                            </div>
                        );
                    })}
            </div>
            <textarea
                name="textarea"
                onChange={(e) => setChatMessage(e.target.value)}
            ></textarea>
            <button onClick={() => socket.emit("chatMessage", chatMessage)}>
                Send
            </button>
        </>
    );
}

// onClick={submit}
// onChange={(e) => this.handleChange(e)}
// defaultValue={this.props.bio}
