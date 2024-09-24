import React from "react";
import back_arrow from "../../src/assets/images/back_arrow.png";
import Avatar from "../../src/assets/images/Avatar.png";
import cross from "../../src/assets/images/Chevron.svg";
import Message from "../../src/assets/images/message.svg";
import emoji from "../../src/assets/images/face-smile.svg";
import send from "../../src/assets/images/send.svg";
import House from "../../src/assets/images/House.svg";
import Add from "../../src/assets/images/x-mark.svg";
import Chats from "../../src/assets/images/Chats.svg";
import search from "../../src/assets/images/search.svg";
import sentIcon from "../../src/assets/images/check-check.png";
import deliveredIcon from "../../src/assets/images/check-check.png";
import readIcon from "../../src/assets/images/check-check.png";

const MyChatApp = () => {
  const messages = [
    { id: 1, text: "Hey there!", sender: "other", time: "10:00 AM" },
    {
      id: 2,
      text: "Hello! How are you?",
      sender: "self",
      time: "10:02 AM",
      status: "sent",
    },
    {
      id: 3,
      text: "I am good, thanks! What about you?",
      sender: "other",
      time: "10:05 AM",
    },
    {
      id: 4,
      text: "I am great! Just working on a project.",
      sender: "self",
      time: "10:07 AM",
      status: "delivered",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return sentIcon;
      case "delivered":
        return deliveredIcon;
      case "read":
        return readIcon;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black md:flex-row">
      {/* Sidebar for MD and above */}
      <div className="hidden md:flex md:flex-col md:w-[72.98px] bg-neutral-800 items-center py-6">
        <div className="mb-6">
          <img src={House} alt="House" />
        </div>
        <div className="mb-6">
          <img src={search} alt="Search" />
        </div>
        <div className="mb-6 bg-[#575757] rounded-full p-1">
          <img src={Add} alt="Add" />
        </div>
        <div className="mb-6">
          <img src={Chats} alt="Chats" />
        </div>
        <div>
          <img src={Avatar} alt="Avatar" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <div className="h-11 px-5 py-4 justify-between inline-flex">
          <div className="grow basis-0 h-6 items-center justify-start gap-2.5 flex">
            <div className="justify-start flex gap-2 items-center">
              <div className="relative">
                <img src={back_arrow} alt="back" />
              </div>
              <img src={Avatar} alt="Avatar" />
            </div>
            <div className="text-white text-base font-semibold tracking-tight">
              John Doe
            </div>
          </div>
        </div>

        <div className="h-[52px] mx-[20px] mt-[15px] mb-[33px] p-4 bg-sky-500 bg-opacity-30 rounded-lg justify-between items-center gap-4 inline-flex">
          <div className="flex gap-4 items-center">
            <div className="w-5 h-5 relative">
              <img src={Message} alt="Message" />
            </div>
            <div className="grow shrink basis-0 text-white text-opacity-80 text-xs font-normal font-['Inter'] leading-none tracking-wide text-left">
              This is the beginning of your conversation
            </div>
          </div>
          <div className="w-5 h-5 relative">
            <img src={cross} alt="Message" />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender === "self" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "self"
                    ? "bg-[#2D78E6] text-white"
                    : "text-white"
                }`}
              >
                <div>{message.text}</div>
                <div className="text-xs mt-1 flex items-center justify-end gap-1">
                  <span>{message.time}</span>
                  {message.sender === "self" && message.status && (
                    <img
                      src={getStatusIcon(message.status)}
                      alt={message.status}
                      className="w-4 h-4"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </main>

        <div className="mx-[20px] h-14 p-4 bg-zinc-800 rounded-lg justify-between items-center inline-flex">
          <div className="text-center text-white text-opacity-50 text-sm font-normal font-['Inter'] leading-tight tracking-tight">
            Type A Message Here
          </div>
          <div className="justify-start items-center gap-4 flex">
            <div className="w-6 h-6 relative">
              <img src={emoji} alt="emoji" />
            </div>
            <div className="w-6 h-6 relative">
              <img src={send} alt="send" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navbar for smaller devices */}
      <div className="md:hidden w-full h-[72.98px] bg-gradient-to-t from-black to-neutral-800 flex justify-between items-center px-[28px]">
        <div>
          <img src={House} alt="House" />
        </div>
        <div>
          <img src={search} alt="Search" />
        </div>
        <div className="bg-[#575757] rounded-full">
          <img src={Add} alt="Add" />
        </div>
        <div>
          <img src={Chats} alt="Chats" />
        </div>
        <div>
          <img src={Avatar} alt="Avatar" />
        </div>
      </div>
    </div>
  );
};

export default MyChatApp;
