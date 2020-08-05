import React, { useState, useEffect, Fragment } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [people, setPeople] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [findings, setFindings] = useState([]);

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
                    setFindings(data);
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

    const search = () => {
        return (
            <div>
                {findings &&
                    findings.map((foundOne, id) => {
                        console.log("found one", foundOne);
                        return (
                            <div key={id}>
                                <p>
                                    {foundOne.first} {foundOne.last}
                                </p>
                                <img src={foundOne.profile_pic} />
                            </div>
                        );
                    })}
            </div>
        );
    };

    const lastRegistered = () => {
        return (
            <div>
                {people &&
                    people.map((eachPerson, id) => {
                        return (
                            <div key={id}>
                                <p>
                                    {eachPerson.first} {eachPerson.last}
                                </p>
                                <img src={eachPerson.profile_pic} />
                            </div>
                        );
                    })}
            </div>
        );
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
            <div>{userInput ? search() : lastRegistered()}</div>
        </Fragment>
    );
}
