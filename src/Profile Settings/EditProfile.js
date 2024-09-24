import React from "react";
import Input from "./Input";
import Button from "./Button";
import back_arrow from "../../src/assets/images/back_arrow.png";


const EditProfile = () => {

 const handleSubmit = (e) => {
   e.preventDefault();
   // Handle form submission here (e.g., send data to backend)
   console.log("Form submitted!");
 };

  return (
    <div className="flex flex-col min-h-screen pt-8 pb-2 md:pb-8 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="w-full max-w-md mx-auto space-y-8 flex flex-col flex-1 relative">
        <div className="w-full h-[54px] px-5 py-[11px] border-b border-white border-opacity-30 flex justify-start items-center gap-5">
          <div className="flex justify-start items-center gap-2.5">
            <img src={back_arrow} alt="Back Arrow" />
          </div>
          <div className="text-white text-[28px] font-semibold leading-[31.09px]">
            Edit Profile
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 flex-1 pb-20">
          <Input label="First Name" type="text" required />
          <Input label="Last Name" type="text" required />
          <Input label="Username" type="text" required />

          <Input
            label="Email Address"
            type="email"
            placeholder="john@gmail.com"
            required
          />
          <textarea
            className="grow shrink basis-0 h-[144px] justify-start items-center flex w-full px-3 rounded"
            type="textarea"
            placeholder="Tell others more about this board (optional)"
          />
          <div className="absolute bottom-0 left-0 w-full bg-black">
            <Button type="submit" variant="primary">
              <div className="text-[#B1B1B1] text-[16px] font-bold capitalize tracking-tight ">
                Save Changes
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
