import { memo, useCallback, useEffect, useMemo } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { clearAuthError } from "../../features/auth/authSlice";

const Modal = memo(function Modal({
  open,
  title,
  onClose,
  children,
  widthClassName = "max-w-md",
  width,
}) {
  const dispatch = useDispatch();

  const handleErrorMessage = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const panelClassName = useMemo(
    () =>
      [
        "relative w-full",
        widthClassName,
        width,
        "rounded-2xl bg-white shadow-xl border border-gray-200",
      ].join(" "),
    [widthClassName, width],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px] px-4"
      onMouseDown={onClose}
      onClick={handleErrorMessage}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal"}
    >
      <div className={panelClassName} onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#2b2f3a]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <RxCross2 className="text-xl text-[#586274]" />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
});

export default Modal;
