import CircularProgress from "@mui/material/CircularProgress";
const Loding = () => {
  return (
    <div className="h-screen w-full bg-white bg-blur flex-col gap-10 flex justify-center items-center">
      <CircularProgress enableTrackSlot size="3rem" aria-label="Loading…" />
    </div>
  );
};

export default Loding;
