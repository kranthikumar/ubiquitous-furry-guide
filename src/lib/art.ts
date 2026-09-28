// Cartoon artwork data, stored as JSON on channels (avatars) and videos
// (placeholder thumbnails) and drawn by src/components/critter.tsx.

export type Species =
  | "fox"
  | "wolf"
  | "husky"
  | "cat"
  | "hyena"
  | "dragon"
  | "protogen";

/** A cartoon character drawn into thumbnails and avatars. */
export type Critter = {
  species: Species;
  fur: string;
  /** Muzzle, chest and inner-ear colour. */
  belly: string;
  eyes: string;
  shirt: string;
  /** Position and size inside the 320×180 thumbnail. */
  x?: number;
  y?: number;
  scale?: number;
  flip?: boolean;
  /** Draw as an uncoloured pencil sketch. */
  sketch?: boolean;
};

export type Scene =
  | "street"
  | "sketch"
  | "workshop"
  | "arena"
  | "neon"
  | "burst"
  | "forest"
  | "studio"
  | "boxes";

/** Colours and pose of a channel's cartoon avatar. */
export type AvatarArt = Critter & { bg: string };

/** How to draw a placeholder thumbnail when no image URL is set. */
export type ThumbnailArt = {
  scene: Scene;
  critters: Critter[];
  caption?: string[];
};

export const SPECIES = [
  "fox",
  "wolf",
  "husky",
  "cat",
  "hyena",
  "dragon",
  "protogen",
] as const satisfies readonly Species[];

export const SCENES = [
  "street",
  "sketch",
  "workshop",
  "arena",
  "neon",
  "burst",
  "forest",
  "studio",
  "boxes",
] as const satisfies readonly Scene[];
