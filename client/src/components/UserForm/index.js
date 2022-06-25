import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {SocketContext} from '../../context/socket';

function UserForm({ setName }) {
    const inputRef = useRef(null);
    const [error, setError] = useState('');
    const [inProgress, setInProgress] = useState(false);

    const socket = useContext(SocketContext);

    const handleOnSubmit = useCallback((e) => {
        e.preventDefault();
        setInProgress(true);

        const value = inputRef.current.value;
        socket.emit('name', value);
        // console.log(e, inputRef.current.value);
    }, [inputRef.current]);

    const handleOnChange = () => {
        setError('');
    }

    useEffect(() => {
        if (!inputRef.current) return;

        socket.on('username exists', () => {
            inputRef.current.value = '';
            setError('username exists already');
            setInProgress(false);
        })

        socket.on('username assigned', () => {
            const value = inputRef.current.value;
            inputRef.current.value = '';
            setInProgress(false);
            setName(value);
        })

        return () => {
            socket.off('username exists');
            socket.off('username assigned');
        }
    }, [inputRef.current]);

    return (
        <Fragment>
            <h2>Your username</h2>
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

export default UserForm;