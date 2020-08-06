import React, { useState, useEffect } from "react";
import axios from "../axios";
import e from "express";

export default function FriendButton(props) {
    let { viewedId } = props;

    const [buttonText, setButtonText] = useState("add");
    const [recipientButtonText, setRecipientButtonText] = useState("");

    useEffect(() => {
        (async () => {
            // console.log(viewedId);
            try {
                const { data } = await axios.get("/api/friendship/" + viewedId);

                console.log("data in friendbutton route", data);

                let userId = Number(viewedId);

                if (data.length === 0) {
                    setButtonText("add");
                } else if (data.accepted == true) {
                    setButtonText("defriend");
                } else {
                    if (data[0].sender_id === userId) {
                        setButtonText("accept");
                    } else {
                        setButtonText("cancel");
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
                console.log("data in friendship **** route", data);
                if (buttonText == "add") {
                    setButtonText("cancel");
                } else if (buttonText == "cancel") {
                    setButtonText("add");
                } else if (buttonText == "accept") {
                    setButtonText("defriend");
                } else if (buttonText == "defriend") {
                    setButtonText("add");
                }
            })
            .catch((err) => console.log("error in send friend request: ", err));
    }

    return (
        <>
            <button onClick={submit}>{buttonText}</button>
        </>
    );
}
