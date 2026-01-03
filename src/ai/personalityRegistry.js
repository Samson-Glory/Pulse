import { friendly } from "./personalities/friendly";
import { professional } from "./personalities/professional";
import { sarcastic } from "./personalities/sarcastic";
import { creative } from "./personalities/creative";

export const personalityRegistry = {
  friendly,
  professional,
  sarcastic,
  creative,
};

export const getPersonality = (key) => personalityRegistry[key] || friendly;
