import {
  Lang90Closing,
  Lang90NextStep,
  Lang90Offer,
  Lang90Scope,
  Lang90Value,
} from "./Lang90Closing";
import { Lang90Journey, Lang90Kenji } from "./Lang90Conversation";
import { Lang90Definition, Lang90Hero, Lang90Recognition } from "./Lang90Opening";
import HomeFooter from "@/components/homepage/HomeFooter";
import HomeHeader from "@/components/homepage/HomeHeader";

export default function Lang90Page() {
  return (
    <div className="bg-e26-ivory font-sans text-e26-text" style={{ fontSynthesis: "none" }}>
      <HomeHeader />
      <main>
        <Lang90Hero />
        <Lang90Recognition />
        <Lang90Definition />
        <Lang90Kenji />
        <Lang90Journey />
        <Lang90Scope />
        <Lang90Value />
        <Lang90Offer />
        <Lang90NextStep />
        <Lang90Closing />
      </main>
      <HomeFooter />
    </div>
  );
}
