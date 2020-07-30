import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;

let isLoggedIn = location.pathname != "/welcome";

if (isLoggedIn) {
    elem = <img src="/logo.png" alt="logo" />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
