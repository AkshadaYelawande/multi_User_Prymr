import React from "react";
import profile_pic from "../../src/assets/images/Avatar.svg";
import cross from "../../src/assets/images/cross.png";
import search from "../../src/assets/images/search.svg";
import House from "../../src/assets/images/House.svg"
import Avatar from "../../src/assets/images/Avatar.png"
import Add from "../../src/assets/images/x-mark.svg";
import Chats from "../../src/assets/images/Chats.svg";

const MessageItem = ({ profile, name, time, message }) => (
  <div className="w-full p-5 bg-sky-500 bg-opacity-30 border-b border-white border-opacity-10 justify-start items-center gap-4 inline-flex">
    <img className="w-10 h-10 rounded-full" src={profile} alt="avatar" />
    <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
      <div className="self-stretch justify-center items-center gap-2 inline-flex">
        <div className="grow shrink basis-0 text-slate-50 text-opacity-95 text-base font-semibold leading-normal tracking-tight text-left">
          {name}
        </div>
        <div className="opacity-50 text-center text-zinc-400 text-[10px] font-light leading-none tracking-wide">
          {time}
        </div>
      </div>
      <div className="text-white text-opacity-80 text-xs font-normal leading-none tracking-wide text-left">
        {message}
      </div>
    </div>
  </div>
);

const MessageList = () => (
  <div className="flex flex-col min-h-screen pt-8 pb-2 h-full max-w-lg bg-black justify-between">
    <div className="px-5 py-2.5 justify-between items-center inline-flex">
      <div className="grow shrink basis-0 h-[33px] justify-start items-center gap-2.5 flex">
        <div className="justify-start items-center flex">
          <div className="w-6 h-6 justify-center items-center flex">
            <div className="w-6 h-6 relative">
              <img src={cross} alt="Close" />
            </div>
          </div>
        </div>
        <div className="text-white text-2xl font-semibold tracking-wide">
          All Messages
        </div>
      </div>
      <div className="w-[30px] self-stretch justify-center items-center flex ">
        <div className="w-[30px] h-[30px] relative">
          <img src={search} alt="Search" />
        </div>
      </div>
    </div>

    <div>
      <MessageItem
        profile={profile_pic}
        name="John Doe"
        time="2 mins ago"
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit."
      />
      <MessageItem
        profile={profile_pic}
        name="John Doe"
        time="2 mins ago"
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit."
      />
      <MessageItem
        profile={profile_pic}
        name="John Doe"
        time="2 mins ago"
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit."
      />
      <MessageItem
        profile={profile_pic}
        name="John Doe"
        time="2 mins ago"
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit."
      />
      <MessageItem
        profile={profile_pic}
        name="John Doe"
        time="2 mins ago"
        message="Lorem ipsum dolor sit amet consectetur adipiscing elit."
      />
    </div>

    <div class="w-full h-[72.98px] bg-gradient-to-t from-black to-neutral-800 flex justify-between items-center px-[28px]">
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

export default MessageList;
