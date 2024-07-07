import React, { useState } from "react";
import "./chatbot.css"; 

const Chatbot = () => {
  return (
    <div className="body">
        {/*<img src="./logo.jpg"/>*/}
        <div className="nono">
        <iframe
            allow="microphone;"
            width="350"
            height="430"
            src="https://console.dialogflow.com/api-client/demo/embedded/8f3b3617-de36-4ed8-abc1-926da33494bd">
        </iframe>
        </div>
    </div>
  );
};

export default Chatbot;
