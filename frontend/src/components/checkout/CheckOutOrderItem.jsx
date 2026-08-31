import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const CheckOutOrderItem = ({ item }) => {
  return (
    <div className="flex gap-3 rounded-md border border-gray-200 bg-white p-2.5 shadow-sm">
      <div className="w-20 h-20 shrink-0">
        <img
          src={`../../../public/image/product_img/${item?.image?.image_name}`}
          alt={item?.name || "Product"}
          className="h-full w-full rounded-md border border-gray-100 object-contain"
        />
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800">
            {item?.name}
          </p>

          <span className="shrink-0 rounded bg-green-500 px-2 py-1 text-[11px] font-medium text-white">
            Qty {item?.qty}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1">
          <Stack spacing={0}>
            <Rating
              name={`product-rating-${item?.id}`}
              value={Number(item?.review?.average_rating) || 1}
              precision={1}
              readOnly
              size="small"
            />
          </Stack>

          <span className="text-[11px] text-gray-500">
            ({item?.review?.total_review || 1})
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs font-semibold text-green-700">
            {item?.discount}% OFF
          </span>

          <span className="text-xs text-gray-400 line-through">
            &#8377;{item?.BPrice}
          </span>

          <span className="text-sm font-semibold text-gray-800">
            &#8377;{item?.PPrice}
          </span>
        </div>

        <div className="text-[12px] flex flex-col justify-start w-full">
          {(item.cart_value ?? []).map((values) =>
            values.value.charAt(0) === "#" ? (
              <span className="flex items-center">
                {values.name} :
                <span
                  style={{ backgroundColor: values.value }}
                  className="inline-block w-5 mx-2 h-5 rounded-full border border-gray-300"
                />
                {values.value}
              </span>
            ) : (
              <span>
                {values.name} : {values.value}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutOrderItem;
