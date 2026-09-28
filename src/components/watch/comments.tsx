"use client";

import { useId, useOptimistic, useState, useTransition } from "react";
import { Check, ListFilter, ThumbsUp } from "lucide-react";
import { addComment } from "@/app/(site)/watch/[id]/actions";
import { formatCount } from "@/lib/format";
import { MAX_COMMENT_LENGTH } from "@/lib/constants";
import type { ChannelBadge, CommentView } from "@/lib/types";
import { Avatar } from "../avatar";

type Sort = "top" | "newest";
const sortLabels: Record<Sort, string> = {
  top: "Top comments",
  newest: "Newest first",
};

function SortMenu({
  sort,
  onChange,
}: {
  sort: Sort;
  onChange: (sort: Sort) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-ink hover:bg-chip"
      >
        <ListFilter className="size-5" strokeWidth={1.75} />
        Sort by
      </button>
      {open && (
        <ul
          id={menuId}
          className="absolute top-full left-0 z-20 mt-1 w-44 rounded-xl border border-line bg-white py-2 shadow-lg"
        >
          {(Object.keys(sortLabels) as Sort[]).map((option) => (
            <li key={option}>
              <button
                type="button"
                aria-pressed={sort === option}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-ink hover:bg-chip"
              >
                {sortLabels[option]}
                {sort === option && <Check className="size-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  pending,
}: {
  comment: CommentView;
  pending: boolean;
}) {
  // Likes aren't saved: without accounts they would be trivial to inflate.
  const [liked, setLiked] = useState(false);
  const { author } = comment;
  return (
    <li
      className={`flex gap-3 transition-opacity ${pending ? "opacity-60" : ""}`}
      aria-busy={pending || undefined}
    >
      <Avatar channel={author} className="size-10" />
      <div className="min-w-0">
        <p className="text-xs">
          <span className="font-semibold text-ink">@{author.id}</span>{" "}
          <span className="text-muted">{comment.published}</span>
        </p>
        <p className="mt-0.5 text-sm break-words whitespace-pre-line text-ink">
          {comment.body}
        </p>
        <button
          type="button"
          onClick={() => setLiked((l) => !l)}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          className="-ml-2 mt-1 flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted hover:bg-chip"
        >
          <ThumbsUp
            className={`size-4 ${liked ? "fill-current text-ink" : ""}`}
            strokeWidth={1.75}
          />
          {formatCount(comment.likes + (liked ? 1 : 0))}
        </button>
      </div>
    </li>
  );
}

function AddComment({
  guest,
  onAdd,
}: {
  guest: ChannelBadge;
  /** Resolves to whether the comment was saved. */
  onAdd: (text: string) => Promise<boolean>;
}) {
  const [text, setText] = useState("");
  const [active, setActive] = useState(false);
  const inputId = useId();
  const reset = () => {
    setText("");
    setActive(false);
  };
  return (
    <form
      className="flex gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        reset();
        // Put the text back so nothing is lost if saving failed.
        if (!(await onAdd(trimmed))) {
          setText(trimmed);
          setActive(true);
        }
      }}
    >
      <Avatar channel={guest} className="size-10" />
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="sr-only">
          Add a comment
        </label>
        <input
          id={inputId}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onFocus={() => setActive(true)}
          placeholder="Add a comment..."
          autoComplete="off"
          maxLength={MAX_COMMENT_LENGTH}
          className="w-full border-b border-line bg-transparent py-1.5 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-none sm:text-sm"
        />
        {active && (
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-chip"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover disabled:bg-chip disabled:text-muted"
            >
              Comment
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

/**
 * Comments come from the database. A new one appears straight away
 * (optimistically) while the server action saves it; the page then
 * re-renders with the saved copy.
 */
export function Comments({
  videoId,
  comments,
  guest,
}: {
  videoId: string;
  comments: CommentView[];
  /** Who new comments are posted as (the shared guest). */
  guest: ChannelBadge;
}) {
  const [optimistic, addOptimistic] = useOptimistic(
    comments,
    (current, added: CommentView) => [added, ...current],
  );
  const [, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("top");

  // Your own comments stay pinned on top, as on YouTube.
  const mine = (c: CommentView) => (c.author.id === guest.id ? 0 : 1);
  const sorted = [...optimistic].sort(
    (a, b) =>
      mine(a) - mine(b) ||
      (sort === "top" ? b.likes - a.likes : 0) ||
      b.createdAt - a.createdAt,
  );

  const add = (text: string) =>
    new Promise<boolean>((resolve) =>
      startTransition(async () => {
        setError(null);
        addOptimistic({
          id: `pending-${Date.now()}`,
          body: text,
          likes: 0,
          published: "Just now",
          createdAt: Date.now(),
          author: guest,
        });
        const result = await addComment(videoId, text).catch(() => ({
          ok: false as const,
          error: "Couldn't post your comment. Please try again.",
        }));
        if (!result.ok) setError(result.error);
        resolve(result.ok);
      }),
    );

  return (
    <section aria-labelledby="comments-heading" className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <h2 id="comments-heading" className="text-xl font-bold text-ink">
          {optimistic.length} Comments
        </h2>
        <SortMenu sort={sort} onChange={setSort} />
      </div>
      <AddComment guest={guest} onAdd={add} />
      {error && (
        <p role="alert" className="-mt-3 text-sm text-paw">
          {error}
        </p>
      )}
      <ul className="flex flex-col gap-5">
        {sorted.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            pending={comment.id.startsWith("pending-")}
          />
        ))}
      </ul>
    </section>
  );
}
