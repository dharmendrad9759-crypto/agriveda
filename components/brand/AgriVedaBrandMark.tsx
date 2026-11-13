type Props = {
  /** Tailwind size classes for the mark, e.g. h-9 w-9 */
  sizeClassName?: string;
  className?: string;
};

/** Plant-and-wheat mark from the AgriVeda logo. */
export default function AgriVedaBrandMark({
  sizeClassName = "h-9 w-9",
  className = "",
}: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-mark.png"
      alt=""
      className={`shrink-0 object-contain ${sizeClassName} ${className}`}
    />
  );
}
