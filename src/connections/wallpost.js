import React, { useState, useEffect } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default function WallPosts(props) {
    let { viewedId } = props;

    const [posts, setPosts] = useState();
    const [inputs, setInputs] = useState();
    const [file, setFile] = useState();
    const [friendship, setFriendship] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data: friendship } = await axios.get(
                    "/api/friendship/" + viewedId
                );

                if (friendship.accepted == true) {
                    setFriendship(true);
                    const { data } = await axios.get("/wall-posts/" + viewedId);

                    setPosts(data);
                }
            } catch (err) {
                console.log("error in getting posts: ", err);
            }
        })();
    }, []);

    function postMessage() {
        let formData = new FormData();
        formData.append("file", file);
        if (file) {
            axios
                .post("/post-image/" + viewedId, formData)
                .then(({ data }) => {
                    setPosts([data, ...posts]);
                    setFile(null);
                })
                .catch((err) => console.log("error in post an image: ", err));
        } else {
            if (document.querySelector("textarea").value == "") {
                setInputs("");
            } else {
                axios
                    .post("/publish-post", { inputs, viewedId })
                    .then(({ data }) => {
                        setPosts([data, ...posts]);
                    })
                    .catch((err) =>
                        console.log("error in publish post route: ", err)
                    );
                document.querySelector("textarea").value = "";
                setInputs("");
            }
        }
    }

    return (
        <>
            <div className="post">
                {friendship && (
                    <div className="post-message">
                        <textarea
                            className="post-textarea"
                            name="textarea"
                            placeholder="Write something here for me!"
                            onChange={(e) => setInputs(e.target.value)}
                        ></textarea>
                        <label className="label" id="post-label">
                            Or post me an interesting photo!
                            <input
                                className="files"
                                onChange={(e) => setFile(e.target.files[0])}
                                type="file"
                                name="file"
                                accept="image/*"
                            ></input>
                        </label>

                        <button onClick={postMessage}>Post</button>
                    </div>
                )}
                <div className="post-area">
                    {posts &&
                        posts.map((post, id) => {
                            return (
                                <div key={id} className="each-post">
                                    <div id="sender-p">
                                        <img src={post.profile_pic} />
                                        <p>
                                            <Link
                                                to={`/user/${post.sender_id}`}
                                            >
                                                {post.first} {post.last}
                                            </Link>
                                        </p>
                                    </div>
                                    <div id="posting">
                                        <p id="date">at {post.created_at}:</p>
                                        <p>{post.post}</p>
                                        <img src={post.image} />
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
