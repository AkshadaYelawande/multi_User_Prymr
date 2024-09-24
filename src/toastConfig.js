import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastStyle = {
  width: "300px", // or '100%' for full width of the container
};

const toastBodyStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  padding: "10px",
};

export const showToast = (type, message) => {
  toast[type](
    <div style={toastBodyStyle}>
      {typeof message === "string"
        ? message
        : message.map((line, index) => <div key={index}>{line}</div>)}
    </div>,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: toastStyle,
    }
  );
};
