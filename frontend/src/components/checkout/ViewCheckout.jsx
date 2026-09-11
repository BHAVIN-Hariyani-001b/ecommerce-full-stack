import { useState } from "react";
import PlaceOrder from "./PlaceOrder";
import PaymentGateway from "./PaymentGateway";
import OrderConfirmation from "./OrderConfirmation";

const ViewCheckout = ({ checkOut, setCheckOut }) => {
  const [action, setAction] = useState("order");
  const [orderResult, setOrderResult] = useState(null);

  console.log(orderResult);

  const steps = {
    order: (
      <PlaceOrder
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        setAction={setAction}
      />
    ),
    payment: (
      <PaymentGateway
        setAction={setAction}
        setOrderResult={setOrderResult}
      />
    ),
    confirmation: (
      <OrderConfirmation
        orderResult={orderResult}
        setCheckOut={setCheckOut}
      />
    ),
  };

  return <div>{steps[action]}</div>;
};

export default ViewCheckout;
