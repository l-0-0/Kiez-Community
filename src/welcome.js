import React from "react";
import Registration from "./register";

export default function Welcome(props) {
    const style = {
        backgroundColor: "tomato",
    };
    return (
        <div style={style}>
            <h1>Welcome to </h1>
            <img src="/kiez.png" alt="logo" />
            <h2>Are you living in Kotti and Loving it?</h2>
            <h1>Join the Kiez Community!</h1>
            <div>
                <Registration />
            </div>
            <p>
                Are you already a member?
                <a href="/login">Log in to your account!</a>
            </p>
        </div>
    );
}

//I can also put the function in a variable and call that in the render!
//const elem = <Welcome />
//ReactDOM.render(elem, document.querySelector("main"));
