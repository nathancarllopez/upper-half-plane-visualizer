// import { useState } from "react";
// import { Stack } from "react-bootstrap";
// import OffcanvasDrawer from "./OffcanvasDrawer";

// export default function Information2() {
//   const [openCardIdx, setOpenCardIdx] = useState(null);
//   const belowOpenCardIdx = openCardIdx + 1;

//   return (
//     <OffcanvasDrawer fabName={"Information"}>
//       <Stack gap={3}>
//         { CARD_NAMES.map((name, idx) => <InfoCard key={name} name={name} isOpen={idx === openCardIdx} toggleIsOpen={toggleIsOpen}/>) }
//       </Stack>
//     </OffcanvasDrawer>
//   );

//   function toggleIsOpen(cardIdx) {
//     setOpenCardIdx(openCardIdx === cardIdx ? null : cardIdx);
//   }
// }

// function InfoCard({ name, isOpen, toggleIsOpen }) {
//   return (
//     <div
//       style={{
//         width: "auto",
//         height: "50px",
//         border: "1px solid black"
//       }}
//       className={ isOpen ? "flex-grow-1" : undefined }
//       onClick={() => toggleIsOpen(name)}
//     >
//       {name}
//     </div>
//   );
// }

// const CARD_NAMES = [
//   "Hyperbolic Paint",
//   "User Manual",
//   "History",
//   "Documentation",
//   "Give Feedback"
// ];