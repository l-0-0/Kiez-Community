import React from "react";

export default function ProfilePic(props) {
    console.log("props in profile pic: ", props);
    let { first, last, profileImg, toggleModal } = props;

    profileImg = profileImg || "/images/default.png";
    console.log("profilePicture: ", profileImg);

    return (
        <div>
            <h1>
                My profile pic of {first} , {last}
                <img onClick={toggleModal} src={profileImg} alt={first} />
            </h1>
        </div>
    );
}
