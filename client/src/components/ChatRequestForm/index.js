import React, { useContext, useEffect, useRef, useState } from "react";

import classNames from "classnames";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { SocketContext } from "../../context/socket";
import styles from "./styles.module.scss";

function ChatRequestForm({ setName2: setName, setAnswer, disabled }) {
  const [requestUsername, setRequestUsername] = useState("");
  const [error, setError] = useState("");
  const [inProgress, setInProgress] = useState(false);

  const socket = useContext(SocketContext);

  const handleOnSubmit = () => {
    // TODO: prevent submitting user's own username
    setInProgress(true);

    socket.emit("request answer", requestUsername);

  };

  const handleOnChange = (e) => {
    setRequestUsername(e.target.value);
    setError("");
  };

  useEffect(() => {
    socket.on("error", () => {
      setRequestUsername("");
      setError("username not found");
      setInProgress(false);
    });

    socket.on("answer", (name, answer) => {
      setRequestUsername("");
      setInProgress(false);
      setName(name);
      setAnswer(answer);
    });

    return () => {
      socket.off("error");
      socket.off("answer");
    };
  });

  return (
    <>
      <h2>Friend's username</h2>
      <div className="d-flex">
        <Form.Control
          size="md"
          type="text"
          disabled={inProgress || disabled}
          onChange={handleOnChange}
          value={requestUsername}
          onKeyPress={(e) => e.key === "Enter" && handleOnSubmit()}
          className="d-inline w-40"
        />
        <Button
          type="submit"
          disabled={!requestUsername || inProgress || disabled}
          className={classNames(styles.submitBtn, "ms-2 border-0")}
          onClick={handleOnSubmit}
        >
          Submit
        </Button>
      </div>
      {error && <div className="fst-italic fw-light">{error}</div>}
    </>
  );
}

export default ChatRequestForm;
