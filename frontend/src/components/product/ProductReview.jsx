import { memo, useEffect, useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoMdThumbsUp } from "react-icons/io";
import { MdVerified } from "react-icons/md";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Modal from "../common/Modal";
import ProductReviewWrite from "./ProductReviewWrite";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsAPI } from "../../features/review/ReviewThunk";

// TODO: replace with real data from redux/API, e.g.
// const reviews = useSelector((state) => state.reviews.list);

  const ratingBreakdown = [
    { stars: 5, percent: 68 },
    { stars: 4, percent: 20 },
    { stars: 3, percent: 7 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
  ];
  

const ReviewCard = memo(function ReviewCard({ review }) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);
  const [marked, setMarked] = useState(false);

  const initials = review.user_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleHelpful = () => {
    if (marked) return;
    setHelpfulCount((prev) => prev + 1);
    setMarked(true);
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-2">
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
        <div className="w-fit">
          <Stack spacing={1}>
            <Rating
              name="half-rating-read"
              defaultValue={review.product_rating}
              precision={0.5}
              readOnly
            />
          </Stack>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

      <button
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
      </button>
    </div>
  );
});

//user review component
const ProductReview = ({ productId }) => {
  console.log(productId);
  const [visibleCount, setVisibleCount] = useState(2);
  const [filterStar, setFilterStar] = useState(null);

  const [reviewWrite, setReviewWrite] = useState(false);

  const dispatch = useDispatch();

  const mockReviews = useSelector((state) => state.review?.reviews);

  useEffect(() => {
    dispatch(fetchReviewsAPI(productId)).unwrap();
  }, [dispatch, productId]);

  const openReviewWrite = () => {
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
              defaultValue={avgRating}
              precision={0.5}
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
          <button
            type="button"
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
            onClick={openReviewWrite}
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review list */}
      {filteredReviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          No reviews for this rating yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
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
        <ProductReviewWrite productId={productId} />
      </Modal>
    </div>
  );
};

export default ProductReview;
