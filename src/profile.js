import React, { Fragment } from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    let { first, last, profileImg, bio, updateTheBio, toggleModal } = props;

    return (
        <Fragment>
            <h2 className="title">
                {first} {last}
            </h2>
            <div className="profile-container">
                <ProfilePic
                    first={first}
                    last={last}
                    profileImg={profileImg}
                    toggleModal={toggleModal}
                />

                <BioEditor
                    first={first}
                    last={last}
                    bio={bio}
                    updateTheBio={updateTheBio}
                />
            </div>
        </Fragment>
    );
}
