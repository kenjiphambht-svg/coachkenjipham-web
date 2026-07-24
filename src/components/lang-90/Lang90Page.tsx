import {
  Lang90Closing,
  Lang90NextStep,
  Lang90Offer,
  Lang90Scope,
  Lang90Value,
} from "./Lang90Closing";
import { Lang90Journey, Lang90Kenji } from "./Lang90Conversation";
import { Lang90Header } from "./Lang90Frame";
import { Lang90Definition, Lang90Hero, Lang90Recognition } from "./Lang90Opening";

export default function Lang90Page() {
  return (
    <div className="bg-e26-ivory text-e26-text">
      <Lang90Header />
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
    </div>
  );
}
