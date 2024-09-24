// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import OnBoardingPage from "./OnBoardingPage";
// import WalletComponent from "../SignUpPage/WalletComponent";
// import "./onboarding.css";

// // function OnBoarding() {
// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
//   ResizeObserverSize: 10,
//   appendDots: (dots) => (
//     <div
//       style={{
//         backgroundColor: "transparent",
//         padding: "10px",
//         bottom: "10px",
//       }}
//     >
//       <ul style={{ margin: "0px" }}> {dots} </ul>
//     </div>
//   ),
// };

// const onBoardingData = [
//   {
//     className: "bg1",

//     logoUrl: "logo",
//     title: "Create Your Space",
//     description:
//       "Craft your unique profile, share your passions, and showcase your talents. Your content is your canvas paint it with your creativity..",
//   },
//   {
//     className: "bg2",
//     logoUrl: "logo",
//     title: "Connect Authentically",
//     description:
//       " Discover a network of like-minded creators and enthusiasts who appreciate you for more than just a like. Engage in meaningful conversations and inspire each other.",
//   },
//   {
//     className: "bg3",
//     logoUrl: "logo",
//     title: "Monetise Your Passion",
//     description:
//       " Prymr believes in the value you bring. Explore ways to turn your creativity into income and achieve the economic freedom you deserve.",
//   },
// ];

// function OnBoarding() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     ResizeObserverSize: 10,
//     appendDots: (dots) => (
//       <div
//         style={{
//           backgroundColor: "transparent",
//           padding: "10px",
//           bottom: "10px",
//         }}
//       >
//         <ul style={{ margin: "0px" }}> {dots} </ul>
//       </div>
//     ),
//   };

//   return (
//     <div className="h-screen relative">
//       <Slider {...settings}>
//         {onBoardingData.map((data, index) => (
//           <div key={index} className={data.className}>
//             <OnBoardingPage
//               logoUrl={data.logoUrl}
//               title={data.title}
//               description={data.description}
//             />
//           </div>
//         ))}
//       </Slider>

//       <div className="fixed inset-0 flex items-center justify-center z-50 xs:top-[330px] lg:top-80 top-96">
//         <div className="w-72 overflow-auto h-80">
//           <WalletComponent />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OnBoarding;
