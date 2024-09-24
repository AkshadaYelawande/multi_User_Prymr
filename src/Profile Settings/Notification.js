import React from "react";
import heartIcon from "../../src/assets/images/heart.svg";
import unlockIcon from "../../src/assets/images/unlock.svg";
import dollarIcon from "../../src/assets/images/dollar.svg";

const Notification = ({
  profileImage,
  username,
  action,
  time,
  type,
  postImage,
  additionalProfiles, // array of profile images for multiple likes
}) => {
  const renderIcon = () => {
    switch (type) {
      case "like":
        return <img src={heartIcon} alt="Like" className="w-4 h-4" />;
      case "unlock":
        return <img src={unlockIcon} alt="Unlock" className="w-4 h-4" />;
      case "tip":
        return <img src={dollarIcon} alt="Tip" className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center">
        <div className="relative flex items-center">
          {additionalProfiles && additionalProfiles.length > 0 ? (
            <div className="relative flex">
              {additionalProfiles.map((profile, index) => (
                <img
                  key={index}
                  className="w-10 h-10 rounded-full border-2 border-black absolute"
                  style={{
                    top: `${index * 5}px`,
                    left: `${index * 5}px`,
                    zIndex: additionalProfiles.length - index,
                  }}
                  src={profile}
                  alt={`Profile ${index + 1}`}
                />
              ))}
              <img
                className="w-10 h-10 rounded-full border-2 border-black relative"
                style={{
                  top: `${additionalProfiles.length * 5}px`,
                  left: `${additionalProfiles.length * 5}px`,
                }}
                src={profileImage}
                alt={username}
              />
              {renderIcon() && (
                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-black rounded-full p-1">
                  {renderIcon()}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full"
                src={profileImage}
                alt={username}
              />
              {renderIcon() && (
                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2 bg-black rounded-full p-1">
                  {renderIcon()}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="ml-4">
          <p className="text-sm text-[#FFFFFF]">
            <span className="font-semibold">{username}</span>{" "}
            <span>{action}</span>
            <span className="mx-1">•</span>
            <span className="text-xs text-gray-500">{time}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center ml-4">
        {type === "follow" ? (
          <button className="w-[86px] h-[35px] px-2.5 py-2 bg-blue-600 rounded-[36px] justify-center items-center gap-2.5 inline-flex">
            <div className="text-white text-sm font-bold capitalize">
              Follow
            </div>
          </button>
        ) : postImage ? (
          <img className="w-10 h-10 rounded" src={postImage} alt="Post" />
        ) : null}
      </div>
    </div>
  );
};

export default Notification;