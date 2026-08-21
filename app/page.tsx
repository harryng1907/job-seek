import { Dashboard } from "@/components/Dashboard";
import { getJobBoard, getSeedApplicationState } from "@/lib/jobs";

/**
 * Server component: loads pipeline data and the seed application state, then
 * hands both to the client dashboard.
 *
 * When the daily job search goes live, only `getJobBoard()` changes — fetch
 * from a JSON file, GitHub, an API route or Supabase and this page is untouched.
 */
export default async function Page() {
  const [board, seedState] = await Promise.all([
    getJobBoard(),
    getSeedApplicationState(),
  ]);

  return <Dashboard board={board} seedState={seedState} />;
}
