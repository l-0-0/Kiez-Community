import React from "react";
import axios from "./axios";

// import { HashRouter, Route, Link } from "react-router-dom";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalOpen: true };
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    handleClick(e) {
        e.preventDefault();
        let formData = new FormData();

        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then(({ data }) => {
                this.setState(
                    {
                        profileImg: data.profile_pic,
                    },
                    () => {
                        console.log("this state:", this.state);
                    }
                );
                // console.log("success with this data", data);
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    close() {
        console.log("closeing?");
        this.setState({
            modalOpen: !this.state.modalOpen,
        });
    }

    render() {
        return (
            <div>
                <h1>I am the uploader</h1>
                <p onClick={() => this.close()}>X</p>
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                ></input>
                <button onClick={(e) => this.handleClick(e)}>submit</button>
            </div>
        );
    }
}
