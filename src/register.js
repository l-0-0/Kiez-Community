import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submit() {
        axios
            .post("/register", {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
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
            <div className="forms">
                {this.state.error && (
                    <div className="error">Oops! You blew it.</div>
                )}

                <input
                    onChange={(e) => this.handleChange(e)}
                    name="firstName"
                    placeholder="First Name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="lastName"
                    placeholder="Last Name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="Email Address"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <button onClick={() => this.submit()}>Submit</button>

                <div className="welcome-link">
                    <p>Are you already a member?</p>

                    <Link to="/login"> Log in </Link>
                    <Link to="/reset"> Reset the password! </Link>
                </div>
            </div>
        );
    }
}
