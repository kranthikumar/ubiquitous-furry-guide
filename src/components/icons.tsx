import type { SVGProps } from "react";

/** Filled paw print used for the logo and brand accents. */
export function PawIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <ellipse
        cx="4.6"
        cy="10.2"
        rx="2.2"
        ry="2.8"
        transform="rotate(-20 4.6 10.2)"
      />
      <ellipse
        cx="9.1"
        cy="5.4"
        rx="2.3"
        ry="3"
        transform="rotate(-6 9.1 5.4)"
      />
      <ellipse
        cx="14.9"
        cy="5.4"
        rx="2.3"
        ry="3"
        transform="rotate(6 14.9 5.4)"
      />
      <ellipse
        cx="19.4"
        cy="10.2"
        rx="2.2"
        ry="2.8"
        transform="rotate(20 19.4 10.2)"
      />
      <path d="M12 11.2c-3 0-6.6 3.7-6.6 6.6 0 1.9 1.4 2.9 3 2.9 1.4 0 2.3-.8 3.6-.8s2.2.8 3.6.8c1.6 0 3-1 3-2.9 0-2.9-3.6-6.6-6.6-6.6z" />
    </svg>
  );
}
