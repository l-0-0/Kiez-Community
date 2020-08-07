import React, { Fragment } from "react";
import axios from "./axios";
import FriendButton from "./connections/friendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        const { id } = this.props.match.params;
        const { data } = await axios.get("/api/user/" + id);
        // console.log("data in other profile component: ", data);
        if (data.isTheSameUser) {
            this.props.history.push("/");
        } else {
            this.setState(
                {
                    first: data.first,
                    last: data.last,
                    profileImg: data.profile_pic,
                    bio: data.bio,
                }
                // () => {
                //     console.log("this state in otherprofile:", this.state);
                // }
            );
        }
    }
    render() {
        // console.log("props in otherprofile: ", this.props);
        // console.log("state in otherprofile: ", this.state);
        return (
            <>
                <div className="profile-container">
                    <img
                        src={this.state.profileImg}
                        alt={`${this.state.first} ${this.state.last}`}
                    />
                    <div className="user-info">
                        <p className="user-name">
                            {this.state.first} {this.state.last}
                        </p>
                        <p className="user-bio">{this.state.bio}</p>
                    </div>
                </div>
                <FriendButton viewedId={this.props.match.params.id} />
            </>
        );
    }
}
