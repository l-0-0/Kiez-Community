import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./connections/reducer";

import { init } from "./connections/socket";

//creating store
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

let isLoggedIn = location.pathname != "/welcome";

if (isLoggedIn) {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
    init(store);
} else {
    elem = <Welcome />;
}

ReactDOM.render(elem, document.querySelector("main"));
