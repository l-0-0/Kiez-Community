import React, { useState, useEffect, Fragment } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [people, setPeople] = useState([]);
    const [userInput, setUserInput] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/api/users");

                setPeople(data);
                // console.log("data in users route", data);
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
                console.log("data in search users *********** route", data);
                if (!abort) {
                    setPeople(data);
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
                    onChange={handleChange}
                    value={userInput}
                    name="finding"
                />
            </div>
            <div>
                {people &&
                    people.map((eachPerson, id) => {
                        return (
                            <div key={id} className="find-user">
                                <p>
                                    {eachPerson.first} {eachPerson.last}
                                </p>
                                <img
                                    className="find-user"
                                    src={eachPerson.profile_pic}
                                />
                            </div>
                        );
                    })}
            </div>
        </Fragment>
    );
}
