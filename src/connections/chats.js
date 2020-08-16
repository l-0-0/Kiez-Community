import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "./socket";

export default function Chat() {
    const [chatMessage, setChatMessage] = useState();
    const recentChats = useSelector((state) => state.chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    });

    function sendMessage(e) {
        socket.emit("chatMessage", chatMessage);
        document.querySelector("textarea").value = "";
        // chat.value = "";
    }

    return (
        <>
            <div className="chat-area" ref={elemRef}>
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
                className="chat_textarea"
                id="chat"
                onChange={(e) => setChatMessage(e.target.value)}
            ></textarea>
            <button className="chat-send" onClick={(e) => sendMessage(e)}>
                Send
            </button>
        </>
    );
}

// onClick={submit}
// onChange={(e) => this.handleChange(e)}
// defaultValue={this.props.bio}
