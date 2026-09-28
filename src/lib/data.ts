// Seed data for the dummy site. Everything here is made up.

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

export type Category = { slug: string; label: string };

export type Channel = {
  handle: string;
  name: string;
  avatar: Critter & { bg: string };
};

export type Video = {
  id: string;
  title: string;
  channel: string;
  views: number;
  published: string;
  duration: string;
  categories: string[];
  scene: Scene;
  critters: Critter[];
  caption?: string[];
};

export const categories: Category[] = [
  { slug: "fursuits", label: "Fursuits" },
  { slug: "art-animation", label: "Art & Animation" },
  { slug: "vlogs", label: "Vlogs" },
  { slug: "gaming", label: "Gaming" },
  { slug: "music", label: "Music" },
  { slug: "tutorials", label: "Tutorials" },
  { slug: "species", label: "Species Focus" },
  { slug: "conventions", label: "Conventions" },
  { slug: "interviews", label: "Interviews" },
];

const fox = {
  species: "fox",
  fur: "#e8762c",
  belly: "#fff4e6",
  eyes: "#3f8f5a",
} as const;
const blueWolf = {
  species: "wolf",
  fur: "#4f8fd6",
  belly: "#e8f1fb",
  eyes: "#f2b233",
} as const;
const tanDog = {
  species: "husky",
  fur: "#c98f55",
  belly: "#fbeedd",
  eyes: "#4a78c2",
} as const;
const greyHusky = {
  species: "husky",
  fur: "#7d8594",
  belly: "#f4f5f7",
  eyes: "#5aa6e0",
} as const;
const brownWolf = {
  species: "wolf",
  fur: "#8a5a3c",
  belly: "#f1dcc6",
  eyes: "#d99a2b",
} as const;
const protogen = {
  species: "protogen",
  fur: "#e9ebf0",
  belly: "#1a1f2e",
  eyes: "#3fe0ff",
} as const;
const hyena = {
  species: "hyena",
  fur: "#c9a46b",
  belly: "#f3e5c8",
  eyes: "#b5482f",
} as const;
const purpleDragon = {
  species: "dragon",
  fur: "#7a4fc9",
  belly: "#f0d7ff",
  eyes: "#ffd23f",
} as const;
const cat = {
  species: "cat",
  fur: "#3b3b46",
  belly: "#f7f2ea",
  eyes: "#8fd14f",
} as const;

export const channels: Channel[] = [
  {
    handle: "fuzzbuttvlogs",
    name: "FuzzButtVlogs",
    avatar: { ...fox, shirt: "#2f6fb5", bg: "#fde2cf" },
  },
  {
    handle: "artbysparky",
    name: "ArtBySparky",
    avatar: { ...fox, shirt: "#8e3b2f", bg: "#f7ecd9" },
  },
  {
    handle: "wuffcreations",
    name: "WuffCreations",
    avatar: { ...tanDog, shirt: "#2d3a4f", bg: "#dfe9f7" },
  },
  {
    handle: "gamerhyena",
    name: "GamerHyena",
    avatar: { ...hyena, shirt: "#2b2d42", bg: "#e7e1f7" },
  },
  {
    handle: "anthronation",
    name: "AnthroNation",
    avatar: { ...brownWolf, shirt: "#1f3a5f", bg: "#dde7f3" },
  },
  {
    handle: "furtales",
    name: "FurTales",
    avatar: { ...brownWolf, shirt: "#6b8f3c", bg: "#e4f0d6" },
  },
  {
    handle: "merchmutt",
    name: "MerchMutt",
    avatar: { ...greyHusky, shirt: "#e0312b", bg: "#fbe0de" },
  },
  {
    handle: "dancepaws",
    name: "DancePaws",
    avatar: { ...purpleDragon, shirt: "#e6388b", bg: "#f1ddfb" },
  },
  {
    handle: "anthroconnect",
    name: "AnthroConnect",
    avatar: { ...fox, shirt: "#3d7a6b", bg: "#d8efe9" },
  },
  {
    handle: "anthroarts",
    name: "AnthroArts",
    avatar: { ...blueWolf, shirt: "#5b3fa6", bg: "#e3e8fb" },
  },
  {
    handle: "pawprintanims",
    name: "PawPrintAnims",
    avatar: { ...fox, shirt: "#d4412f", bg: "#fde6d6" },
  },
  {
    handle: "wuffgaming",
    name: "WuffGaming",
    avatar: { ...protogen, shirt: "#1f2a44", bg: "#d9f6fc" },
  },
];

export const followedChannels = [
  "anthroarts",
  "fuzzbuttvlogs",
  "pawprintanims",
  "wuffgaming",
  "artbysparky",
  "gamerhyena",
  "dancepaws",
];

export function getChannel(handle: string): Channel {
  const channel = channels.find((c) => c.handle === handle);
  if (!channel) throw new Error(`Unknown channel: ${handle}`);
  return channel;
}

export const videos: Video[] = [
  {
    id: "blfc-day-1",
    title: "BLFC 2024: Day 1 Fursuit Parade!",
    channel: "fuzzbuttvlogs",
    views: 199_000,
    published: "1 hour ago",
    duration: "14:21",
    categories: ["conventions", "vlogs", "fursuits"],
    scene: "street",
    caption: ["BLFC", "2024:", "Day 1", "Parade!"],
    critters: [
      { ...fox, shirt: "#2f6fb5", x: 150, y: 96, scale: 0.9 },
      { ...blueWolf, shirt: "#f2f2f2", x: 212, y: 90, scale: 0.95, flip: true },
      { ...tanDog, shirt: "#394b66", x: 272, y: 102, scale: 0.85 },
    ],
  },
  {
    id: "drawing-anthro-101",
    title: "Drawing Anthro Characters: Step-by-Step!",
    channel: "artbysparky",
    views: 4_700,
    published: "1 hour ago",
    duration: "14:21",
    categories: ["art-animation", "tutorials"],
    scene: "sketch",
    critters: [
      { ...fox, shirt: "#8e3b2f", x: 120, y: 88, scale: 1 },
      { ...fox, shirt: "#8e3b2f", x: 240, y: 88, scale: 1, sketch: true },
    ],
  },
  {
    id: "fursuit-head-5",
    title: "Building My Fursuit Head: Part 5",
    channel: "wuffcreations",
    views: 153_000,
    published: "1 hour ago",
    duration: "14:21",
    categories: ["fursuits", "tutorials"],
    scene: "workshop",
    critters: [{ ...tanDog, shirt: "#2d3a4f", x: 170, y: 92, scale: 1.25 }],
  },
  {
    id: "anthro-arena-1",
    title: "Anthro Arena: Protogen Gameplay",
    channel: "gamerhyena",
    views: 1_700,
    published: "1 hour ago",
    duration: "18:36",
    categories: ["gaming"],
    scene: "arena",
    critters: [
      { ...protogen, shirt: "#2b2d42", x: 120, y: 92, scale: 1 },
      { ...hyena, shirt: "#3b3f5c", x: 230, y: 98, scale: 0.85, flip: true },
    ],
  },
  {
    id: "anthro-arena-2",
    title: "Anthro Arena: Protogen Ranked Climb",
    channel: "gamerhyena",
    views: 177_000,
    published: "1 month ago",
    duration: "13:02",
    categories: ["gaming"],
    scene: "arena",
    critters: [
      {
        ...protogen,
        fur: "#3a4f7a",
        eyes: "#7ff0ff",
        shirt: "#1d2438",
        x: 110,
        y: 94,
        scale: 1.05,
      },
      { ...fox, shirt: "#394b66", x: 230, y: 96, scale: 0.95, flip: true },
    ],
  },
  {
    id: "why-were-here",
    title: "The Furry Fandom: Why We're Here (Documentary)",
    channel: "anthronation",
    views: 1_200_000,
    published: "3 days ago",
    duration: "14:21",
    categories: ["interviews", "conventions"],
    scene: "street",
    critters: [
      { ...fox, shirt: "#1f3a5f", x: 80, y: 94, scale: 1 },
      { ...blueWolf, shirt: "#dfe4ea", x: 165, y: 92, scale: 1.02 },
      { ...tanDog, shirt: "#5a3a2a", x: 250, y: 96, scale: 0.98, flip: true },
    ],
  },
  {
    id: "drawing-anthro-clothes",
    title: "Drawing Anthro Characters: Hoodies & Clothing Folds",
    channel: "artbysparky",
    views: 115_000,
    published: "2 days ago",
    duration: "13:36",
    categories: ["art-animation", "tutorials"],
    scene: "sketch",
    critters: [
      { ...brownWolf, shirt: "#8e3b2f", x: 115, y: 92, scale: 1.05 },
      {
        ...brownWolf,
        shirt: "#8e3b2f",
        x: 235,
        y: 92,
        scale: 1.05,
        sketch: true,
      },
    ],
  },
  {
    id: "animation-short-1",
    title: "Original Furry Animation Short: The Long Way Home",
    channel: "pawprintanims",
    views: 77_000,
    published: "1 month ago",
    duration: "14:39",
    categories: ["art-animation"],
    scene: "forest",
    critters: [{ ...fox, shirt: "#d4412f", x: 175, y: 110, scale: 0.8 }],
  },
  {
    id: "merch-haul-1",
    title: "Unboxing Furry Merch Haul!",
    channel: "merchmutt",
    views: 3_300_000,
    published: "5 hours ago",
    duration: "13:55",
    categories: ["vlogs"],
    scene: "burst",
    critters: [{ ...fox, shirt: "#2f6fb5", x: 160, y: 94, scale: 1.3 }],
  },
  {
    id: "dance-battle-finale",
    title: "Furry Dance Battle 2024 Finale!",
    channel: "dancepaws",
    views: 217_000,
    published: "1 hour ago",
    duration: "12:01",
    categories: ["music", "conventions"],
    scene: "neon",
    critters: [
      {
        ...protogen,
        fur: "#4a2f7a",
        eyes: "#d46bff",
        shirt: "#1b1330",
        x: 110,
        y: 96,
        scale: 1,
      },
      { ...fox, shirt: "#1b1330", x: 230, y: 94, scale: 1, flip: true },
    ],
  },
  {
    id: "why-were-here-2",
    title: "The Furry Fandom: Why We're Here (Part 2)",
    channel: "anthronation",
    views: 3_200,
    published: "1 hour ago",
    duration: "14:21",
    categories: ["interviews"],
    scene: "studio",
    caption: ["WHY", "ARE WE", "HERE?"],
    critters: [
      { ...brownWolf, shirt: "#1f3a5f", x: 225, y: 96, scale: 1.2, flip: true },
    ],
  },
  {
    id: "animation-short-2",
    title: "Original Furry Animation Short: Moving Day",
    channel: "furtales",
    views: 71_000,
    published: "6 hours ago",
    duration: "14:52",
    categories: ["art-animation"],
    scene: "studio",
    critters: [
      { ...brownWolf, shirt: "#6b8f3c", x: 115, y: 96, scale: 1.1 },
      { ...fox, shirt: "#394b66", x: 235, y: 100, scale: 0.9, flip: true },
    ],
  },
  {
    id: "merch-haul-2",
    title: "Unboxing Furry Merch Haul! Pt. 2",
    channel: "merchmutt",
    views: 123_000,
    published: "1 hour ago",
    duration: "14:29",
    categories: ["vlogs"],
    scene: "boxes",
    critters: [
      { ...fox, shirt: "#2f6fb5", x: 120, y: 88, scale: 0.95 },
      { ...blueWolf, shirt: "#f2f2f2", x: 205, y: 86, scale: 0.95, flip: true },
    ],
  },
  {
    id: "dance-battle-semis",
    title: "Furry Dance Battle 2024: Semi-Finals",
    channel: "dancepaws",
    views: 179_000,
    published: "1 day ago",
    duration: "14:32",
    categories: ["music", "conventions"],
    scene: "neon",
    critters: [
      { ...cat, shirt: "#e6388b", x: 95, y: 100, scale: 0.85 },
      { ...purpleDragon, shirt: "#1b1330", x: 165, y: 94, scale: 0.95 },
      {
        ...greyHusky,
        shirt: "#27c3d8",
        x: 240,
        y: 100,
        scale: 0.85,
        flip: true,
      },
    ],
  },
  {
    id: "interview-sparky",
    title: "Interview with Art Legend: Sparky Fox",
    channel: "anthroconnect",
    views: 4_800,
    published: "1 hour ago",
    duration: "14:32",
    categories: ["interviews", "art-animation"],
    scene: "studio",
    critters: [
      { ...fox, shirt: "#3d7a6b", x: 100, y: 94, scale: 1.05 },
      {
        ...fox,
        fur: "#d9622a",
        shirt: "#8e3b2f",
        x: 225,
        y: 94,
        scale: 1.05,
        flip: true,
      },
    ],
  },
  {
    id: "species-dutch-angel",
    title: "Species Spotlight: Why Everyone Loves Dragons",
    channel: "anthroarts",
    views: 58_000,
    published: "2 weeks ago",
    duration: "11:47",
    categories: ["species"],
    scene: "forest",
    critters: [
      { ...purpleDragon, shirt: "#5b3fa6", x: 170, y: 96, scale: 1.25 },
    ],
  },
  {
    id: "lofi-paws",
    title: "Lo-fi Paws: 1 Hour of Chill Beats to Draw To",
    channel: "pawprintanims",
    views: 842_000,
    published: "3 weeks ago",
    duration: "1:02:14",
    categories: ["music", "art-animation"],
    scene: "studio",
    critters: [{ ...cat, shirt: "#d4412f", x: 175, y: 100, scale: 1.2 }],
  },
  {
    id: "tail-tutorial",
    title: "Beginner Fursuit Tail Tutorial (No Sewing Machine!)",
    channel: "wuffcreations",
    views: 96_000,
    published: "4 days ago",
    duration: "22:08",
    categories: ["tutorials", "fursuits"],
    scene: "workshop",
    critters: [{ ...greyHusky, shirt: "#2d3a4f", x: 165, y: 96, scale: 1.2 }],
  },
  {
    id: "protogen-visor",
    title: "Protogen Visor LEDs: Complete Wiring Guide",
    channel: "wuffgaming",
    views: 311_000,
    published: "2 months ago",
    duration: "27:40",
    categories: ["tutorials", "fursuits", "species"],
    scene: "arena",
    critters: [{ ...protogen, shirt: "#1f2a44", x: 165, y: 92, scale: 1.3 }],
  },
  {
    id: "hyena-misunderstood",
    title: "Species Focus: Hyenas Are Misunderstood",
    channel: "gamerhyena",
    views: 26_000,
    published: "1 week ago",
    duration: "9:12",
    categories: ["species", "vlogs"],
    scene: "burst",
    critters: [{ ...hyena, shirt: "#2b2d42", x: 165, y: 96, scale: 1.25 }],
  },
];

export function findVideos({
  query,
  category,
}: {
  query?: string;
  category?: string;
}): Video[] {
  const needle = query?.trim().toLowerCase();
  return videos.filter((video) => {
    if (category && !video.categories.includes(category)) return false;
    if (!needle) return true;
    const channelName = getChannel(video.channel).name.toLowerCase();
    return (
      video.title.toLowerCase().includes(needle) || channelName.includes(needle)
    );
  });
}
