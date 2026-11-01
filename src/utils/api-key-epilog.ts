import { oneLine } from "common-tags";

type ApiPlan = "Core" | "Pro" | "High RPM";

const planList = new Intl.ListFormat("en", { type: "disjunction" });

export function apiKeyEpilog(...plans: [ApiPlan, ...ApiPlan[]]): string {
  return oneLine`
    🔑 This command requires an API key from a ${planList.format(plans)} plan.
    Make sure you've run the "apiKey" command first.
  `;
}
