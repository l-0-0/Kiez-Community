import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    login() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
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
    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Something went wrong! Please try again.
                    </div>
                )}

                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="Email Address"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    placeholder="Password"
                />
                <button onClick={(e) => this.login()}>Log in</button>
            </div>
        );
    }
}
