import { getActivePoll, getPollResult } from "@/lib/polls";
import { PollWidget } from "./poll-widget";

/** Server wrapper — fetches active poll + initial state. Hides if none. */
export async function TodaysPoll() {
  const poll = await getActivePoll();
  if (!poll) return null;

  const result = await getPollResult(poll);

  return (
    <PollWidget
      slug={poll.slug}
      question={poll.question}
      context={poll.context}
      options={poll.options}
      initialCounts={result.counts}
      initialUserVote={result.userVote}
      isLoggedIn={result.isLoggedIn}
      isClosed={result.isClosed}
    />
  );
}
