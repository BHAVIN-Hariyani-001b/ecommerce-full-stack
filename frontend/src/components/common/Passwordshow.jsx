import { memo } from "react";

const Passwordshow = memo(function Passwordshow({
  showPassword,
  setShowPassword,
}) {
  return (
    <div className="ml-1">
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          name="showpassword"
          id="show"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        <label htmlFor="show" className="text-sm text-[#586274] pb-0.5">
          Show Password
        </label>
      </div>
    </div>
  );
});

export default Passwordshow;
