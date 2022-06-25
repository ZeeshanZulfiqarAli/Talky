import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import Button from "react-bootstrap/Button";

import {SocketContext} from '../../context/socket';

function IncomingRequest({ incomingRequestData, setIncomingRequestData, generateAnswer, setName2, createDataChannel }) {
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
            <div className='mt-3'>
                <h4>You've an incomming request from {incomingRequestData.name}</h4>
                <Button className="me-2" onClick={handleOnClickAccept}>Accept</Button>
                <Button onClick={handleOnClickReject}>Reject</Button>
            </div>
    )
}

export default IncomingRequest;