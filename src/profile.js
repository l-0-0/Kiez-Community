import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    let { first, last, profileImg, bio, updateTheBio } = props;

    return (
        <div>
            <h2>
                {first} {last}
            </h2>
            <ProfilePic
                first={first}
                last={last}
                profileImg={profileImg}
                className="profile-pic-large"
            />
            <BioEditor
                first={first}
                last={last}
                bio={bio}
                updateTheBio={updateTheBio}
            />
        </div>
    );
}
