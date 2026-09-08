import { useState } from "react";
import PlaceOrder from "./PlaceOrder";
import PaymentGateway from "./PaymentGateway";
import OrderConfirmation from "./OrderConfirmation";

const ViewCheckout = ({ checkOut, setCheckOut }) => {
  const [action, setAction] = useState("order");
  const steps = {
    order: (
      <PlaceOrder
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        setAction={setAction}
      />
    ),
    payment: <PaymentGateway setAction={setAction} />,
    confirmation: <OrderConfirmation />,
  };

  return <div>{steps[action]}</div>;
};

export default ViewCheckout;
