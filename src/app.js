import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
// import Logo from "./logo";
// import { HashRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visibleUploader: false };
        this.toggleModal = this.toggleModal.bind(this);
        this.showTheImage = this.showTheImage.bind(this);
    }

    componentDidMount() {
        // console.log("has mounted");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data: ", { data });

                if (data) {
                    this.setState(
                        {
                            first: data.first,
                            last: data.last,
                            profileImg: data.profile_pic,
                            userId: data.id,
                        },
                        () => {
                            console.log("this state in app:", this.state);
                        }
                    );
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    showTheImage(image) {
        this.setState({
            profileImg: image,
            visibleUploader: !this.state.visibleUploader,
        });
        // console.log("image is: ", image);
    }

    toggleModal() {
        // console.log("toggle modal is running");
        this.setState({
            visibleUploader: !this.state.visibleUploader,
        });
    }

    render() {
        return (
            <div>
                <ProfilePic
                    //give props to the child
                    first={this.state.first}
                    last={this.state.last}
                    profileImg={this.state.profileImg}
                    userId={this.state.userId}
                    toggleModal={() => {
                        this.toggleModal();
                    }}
                />

                {this.state.visibleUploader && (
                    <Uploader showTheImage={this.showTheImage} />
                )}
            </div>
        );
    }
}
