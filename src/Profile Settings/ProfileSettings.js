import React from "react";
import cross from "../../src/assets/images/cross.png";
import lock from "../../src/assets/images/lock.png";
import arrow from "../../src/assets/images/arrow.png";
import bell from "../../src/assets/images/bell.png";

const ProfileSettings = () => {
  return (
    <div className="h-screen w-[428px] flex flex-col px-4 py-2 bg-black text-white font-['Nunito']">
      <div className="flex-grow">
        <div className="h-[98px] flex items-center gap-2">
          <div>
            <img src={cross} alt="close" />
          </div>
          <div className="text-white text-xl font-semibold tracking-wide">
            Profile Settings
          </div>
        </div>

        <div className="space-y-5 flex-grow">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div>
                <img src={lock} alt="lock" />
              </div>
              <div>Edit Profile</div>
            </div>
            <div>
              <img src={arrow} alt="arrow" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div>
                <img src={lock} alt="lock" />
              </div>
              <div>Change Password</div>
            </div>
            <div>
              <img src={arrow} alt="arrow" />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div>
                <img src={bell} alt="bell" />
              </div>
              <div>Notification</div>
            </div>
            <div>
              <img src={arrow} alt="arrow" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 pb-5">
        <button
          className="text-white font-bold bg-opacity-300 bg-blue-600 w-full h-[45px] rounded-full"
          type="submit"
        >
          Log Out
        </button>
        <button
          className="text-red-600 font-bold border border-red-600 bg-opacity-300 w-full h-[45px] rounded-full"
          type="submit"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
