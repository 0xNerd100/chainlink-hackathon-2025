// "use client";
// import { useCountdown } from "@/hooks/useCountdown";
// import React from "react";

// interface TimerProps {
//   start: number;
//   end: number;
// }

// const Timer: React.FC<TimerProps> = ({ start, end }) => {
//   const { timer, text } = useCountdown(start, end);

//   return (
//     <>
//       <p className="themeClr m-0 text-center text-[14px] mt-[-10px]">{text}</p>
//       <div className="timerset mt-[10px]">
//         <ul className="list-none flex items-center justify-center sm:gap-[14px] gap-[10px] sm:px-[30px] text-center">
//           <li>
//             <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
//               {timer ? (timer[0] ? timer[0] : "0") : "0"}
//             </div>
//             <span className="sm:text-[14px] text-[12px] themeClr font-normal">
//               Days
//             </span>
//           </li>
//           <div className="dash sm:text-[40px] text-[30px] font-[800] themeClr">
//             :
//           </div>
//           <li>
//             <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
//               {timer ? (timer[1] ? timer[1] : "0") : "0"}
//             </div>
//             <span className="sm:text-[14px] text-[12px] themeClr font-normal">
//               HOURS
//             </span>
//           </li>
//           <div className="dash sm:text-[40px] text-[30px] font-[800] themeClr">
//             :
//           </div>
//           <li>
//             <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
//               {timer ? (timer[2] ? timer[2] : "0") : "0"}
//             </div>
//             <span className="sm:text-[14px] text-[12px] themeClr font-normal">
//               MINUTES
//             </span>
//           </li>
//           <div className="dash sm:text-[40px] text-[30px] font-[800] themeClr">
//             :
//           </div>
//           <li>
//             <div className="sm:h-[80px] sm:w-[80px] h-[50px] w-[50px] rounded bg-[#1f8f3e] flex items-center justify-center p-2 sm:text-[26px] text-[20px] mb-2">
//               {timer ? (timer[3] ? timer[3] : "0") : "0"}
//             </div>
//             <span className="sm:text-[14px] text-[12px] themeClr font-normal">
//               SECONDS
//             </span>
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default Timer;
