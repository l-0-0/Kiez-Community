import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioText: "add",
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    editBio() {
        this.setState({
            bioText: "edit",
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.bio !== this.props.bio) {
            this.setState({
                bioText: "show",
            });
        }
    }

    submit() {
        axios
            .post("/bio", { bio: this.state.textarea })
            .then(({ data }) => {
                this.props.updateTheBio(data.bio);
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    render() {
        const { bioText } = this.state;
        if (bioText === "show") {
            if (this.props.bio) {
                return (
                    <div className="show-bio">
                        <p>{this.props.bio}</p>
                        <button onClick={() => this.editBio()}>
                            Edit your bio
                        </button>
                    </div>
                );
            } else {
                return <button onClick={() => this.editBio()}>Add bio</button>;
            }
        } else {
            return (
                <div className="textarea-box">
                    <textarea
                        name="textarea"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                    ></textarea>
                    <button onClick={() => this.submit()}>Save</button>
                </div>
            );
        }
    }
}
