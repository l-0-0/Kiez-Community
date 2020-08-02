import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
// import Logo from "./logo";
import Uploader from "./uploader";
// import { HashRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visibleUploader: false };
    }

    componentDidMount() {
        console.log("has mounted");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data: ", { data });
                console.log("data", data.first);
                if (data) {
                    this.setState(
                        {
                            first: data.first,
                            last: data.last,
                            profileImg: data.profile_pic,
                        },
                        () => {
                            console.log("this state:", this.state);
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
    // uploadPic() {
    //     this.setState({ profileImg });
    // }

    toggleModal() {
        console.log("toggle modal is running");
        this.setState({
            visibleUploader: !this.state.visibleUploader,
        });
    }
    render() {
        return (
            <div>
                <h1>Re aou working?</h1>
                <h2>solved</h2>
                <ProfilePic
                    //give props to the child
                    first={this.state.first}
                    last={this.state.last}
                    profileImg={this.state.profileImg}
                    toggleModal={() => {
                        this.toggleModal();
                    }}
                />
                <Uploader
                    profileImg={this.state.profileImg}
                    componentDidMount={() => {
                        this.componentDidMount();
                    }}
                />
                {this.state.visibleUploader && <Uploader />}
            </div>
        );
    }
}
