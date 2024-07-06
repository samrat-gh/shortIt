import Urlbox from "@/components/Urlbox";
import { Link } from "lucide-react";

export default function Home() {
  return (
    <div className="mt-6 flex flex-col items-center justify-center">
      <div className="rounded-2xl border-[0.25px] border-slate-500 p-5">
        <div className="text-center font-mono text-4xl font-medium tracking-wider text-slate-300">
          <Link className="mx-4 inline" size={32} color="#cbd5e1" />
          ShortIt
        </div>
        <p className="mt-3 text-center font-mono text-xs font-medium italic tracking-wider text-slate-300">
          {" "}
          Simplify Your Links, Amplify Your Reach!{" "}
        </p>
      </div>
      <Urlbox />
    </div>
  );
}
