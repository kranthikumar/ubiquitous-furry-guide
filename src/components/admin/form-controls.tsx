"use client";

import { useId, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import type { FormState, FormValues } from "@/app/admin/_lib/form";
import { buttonClass, inputClass, secondaryButtonClass } from "./ui";

/** Current value for a field: last submission if any, else the saved value. */
export function valueOf(
  values: FormValues | undefined,
  name: string,
  fallback: string | number | null | undefined,
): string {
  const submitted = values?.[name];
  if (submitted !== undefined) {
    return Array.isArray(submitted) ? (submitted[0] ?? "") : submitted;
  }
  return fallback == null ? "" : String(fallback);
}

export function Field({
  label,
  name,
  state,
  hint,
  children,
}: {
  label: string;
  name: string;
  state: FormState;
  hint?: ReactNode;
  /** Receives the ids to wire up: input id, and describedby. */
  children: (ids: {
    id: string;
    describedBy?: string;
    invalid: boolean;
  }) => ReactNode;
}) {
  const id = useId();
  const errors = state.errors?.[name];
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = errors ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(errors) })}
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {errors && (
        <ul id={errorId} className="text-xs text-paw">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Text-like input bound to a form field. */
export function TextField({
  label,
  name,
  state,
  defaultValue,
  hint,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  state: FormState;
  defaultValue?: string | number | null;
  hint?: ReactNode;
  type?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "name" | "type"
>) {
  return (
    <Field label={label} name={name} state={state} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={valueOf(state.values, name, defaultValue)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={inputClass}
          {...rest}
        />
      )}
    </Field>
  );
}

export function TextAreaField({
  label,
  name,
  state,
  defaultValue,
  hint,
  rows = 4,
  ...rest
}: {
  label: string;
  name: string;
  state: FormState;
  defaultValue?: string | null;
  hint?: ReactNode;
  rows?: number;
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "defaultValue" | "name"
>) {
  return (
    <Field label={label} name={name} state={state} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <textarea
          id={id}
          name={name}
          rows={rows}
          defaultValue={valueOf(state.values, name, defaultValue)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={inputClass}
          {...rest}
        />
      )}
    </Field>
  );
}

export function SelectField({
  label,
  name,
  state,
  defaultValue,
  options,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  state: FormState;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  placeholder?: string;
  hint?: ReactNode;
}) {
  return (
    <Field label={label} name={name} state={state} hint={hint}>
      {({ id, describedBy, invalid }) => (
        <select
          id={id}
          name={name}
          defaultValue={valueOf(state.values, name, defaultValue)}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={inputClass}
        >
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

/** Form-level error (database failures and the like). */
export function FormMessage({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-paw/30 bg-paw/5 px-3 py-2 text-sm text-paw"
    >
      {state.message}
    </p>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: ReactNode;
}) {
  return (
    <button type="submit" disabled={pending} className={buttonClass}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

function ConfirmDeleteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${buttonClass} bg-paw hover:bg-paw/90`}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Trash2 className="size-4" />
      )}
      Delete
    </button>
  );
}

/** Delete button that asks for confirmation in a native <dialog>. */
export function DeleteButton({
  action,
  title,
  children,
}: {
  action: () => Promise<void>;
  title: string;
  /** What will be deleted, shown in the confirmation. */
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className={`${secondaryButtonClass} border-paw/40 text-paw hover:bg-paw/5`}
      >
        <Trash2 className="size-4" />
        Delete
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-xl p-0 text-ink shadow-xl backdrop:bg-black/50"
      >
        <form action={action} className="flex flex-col gap-4 p-5">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <div className="text-sm text-muted">{children}</div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <ConfirmDeleteSubmit />
          </div>
        </form>
      </dialog>
    </>
  );
}
