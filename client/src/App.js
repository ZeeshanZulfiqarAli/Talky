import React, { useCallback, useEffect, useState } from "react";
import logo from "./logo.svg";
import LayoutContainer from "./containers/LayoutContainer";
import ChatContainer from "./containers/ChatContainer";
import UserForm from "./components/UserForm";
import ChatRequestForm from "./components/ChatRequestForm";
import IncomingRequest from "./components/IncomingRequest";

import gatherIceCandidates from "./components/GatherIceCandidates";
import { SocketContext, socket } from "./context/socket";

import "./styles/globals.scss";

const iceConfiguration = {
  iceServers: [
    {
      urls: "stun:stun1.l.google.com:19302",
    },
  ],
};

function App() {
  const [name, setName] = useState("");
  const [name2, setName2] = useState("");
  const [dataChannel, setDataChannel] = useState(null);
  const [incomingRequestData, setIncomingRequestData] = useState(null);

  const [localConnection] = useState(new RTCPeerConnection(iceConfiguration));

  const handleOnCandidate = useCallback((candidates) => {
    socket.emit("ice candidates", candidates);
  });

  const handleOnAnswer = useCallback((answer) => {
    localConnection.setRemoteDescription(answer);
  });

  const generateAnswer = useCallback(
    async (offer) => {
      await localConnection.setRemoteDescription(offer);
      const a = await localConnection.createAnswer();
      await localConnection.setLocalDescription(a);
      return localConnection.localDescription;
    },
    [localConnection]
  );

  const createDataChannel = useCallback(() => {
    // const channel = localConnection.createDataChannel("chat");
    // channel.onopen = function(event) {
    //   channel.send('Hi!');
    // }
    // channel.onmessage = function(event) {
    //   console.log(event.data);
    // }
    localConnection.ondatachannel = (e) => {
      const receiveChannel = e.channel;
      localConnection.channel = receiveChannel;
      setDataChannel(receiveChannel);
      // receiveChannel.onmessage =e =>  console.log("messsage received!!!"  + e.data )
      // receiveChannel.onopen = e => console.log("open!!!!");
      // receiveChannel.onclose =e => console.log("closed!!!!!!");
      // localConnection.channel = receiveChannel;
    };

    // setDataChannel(channel);
  });

  useEffect(() => {
    setDataChannel(gatherIceCandidates(localConnection, handleOnCandidate));
  }, []);

  useEffect(() => {
    console.log("name", name);
  }, [name]);

  return (
    <SocketContext.Provider value={socket}>
      <LayoutContainer>
        {!name ? (
          <UserForm setName={setName} />
        ) : !name2 ? (
          <ChatRequestForm setName2={setName2} setAnswer={handleOnAnswer} disabled={!!incomingRequestData}/>
        ) : (
          <ChatContainer name={name} name2={name2} dataChannel={dataChannel} />
        )}
        <IncomingRequest
          incomingRequestData={incomingRequestData}
          setIncomingRequestData={setIncomingRequestData}
          generateAnswer={generateAnswer}
          setName2={setName2}
          createDataChannel={createDataChannel}
        />
        {/* <GatherIceCandidates onCandidate={handleOnCandidate} lc={localConnection}/> */}
      </LayoutContainer>
    </SocketContext.Provider>
  );
}

export default App;
