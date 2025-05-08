import Latex from "react-latex";

export default function ToLatex({ tex, displayMode = false }) {
  const delimited = `$$${tex}$$`;
  
  return (
    <Latex displayMode={displayMode}>{ delimited }</Latex>
  );
}