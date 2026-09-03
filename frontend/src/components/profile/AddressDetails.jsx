import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  AddUserAddress,
  GetUserAddress,
  UpdateUserAddress,
} from "../../features/userAddress/userAddressThunk";

import { BiHome } from "react-icons/bi";
import { MdOutlineWorkOutline } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

const AddressDetails = ({ handeleCloseAddressDetails }) => {
  const user = useSelector((state) => state.auth.user);
  const initialAddress = {
    name: user?.username ?? "",
    address: "",
    city: "",
    state: "",
    pin: "",
    phone: user?.phone ?? "",
    isPrimary: false,
  };

  const isUpdate = useSelector((state) => state.address?.isUpdate);

  const isUpdateLocation = () => {
    return isUpdate?.id
      ? ["home", "office"].includes(isUpdate?.location_type)
        ? isUpdate?.location_type
        : "other"
      : "home";
  };

  const [locationType, setLocationType] = useState(isUpdateLocation) ?? "home";
  const [otherLocation, setOtherLocation] = useState(
    isUpdate?.location_type ?? "",
  );

  const dispatch = useDispatch();

  const [adressInfo, setAddressInfo] = useState(initialAddress);
  console.log(adressInfo);

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const isCheckLocation = () => {
    return locationType.toLocaleLowerCase() === "other"
      ? otherLocation
      : locationType;
  };

  const ChekcLocation = () => {
    return Boolean(
      adressInfo.name && adressInfo.address && adressInfo.city && adressInfo.state && adressInfo.pin && adressInfo.phone,
    );
  }

  const handleOnClick = async () => {

    if(user === null){
      toast.error("Please login first");
      return;
    }

    if (!ChekcLocation()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      if (isUpdate?.id) {
        await dispatch(
          UpdateUserAddress({
            id: isUpdate?.id,
            location_type: isCheckLocation(),
            AddressData: adressInfo,
          }),
        ).unwrap();
        toast.success("User Address Update Successfully");
      } else {
        await dispatch(
          AddUserAddress({
            location_type: isCheckLocation(),
            AddressData: adressInfo,
          }),
        ).unwrap();
        toast.success("User Address Add Successfully");
      }

      handeleCloseAddressDetails();
      await dispatch(GetUserAddress(user?.id)).unwrap();
    } catch {
      toast.error("Please Try again");
    }
  };

  useEffect(() => {
    if (isUpdate?.id) {
      setAddressInfo({
        name: isUpdate?.userfullname,
        address: isUpdate?.street_area,
        city: isUpdate?.city,
        state: isUpdate?.state,
        location_type: isUpdate?.location_type,
        pin: isUpdate?.pin_code,
        phone: user?.phone,
        isPrimary: isUpdate?.isPrimary,
      });
    } else {
      setAddressInfo(initialAddress);
    }
  }, [isUpdate, user]);

  const Work = [
    { name: "home", icon: <BiHome size={15} /> },
    { name: "office", icon: <MdOutlineWorkOutline size={15} /> },
    { name: "other", icon: <IoLocationOutline size={15} /> },
  ];

  return (
    <div>
      <div className="space-y-3">
        <div className="border-b border-gray-300 border-dashed">
          <div className="w-full pb-3 space-x-3 flex">
            {Work.map((item, index) =>
              locationType.toLocaleLowerCase() ===
              item.name.toLocaleLowerCase() ? (
                <button
                  key={index}
                  className="border border-gray-300 px-2 py-1 rounded outline-2 duration-500 outline-blue-500/20 cursor-pointer flex items-center justify-center gap-1 text-[14px]"
                >
                  {item.icon} <span>{item.name}</span>
                </button>
              ) : (
                <button
                  key={index}
                  className="border border-gray-300 px-2 py-1 rounded outline-2 outline-transparent duration-500 hover:outline-blue-500/20 cursor-pointer flex items-center justify-center gap-1 text-[14px]"
                  onClick={() => setLocationType(item.name)}
                >
                  {item.icon} <span>{item.name}</span>
                </button>
              ),
            )}
          </div>
          <div>
            {locationType.toLocaleLowerCase() === "other" && (
              <div className="flex flex-col gap-1 pb-3">
                <label htmlFor="UserName">
                  Enter Type Of Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="UserName"
                  value={
                    otherLocation === "other"
                      ? isUpdate?.location_type
                      : otherLocation
                  }
                  className="border px-2 py-2 border-gray-300 outline-none rounded-md"
                  onChange={(e) => setOtherLocation(e.target.value)}
                  placeholder="School"
                />
              </div>
            )}
          </div>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="UserName">
              Enter Full Name <span className="text-red-600">*</span>{" "}
            </label>
            <input
              type="text"
              name="name"
              id="UserName"
              value={adressInfo.name}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
              placeholder="Ananad"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserAddress">
              Street address <span className="text-red-600">*</span>
            </label>
            <textarea
              type="text"
              name="address"
              id="UserAddress"
              value={adressInfo.address}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md resize-none"
              onChange={handleOnChange}
              placeholder="Kamani science collage"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserCity">
              City <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="city"
              id="UserCity"
              value={adressInfo.city}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
              placeholder="Amreli"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserState">
              State <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="state"
              id="UserState"
              value={adressInfo.state}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
              placeholder="Gujarat"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserPin">
              Pin Code <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="pin"
              id="UserPin"
              value={adressInfo.pin}
              min={5}
              max={6}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md appearance-none"
              placeholder="365601"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserPhone">
              Phone number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="phone"
              id="UserPhone"
              value={adressInfo.phone}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
              placeholder="+91897698XXXX"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPrimary"
              id="UserPrimary"
              checked={adressInfo.isPrimary}
              onChange={handleOnChange}
              className="w-4 h-4 accent-blue-500 cursor-pointer transition-transform duration-300 hover:scale-110"
            />
            <label htmlFor="UserPrimary">Set as Primary Address</label>
          </div>
          <button
            className="w-full bg-blue-500 py-2 text-white rounded-md cursor-pointer"
            onClick={handleOnClick}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressDetails;
