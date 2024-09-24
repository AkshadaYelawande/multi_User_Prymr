const SocialMediaBtn = ({ mediaBtn }) => {
  const handleGoogleLogin = () => {
    toast("Redirecting to the Google authentication ");
    window.location.href = " https://prymr.vercel.app/api/auth/google";
  };
  return (
    <div>
      <div className="m-5 w-[82px] text-gray-400 h-[16px] font-inter text-xs font-medium leading-[15.73px] tracking-tight text-left">
        SIGN UP VIA
      </div>
      <div className="flex pr-1 pl-1 justify-center">
        <img
          className="mx-auto  w-[75px] h-[75px]  rounded-full"
          src="\Images\Google.png"
          alt="Google.com "
          onClick={handleGoogleLogin}
        />
        {/* <GoogleOAuthProvider clientId="<your_client_id>">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              //encrypted format
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }} 
       /> </GoogleOAuthProvider> */}
        <img
          className="mx-auto  w-[75px] h-[75px] rounded-full transform scale-100"
          src="\Images\Apple.png"
          alt="Apple.com "
        />
        <img
          className=" mx-auto   w-[75px] h-[75px] rounded-full"
          src="\Images\Facebook.png"
          alt="Google.com "
        />
        <img
          className=" mx-auto  w-[75px] h-[75px] rounded-full transform scale-100"
          src="\Images\Twitter.png"
          alt="Google.com "
        />
      </div>
    </div>
  );
};

export default SocialMediaBtn;
