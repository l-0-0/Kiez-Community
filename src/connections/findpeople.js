import React, { useState, useEffect, Fragment } from "react";
import axios from "../axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [people, setPeople] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/api/users");

                setPeople(data);
            } catch (err) {
                console.log("error in finding last users: ", err);
            }
        })();
    }, []);

    useEffect(() => {
        let abort;
        if (userInput !== "") {
            (async () => {
                const { data } = await axios.get(`/find-people/${userInput}`);
                console.log("data in search users* route", data);
                if (data.success == false) {
                    setError(true);
                    setPeople([]);
                } else {
                    if (!abort) {
                        setError(false);
                        setPeople(data);
                    }
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [userInput]);

    const handleChange = (e) => {
        setUserInput(e.target.value);
    };

    return (
        <Fragment>
            <div>
                <input
                    id="input-field"
                    onChange={handleChange}
                    value={userInput}
                    name="finding"
                    placeholder="Search for friends!"
                />
            </div>
            <div className="find-user">
                {error && <p>There is no user based on your search!</p>}
                {people &&
                    people.map((eachPerson, id) => {
                        return (
                            <div key={id}>
                                <img
                                    className="find-user"
                                    src={eachPerson.profile_pic}
                                />
                                <p>
                                    <Link to={`/user/${eachPerson.id}`}>
                                        {eachPerson.first} {eachPerson.last}
                                    </Link>
                                </p>
                            </div>
                        );
                    })}
            </div>
        </Fragment>
    );
}
