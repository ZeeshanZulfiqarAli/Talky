import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {SocketContext} from '../../context/socket';

function IncomingRequest({ generateAnswer, setName2, createDataChannel }) {
    const [incomingRequestData, setIncomingRequestData] = useState(null);
    const socket = useContext(SocketContext);

    const handleOnClickAccept = useCallback(async () => {
        const generatedAnswer = await generateAnswer(incomingRequestData.candidates);

        socket.emit('propagate answer', incomingRequestData.name, generatedAnswer);
        setName2(incomingRequestData.name);
        createDataChannel();
        setIncomingRequestData(null);
    }, [incomingRequestData]);

    const handleOnClickReject = () => {
        setIncomingRequestData(null);
    };

    useEffect(() => {
        socket.on('request answer', (name, candidates) => {
            setIncomingRequestData({name, candidates});
        })

        return () => socket.off('request answer');
    }, []);

    return (
        incomingRequestData &&
            <Fragment>
                <h4>You've an incomming request from {incomingRequestData.name}</h4>
                <button onClick={handleOnClickAccept}>Accept</button>
                <button onClick={handleOnClickReject}>Reject</button>
            </Fragment>
    )
}

export default IncomingRequest;