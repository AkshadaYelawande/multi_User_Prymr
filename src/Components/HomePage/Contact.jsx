import React, { useState } from "react";
import handleBack from "../../assets/handleBack.svg";
import mailchimp from "../../assets/mailchimp.png";
import instagram from "../../assets/instagram.svg";
import message from "../../assets/message.png";
import twitter from "../../assets/Twitter.png";
import editToolNavbar from "../../assets/settings.png";
import { baseURL } from "../../Constants/urls";
import { useNavigate } from "react-router";
import handleBackk from "../../assets/handleBack.svg";
import Navbar from "../common/Navbar";
import { useToastManager } from "../Context/ToastContext";

const Contact = ({ closeInfo }) => {
  const toast = useToastManager();
  const userRole = localStorage.getItem("userRole");
  const [contactSubmitted, setContactSubmitted] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${baseURL}/auth/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status) {
        toast(result.message);
        setContactSubmitted(result.message);
        console.log(result);
        navigate("/prymr");
      } else {
        toast("Failed to send message.");
        // setContactSubmitted("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message", error);
      toast("Error sending message.");
      // setContactSubmitted("Error sending message.");
    }
  };
  const handleBack = () => {
    closeInfo();
  };
  return (
    <>
      <div className=" flex justify-between gap-5 lg:pt-2 lg:mt-[12vh]  sm:justify-center ">
        <div className="bg-[#1E1E1E] w-full ml-10  md:hidden md:w-[70%] lg:h-[70vh] lg:block hidden ">
          <div className="flex justify-between ">
            <img
              src={handleBackk}
              className="text-xs sm:w-[20px] border-white lg:hidden"
              onClick={handleBack}
            />

            <div>
              <img src={editToolNavbar} className="ml-auto m-1" />
            </div>
          </div>
          <div className="p-3">I’d love to hear from you</div>
          <div className="p-3">
            The canvas stretched before the artist, blank yet pregnant with
            possibilities. With each stroke of the brush, colors danced in
            harmony or clashed in discord, reflecting the artist's emotions and
            visions. Layers of paint intertwined, revealing depths of meaning
            that words could not convey.
          </div>
          <div className="ml-4  mt-10">
            <div className="flex items-center m-2 space-x-2">
              <img src={instagram} />
              <span className="text-md">@creatorart</span>
            </div>
            <div className="flex items-center m-2  space-x-2">
              <img src={twitter} />
              <span className="text-md">@creatorartist</span>
            </div>
            <div className="m-2  ">
              <button className="w-auto flex  gap-3 p-2 bg-black rounded text-white">
                <img className="w-5 h-5" src={mailchimp} />
                Join Mailing list
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#1E1E1E] h-screen  lg:h-[70vh] pt-1 lg:mr-10">
          <div className="flex justify-between mt-1 mb-3">
            <div className="flex gap-1">
              <img
                src={handleBackk}
                className="text-xs sm:w-[20px] w-5 h-5 mt-[1.2vh] border-white lg:hidden"
                onClick={handleBack}
              />{" "}
              <span className="text-white mt-2"> Contact</span>
            </div>
            <div>
              <img src={editToolNavbar} className="ml-auto m-1" />
            </div>{" "}
          </div>
          <div className="flex gap-2 ml-3">
            <img src={message} /> mailto:erik@erikjonesart.com
          </div>
          <form className="space-y-3 mt-6 w-full p-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              className="p-2 bg-[#2A2A2A] border-2 h-[5vh] text-xs w-full rounded italic"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="p-2 bg-[#2A2A2A] border-2 h-[5vh] text-xs w-full rounded italic"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject Matter"
              value={formData.subject}
              onChange={handleChange}
              className="p-2 bg-[#2A2A2A] border-2 h-[5vh] text-xs w-full rounded italic"
            />
            <textarea
              name="message"
              placeholder="Write Your Message Here"
              value={formData.message}
              onChange={handleChange}
              className="p-2 bg-[#2A2A2A] border-2 mb-3 text-sm w-full h-[20vh] rounded italic"
            />
            <button
              type="submit"
              className="bg-[#696969] py-2 w-full rounded-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>

    // <>
    //   {userRole === "user" ? (
    //     <div className="flex justify-between gap-5 pt-14">
    //       <div className="bg-[#1E1E1E] w-full ml-10 md:hidden md:w-[70%] lg:h-[70vh] lg:block hidden">
    //         <div className="flex justify-between">
    //           <img
    //             src={handleBackk}
    //             className="text-xs sm:w-[20px] border-white lg:hidden"
    //             onClick={handleBack}
    //           />
    //           <div>
    //             <img src={editToolNavbar} className="ml-auto m-1" />
    //           </div>
    //         </div>
    //         <div className="p-3">I’d love to hear from you</div>
    //         <div className="p-3">
    //           The canvas stretched before the artist, blank yet pregnant with
    //           possibilities. With each stroke of the brush, colors danced in
    //           harmony or clashed in discord, reflecting the artist's emotions
    //           and visions. Layers of paint intertwined, revealing depths of
    //           meaning that words could not convey.
    //         </div>
    //         <div className="ml-4 mt-10">
    //           <div className="flex items-center m-2 space-x-2">
    //             <img src={instagram} />
    //             <span className="text-md">@creatorart</span>
    //           </div>
    //           <div className="flex items-center m-2 space-x-2">
    //             <img src={twitter} />
    //             <span className="text-md">@creatorartist</span>
    //           </div>
    //           <div className="m-2">
    //             <button className="w-auto flex gap-3 p-2 bg-black rounded text-white">
    //               <img className="w-5 h-5" src={mailchimp} />
    //               Join Mailing list
    //             </button>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="w-full bg-[#1E1E1E] h-screen md:h-auto lg:h-[70vh] lg:mr-10">
    //         <div className="flex justify-between mt-3">
    //           <img
    //             src={handleBackk}
    //             className="text-xs sm:w-[20px] border-white lg:hidden"
    //             onClick={handleBack}
    //           />
    //           <div>
    //             <img src={editToolNavbar} className="ml-auto m-1" />
    //           </div>
    //         </div>
    //         <div className="flex gap-2 ml-3">
    //           <img src={message} /> mailto:erik@erikjonesart.com
    //         </div>
    //         <form className="space-y-3 mt-6 w-full p-5" onSubmit={handleSubmit}>
    //           <input
    //             type="text"
    //             name="firstName"
    //             placeholder="First name"
    //             value={formData.firstName}
    //             onChange={handleChange}
    //             className="p-2 bg-[#2A2A2A] border-2 h-[5vh] text-xs w-full rounded italic"
    //           />
    //           <input
    //             type="email"
    //             name="email"
    //             placeholder="Email address"
    //             value={formData.email}
    //             onChange={handleChange}
    //             className="p-2 bg-[#2A2A2A] border-2 h-[5vh] text-xs w-full rounded italic"
    //           />
    //           <input
    //             type="text"
    //             name="subject"
    //             placeholder="Subject Matter"
    //             value={formData.subject}
    //             onChange={handleChange}
    //             className="p-2 bg-[#2A2A2A] border-2 h-[5vh] text-xs w-full rounded italic"
    //           />
    //           <textarea
    //             name="message"
    //             placeholder="Write Your Message Here"
    //             value={formData.message}
    //             onChange={handleChange}
    //             className="p-2 bg-[#2A2A2A] border-2 mb-3 text-sm w-full h-[20vh] rounded italic"
    //           />
    //           <button
    //             type="submit"
    //             className="bg-[#696969] py-2 w-full rounded-full"
    //           >
    //             Submit
    //           </button>
    //         </form>
    //       </div>
    //     </div>
    //   ) : userRole === "publicuser" ? (
    //     <div className=" text-white text-lg">hey its Erik</div>
    //   ) : userRole === "private" ? (
    //     <div className=" text-white text-lg">Hey its Ben</div>
    //   ) : null}
    // </>
  );
};

export default Contact;
