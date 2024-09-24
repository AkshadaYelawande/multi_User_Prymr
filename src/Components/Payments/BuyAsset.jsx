"use client";

import { useState } from "react";

const BuyAsset = ({ onClose, tappableContent }) => {
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  const toggleNewCardForm = () => {
    setShowNewCardForm(!showNewCardForm);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-gray-900 overflow-y-auto ">
      <div className="min-h-full bg-black rounded-l-3xl overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Buy Asset</h2>
            <button
              className="text-gray-400 w-[10px] hover:text-white"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            Buy my NFT and be a part of my creator journey!
          </p>
          <div className="flex justify-center items-center py-6">
            {/* Lock icon placeholder */}
            <span className="text-gray-600 text-5xl">🔒</span>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <span className="text-5xl font-bold text-white">$1.00</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Choose a payment method</span>
              <button
                className="text-blue-500 w-auto text-sm flex items-center"
                onClick={toggleNewCardForm}
              >
                Add New Card
              </button>
            </div>
            {showNewCardForm && (
              <form className="bg-gray-800 rounded-xl p-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="text-gray-400 block">
                    Card Number
                  </label>
                  <input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="bg-gray-700 text-white w-full p-2 rounded"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1 space-y-2">
                    <label htmlFor="expiry" className="text-gray-400 block">
                      MM/YY
                    </label>
                    <input
                      id="expiry"
                      placeholder="MM/YY"
                      className="bg-gray-700 text-white w-full p-2 rounded"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label htmlFor="cvc" className="text-gray-400 block">
                      CVC
                    </label>
                    <input
                      id="cvc"
                      placeholder="CVC"
                      className="bg-gray-700 text-white w-full p-2 rounded"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="name" className="text-gray-400 block">
                    Name on Card
                  </label>
                  <input
                    id="name"
                    placeholder="John Doe"
                    className="bg-gray-700 text-white w-full p-2 rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="region" className="text-gray-400 block">
                    Region
                  </label>
                  <select
                    id="region"
                    className="bg-gray-700 text-white w-full p-2 rounded"
                  >
                    <option value="">Select a region</option>
                    <option value="us">United States</option>
                    <option value="ca">Canada</option>
                    <option value="uk">United Kingdom</option>
                    <option value="au">Australia</option>
                  </select>
                </div>
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">
                  Add Card
                </button>
              </form>
            )}
            <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-9 h-6 bg-gray-600 mr-3"></div>
                <div>
                  <div className="text-white">•••• •••• •••• 3468</div>
                  <div className="text-gray-400 text-sm">John Doe</div>
                </div>
              </div>
              <div className="w-9 h-6 bg-gray-600"></div>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-600 mr-3 rounded-full"></div>
                <div>
                  <div className="text-white">Crypto</div>
                  <div className="text-gray-400 text-sm">
                    Powered by coinbase
                  </div>
                </div>
              </div>
              <span className="text-gray-400">💳</span>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 flex items-center">
              <div className="w-8 h-8 bg-gray-600 mr-3 rounded-full"></div>
              <div>
                <div className="text-white">John Doe</div>
                <div className="text-gray-400 text-sm">j•••••••@gmail.com</div>
              </div>
            </div>
          </div>
          <button className="w-full bg-white text-black hover:bg-gray-200 p-2 rounded">
            $1.00 Checkout
          </button>
          <button className="w-full bg-gray-800 text-white hover:bg-gray-700 p-2 rounded flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            Add to cart
          </button>
        </div>
        <div className="h-2 bg-gray-800" />
      </div>
    </div>
  );
};
export default BuyAsset;

// "use client";

// import { useState } from "react";
// import plusCircle from "../../assets/plusCircle.svg";

// const BuyAsset = ({ onClose, tappableContent }) => {
//   const [showNewCardForm, setShowNewCardForm] = useState(false);

//   const toggleNewCardForm = () => {
//     setShowNewCardForm(!showNewCardForm);
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-start sm:items-center p-4 overflow-y-auto">
//       <div className="w-full sm:w-[400px] bg-gray-900 rounded-3xl overflow-hidden">
//         <div className="p-6 space-y-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-white">Buy Asset</h2>
//             <button
//               variant="ghost"
//               size="icon"
//               onClick={onClose}
//               className="text-gray-400 hover:text-white"
//             >
//               X
//             </button>
//           </div>
//           <p className="text-gray-400 text-sm">
//             Buy my NFT and be a part of my creator journey!
//           </p>
//           <div className="flex justify-center items-center py-6">
//             <Lock className="h-12 w-12 text-gray-600" />
//           </div>
//           <div className="bg-gray-800 rounded-xl p-6">
//             <span className="text-5xl font-bold text-white">$1.00</span>
//           </div>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-gray-400">Choose a payment method</span>
//               <button
//                 // variant="ghost"
//                 // size="sm"
//                 onClick={toggleNewCardForm}
//                 className="text-blue-500 hover:text-blue-400"
//               >
//                 <img
//                   src={plusCircle}
//                   alt="Add new card"
//                   className="h-4 w-4 mr-2"
//                 />
//                 Add New Card
//               </button>
//             </div>
//             {showNewCardForm && (
//               <form className="bg-gray-800 rounded-xl p-4 space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="cardNumber" className="text-gray-400">
//                     Card Number
//                   </Label>
//                   <Input
//                     id="cardNumber"
//                     placeholder="1234 5678 9012 3456"
//                     className="bg-gray-700 text-white"
//                   />
//                 </div>
//                 <div className="flex space-x-4">
//                   <div className="flex-1 space-y-2">
//                     <Label htmlFor="expiry" className="text-gray-400">
//                       MM/YY
//                     </Label>
//                     <Input
//                       id="expiry"
//                       placeholder="MM/YY"
//                       className="bg-gray-700 text-white"
//                     />
//                   </div>
//                   <div className="flex-1 space-y-2">
//                     <Label htmlFor="cvc" className="text-gray-400">
//                       CVC
//                     </Label>
//                     <Input
//                       id="cvc"
//                       placeholder="CVC"
//                       className="bg-gray-700 text-white"
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-gray-400">
//                     Name on Card
//                   </Label>
//                   <Input
//                     id="name"
//                     placeholder="John Doe"
//                     className="bg-gray-700 text-white"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="region" className="text-gray-400">
//                     Region
//                   </Label>
//                   <Select>
//                     <SelectTrigger className="bg-gray-700 text-white">
//                       <SelectValue placeholder="Select a region" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="us">United States</SelectItem>
//                       <SelectItem value="ca">Canada</SelectItem>
//                       <SelectItem value="uk">United Kingdom</SelectItem>
//                       <SelectItem value="au">Australia</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
//                   Add Card
//                 </button>
//               </form>
//             )}
//             <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-9 h-6 bg-gray-600 mr-3 rounded"></div>
//                 <div>
//                   <div className="text-white">•••• •••• •••• 3468</div>
//                   <div className="text-gray-400 text-sm">John Doe</div>
//                 </div>
//               </div>
//               <div className="w-9 h-6 bg-gray-600 rounded"></div>
//             </div>
//             <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 bg-gray-600 mr-3 rounded-full"></div>
//                 <div>
//                   <div className="text-white">Crypto</div>
//                   <div className="text-gray-400 text-sm">
//                     Powered by coinbase
//                   </div>
//                 </div>
//               </div>
//               {/* <CreditCard className="h-6 w-6 text-gray-400" /> */}
//             </div>
//             <div className="bg-gray-800 rounded-xl p-4 flex items-center">
//               <div className="w-8 h-8 bg-gray-600 mr-3 rounded-full"></div>
//               <div>
//                 <div className="text-white">John Doe</div>
//                 <div className="text-gray-400 text-sm">j•••••••@gmail.com</div>
//               </div>
//             </div>
//           </div>
//           <button className="w-full bg-white text-black hover:bg-gray-200">
//             $1.00 Checkout
//           </button>
//           <button
//             className="w-full bg-gray-800 text-white hover:bg-gray-700"
//             variant="outline"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
//             </svg>
//             Add to cart
//           </button>
//         </div>
//         <div className="h-2 bg-gray-800" />
//       </div>
//     </div>
//   );
// };

// export default BuyAsset;
