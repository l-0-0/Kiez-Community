import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

let elem;

let isLoggedIn = location.pathname != "/welcome";

if (isLoggedIn) {
    elem = <App />;
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
