// import React, { useState } from "react";
// import { X, CreditCard, Gift } from "lucide-react";
// import smallAvatar from "../assets/smallAvatar.svg";

// export default function SupportArtistForm() {
//   const [amount, setAmount] = useState(1);
//   const [isAnonymous, setIsAnonymous] = useState(true);
//   const [coverFees, setCoverFees] = useState(true);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-blue-500 rounded-lg shadow-xl max-w-md w-full text-white">
//         <div className="p-6 space-y-6">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold flex items-center">
//               <Gift className="w-6 h-6 mr-2" />
//               Support This Artist
//             </h2>
//             <button className="text-white hover:text-gray-200">
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//           <p className="text-blue-100">
//             You are about to support this artist with
//           </p>
//           <div className="bg-blue-400 rounded-lg p-4 gap-4 flex flex-col items-center">
//             <div className="text-4xl font-bold">${amount}</div>
//             <button className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
//               Change amount
//             </button>
//           </div>

//           <div className="flex items-center space-x-3">
//             <img
//               src={smallAvatar}
//               alt="Artist avatar"
//               className="w-10 h-10 rounded-full"
//             />
//             <div>
//               <div className="font-semibold">Erik Jones Art</div>
//               <div className="text-sm text-blue-200">@erikjonesart</div>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 className="form-checkbox w-auto text-blue-700"
//                 checked={coverFees}
//                 onChange={() => setCoverFees(!coverFees)}
//               />
//               <span className="text-sm">
//                 I'll generously add $0.35 to cover the transaction fees so the
//                 artist can receive 100% of my support
//               </span>
//             </label>
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 className="form-checkbox w-auto  text-blue-700"
//                 checked={isAnonymous}
//                 onChange={() => setIsAnonymous(!isAnonymous)}
//               />
//               <span className="text-sm">Make my support anonymous</span>
//             </label>
//           </div>
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <span>Payment method</span>
//               <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
//                 Add New
//               </button>
//             </div>
//             <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <CreditCard className="w-6 h-6" />
//                 <div>
//                   <div className="font-mono">**** **** **** 3468</div>
//                   <div className="text-sm text-gray-400">John Doe</div>
//                 </div>
//               </div>
//               <img
//                 src="/api/placeholder/40/30"
//                 alt="Mastercard logo"
//                 className="h-8"
//               />
//             </div>
//           </div>
//           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center">
//             <Gift className="w-5 h-5 mr-2" />
//             Send Support (${amount})
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState } from "react";
import X from "../assets/xcircle.png";

import GiftIcon from "../assets/Gift_pop.svg";
import PlusIcon from "../assets/tappable_plus.svg";

// import CreditCardIcon from "../assets/credit-card.png";

export default function SupportArtistForm() {
  const [amount, setAmount] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [coverFees, setCoverFees] = useState(true);
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  const toggleNewCardForm = () => {
    setShowNewCardForm(!showNewCardForm);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-blue-500 max-w-md w-full text-white rounded-lg shadow-md">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <img src={GiftIcon} alt="Gift Icon" className="w-6 h-6 mr-2" />
              Support This Artist
            </h2>
            <button
              variant="ghost"
              size="icon"
              className="text-white w-auto hover:text-gray-200"
            >
              <img src={X} alt="Close" className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100">
            You are about to support this artist with
          </p>
          <div className="bg-blue-400 rounded-lg p-4 gap-4 flex flex-col items-center">
            <div className="text-4xl font-bold">${amount}</div>
            <button
              variant="secondary"
              size="sm"
              className="bg-yellow-400 text-blue-900 hover:bg-yellow-500"
            >
              Change amount
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Artist avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="font-semibold">Erik Jones Art</div>
              <div className="text-sm text-blue-200">@erikjonesart</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="cover-fees"
                className="w-auto "
                checked={coverFees}
                onChange={() => setCoverFees(!coverFees)}
              />
              <label htmlFor="cover-fees" className="text-sm">
                I'll generously add $0.35 to cover the transaction fees so the
                artist can receive 100% of my support
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                className="w-auto "
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <label htmlFor="anonymous" className="text-sm">
                Make my support anonymous
              </label>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span>Payment method</span>
              <div className="flex items-center">
                <button
                  className="flex items-center w-auto text-sm px-2 py-1 hover:bg-gray-300 rounded"
                  onClick={toggleNewCardForm}
                >
                  <img src={PlusIcon} alt="Add New" className="w-4 h-4 mr-2" />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {showNewCardForm ? (
              <form className="bg-blue-600 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-sm">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-blue-500 text-white placeholder-blue-300"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <label htmlFor="expiry" className="text-sm">
                      MM/YY
                    </label>
                    <input
                      id="expiry"
                      placeholder="MM/YY"
                      className="bg-blue-500 text-white placeholder-blue-300"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label htmlFor="cvc" className="text-sm">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      placeholder="CVC"
                      className="bg-blue-500 text-white placeholder-blue-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm">
                    Name on Card
                  </label>
                  <input
                    id="name"
                    placeholder="John Doe"
                    className="bg-blue-500 text-white placeholder-blue-300"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="region" className="text-sm">
                    Region
                  </label>
                  <Select>
                    <SelectTrigger className="bg-blue-500 text-white">
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <button className="w-full bg-yellow-400 text-blue-900 hover:bg-yellow-500">
                  Add Card
                </button>
              </form>
            ) : (
              <div className="bg-blue-600 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    // src={CreditCardIcon}
                    alt="Credit Card"
                    className="w-6 h-6"
                  />
                  <div>
                    <div className="font-mono">**** **** **** 3468</div>
                    <div className="text-sm text-blue-200">John Doe</div>
                  </div>
                </div>
                <img
                  src="/placeholder.svg?height=32&width=40"
                  alt="Mastercard logo"
                  width={40}
                  height={32}
                />
              </div>
            )}
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center">
            <img src={GiftIcon} alt="Send Support" className="w-5 h-5 mr-2" />
            Send Support (${amount})
          </button>
        </div>
      </div>
    </div>
  );
}
