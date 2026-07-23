import {
  Lang90BeforeSession,
  Lang90Closing,
  Lang90Fit,
  Lang90Offer,
  Lang90Scope,
} from "./Lang90Closing";
import {
  Lang90Journey,
  Lang90Kenji,
  Lang90Outcomes,
} from "./Lang90Conversation";
import { Lang90Header } from "./Lang90Frame";
import {
  Lang90Definition,
  Lang90Hero,
  Lang90Recognition,
  Lang90WhyHardToSee,
} from "./Lang90Opening";

export default function Lang90Page() {
  return (
    <div className="bg-e26-ivory text-e26-text">
      <Lang90Header />
      <main>
        <Lang90Hero />
        <Lang90Recognition />
        <Lang90WhyHardToSee />
        <Lang90Definition />
        <Lang90Kenji />
        <Lang90Journey />
        <Lang90Outcomes />
        <Lang90Fit />
        <Lang90Scope />
        <Lang90BeforeSession />
        <Lang90Offer />
        <Lang90Closing />
      </main>
    </div>
  );
}
