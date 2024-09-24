//  @type {import('tailwindcss').Config} 
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      zIndex: {
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      filter: {
        "sky-blue":
          "invert(79%) sepia(53%) saturate(2378%) hue-rotate(165deg) brightness(100%) contrast(97%)",
      },
      variants: {
        extend: {
          filter: ["hover", "focus"],
        },
      },
      screens: {
        xs: {
          max: "376px",
        },
        fontSize: {
          xxs: "0.625rem", // Custom font size, 10px
        },
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
