import type { ReactNode } from "react";
import type { ThumbnailArt } from "@/db/schema";
import type { Scene } from "@/lib/data";
import { CritterFigure } from "./critter";

const W = 320;
const H = 180;

type Gradient = { id: string; stops: [string, string]; radial?: boolean };

function Backdrop({
  scene,
  gid,
}: {
  scene: Scene;
  gid: (name: string) => string;
}) {
  const gradients: Gradient[] = [];
  let art: ReactNode = null;

  switch (scene) {
    case "street":
      gradients.push({ id: gid("sky"), stops: ["#9fc7ee", "#eaf3fb"] });
      art = (
        <>
          <rect width={W} height={H} fill={`url(#${gid("sky")})`} />
          {[
            [0, 40, 60, "#c9b8a3"],
            [56, 20, 70, "#a9b4c2"],
            [122, 50, 54, "#d8c9b4"],
            [172, 10, 64, "#b8a58f"],
            [232, 34, 88, "#c4ccd6"],
          ].map(([x, y, w, fill]) => (
            <g key={x}>
              <rect x={x} y={y} width={w} height={H} fill={fill as string} />
              {Array.from({ length: 4 }, (_, row) => (
                <rect
                  key={row}
                  x={(x as number) + 10}
                  y={(y as number) + 12 + row * 22}
                  width={(w as number) - 20}
                  height={8}
                  fill="#ffffff"
                  opacity={0.45}
                />
              ))}
            </g>
          ))}
          <rect y={150} width={W} height={30} fill="#8d9097" />
        </>
      );
      break;
    case "sketch":
      art = (
        <>
          <rect width={W} height={H} fill="#fbf6ec" />
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={i}
              x1={56}
              x2={W}
              y1={20 + i * 22}
              y2={20 + i * 22}
              stroke="#e8dcc6"
            />
          ))}
          {[
            "#e0312b",
            "#f28c28",
            "#f2c230",
            "#4caf50",
            "#2f86d6",
            "#6a4fc9",
            "#8a5a3c",
          ].map((fill, i) => (
            <g key={fill} transform={`translate(${8 + i * 6} ${14 + i * 3})`}>
              <rect width={5} height={120} fill={fill} />
              <path d="M 0 0 L 2.5 -9 L 5 0 Z" fill="#e9c9a0" />
            </g>
          ))}
        </>
      );
      break;
    case "workshop":
      gradients.push({ id: gid("wall"), stops: ["#6b4a33", "#a57a55"] });
      art = (
        <>
          <rect width={W} height={H} fill={`url(#${gid("wall")})`} />
          {Array.from({ length: 60 }, (_, i) => (
            <circle
              key={i}
              cx={12 + (i % 15) * 21}
              cy={14 + Math.floor(i / 15) * 18}
              r={2}
              fill="#3f2a1c"
              opacity={0.5}
            />
          ))}
          <rect x={20} y={40} width={36} height={6} rx={3} fill="#c0c7d1" />
          <rect x={258} y={30} width={10} height={40} rx={3} fill="#e0312b" />
          <rect y={150} width={W} height={30} fill="#4a3322" />
        </>
      );
      break;
    case "arena":
      gradients.push({
        id: gid("glow"),
        stops: ["#7fd8ff", "#1b2233"],
        radial: true,
      });
      art = (
        <>
          <rect width={W} height={H} fill="#1b2233" />
          <circle
            cx={250}
            cy={60}
            r={90}
            fill={`url(#${gid("glow")})`}
            opacity={0.8}
          />
          {Array.from({ length: 9 }, (_, i) => (
            <line
              key={i}
              x1={160}
              y1={110}
              x2={-80 + i * 60}
              y2={H}
              stroke="#3a4661"
            />
          ))}
          <rect y={110} width={W} height={1} fill="#3a4661" />
        </>
      );
      break;
    case "neon":
      gradients.push({ id: gid("stage"), stops: ["#2a1446", "#0e0a1f"] });
      art = (
        <>
          <rect width={W} height={H} fill={`url(#${gid("stage")})`} />
          <path d="M 40 0 L 0 180 L 90 180 Z" fill="#e6388b" opacity={0.3} />
          <path
            d="M 160 0 L 110 180 L 210 180 Z"
            fill="#27c3d8"
            opacity={0.25}
          />
          <path
            d="M 280 0 L 230 180 L 320 180 Z"
            fill="#b46bff"
            opacity={0.3}
          />
          {[40, 160, 280].map((cx) => (
            <circle key={cx} cx={cx} cy={4} r={6} fill="#fff" />
          ))}
        </>
      );
      break;
    case "burst":
      art = (
        <>
          <rect width={W} height={H} fill="#7fd36b" />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const b = a + Math.PI / 16;
            const r = 400;
            return (
              <path
                key={i}
                d={`M 160 90 L ${160 + r * Math.cos(a)} ${90 + r * Math.sin(a)} L ${160 + r * Math.cos(b)} ${90 + r * Math.sin(b)} Z`}
                fill="#4fb84a"
              />
            );
          })}
        </>
      );
      break;
    case "forest":
      gradients.push({ id: gid("dusk"), stops: ["#6f8f7a", "#c9b98a"] });
      art = (
        <>
          <rect width={W} height={H} fill={`url(#${gid("dusk")})`} />
          {[20, 70, 250, 300].map((x, i) => (
            <path
              key={x}
              d={`M ${x} ${30 + i * 6} L ${x - 26} 150 L ${x + 26} 150 Z`}
              fill="#34523f"
            />
          ))}
          <path
            d="M 0 140 Q 160 120 320 140 L 320 180 L 0 180 Z"
            fill="#5b4a33"
          />
        </>
      );
      break;
    case "studio":
      gradients.push({ id: gid("warm"), stops: ["#f6d7b0", "#e9b98a"] });
      art = (
        <>
          <rect width={W} height={H} fill={`url(#${gid("warm")})`} />
          <rect
            x={250}
            y={20}
            width={50}
            height={60}
            rx={4}
            fill="#fff4e0"
            stroke="#b78655"
            strokeWidth={4}
          />
          <path d="M 30 150 L 40 110 L 50 150 Z" fill="#6b4a33" />
          <circle cx={40} cy={100} r={18} fill="#6aa35a" />
        </>
      );
      break;
    case "boxes":
      gradients.push({ id: gid("pop"), stops: ["#ffb3c7", "#9fe6e0"] });
      art = (
        <>
          <rect width={W} height={H} fill={`url(#${gid("pop")})`} />
          {Array.from({ length: 12 }, (_, i) => (
            <circle
              key={i}
              cx={20 + i * 27}
              cy={i % 2 ? 20 : 40}
              r={4}
              fill="#fff"
              opacity={0.7}
            />
          ))}
        </>
      );
      break;
  }

  return (
    <>
      <defs>
        {gradients.map((g) =>
          g.radial ? (
            <radialGradient key={g.id} id={g.id}>
              <stop offset="0" stopColor={g.stops[0]} />
              <stop offset="1" stopColor={g.stops[1]} stopOpacity={0} />
            </radialGradient>
          ) : (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={g.stops[0]} />
              <stop offset="1" stopColor={g.stops[1]} />
            </linearGradient>
          ),
        )}
      </defs>
      {art}
    </>
  );
}

/** Foreground props drawn in front of the characters. */
function Foreground({ scene }: { scene: Scene }) {
  if (scene === "boxes") {
    return (
      <g stroke="#6b4a2b" strokeWidth={2} strokeLinejoin="round">
        <path d="M 70 130 L 250 130 L 262 180 L 58 180 Z" fill="#c8955b" />
        <path
          d="M 70 130 L 40 110 L 70 118 Z M 250 130 L 282 110 L 250 118 Z"
          fill="#b07f48"
        />
      </g>
    );
  }
  if (scene === "workshop") {
    return (
      <rect x={120} y={158} width={110} height={10} rx={2} fill="#2a1d14" />
    );
  }
  return null;
}

function Caption({ lines }: { lines: string[] }) {
  return (
    <text
      x={10}
      fontSize={30}
      fontWeight={900}
      fill="#fff"
      stroke="#111"
      strokeWidth={6}
      strokeLinejoin="round"
      paintOrder="stroke"
      fontFamily="inherit"
    >
      {lines.map((line, i) => (
        <tspan key={i} x={10} y={36 + i * 33}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

/**
 * Placeholder artwork drawn from `art`; a blank frame when there is none.
 * `id` keeps gradient ids unique when several thumbnails share a page.
 */
export function Thumbnail({
  id,
  art,
}: {
  id: string;
  art: ThumbnailArt | null;
}) {
  const gid = (name: string) => `thumb-${id}-${name}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="block size-full"
      aria-hidden="true"
    >
      {art ? (
        <>
          <Backdrop scene={art.scene} gid={gid} />
          {art.critters.map((critter, i) => (
            <CritterFigure key={i} critter={critter} />
          ))}
          <Foreground scene={art.scene} />
          {art.caption && <Caption lines={art.caption} />}
        </>
      ) : (
        <rect width={W} height={H} fill="#1f2a44" />
      )}
    </svg>
  );
}
