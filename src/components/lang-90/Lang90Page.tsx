import HomeFooter from "@/components/homepage/HomeFooter";
import HomeHeader from "@/components/homepage/HomeHeader";

import Lang90Cinematic from "./Lang90Cinematic";

export default function Lang90Page() {
  return (
    <div className="bg-e26-ivory font-sans text-e26-text" style={{ fontSynthesis: "none" }}>
      <HomeHeader />
      <main>
        <Lang90Cinematic />
      </main>
      <HomeFooter />
    </div>
  );
}
