import React, { useCallback, useEffect, useState, useRef } from 'react';

function ChatContainer({dataChannel, name2}) {
    const [messsages, setMessages] = useState([]);
    const inputRef = useRef(null);

    const send = useCallback((e) => {
        const value = inputRef.current.value;
        if (value === "" || !dataChannel) return;

        dataChannel.send(value);
        setMessages(messages => [...messages, {text: value, our: true}]);
        inputRef.current.value = '';

    }, [dataChannel, inputRef.current]);

    useEffect(() => {
        if (!dataChannel) return;

        dataChannel.onmessage = (event) => {
            setMessages(messages => [...messages, {text: event.data, our: false}]);
        };

        return () => {
            dataChannel.onmessage = undefined;
        }
    }, [dataChannel]);

    return (
        <div>
            <h2>chatting with {name2}</h2>
            <ul>
                {
                    messsages.map((message, idx) => 
                        <li className={message.our ? 'our' : 'their'} key={idx}>{message.text}</li>
                    )
                }
            </ul>
            <div>
                <input ref={inputRef} placeholder="write message here"/>
                <button onClick={send}>Send</button>
            </div>
        </div>
    );
}

export default ChatContainer;