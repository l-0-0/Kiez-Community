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
                    // console.log("data getting from posts", data);
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
                .post("/post-image", formData)
                .then(({ data }) => {
                    // console.log("data from post image", data);
                    setPosts([data, ...posts]);
                })
                .catch((err) => console.log("error in post an image: ", err));
        } else {
            axios
                .post("/publish-post", { inputs, viewedId })
                .then(({ data }) => {
                    // console.log("data in publish post route", data);
                    setPosts([data, ...posts]);
                })
                .catch((err) =>
                    console.log("error in publish post route: ", err)
                );
            document.querySelector("textarea").value = "";
        }
        setFile(null);
        setInputs("");
    }

    return (
        <>
            <div className="post">
                {friendship && (
                    <div className="profile-container">
                        <label className="label">
                            Post a photo
                            <input
                                className="files"
                                onChange={(e) => setFile(e.target.files[0])}
                                type="file"
                                name="file"
                                accept="image/*"
                            ></input>
                        </label>
                        <textarea
                            name="textarea"
                            placeholder="Post something here!"
                            onChange={(e) => setInputs(e.target.value)}
                        ></textarea>
                        <button onClick={postMessage}>Post</button>
                    </div>
                )}
                <div>
                    {posts &&
                        posts.map((post, id) => {
                            return (
                                <div key={id} className="post-area">
                                    <img
                                        className="find-user"
                                        src={post.profile_pic}
                                    />
                                    <p>
                                        <Link to={`/user/${post.id}`}>
                                            {post.first} {post.last}
                                        </Link>
                                    </p>
                                    <p>{post.post}</p>
                                    <img src={post.image} />
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    );
}
