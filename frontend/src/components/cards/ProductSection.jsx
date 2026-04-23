// import { useSelector } from "react-redux";

const productSection = ({ category }) => {
  // const activeProduct = useSelector((state) => state.category.active);
  return (
    <div>
      <h1>{category}</h1>
    </div>
  );
};

export default productSection;
