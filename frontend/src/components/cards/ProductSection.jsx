import { useSelector } from "react-redux";

const productSection = () => {
  const activeProduct = useSelector((state) => (state.active))
  return (
    <div>
      <h1>{activeProduct}</h1>
    </div>
  );
};

export default productSection;
