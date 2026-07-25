import { Cormorant_Garamond, Newsreader } from "next/font/google";

export const lang90Cormorant = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const lang90Newsreader = Newsreader({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
