import React from "react";
import cross from "../../src/assets/images/cross.png";
import search from "../../src/assets/images/search.svg";
import Notification from "./Notification";

const notifications = [
  {
    profileImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    username: "john_doe",
    action: "liked your photo.",
    time: "2h ago",
    type: "like",
    postImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    additionalProfiles: [
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    ],
  },
  {
    profileImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    username: "jane_doe",
    action: "started following you.",
    time: "3h ago",
    type: "follow",
    postImage: null,
    additionalProfiles: null,
  },
  {
    profileImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    username: "alice_w",
    action: 'commented: "Nice shot!"',
    time: "5h ago",
    type: "post",
    postImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    additionalProfiles: null,
  },
  {
    profileImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    username: "bob_smith",
    action: "unlocked your art.",
    time: "1d ago",
    type: "unlock",
    postImage: "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",

    additionalProfiles: null,
  },
  {
    profileImage:
      "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",
    username: "charlie_brown",
    action: "sent you a tip.",
    time: "2d ago",
    type: "tip",
    postImage: "https://cdn4.sharechat.com/compressed_gm_40_img_712342_2212d3af_1688811709348_sc.jpg?tenant=sc&referrer=pwa-sharechat-service&f=348_sc.jpg",

    additionalProfiles: null,
  },
];

const Notifications = () => {
  return (
    <div className="flex flex-col min-h-screen pt-8 pb-2 md:pb-8 px-4 sm:px-6 lg:px-8 h-full max-w-lg mx-auto bg-black">
      <div className="w-full h-[54px] px-5 py-[11px] flex items-center gap-5 justify-between">
        <div className="flex gap-5">
          <div className="flex justify-start items-center gap-2.5">
            <img src={cross} alt="Close" />
          </div>
          <div className="text-white text-[28px] font-semibold leading-[31.09px]">
            Notifications
          </div>
        </div>
        <img src={search} alt="Search" />
      </div>
      <div className="rounded-lg shadow">
        {notifications.map((notification, index) => (
          <Notification
            key={index}
            profileImage={notification.profileImage}
            username={notification.username}
            action={notification.action}
            time={notification.time}
            type={notification.type}
            postImage={notification.postImage}
            additionalProfiles={notification.additionalProfiles}
          />
        ))}
      </div>
    </div>
  );
};

export default Notifications;