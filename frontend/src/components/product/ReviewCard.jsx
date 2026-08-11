import { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdThumbsUp } from "react-icons/io";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import { deleteReviewAPI } from "../../features/review/ReviewThunk.js";
import { setUserReviewUpdate } from "../../features/review/ReviewSlice.js";

const ReviewCard = ({ review, setReviewWrite }) => {
  // const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  // const [marked, setMarked] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  const initials =
    review?.user_name &&
    review?.user_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // const handleHelpful = () => {
  //   if (marked) return;
  //   setHelpfulCount((prev) => prev + 1);
  //   setMarked(true);
  // };

  const handleOnDelete = (id) => {
    dispatch(deleteReviewAPI(id)).unwrap();
  };

  const handleOnUpdate = (review) => {
    dispatch(setUserReviewUpdate(review));
    setReviewWrite(true);
  };

  return (
    <div className="relative">
      <div className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-2 group">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5 ">
                <span className="font-medium text-gray-900 line-clamp-1">
                  {review.user_name}
                </span>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(review.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="w-fit">
              <Stack spacing={1}>
                <Rating
                  name="half-rating-read"
                  value={review.product_rating}
                  precision={1}
                  readOnly
                />
              </Stack>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {review.comment}
        </p>

        <div className="flex justify-between items-center">
          {/* <button
            type="button"
            onClick={handleHelpful}
            className={`w-fit flex items-center gap-1.5 text-xs mt-1 px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
              marked
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            <IoMdThumbsUp size={14} />
            Helpful ({helpfulCount})
          </button> */}

          {user && user?.id === review?.user_id ? (
            <div className="space-x-2 hidden group-hover:flex">
              <button
                onClick={() => handleOnUpdate(review)}
                className="cursor-pointer hover:bg-gray-300 p-1 rounded-full"
              >
                <TbEdit size={20} />
              </button>
              <button
                onClick={() => handleOnDelete(review?.id)}
                className="cursor-pointer hover:bg-gray-300 p-1 rounded-full"
              >
                <MdOutlineDeleteOutline size={20} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
