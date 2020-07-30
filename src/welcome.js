import React from "react";
import Registration from "./register";
import Login from "./login";
import { HashRouther, Route, Link } from "react-router-dom";

export default function Welcome(props) {
    // const style = {
    //     backgroundColor: "tomato",
    // };
    return (
        // <div style={style}>
        <HashRouther>
            <div>
                <h1>Welcome to </h1>
                <img className="logo-welcome" src="/logoB.png" alt="logo" />
                <h2>Are you living in Kotti and Loving it?</h2>
                <h1>Join the Kiez Community!</h1>

                <Route exact path="/" component={Registration} />
                <Route path="/login" component={Login} />

                <p>
                    Are you already a member?
                    <Link to="/login">Log in!</Link>
                </p>
            </div>
        </HashRouther>
    );
}

//I can also put the function in a variable and call that in the render!
//const elem = <Welcome />
//ReactDOM.render(elem, document.querySelector("main"));
