import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import houseImage from "@/assets/fairytale-house.jpg";
import atticAsset from "@/assets/top-room.png.asset.json";
import bedroomLeftAsset from "@/assets/second-floor-left-room.png.asset.json";
import studyRightAsset from "@/assets/second-floor-right-room.png.asset.json";
import firstFloorLeftAsset from "@/assets/first-floor-left-room.png.asset.json";
import firstFloorCenterAsset from "@/assets/first-floor-center-room.png.asset.json";
import firstFloorRightAsset from "@/assets/first-floor-right-room.png.asset.json";
import { loadHouseConfig, membersByRoute, type HouseConfig } from "@/lib/houseStore";

const TAVUS_DEPLOYMENT_ID = "cc147485-2ad2-416c-80e5-51f12f8d8a3e";

type Room = {
  slug: string;
  name: string;
  caption: string;
  description: string;
  asset: string;
  hotspot: { left: string; top: string; width: string; height: string };
  origin: string;
};

// Hotspot coordinates calibrated to the fairytale-house.jpg cutaway
// (image is 16:9; rooms sit roughly in three rows across the cottage).
const ROOMS: Room[] = [
  {
    slug: "attic",
    name: "The Attic",
    caption: "Stored letters, photographs, and the long-kept things.",
    description:
      "A quiet space under the rafters where Echo keeps the oldest memories — boxed letters, faded photographs, and the stories you weren't sure you'd ever tell.",
    asset: atticAsset.url,
    hotspot: { left: "35.5%", top: "6%", width: "27%", height: "27%" },
    origin: "49% 19%",
  },
  {
    slug: "childs-bedroom",
    name: "The Child's Bedroom",
    caption: "Lullabies, bedtime stories, the small voices of growing up.",
    description:
      "Soft amber light, a low bookshelf, the songs sung at bedtime. A room for the gentle, daily memories of family.",
    asset: bedroomLeftAsset.url,
    hotspot: { left: "23.5%", top: "34.5%", width: "24.5%", height: "26.5%" },
    origin: "36% 48%",
  },
  {
    slug: "study",
    name: "The Study",
    caption: "Lamplight, books, and the long talks late into the evening.",
    description:
      "Where ideas were turned over, advice given, and quiet conversations made room for whatever was on your mind.",
    asset: studyRightAsset.url,
    hotspot: { left: "48%", top: "34.5%", width: "30%", height: "26.5%" },
    origin: "63% 48%",
  },
  {
    // first floor LEFT in the artwork is the kitchen (blue cabinets / island)
    slug: "kitchen",
    name: "The Kitchen",
    caption: "Recipes, rituals, the warm center of the house.",
    description:
      "Where the family fed itself first. The recipes passed down, the small kindnesses made with hands and time.",
    asset: firstFloorLeftAsset.url,
    hotspot: { left: "18.5%", top: "61.5%", width: "27%", height: "29.5%" },
    origin: "32% 76%",
  },
  {
    slug: "living-room",
    name: "The Living Room",
    caption: "The gathering place — laughter, films, evenings together.",
    description:
      "The room where everyone landed. Films watched together, conversations that wandered, the seat someone always took.",
    asset: firstFloorCenterAsset.url,
    hotspot: { left: "45.5%", top: "61.5%", width: "19.5%", height: "29.5%" },
    origin: "55% 76%",
  },
  {
    // first floor RIGHT in the artwork is the bath (clawfoot tub / steam)
    slug: "bath",
    name: "The Bath",
    caption: "Steam, hush, the small daily rituals of care.",
    description:
      "A small private room of warmth and care — the rituals of beginning and ending the day, kept softly.",
    asset: firstFloorRightAsset.url,
    hotspot: { left: "65%", top: "61.5%", width: "19.5%", height: "29.5%" },
    origin: "75% 76%",
  },
];

export const Route = createFileRoute("/house")({
  head: () => ({
    meta: [
      { title: "The House — Echo" },
      {
        name: "description",
        content:
          "Step inside the Echo house. Choose a room — each one holds a different part of a life lovingly kept.",
      },
      { property: "og:title", content: "The House — Echo" },
      {
        property: "og:description",
        content:
          "An interactive cutaway of the Echo house. Touch any room to step inside its memories.",
      },
      { property: "og:image", content: houseImage },
    ],
  }),
  component: HousePage,
});

function HousePage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [config, setConfig] = useState<HouseConfig | null>(null);

  // Load saved onboarding config (client-only)
  useEffect(() => {
    setConfig(loadHouseConfig());
  }, []);

  const grouped = useMemo(() => membersByRoute(config), [config]);

  const selectedRoom = useMemo(
    () => ROOMS.find((r) => r.slug === selectedSlug) ?? null,
    [selectedSlug],
  );

  const selectedMembers = selectedRoom ? grouped[selectedRoom.slug] ?? [] : [];

  // Load Tavus embed web component on the client only
  useEffect(() => {
    import("@tavus/embed");
  }, []);

  // Esc closes the room overlay
  useEffect(() => {
    if (!selectedSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSlug(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedSlug]);

  const houseTitle = config?.houseName ?? "Echo House";

  return (
    <main className="fixed inset-0 z-0 overflow-hidden bg-[#0f0818] text-[#f3e8d8]">
      <div
        className={`house-map-frame relative h-full w-full overflow-hidden ${
          selectedRoom ? "is-zooming" : ""
        }`}
        style={
          selectedRoom
            ? ({ ["--zoom-origin" as string]: selectedRoom.origin } as React.CSSProperties)
            : undefined
        }
      >
        <img
          src={houseImage}
          alt="A luminous cutaway of the Echo house at twilight, six glowing rooms across three floors"
          className="house-map-image absolute inset-0 block h-full w-full object-cover"
          loading="eager"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(15,8,24,0.78)_100%)]" />

        {/* Back to landing */}
        {!selectedRoom && (
          <Link
            to="/"
            className="absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 font-serif text-sm tracking-wide text-white/90 backdrop-blur-md transition hover:bg-black/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
            Back home
          </Link>
        )}

        {/* House name (from onboarding) */}
        {!selectedRoom && config && (
          <div className="pointer-events-none absolute inset-x-0 top-6 z-10 text-center">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#e8c987]/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Welcome to
            </p>
            <h1 className="mt-1 font-serif text-2xl italic text-white/95 drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] sm:text-3xl">
              {houseTitle}
            </h1>
          </div>
        )}

        {/* Hint */}
        {!selectedRoom && (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 text-center">
            <p className="font-serif text-sm italic tracking-wide text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-base">
              Touch a room to step inside
            </p>
          </div>
        )}

        {/* Touch targets */}
        {!selectedRoom &&
          ROOMS.map((room) => {
            const roomMembers = grouped[room.slug] ?? [];
            const labelText =
              roomMembers.length > 0
                ? `${room.name} · ${roomMembers.map((m) => m.name).filter(Boolean).join(", ") || roomMembers.length + " member" + (roomMembers.length === 1 ? "" : "s")}`
                : room.name;
            return (
              <button
                key={room.slug}
                type="button"
                aria-label={`Enter ${room.name}`}
                onClick={() => setSelectedSlug(room.slug)}
                className="house-hotspot absolute cursor-pointer"
                style={room.hotspot}
              >
                <span className="sr-only">{room.name}</span>
                <span className="hotspot-label pointer-events-none absolute left-1/2 top-1/2 max-w-[90%] whitespace-nowrap rounded-full border border-[#c9a96a]/40 bg-black/55 px-3.5 py-1.5 font-serif text-xs tracking-[0.18em] text-[#fde68a] uppercase backdrop-blur-sm drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-[13px]">
                  {labelText}
                </span>
              </button>
            );
          })}

        {/* Zoom overlay */}
        <div
          className={`zoom-overlay absolute inset-0 z-30 ${
            selectedRoom
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          {selectedRoom && (
            <>
              <img
                src={selectedRoom.asset}
                alt={selectedRoom.name}
                className="zoom-overlay-image pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,8,24,0.35),transparent_25%,transparent_55%,rgba(15,8,24,0.7))]" />

              {/* Tavus CVI — "Mom" — mounts in the attic */}
              {selectedRoom.slug === "attic" && (
                <div className="absolute left-1/2 top-1/2 z-20 h-[min(70vh,560px)] w-[min(90vw,860px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#c9a96a]/40 bg-black/70 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                  <tavus-embed
                    deployment-id={TAVUS_DEPLOYMENT_ID}
                    style={{ display: "block", width: "100%", height: "100%" }}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setSelectedSlug(null)}
                className="absolute left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-4 py-2 font-serif text-sm tracking-wide text-white backdrop-blur-md transition hover:bg-black/65"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
                Back to the house
              </button>

              <button
                type="button"
                aria-label="Close room"
                onClick={() => setSelectedSlug(null)}
                className="absolute right-5 top-5 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65"
              >
                <X className="h-4 w-4" strokeWidth={1.25} />
              </button>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-6 sm:p-12">
                <div className="mx-auto max-w-3xl text-white">
                  <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-[#e8c987]">
                    {houseTitle}
                  </p>
                  <h1 className="mt-3 font-serif text-4xl italic leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl">
                    {selectedRoom.name}
                  </h1>
                  {selectedMembers.length > 0 && (
                    <p className="mt-3 font-sans text-xs uppercase tracking-[0.24em] text-[#e8c987]/90">
                      Lives here:{" "}
                      <span className="normal-case tracking-normal text-white/90">
                        {selectedMembers
                          .map((m) => (m.name ? `${m.name} (${m.relationship})` : m.relationship))
                          .join(" · ")}
                      </span>
                    </p>
                  )}
                  <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-white/85 sm:text-base">
                    {selectedRoom.description}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
