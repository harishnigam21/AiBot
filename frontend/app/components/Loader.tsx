export default function Loader({
  size = 4,
  speed = 4,
  color = "#afafaf",
  density = 3,
}: {
  size?: number;
  speed?: number;
  color?: string;
  density?: number;
}) {
  const rotations = [0, 45, 90, 135];

  return (
    <div
      style={{
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        animationDuration: `${speed}s`,
      }}
      className="relative flex items-center justify-center animate-spin"
    >
      {rotations.map((rotation) => (
        <hr
          key={rotation}
          style={{
            borderTopWidth: `${density}px`,
            borderTopColor: color,
            transform: `rotate(${rotation}deg)`,
          }}
          className="absolute w-full"
        />
      ))}
    </div>
  );
}
