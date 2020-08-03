import React from "react";

export default function ProfilePic(props) {
    console.log("props in profile pic: ", props);
    let { first, last, profileImg, toggleModal } = props;

    profileImg = profileImg || "/images/default.png";
    // console.log("profilePicture: ", profileImg);

    return (
        <div>
            {/* My profile pic of {first} , {last} */}
            <img
                className="profile-pic-small"
                onClick={toggleModal}
                src={profileImg}
                alt={`${first} ${last}`}
            />
        </div>
    );
}
