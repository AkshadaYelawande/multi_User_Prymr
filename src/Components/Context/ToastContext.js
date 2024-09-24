// ToastManagerContext.js
import React, { createContext, useContext, useState, useCallback } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const ToastManagerContext = createContext();

export const ToastManagerProvider = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState(new Set());

  const showToast = useCallback(
    (message, options = {}) => {
      if (!activeToasts.has(message)) {
        setActiveToasts((prev) => new Set(prev).add(message));
        Toastify({
          text: message,
          ...options,
          callback: () => {
            setActiveToasts((prev) => {
              const newSet = new Set(prev);
              newSet.delete(message);
              return newSet;
            });
          },
        }).showToast();
      }
    },
    [activeToasts]
  );

  return (
    <ToastManagerContext.Provider value={showToast}>
      {children}
    </ToastManagerContext.Provider>
  );
};

export const useToastManager = () => {
  return useContext(ToastManagerContext);
};

// import React, { createContext, useContext, useState, useCallback } from "react";
// import Toastify from "toastify-js";
// import "toastify-js/src/toastify.css";

// const ToastManagerContext = createContext();

// export const ToastManagerProvider = ({ children }) => {
//   const [activeToasts, setActiveToasts] = useState(new Set());

//   const showToast = useCallback(
//     (message, options = {}) => {
//       if (!activeToasts.has(message)) {
//         setActiveToasts((prev) => new Set(prev.add(message)));
//         const toastInstance = Toastify({
//           text: message,
//           ...options,
//           duration: options.duration || 3000,
//           onClick: () => {
//             setActiveToasts((prev) => {
//               const newSet = new Set(prev);
//               newSet.delete(message);
//               return newSet;
//             });
//             options.callback?.();
//           },
//         }).showToast();

//         return toastInstance;
//       } else {
//         const existingToast = Array.from(activeToasts).find(
//           (t) => t === message
//         );
//         Toastify({
//           text: message,
//           ...options,
//           duration: options.duration || 3000,
//           onClick: () => {
//             setActiveToasts((prev) => {
//               const newSet = new Set(prev);
//               newSet.delete(message);
//               return newSet;
//             });
//             options.callback?.();
//           },
//         }).update(existingToast);
//       }
//     },
//     [activeToasts]
//   );

//   return (
//     <ToastManagerContext.Provider value={showToast}>
//       {children}
//     </ToastManagerContext.Provider>
//   );
// };

// export const useToastManager = () => {
//   return useContext(ToastManagerContext);
// };
