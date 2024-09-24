import "./onboarding.css";
const OnBoardingPage = ({ title, description, imageUrl, logoUrl }) => {
  return (
    <div className=" overflow-y-auto h-screen ">
      <div className=" bg-cover bg-center absolute h-[120vh] flex justify-center align-center">
        <img src={imageUrl} />
      </div>
      <div className="flex flex-col h-[85vh] justify-between">
        <div className=" flex  items-center w-[100vw]  justify-center text-center px-5">
          <div className="logo "></div>
        </div>
        <div className="flex  justify-center w-[100vw]   h-[58vh] -mt-20 ">
          <div className="relative  text-white ">
            <p className="py-2 text-center text-2xl font-semibold">{title}</p>
            <p className="mb-8 text-center px-5 lg:w-[28rem]">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
