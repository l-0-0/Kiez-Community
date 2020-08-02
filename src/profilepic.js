import React from "react";

export default function ProfilePic(props) {
    console.log("props in profile pic: ", props);
    let { first, last, profileImg } = props;

    profileImg = profileImg || "/images/default-img.png";
    console.log("profilePicture: ", profileImg);

    return (
        <div>
            <h1>
                My profile pic of {first} , {last}
                <img src={profileImg} alt={first} />
            </h1>
        </div>
    );
}
