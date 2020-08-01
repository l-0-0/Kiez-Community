import React from "react";
import Registration from "./register";
import Login from "./login";
import ResetPassword from "./resetpassword";
import { HashRouter, Route, Link } from "react-router-dom";

export default function Welcome(props) {
    // const style = {
    //     backgroundColor: "tomato",
    // };
    return (
        // <div style={style}>
        <HashRouter>
            <div>
                <h2>Welcome to </h2>
                <img className="logo-welcome" src="/logoB.png" alt="logo" />
                <h3>Are you living in Kotti and Loving it?</h3>
                <h3>Join the Kiez Community!</h3>

                <Route exact path="/" component={Registration} />
                <Route path="/login" component={Login} />
                <Route path="/reset" component={ResetPassword} />

                <p>
                    Are you already a member?
                    <Link to="/login">Log in!</Link>
                    <Link to="/reset">Reset the password!</Link>
                </p>
            </div>
        </HashRouter>
    );
}

//I can also put the function in a variable and call that in the render!
//const elem = <Welcome />
//ReactDOM.render(elem, document.querySelector("main"));
