import React, { Fragment } from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import FindPeople from "./connections/findpeople";
import { BrowserRouter, Route } from "react-router-dom";
import Friends from "./connections/friends";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visibleUploader: false };
        this.toggleModal = this.toggleModal.bind(this);
        this.showTheImage = this.showTheImage.bind(this);
        this.updateTheBio = this.updateTheBio.bind(this);
    }

    componentDidMount() {
        // console.log("has mounted");
        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("data: ", { data });

                if (data) {
                    this.setState(
                        {
                            first: data.first,
                            last: data.last,
                            profileImg: data.profile_pic,
                            userId: data.id,
                            bio: data.bio,
                        }
                        // () => {
                        //     console.log("this state in app:", this.state);
                        // }
                    );
                } else {
                    this.props.history.push("/");
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

    updateTheBio(nBio) {
        this.setState({
            bio: nBio,
        });
    }

    toggleModal() {
        // console.log("toggle modal is running");
        this.setState({
            visibleUploader: !this.state.visibleUploader,
        });
    }

    render() {
        // if (!this.state.id) {
        //     return null;
        // }

        return (
            <BrowserRouter>
                <Fragment>
                    <header>
                        <Logo />

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
                        <div className="navbar">
                            <ul>
                                <li>
                                    <a href="/logout">Logout</a>
                                </li>
                                <li>
                                    <a href="/users">Find People</a>
                                </li>
                                <li>
                                    <a href="/">My Profile</a>
                                </li>
                            </ul>
                        </div>
                    </header>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    id={this.state.id}
                                    profileImg={this.state.profileImg}
                                    bio={this.state.bio}
                                    updateTheBio={this.updateTheBio}
                                    toggleModal={this.toggleModal}
                                />
                            )}
                        />
                        <Route path="/users" component={FindPeople} />
                        <Route
                            path="/user/:id"
                            component={OtherProfile}
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" component={Friends} />
                    </div>
                </Fragment>
            </BrowserRouter>
        );
    }
}
