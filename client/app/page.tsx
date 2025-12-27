import UrlBox from "@/components/url-box";

const PatternGradient = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-white">
      {/* Emerald Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};
export default function Home() {
  return (
    <PatternGradient>
      <div className="flex flex-col items-center justify-center">
        <UrlBox />
      </div>
    </PatternGradient>
  );
}
