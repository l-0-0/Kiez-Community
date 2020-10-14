import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
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
                this.props.showTheImage(data.profile_pic);
            })
            .catch(() =>
                this.setState({
                    error: true,
                })
            );
    }

    render() {
        return (
            <div className="photo-uploader">
                <label className="label">
                    select a photo
                    <input
                        className="files"
                        onChange={(e) => this.handleChange(e)}
                        type="file"
                        name="file"
                        accept="image/*"
                    ></input>
                </label>

                <button onClick={(e) => this.handleClick(e)}>Upload</button>
            </div>
        );
    }
}
