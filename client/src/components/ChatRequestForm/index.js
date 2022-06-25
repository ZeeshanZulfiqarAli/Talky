import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import {SocketContext} from '../../context/socket';

function ChatRequestForm({ setName2: setName, setAnswer }) {
    const inputRef = useRef(null);
    const [error, setError] = useState('');
    const [inProgress, setInProgress] = useState(false);

    const socket = useContext(SocketContext);


    const handleOnSubmit = (e) => {
        e.preventDefault();
        setInProgress(true);

        const value = inputRef.current.value;
        if (value === "") return;
        socket.emit('request answer', value);

        
        // console.log(e, inputRef.current.value);
    };

    const handleOnChange = () => {
        setError('');
    }

    useEffect(() => {
        socket.on('error', () => {
            inputRef.current.value = '';
            setError('username not found');
            setInProgress(false);
        })

        socket.on('answer', (name, answer) => {
            inputRef.current.value = '';
            setInProgress(false);
            setName(name);
            setAnswer(answer);
        })

        return () => {
            socket.off('error');
            socket.off('answer');
        };
    });

    return (
        <Fragment>
            <h2>Friend's username</h2>
            <form onSubmit={handleOnSubmit}>
                {
                    error && (<div className="error_message">{error}</div>)
                }
                <input type='text' ref={inputRef} disabled={inProgress} onChange={handleOnChange}/>
                <button type='submit'>Submit</button>
            </form>
        </Fragment>
    )
}

export default ChatRequestForm;