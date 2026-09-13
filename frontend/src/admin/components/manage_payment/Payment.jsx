import PageWapper from "../../../components/layout/PageWapper";
import { MdPayments } from "react-icons/md";
import PaymentList from "./PaymentList";

const Payment = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <PageWapper className="h-full w-full px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-2 max-[600px]:text-xl">
            <MdPayments className="inline-block text-blue-600" />
            <span>Payment Management</span>
          </h1>
        </div>
        <PaymentList />
      </PageWapper>
    </div>
  );
};

export default Payment;