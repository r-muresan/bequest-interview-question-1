import { recoveringChainFromDatabase } from "./jobs/chain.integrity.job";

export function startAllCronJobs() {
  recoveringChainFromDatabase();
}