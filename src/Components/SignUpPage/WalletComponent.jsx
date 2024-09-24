import "./signup.css";
import {
  ConnectEmbed,
  useAddress,
  useEmbeddedWalletUserEmail,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const WalletComponent = () => {
  const address = useAddress();
  const wallet = useEmbeddedWalletUserEmail();
  const navigate = useNavigate();
  const [flag, setFlag] = useState(null);
  const [error, setError] = useState(null);

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const checkFlag = async () => {
      if (address && wallet?.data) {
        try {
          const response = await fetch(
            "https://prymr-dev-backend.vercel.app/api/auth/registerUser",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedToken}`,
              },
              body: JSON.stringify({
                wallet_address: address,
                email: wallet.data,
              }),
            }
          );

          if (response.status) {
            const data = await response.json();
            console.log("39 Data :" + data.data.data);
            console.log(response);

            if (data.status) {
              localStorage.setItem("token", data.data.token);
              setFlag(data.data.data.profile_is_completed);
              console.log(
                "43 Token Data:" + data.data.data.profile_is_completed
              );
            }
          } else {
            console.error("Error fetching flag:", response.statusText);
            setError("Failed to determine flag");
          }
        } catch (error) {
          console.error("Error fetching flag:", error);
          setError("Failed to determine flag");
        }
      }
    };

    checkFlag();
  }, [wallet.data]);

  useEffect(() => {
    if (flag == false) {
      navigate("/signuppage");
    } else if (flag == true) {
      navigate("/prymr");
    }
  }, [flag]);

  //h-20 wallet lg:mt-20
  return <ConnectEmbed />;
};
export default WalletComponent;
