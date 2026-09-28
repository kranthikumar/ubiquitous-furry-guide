import type { Critter as CritterData, Species } from "@/lib/art";

const INK = "#1f1a17";
const PAPER = "#fbf6ec";
const PENCIL = "#8a8178";

function Ears({
  species,
  fur,
  belly,
}: {
  species: Species;
  fur: string;
  belly: string;
}) {
  switch (species) {
    case "hyena":
      return (
        <>
          <ellipse cx={-30} cy={-38} rx={13} ry={17} fill={fur} />
          <ellipse cx={30} cy={-38} rx={13} ry={17} fill={fur} />
          <ellipse cx={-30} cy={-36} rx={7} ry={10} fill={belly} />
          <ellipse cx={30} cy={-36} rx={7} ry={10} fill={belly} />
        </>
      );
    case "cat":
      return (
        <>
          <path d="M -38 -18 L -36 -56 L -10 -38 Z" fill={fur} />
          <path d="M 38 -18 L 36 -56 L 10 -38 Z" fill={fur} />
          <path d="M -32 -26 L -31 -46 L -17 -37 Z" fill={belly} />
          <path d="M 32 -26 L 31 -46 L 17 -37 Z" fill={belly} />
        </>
      );
    case "dragon":
      return (
        <>
          <path
            d="M -26 -36 C -34 -52 -44 -60 -50 -72 C -36 -64 -22 -54 -14 -40 Z"
            fill={belly}
          />
          <path
            d="M 26 -36 C 34 -52 44 -60 50 -72 C 36 -64 22 -54 14 -40 Z"
            fill={belly}
          />
          <path d="M -40 -12 L -58 -30 L -36 -30 Z" fill={fur} />
          <path d="M 40 -12 L 58 -30 L 36 -30 Z" fill={fur} />
        </>
      );
    default: {
      // Foxes, wolves, huskies and protogens share pointed ears; wolves'
      // are a little shorter and wider.
      const tip = species === "wolf" ? -60 : -68;
      return (
        <>
          <path d={`M -38 -16 L -32 ${tip} L -6 -38 Z`} fill={fur} />
          <path d={`M 38 -16 L 32 ${tip} L 6 -38 Z`} fill={fur} />
          <path d={`M -30 -26 L -28 ${tip + 14} L -14 -38 Z`} fill={belly} />
          <path d={`M 30 -26 L 28 ${tip + 14} L 14 -38 Z`} fill={belly} />
        </>
      );
    }
  }
}

function Eye({ cx, color }: { cx: number; color: string }) {
  return (
    <>
      <ellipse cx={cx} cy={-8} rx={7} ry={8.5} fill="#fff" />
      <circle cx={cx + 1} cy={-7} r={5} fill={color} stroke="none" />
      <circle cx={cx + 1} cy={-7} r={2.4} fill={INK} stroke="none" />
      <circle cx={cx + 2.6} cy={-9.6} r={1.5} fill="#fff" stroke="none" />
    </>
  );
}

function Face({ c }: { c: CritterData }) {
  if (c.species === "protogen") {
    return (
      <>
        <path
          d="M -34 -24 C -30 -34 30 -34 34 -24 L 36 12 C 22 30 -22 30 -36 12 Z"
          fill={c.belly}
        />
        <g fill={c.eyes} stroke="none">
          <path d="M -26 -14 L -10 -10 L -12 -2 L -26 -6 Z" />
          <path d="M 26 -14 L 10 -10 L 12 -2 L 26 -6 Z" />
        </g>
        <polyline
          points="-22,12 -15,7 -8,12 -1,7 6,12 13,7 20,12"
          fill="none"
          stroke={c.eyes}
          strokeWidth={2.5}
        />
      </>
    );
  }
  return (
    <>
      {c.species === "husky" && (
        <>
          <path d="M -9 -43 L 0 -18 L 9 -43 Z" fill={c.belly} />
          <circle cx={-15} cy={-21} r={3.5} fill={c.belly} stroke="none" />
          <circle cx={15} cy={-21} r={3.5} fill={c.belly} stroke="none" />
        </>
      )}
      {c.species === "hyena" && (
        <g fill={INK} stroke="none" opacity={0.35}>
          <circle cx={-30} cy={-18} r={3} />
          <circle cx={-24} cy={-28} r={2.5} />
          <circle cx={30} cy={-18} r={3} />
          <circle cx={24} cy={-28} r={2.5} />
        </g>
      )}
      <path
        d="M -24 6 C -14 -4 14 -4 24 6 C 24 22 12 34 0 34 C -12 34 -24 22 -24 6 Z"
        fill={c.belly}
      />
      <Eye cx={-15} color={c.eyes} />
      <Eye cx={15} color={c.eyes} />
      <path d="M -6 10 Q 0 6 6 10 Q 0 17 -6 10 Z" fill={INK} />
      <path
        d="M -9 20 Q -4.5 26 0 20 Q 4.5 26 9 20"
        fill="none"
        strokeWidth={1.8}
      />
    </>
  );
}

/**
 * A cartoon head-and-shoulders character in local coordinates: the head is
 * centred on (0, 0) and roughly 100 units wide; the torso runs down to y≈95.
 */
export function CritterFigure({ critter }: { critter: CritterData }) {
  const c = critter.sketch
    ? { ...critter, fur: PAPER, belly: PAPER, eyes: PAPER, shirt: PAPER }
    : critter;
  const s = critter.scale ?? 1;
  const transform = `translate(${critter.x ?? 0} ${critter.y ?? 0}) scale(${critter.flip ? -s : s} ${s})`;

  return (
    <g
      transform={transform}
      stroke={critter.sketch ? PENCIL : INK}
      strokeWidth={critter.sketch ? 1.4 : 1.8}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={critter.sketch ? "5 2" : undefined}
    >
      <path d="M -56 100 Q -54 46 0 42 Q 54 46 56 100 Z" fill={c.shirt} />
      <path d="M -22 30 L -12 50 L 0 40 L 12 50 L 22 30 Z" fill={c.belly} />
      <Ears species={c.species} fur={c.fur} belly={c.belly} />
      <path
        d="M -40 -8 C -42 -38 -20 -44 0 -44 C 20 -44 42 -38 40 -8 L 50 14 L 32 12 L 24 30 L 0 36 L -24 30 L -32 12 L -50 14 Z"
        fill={c.fur}
      />
      <Face c={c} />
    </g>
  );
}
