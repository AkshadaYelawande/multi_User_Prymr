// import React, { useState } from "react";
// import cross from "../../../assets/images/cross.png";
// import full_screen from "../../../assets/images/arrows-pointing-out.png";
// import crop from "../../../assets/images/crop.svg";
// import rotate from "../../../assets/images/arrow-path.png";
// import queue from "../../../assets/images/queue-list.svg";
// import selective from "../../../assets/images/cursor-arrow-rays.svg";
// import paint_brush from "../../../assets/images/paint-brush.svg";
// import undo from "../../../assets/images/undo.svg";
// import redo from "../../../assets/images/redo.svg";
// import { useNavigate } from "react-router";
// import BoardEditTools from "./BoardEditTools";

// const tools = [
//   { src: crop, alt: "crop", label: "Crop" },
//   { src: rotate, alt: "rotate", label: "Rotate" },
//   { src: queue, alt: "queue", label: "Tune Image" },
//   { src: selective, alt: "selective", label: "Selective" },
//   { src: paint_brush, alt: "paint_brush", label: "Brush" },
// ];

// const BoardEditorBottomDiv = () => {
//   const [isAllToolsVisible, setAllToolsVisible] = useState();

//   return (
//     <div className="w-full fixed bottom-0 left-0 right-0 z-10 bg-black pt-2">
//       <div className="flex justify-between text-gray-400 ml-[10px] mr-[23px]">
//         <div className="w-[122px] h-[29px] pl-[13px] pr-2 py-[3px] rounded-[35px] border-neutral-500 justify-center items-center gap-2 inline-flex">
//           <div className="w-[25px] h-[25px] relative">
//             <img src={cross} alt="cross" />
//           </div>
//           <div className="text-[#A9A9A9] font-bold text-[11px] font-Nunito capitalize tracking-[0.22px]">
//             Board Editor
//           </div>
//         </div>
//         <div className="flex gap-[10px] items-center">
//           <div className="text-neutral-400 text-[11px] font-bold font-Nunito capitalize tracking-tight">
//             All tools
//           </div>
//           <div className="w-6 h-6 relative">
//             <img
//               src={full_screen}
//               alt="full_screen"
//               onClick={setAllToolsVisible(!isAllToolsVisible)}
//             />
//             {isAllToolsVisible && <BoardEditTools />}
//           </div>
//         </div>
//       </div>
//       <div className="mt-2 flex justify-between mx-5">
//         {tools.map((tool) => (
//           <div
//             key={tool.alt}
//             className="flex flex-col justify-start items-center gap-2.5"
//             style={{ width: "calc((100% - 20px) / 5)" }}
//           >
//             <div
//               className="p-[15px] bg-neutral-800 rounded-[15px] border backdrop-blur-sm flex justify-center items-center"
//               style={{
//                 width: "calc(63px * 100%)",
//                 height: "calc(63px * 100%)",
//               }}
//             >
//               <div
//                 className="relative"
//                 style={{
//                   width: "calc(33px * 100%)",
//                   height: "calc(33px * 100%)",
//                 }}
//               >
//                 <img src={tool.src} alt={tool.alt} />
//               </div>
//             </div>
//             <div className="text-center text-white text-opacity-50 text-[10px] sm:text-lg text-nowrap font-normal font-['Nunito']">
//               {tool.label}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="w-auto h-[0px] border border-zinc-800 mt-[8px] mb-[4px] mx-4"></div>
//       <div className="w-[121px] h-[40px] rounded-[27px] justify-center items-end inline-flex">
//         <div className="w-10 px-2 rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
//           <div className="w-5 h-5 justify-center items-center inline-flex">
//             <div className="w-5 h-5 relative">
//               <img src={undo} alt="undo" />
//             </div>
//           </div>
//           <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
//             Undo
//           </div>
//         </div>
//         <div className="w-10 px-2 rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
//           <div className="w-5 h-5 justify-center items-center inline-flex">
//             <div className="w-5 h-5 relative">
//               <img src={redo} alt="redo" />
//             </div>
//           </div>
//           <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
//             Redo
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BoardEditorBottomDiv;

import React, { useState } from "react";
import cross from "../../../../assets/images/cross.png";
import full_screen from "../../../../assets/images/arrows-pointing-out.png";
import crop from "../../../../assets/images/crop.svg";
import rotate from "../../../../assets/images/arrow-path.png";
import queue from "../../../../assets/images/queue-list.svg";
import selective from "../../../../assets/images/cursor-arrow-rays.svg";
import paint_brush from "../../../../assets/images/paint-brush.svg";
import undo from "../../../../assets/images/undo.svg";
import redo from "../../../../assets/images/redo.svg";
import BoardEditTools from "./BoardEditTools";

const tools = [
  { src: crop, alt: "crop", label: "Crop" },
  { src: rotate, alt: "rotate", label: "Rotate" },
  { src: queue, alt: "queue", label: "Tune Image" },
  { src: selective, alt: "selective", label: "Selective" },
  { src: paint_brush, alt: "paint_brush", label: "Brush" },
];

const BoardEditorBottomDiv = () => {
  const [isAllToolsVisible, setAllToolsVisible] = useState(false);

  return (
    <div className="w-full fixed bottom-0 left-0 right-0 z-10 bg-black pt-2">
      <div className="flex justify-between text-gray-400 ml-[10px] mr-[23px]">
        <div className="w-[122px] h-[29px] pl-[13px] pr-2 py-[3px] rounded-[35px] border-neutral-500 justify-center items-center gap-2 inline-flex">
          <div className="w-[25px] h-[25px] relative">
            <img src={cross} alt="cross" />
          </div>
          <div className="text-[#A9A9A9] font-bold text-[11px] font-Nunito capitalize tracking-[0.22px]">
            Board Editor
          </div>
        </div>
        <div className="flex gap-[10px] items-center">
          <div className="text-neutral-400 text-[11px] font-bold font-Nunito capitalize tracking-tight">
            All tools
          </div>
          <div className="w-6 h-6 relative">
            <img
              src={full_screen}
              alt="full_screen"
              onClick={() => setAllToolsVisible(!isAllToolsVisible)}
            />
            {isAllToolsVisible && <BoardEditTools />}
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between mx-5">
        {tools.map((tool) => (
          <div
            key={tool.alt}
            className="flex flex-col justify-start items-center gap-2.5"
            style={{ width: "calc((100% - 20px) / 5)" }}
          >
            <div
              className="p-[15px] bg-neutral-800 rounded-[15px] border backdrop-blur-sm flex justify-center items-center"
              style={{
                width: "calc(63px * 100%)",
                height: "calc(63px * 100%)",
              }}
            >
              <div
                className="relative"
                style={{
                  width: "calc(33px * 100%)",
                  height: "calc(33px * 100%)",
                }}
              >
                <img src={tool.src} alt={tool.alt} />
              </div>
            </div>
            <div className="text-center text-white text-opacity-50 text-[10px] sm:text-lg text-nowrap font-normal font-['Nunito']">
              {tool.label}
            </div>
          </div>
        ))}
      </div>
      <div className="w-auto h-[0px] border border-zinc-800 mt-[8px] mb-[4px] mx-4"></div>
      <div className="w-[121px] h-[40px] rounded-[27px] justify-center items-end inline-flex">
        <div className="w-10 px-2 rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
          <div className="w-5 h-5 justify-center items-center inline-flex">
            <div className="w-5 h-5 relative">
              <img src={undo} alt="undo" />
            </div>
          </div>
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Undo
          </div>
        </div>
        <div className="w-10 px-2 rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
          <div className="w-5 h-5 justify-center items-center inline-flex">
            <div className="w-5 h-5 relative">
              <img src={redo} alt="redo" />
            </div>
          </div>
          <div className="text-zinc-400 text-[11px] font-bold font-['Nunito'] capitalize tracking-tight">
            Redo
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardEditorBottomDiv;
