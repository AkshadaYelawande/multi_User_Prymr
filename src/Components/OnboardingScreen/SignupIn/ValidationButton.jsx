import { useEffect, useState } from "react";

const ValidationButton = ({ password }) => {
  const [validationObj, setvalidationObj] = useState({
    CharactersPresent: false,
    DigitsPresent: false,
    IsUppercase: false,
    SpecailChar: false,
  });

  useEffect(() => {
    if (password) {
      setvalidationObj({
        CharactersPresent: !(password.length < 8),
        DigitsPresent: /\d/.test(password),
        IsUppercase: /[A-Z]/.test(password),
        SpecailChar: /[!@#$%^&*]/.test(password),
      });
    } else {
      setvalidationObj({
        CharactersPresent: false,
        DigitsPresent: false,
        IsUppercase: false,
        SpecailChar: false,
      });
    }
  }, [password]);

  return (
    <div className="w-full mt-2 mb-14 h-[5vh] gap-4 font-nunito text-xs font-normal leading-[5px] text-left">
      <button
        className={`w-auto ml-2 bg-black border-dashed rounded-full ${
          validationObj.CharactersPresent
            ? "bg-white text-black"
            : "bg-black text-white"
        }`}
      >
        8 Characters <></>
        {validationObj.CharactersPresent ? (
          <span className="bg-blue-500 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-5 inline-block "
              viewBox="3 3 15 20"
              fill="none"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        ) : (
          <></>
        )}
      </button>

      <button
        className={`w-auto ml-2 bg-black border-dashed rounded-full ${
          validationObj.DigitsPresent
            ? "bg-white text-black"
            : "bg-black text-white"
        }`}
      >
        Digit <></>
        {validationObj.DigitsPresent ? (
          <span className="bg-blue-500 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-5 inline-block "
              viewBox="3 3 15 20"
              fill="none"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        ) : (
          <></>
        )}
      </button>

      <button
        className={`w-auto ml-2 bg-black border-dashed rounded-full ${
          validationObj.IsUppercase
            ? "bg-white text-black"
            : "bg-black text-white"
        }`}
      >
        UpperCase <></>
        {validationObj.IsUppercase ? (
          <span className="bg-blue-500 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-5 inline-block "
              viewBox="3 3 15 20"
              fill="none"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        ) : (
          <></>
        )}
      </button>

      <button
        className={`w-auto ml-2 mt-4 bg-black border-dashed rounded-full ${
          validationObj.SpecailChar
            ? "bg-white text-black"
            : "bg-black text-white"
        }`}
      >
        Special Characters <></>
        {validationObj.SpecailChar ? (
          <span className="bg-blue-500 hover:bg-blue-700 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-5 inline-block "
              viewBox="3 3 15 20"
              fill="none"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        ) : (
          <></>
        )}
      </button>
    </div>
  );
};
export default ValidationButton;
