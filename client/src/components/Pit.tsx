interface IPitProps {
  index: number
  stones: number
  handlePitClick: (arg:number) => void
}
function Pit({ index, stones, handlePitClick } : IPitProps) {
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="pit" onClick={() => handlePitClick(index)}>
      <p>{stones}</p>
      <p>{index}</p>
    </div>
  );
}

export default Pit;
