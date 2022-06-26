import React, { useEffect, useState } from "react";

import classNames from "classnames";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import styles from "./styles.module.scss";

function ChatContainer({ dataChannel, name2 }) {
  const [messsages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const handleOnChange = (e) => {
    setText(e.target.value);
  };

  const send = (e) => {
    if (text === "" || !dataChannel) return;

    dataChannel.send(text);
    setMessages((messages) => [...messages, { text, our: true }]);
    setText("");
  };

  useEffect(() => {
    if (!dataChannel) return;

    dataChannel.onmessage = (event) => {
      setMessages((messages) => [
        ...messages,
        { text: event.data, our: false },
      ]);
    };

    return () => {
      dataChannel.onmessage = undefined;
    };
  }, [dataChannel]);

  return (
    <div>
      <h2>chatting with {name2}</h2>
      <Container>
        <Card className={classNames(styles.chatContainer, 'justify-content-between')}>
          <div className={classNames(styles.allMessageContainer, "overflow-scroll")}>
            {messsages.map((message, idx) => (
                <div className={classNames(styles.messageContainer, {[styles.ourMessage]: message.our, [styles.theirMessage]: !message.our})}>
              <div className={styles.content} key={idx}>
                {message.text}
              </div>
              </div>
            ))}
          </div>
          <div className="d-flex">
            <Form.Control
              size="md"
              type="text"
              placeholder="write message here"
              value={text}
              onChange={handleOnChange}
              onKeyPress={(e) => e.key === "Enter" && send()}
              className="d-inline"
            />
            <Button
              type="submit"
              disabled={!text}
              className={classNames(styles.submitBtn, "ms-2 border-0 cursor-pointer")}
              onClick={send}
            >
              Submit
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default ChatContainer;
