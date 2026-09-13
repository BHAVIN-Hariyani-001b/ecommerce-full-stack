import PageWapper from "../../../components/layout/PageWapper";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import OrderList from "./OrderList";

const Order = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <PageWapper className={"h-full w-full px-4 py-4"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 max-[600px]:text-xl">
            <HiOutlineClipboardDocumentList className="inline-block" />
            <span>Order List</span>
          </h1>
        </div>
        <OrderList />
      </PageWapper>
    </div>
  );
};

export default Order;
