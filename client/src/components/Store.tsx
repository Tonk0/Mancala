interface IStoreProps {
  stones: number
}
function Store({ stones } : IStoreProps) {
  return (
    <div className="store">
      <p>{stones}</p>
    </div>
  );
}

export default Store;
