export default function LoadingText() {
  return (
    <div className="gap-sm font-unbounded absolute flex h-full w-full items-center justify-center font-bold">
      {'Setting...'.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block animate-bounce"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {char}
          {/* <span className="inline-block animate-[bounce-custom_0.6s_infinite]">{char}</span> */}
        </span>
      ))}
    </div>
  );
}
