import React from "react";

export default function ProfilePic(props) {
    let { first, last, profileImg, toggleModal } = props;

    profileImg = profileImg || "/images/default.png";

    return (
        <div>
            <img
                className="profile-pic-small"
                onClick={toggleModal}
                src={profileImg}
                alt={`${first} ${last}`}
            />
        </div>
    );
}
