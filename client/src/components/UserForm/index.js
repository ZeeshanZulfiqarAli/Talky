import React, { useContext, useEffect, useState } from "react";

import classNames from "classnames";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { SocketContext } from "../../context/socket";
import styles from "./styles.module.scss";

function UserForm({ setName }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const socket = useContext(SocketContext);

  const handleOnSubmit = () => {
    setInProgress(true);
    console.log("1");
    socket.emit("name", username);
  };

  const handleOnChange = (e) => {
    setUsername(e.target.value);
    setError("");
  };

  useEffect(() => {
    socket.on("username exists", () => {
      console.log("2", username);
      setUsername("");
      setError(`Username ${username} exists already`);
      setInProgress(false);
    });

    socket.on("username assigned", () => {
      console.log("3");
      setInProgress(false);
      setName(username);
      setUsername("");
    });

    return () => {
      console.log("4");
      socket.off("username exists");
      socket.off("username assigned");
    };
  }, [username]);

  return (
    <>
      <h2>Your username</h2>
      <div className="d-flex">
        <Form.Control
          size="md"
          type="text"
          disabled={inProgress}
          value={username}
          onChange={handleOnChange}
          onKeyPress={(e) => e.key === "Enter" && handleOnSubmit()}
          className="d-inline w-40"
        />
        <Button
          type="submit"
          disabled={!username || inProgress}
          className={classNames(styles.submitBtn, "ms-2 border-0 cursor-pointer")}
          onClick={handleOnSubmit}
        >
          Submit
        </Button>
      </div>
      {error && <div className="fst-italic fw-light">{error}</div>}
    </>
  );
}

export default UserForm;
