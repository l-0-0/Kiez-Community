import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function FriendButton(props) {
    let { viewedId } = props;
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        (async () => {
            // console.log(viewedId);
            try {
                const { data } = await axios.get("/api/friendship/" + viewedId);

                console.log("data in friendbutton route", data);

                let userId = Number(viewedId);

                if (data.length === 0) {
                    setButtonText("Send a friend request");
                } else if (data.accepted == true) {
                    setButtonText("Put an end to this friendship");
                } else {
                    if (data.sender_id === userId) {
                        setButtonText("Accept the friendship request");
                    } else {
                        setButtonText("Cancel the friendship request");
                    }
                }
            } catch (err) {
                console.log("error in friendbutton route: ", err);
            }
        })();
    }, []);

    function submit() {
        axios
            .post("/friendship-status", { buttonText, viewedId })
            .then(({ data }) => {
                // console.log("data in friendship **** route", data);
                if (buttonText == "Send a friend request") {
                    setButtonText("Cancel the friendship request");
                } else if (buttonText == "Cancel the friendship request") {
                    setButtonText("Send a friend request");
                } else if (buttonText == "Accept the friendship request") {
                    setButtonText("Put an end to this friendship");
                } else if (buttonText == "Put an end to this friendship") {
                    setButtonText("Send a friend request");
                }
            })
            .catch((err) => console.log("error in send friend request: ", err));
    }

    return (
        <>
            <button className="friendship-button" onClick={submit}>
                {buttonText}
            </button>
        </>
    );
}
