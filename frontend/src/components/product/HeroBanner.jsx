import PageWapper from "../layout/PageWapper";
import offImage from "../../assets/images/off4.png";
// import offMImage from "../../assets/images/Other/img/"

const HeroBanner = () => {
  return (
    <div>
      <PageWapper>
        <div className="flex justify-center items-center rounded-md my-10 bg-red-100 ">
          <div className="flex justify-center items-center">
            <img
              src={offImage}
              className="object-contain max-[1000px]:w-full"
              alt="main page offer image"
            />
          </div>
        </div>
      </PageWapper>
    </div>
  );
};

export default HeroBanner;
