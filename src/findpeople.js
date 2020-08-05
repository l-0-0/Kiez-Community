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
                console.log("data in users route", data);
            } catch (err) {
                console.log("error in finding last users: ", err);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`/find-people/${userInput}`);
                setFindings(data);
                console.log("data in search users route", data);
            } catch (err) {
                console.log("error in search users: ", err);
            }
        })();
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
                            <div key={id}>
                                <p>{(eachPerson.first, eachPerson.last)}</p>
                                <img src={eachPerson.profile_pic} />
                            </div>
                        );
                    })}
            </div>
            <div>
                {findings &&
                    findings.map((foundOne, id) => {
                        return (
                            <div key={id}>
                                <p>{(foundOne.first, foundOne.last)}</p>
                                <img src={foundOne.profile_pic} />
                            </div>
                        );
                    })}
            </div>
        </Fragment>
    );
}
