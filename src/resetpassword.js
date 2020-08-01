import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    async submit() {
        const { data } = await axios.post("/reset-password", {
            email: this.state.email,
        });
        if (data.success) {
            this.setState({
                step: 2,
            });
        } else {
            location.replace("/");
            this.setState({
                error: true,
            });
        }
    }
    async sendCode() {
        const { data } = await axios.post("/new-password", {
            email: this.state.email,
            code: this.state.code,
            password: this.state.password,
        });
        if (data.success) {
            this.setState({
                step: 3,
            });
        } else {
            location.replace("/");
            this.setState({
                error: true,
            });
        }
    }

    render() {
        const { step } = this.state;
        if (step == 1) {
            return (
                <div>
                    <h4>Reset Password</h4>
                    <p>
                        Please enter the email address with which you registered
                    </p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        placeholder="Email Address"
                        id="email"
                    />
                    <button onClick={() => this.submit()}>Submit</button>
                </div>
            );
        } else if (step == 2) {
            return (
                <div>
                    <h4>Reset Password</h4>
                    <p>Please enter the code you received</p>
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        placeholder="Code"
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <button onClick={() => this.sendCode()}>Submit</button>
                </div>
            );
        } else {
            return (
                <div>
                    <h4>You successfully reset your password</h4>
                    <p>
                        You can
                        <Link to="/login">login</Link>with your new password!
                    </p>
                </div>
            );
        }
    }
}

// return (
//     <div>
//         {step == 1 && (
//             <div></div>
//         )}
//         {step == 2 && (
//             <div></div>
//         )}
//         {step == 3 && (
//             <div></div>
//         )}
//     </div>
// )
