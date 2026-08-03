import { useState } from "react";
import { store } from "../../app/store";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { addReviewAPI } from "../../features/review/ReviewThunk";

const ProductReviewWrite = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  //   console.log(rating);
  console.log(review);

  const dispatch = useDispatch();

  const handleOnSubmit = () => {
    const user = store.getState().user;
    console.log(user.id);
    // dispatch(addReviewAPI({ productId, rating, review }));
  };

  return (
    <div>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between mt-4">
          <label
            htmlFor="rating"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Rating <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center justify-center space-x-2">
            <Stack spacing={1}>
              <Rating
                name="half-rating"
                value={rating}
                precision={0.1}
                size="large"
                onChange={(event, newValue) => setRating(newValue ?? 0.1)}
              />
            </Stack>
            <span className="text-sm text-gray-500">({rating})</span>
          </div>
        </div>
        <div>
          <label
            htmlFor="review"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Your Review <span className="text-red-600">*</span>
          </label>
          <textarea
            id="review"
            rows="4"
            className="block p-2.5 w-full text-sm text-gray-900 outline-none bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
        </div>
        <button
          type="button"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 w-full rounded-lg transition-colors whitespace-nowrap"
          onClick={handleOnSubmit}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductReviewWrite;
