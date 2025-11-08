import { ArrowRight } from "lucide-react";

export default function ScrollControls({
  onPrev,
  onNext,
  leftClass = "",
  rightClass = "",
  leftDisabled = false,
  rightDisabled = false,
  leftVisible = true,
  rightVisible = true,
}: {
  onPrev: () => void;
  onNext: () => void;
  leftClass?: string;
  rightClass?: string;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  leftVisible?: boolean;
  rightVisible?: boolean;
}) {
  const leftStyle =
    leftDisabled && leftVisible
      ? { opacity: 0.4, pointerEvents: "none" }
      : undefined;
  const rightStyle =
    rightDisabled && rightVisible
      ? { opacity: 0.4, pointerEvents: "none" }
      : undefined;

  return (
    <>
      <button
        aria-label="prev"
        onClick={onPrev}
        className={leftClass}
        disabled={leftDisabled}
        aria-disabled={leftDisabled}
        style={leftStyle}
      >
        <ArrowRight className="h-4 w-4 rotate-180 text-slate-700" />
      </button>

      <button
        aria-label="next"
        onClick={onNext}
        className={rightClass}
        disabled={rightDisabled}
        aria-disabled={rightDisabled}
        style={rightStyle}
      >
        <ArrowRight className="h-4 w-4 text-slate-700" />
      </button>
    </>
  );
}
