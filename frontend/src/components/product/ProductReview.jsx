import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { MdVerified } from "react-icons/md";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Modal from "../common/Modal";
import ProductReviewWrite from "./ProductReviewWrite";
import { useDispatch, useSelector } from "react-redux";
import ReviewCard from "./ReviewCard";
import { setAuthOpen, setAuthView } from "../../features/auth/authSlice";

// import { fetchReviewsAPI } from "../../features/review/ReviewThunk";

// TODO: replace with real data from redux/API, e.g.
// const reviews = useSelector((state) => state.reviews.list);

//user review component
const ProductReview = ({ productId }) => {
  console.log(productId);
  const [visibleCount, setVisibleCount] = useState(2);

  const [filterStar, setFilterStar] = useState(null);
  const [reviewWrite, setReviewWrite] = useState(false);

  const user = useSelector((state) => state.auth?.user);

  const dispatch = useDispatch();

  const mockReviews = useSelector((state) => state.review?.reviews);
  const ratingBreakdown = useSelector(
    (state) => state.review?.review_summary.breakdown ?? [],
  );

  console.log(ratingBreakdown);

  const openReviewWrite = () => {
    if (!user) {
      dispatch(setAuthView("signin"));
      dispatch(setAuthOpen(true));
      return;
    }
    setReviewWrite(true);
  };

  const closeReviewWrite = () => {
    setReviewWrite(false);
  };

  const totalReviews = mockReviews.length;
  const avgRating = (
    mockReviews.reduce((sum, r) => sum + r.product_rating, 0) / totalReviews
  ).toFixed(1);

  const filteredReviews = filterStar
    ? mockReviews.filter((r) => r.product_rating === filterStar)
    : mockReviews;

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const alreadyReviewed = mockReviews.some(
    (item) => item?.user_id === user?.id,
  );
  // console.log("is good" + alreadyReviewed);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Product Review</h1>

      {/* Rating summary */}
      <div className="flex flex-col sm:flex-row gap-6 border border-gray-200 rounded-2xl p-5">
        {/* Big average score */}
        <div className="flex flex-col items-center justify-center gap-1 sm:border-r sm:border-gray-200 sm:pr-6 shrink-0">
          <span className="text-4xl font-bold text-gray-900">
            {isNaN(Number(avgRating)) ? "0" : avgRating}
          </span>
          <Stack spacing={1}>
            <Rating
              name="half-rating-read"
              value={avgRating}
              precision={1}
              readOnly
            />
          </Stack>
          <span className="text-xs text-gray-400">{totalReviews} ratings</span>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 flex flex-col gap-1.5">
          {ratingBreakdown.map((row) => (
            <button
              key={row.stars}
              type="button"
              onClick={() =>
                setFilterStar(filterStar === row.stars ? null : row.stars)
              }
              className={`flex items-center gap-2 text-xs group cursor-pointer ${
                filterStar && filterStar !== row.stars ? "opacity-40" : ""
              }`}
            >
              <span className="w-8 text-gray-500 shrink-0">{row.stars} ★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className="w-8 text-gray-400 text-right shrink-0">
                {row.percent}%
              </span>
            </button>
          ))}

          {filterStar && (
            <button
              type="button"
              onClick={() => setFilterStar(null)}
              className="w-fit text-xs text-blue-600 hover:underline mt-1 cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Write review CTA */}

        <div className="flex items-center justify-center sm:border-l sm:border-gray-200 sm:pl-6 shrink-0">
          {!alreadyReviewed && (
            <button
              type="button"
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
              onClick={openReviewWrite}
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Review list */}
      {filteredReviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No reviews for this rating yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3 h-80 scrollbar-none overflow-y-scroll">
          {visibleReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              setReviewWrite={setReviewWrite}
            />
          ))}
        </div>
      )}

      {visibleCount < filteredReviews.length && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 3)}
          className="cursor-pointer w-fit mx-auto border border-gray-200 hover:border-gray-300 text-sm font-medium px-5 py-2 rounded-full transition-colors"
        >
          Load more reviews
        </button>
      )}

      <Modal
        open={reviewWrite}
        onClose={closeReviewWrite}
        title="Write a Review"
      >
        <ProductReviewWrite productId={productId} onClose={closeReviewWrite} />
      </Modal>
    </div>
  );
};

export default ProductReview;
