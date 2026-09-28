// Seed data for the dummy site. Everything here is made up.
//
// Only used to fill a fresh database (src/db/seed.ts). The site and admin
// read and write the database; nothing in the UI imports this file.
import { GUEST_CHANNEL_ID } from "../lib/constants";
import type { Critter, Scene } from "../lib/art";
import { parseDuration } from "../lib/format";

export { parseDuration };

export type Category = { slug: string; label: string };

export type Channel = {
  handle: string;
  name: string;
  subscribers: number;
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
  description: string;
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
    subscribers: 201_000,
    avatar: { ...fox, shirt: "#2f6fb5", bg: "#fde2cf" },
  },
  {
    handle: "artbysparky",
    name: "ArtBySparky",
    subscribers: 88_400,
    avatar: { ...fox, shirt: "#8e3b2f", bg: "#f7ecd9" },
  },
  {
    handle: "wuffcreations",
    name: "WuffCreations",
    subscribers: 342_000,
    avatar: { ...tanDog, shirt: "#2d3a4f", bg: "#dfe9f7" },
  },
  {
    handle: "gamerhyena",
    name: "GamerHyena",
    subscribers: 57_300,
    avatar: { ...hyena, shirt: "#2b2d42", bg: "#e7e1f7" },
  },
  {
    handle: "anthronation",
    name: "AnthroNation",
    subscribers: 1_140_000,
    avatar: { ...brownWolf, shirt: "#1f3a5f", bg: "#dde7f3" },
  },
  {
    handle: "furtales",
    name: "FurTales",
    subscribers: 129_000,
    avatar: { ...brownWolf, shirt: "#6b8f3c", bg: "#e4f0d6" },
  },
  {
    handle: "merchmutt",
    name: "MerchMutt",
    subscribers: 2_060_000,
    avatar: { ...greyHusky, shirt: "#e0312b", bg: "#fbe0de" },
  },
  {
    handle: "dancepaws",
    name: "DancePaws",
    subscribers: 415_000,
    avatar: { ...purpleDragon, shirt: "#e6388b", bg: "#f1ddfb" },
  },
  {
    handle: "anthroconnect",
    name: "AnthroConnect",
    subscribers: 23_800,
    avatar: { ...fox, shirt: "#3d7a6b", bg: "#d8efe9" },
  },
  {
    handle: "anthroarts",
    name: "AnthroArts",
    subscribers: 176_000,
    avatar: { ...blueWolf, shirt: "#5b3fa6", bg: "#e3e8fb" },
  },
  {
    handle: "pawprintanims",
    name: "PawPrintAnims",
    subscribers: 938_000,
    avatar: { ...fox, shirt: "#d4412f", bg: "#fde6d6" },
  },
  {
    handle: "wuffgaming",
    name: "WuffGaming",
    subscribers: 64_100,
    avatar: { ...protogen, shirt: "#1f2a44", bg: "#d9f6fc" },
  },
];

/** Channels listed under "Followed Channels" in the sidebar, in order. */
export const followedChannels = [
  "anthroarts",
  "fuzzbuttvlogs",
  "pawprintanims",
  "wuffgaming",
  "artbysparky",
  "gamerhyena",
  "dancepaws",
];

export const videos: Video[] = [
  {
    id: "blfc-day-1",
    description:
      "Day 1 of BLFC is in the books! We hit the fursuit parade with over 2,000 suiters, caught up with old friends and met a lot of new ones. Huge thanks to the parade staff and headless lounge volunteers.\n\nFind yourself in the crowd? Drop a timestamp in the comments!\n\n#BLFC #FursuitParade #ConVlog",
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
    description:
      "A beginner-friendly walkthrough for drawing anthro characters, from a gesture sketch to clean line art and flat colours. We cover head shapes, muzzles, ears and how to keep proportions consistent.\n\nBrushes: default round pen, 60% opacity sketch layer.\n\n#DrawingTutorial #AnthroArt",
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
    description:
      "Part 5 of the head build: carving the foam base for the muzzle, attaching the ears and patterning the fur. Next episode we finally get to shaving and airbrushing!\n\nMaterials list is pinned in the comments.\n\n#FursuitMaking #FursuitHead",
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
    description:
      "First look at Anthro Arena's new protogen class. Visor abilities are wild; the shield bash combo is absolutely broken right now.\n\n#AnthroArena #Protogen #Gaming",
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
    description:
      "Climbing ranked with the protogen main. We go from Silver to Platinum in one sitting (with a lot of yelling).\n\n#AnthroArena #Ranked",
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
    description:
      "What draws people to the furry fandom? We spent a year at conventions, meetups and art streams talking to artists, fursuiters and first-timers about creativity, community and belonging.\n\nDirected by AnthroNation. Music licensed from independent furry musicians.\n\n#Documentary #FurryFandom",
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
    description:
      "Clothes make the character! This lesson focuses on hoodies: where folds form, how fabric drapes over fur and tails, and how to shade it quickly.\n\n#DrawingTutorial #ClothingFolds",
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
    description:
      "A lost fox kit tries to find the way home through an autumn forest. Hand-animated over eight months by the PawPrintAnims team.\n\n#Animation #ShortFilm",
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
    description:
      "Opening EVERYTHING from the con dealers' den: pins, prints, badges, plushies and one very questionable tail keychain.\n\nAll artists are credited on screen, go support them!\n\n#MerchHaul #Unboxing",
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
    description:
      "The final round of the 2024 Furry Dance Battle! Two finalists, three songs, one trophy. Who do you think should have won?\n\n#DanceBattle #Fursuit",
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
    description:
      "Part 2 of our documentary series. This time we sit down with long-time members of the fandom to talk about how the community has changed over the years.\n\n#Documentary #Interviews",
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
    description:
      "Two roommates, one tiny apartment and far too many boxes. An original animated comedy short from FurTales.\n\n#Animation #Comedy",
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
    description:
      "You asked for it: more merch! This haul is all mail-order commissions from independent artists.\n\n#MerchHaul #SupportArtists",
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
    description:
      "Semi-finals of the 2024 Furry Dance Battle. Eight dancers, four head-to-head rounds and some incredible fursuit footwork.\n\n#DanceBattle",
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
    description:
      "We sat down with Sparky Fox, the artist behind ArtBySparky, to talk about getting started, avoiding burnout and finding a style.\n\n#ArtistInterview",
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
    description:
      "From classic western dragons to feathered sweethearts, we look at why dragons are one of the most popular species in the fandom.\n\n#SpeciesSpotlight #Dragons",
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
    description:
      "One hour of chill lo-fi beats to draw, study or nap to. Animated loop by PawPrintAnims.\n\n#Lofi #StudyMusic",
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
    description:
      "Make a floppy, fluffy fursuit tail with just faux fur, stuffing and a needle and thread. Perfect first project!\n\n#FursuitTutorial #DIY",
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
    description:
      "Everything you need to wire up LED matrix eyes for a protogen visor: parts list, soldering, power and a simple animation script.\n\n#Protogen #LED #Electronics",
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
    description:
      "Hyenas get a bad rap. Let's talk about why they're actually one of the coolest animals around, and why hyena fursonas are on the rise.\n\n#SpeciesFocus #Hyena",
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

/**
 * The shared guest user everyone comments as until accounts exist. Also
 * recreated from here if it is deleted in the admin.
 */
export const DEFAULT_GUEST: Channel = {
  handle: GUEST_CHANNEL_ID,
  name: "You",
  subscribers: 0,
  avatar: { ...greyHusky, shirt: "#1f2a44", bg: "#e3e8f0" },
};

export type Comment = {
  id: string;
  author: string;
  text: string;
  likes: number;
  /** Minutes since posting; used for "Newest first" sorting. */
  age: number;
  published: string;
};

const commentPool: Omit<Comment, "id">[] = [
  {
    author: "anthroarts",
    text: "The colours in this are incredible. Saving this for reference!",
    likes: 1_200,
    age: 50,
    published: "50 minutes ago",
  },
  {
    author: "pawprintanims",
    text: "Instant like. You always put so much love into these.",
    likes: 842,
    age: 120,
    published: "2 hours ago",
  },
  {
    author: "wuffgaming",
    text: "Who else is watching this at 3am instead of sleeping? 🐾",
    likes: 530,
    age: 30,
    published: "30 minutes ago",
  },
  {
    author: "dancepaws",
    text: "The energy here is unmatched. Can't wait for the next one!",
    likes: 311,
    age: 300,
    published: "5 hours ago",
  },
  {
    author: "merchmutt",
    text: "Came for the video, stayed for the wholesome comment section.",
    likes: 2_400,
    age: 1_440,
    published: "1 day ago",
  },
  {
    author: "furtales",
    text: "This got me to finally start my own project. Thank you!",
    likes: 97,
    age: 10,
    published: "10 minutes ago",
  },
  {
    author: "gamerhyena",
    text: "Hyena representation when? 👀 (great video though)",
    likes: 64,
    age: 5,
    published: "5 minutes ago",
  },
  {
    author: "anthroconnect",
    text: "Would love a behind-the-scenes follow-up on how this was made.",
    likes: 188,
    age: 720,
    published: "12 hours ago",
  },
  {
    author: "artbysparky",
    text: "Love seeing the community grow like this. 💛",
    likes: 403,
    age: 2_880,
    published: "2 days ago",
  },
];

/** A deterministic handful of comments for a video. */
export function commentsFor(video: Video): Comment[] {
  const seed = [...video.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return Array.from({ length: 6 }, (_, i) => {
    const pick = commentPool[(seed + i * 4) % commentPool.length];
    return { ...pick, id: `${video.id}-c${i}` };
  }).filter((comment) => comment.author !== video.channel);
}
