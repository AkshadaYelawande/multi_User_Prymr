import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const LockTappableComponent = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white">Lock Tappable</span>
        <Switch
          checked={isLocked}
          onCheckedChange={setIsLocked}
        />
      </div>
      
      {isLocked && (
        <>
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 rounded ${selectedOption === 'payment' ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'}`}
              onClick={() => setSelectedOption('payment')}
            >
              Payment
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedOption === 'follow' ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'}`}
              onClick={() => setSelectedOption('follow')}
            >
              Follow
            </button>
          </div>
          
          {selectedOption === 'payment' && (
            <Input className="mb-2" placeholder="Enter Price" />
          )}
          
          <Textarea 
            className="mb-2" 
            placeholder="Enter Description" 
          />
          
          <p className="text-sm text-gray-400">
            {selectedOption === 'payment'
              ? "By adding a payment request, your viewers will pay the stipulated fee to apply the selected switch action this tappable"
              : "By adding a follow request, your viewers must be following you on prymr to apply the selected switch action this tappable"}
          </p>
        </>
      )}
    </div>
  );
};

export default LockTappableComponent;