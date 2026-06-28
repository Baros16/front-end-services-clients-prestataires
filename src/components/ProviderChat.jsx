import React, { useState } from "react";

import ChatHeader from "../components/ChatHeader";
import ChatMessages from "../components/ChatMessages";
import ChatInput from "../components/ChatInput";
import initialMessages from "../data/messages";


const ProviderChat = () => {

  const [messages, setMessages] = useState(initialMessages);


  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });



  const handleSend = (text) => {

    const newMessage = {

      id: Date.now(),

      type: "sent",

      text,

      time: formatTime(new Date()),

    };


    setMessages((prev) => [
      ...prev,
      newMessage
    ]);

  };



  const handleAttach = () => {

    console.log("open file picker");

  };



  const handleCamera = () => {

    console.log("open camera");

  };



  const handleFinalizeQuote = () => {

    console.log("Finalize Quote");

  };



  const handleOpenMenu = () => {

    console.log("Open menu");

  };



  return (


    <div className="h-screen flex flex-col bg-gray-50">


      {/* HEADER */}

      <ChatHeader

        name="Sarah Jenkins"

        status="Online now"

        avatar="/images/sarah.jpg"

        onFinalizeQuote={handleFinalizeQuote}

        onOpenMenu={handleOpenMenu}

      />



      {/* MESSAGES */}

      <main className="flex-1 overflow-hidden">


        <ChatMessages

          messages={messages}

          dayLabel="Today"

          showQuoteDraft

        />


      </main>



      {/* INPUT */}

      <ChatInput

        onSend={handleSend}

        onAttach={handleAttach}

        onCamera={handleCamera}

      />


    </div>


  );

};



export default ProviderChat;