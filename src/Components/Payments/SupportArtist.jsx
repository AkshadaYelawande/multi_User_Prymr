import React, { useState } from "react";
import { X, CreditCard, Gift } from "lucide-react";
import smallAvatar from "../../assets/smallAvatar.svg";

export default function SupportArtistForm() {
  const [amount, setAmount] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [coverFees, setCoverFees] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-blue-500 rounded-lg shadow-xl max-w-md w-full text-white">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Gift className="w-6 h-6 mr-2" />
              Support This Artist
            </h2>
            <button className="text-white hover:text-gray-200">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-blue-100">
            You are about to support this artist with
          </p>
          <div className="bg-blue-400 rounded-lg p-4 gap-4 flex flex-col items-center">
            <div className="text-4xl font-bold">${amount}</div>
            <button className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">
              Change amount
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <img
              src={smallAvatar}
              alt="Artist avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-semibold">Erik Jones Art</div>
              <div className="text-sm text-blue-200">@erikjonesart</div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-700"
                checked={coverFees}
                onChange={() => setCoverFees(!coverFees)}
              />
              <span className="text-sm">
                I'll generously add $0.35 to cover the transaction fees so the
                artist can receive 100% of my support
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-700"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(!isAnonymous)}
              />
              <span className="text-sm">Make my support anonymous</span>
            </label>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span>Payment method</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Add New
              </button>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6" />
                <div>
                  <div className="font-mono">**** **** **** 3468</div>
                  <div className="text-sm text-gray-400">John Doe</div>
                </div>
              </div>
              <img
                src="/api/placeholder/40/30"
                alt="Mastercard logo"
                className="h-8"
              />
            </div>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 mr-2" />
            Send Support (${amount})
          </button>
        </div>
      </div>
    </div>
  );
}
