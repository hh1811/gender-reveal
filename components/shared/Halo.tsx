export function Halo({ size = 320, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: "blur(40px)",
        background: "radial-gradient(circle, rgba(159,214,249,.4) 0%, rgba(195,175,245,.26) 45%, transparent 72%)",
      }}
    />
  );
}
