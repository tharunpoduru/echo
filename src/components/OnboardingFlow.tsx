import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bird,
  Cat,
  Check,
  Dog,
  Heart,
  Home,
  Mail,
  Plus,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { saveHouseConfig } from "@/lib/houseStore";
import cozyHouseAsset from "@/assets/cozy-house.png.asset.json";
import emptyHouseAsset from "@/assets/cozy-house-empty.png.asset.json";
import birdCharacter from "@/assets/character-bird.jpg";
import butlerCharacter from "@/assets/character-butler.jpg";
import catCharacter from "@/assets/character-cat.jpg";
import dogCharacter from "@/assets/character-dog.jpg";
import fairyCharacter from "@/assets/character-fairy.jpg";
import fairytaleHouseBg from "@/assets/fairytale-house.jpg";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

type Member = {
  id: number;
  name: string;
  relationship: string;
  email: string;
  room: string;
};

type CharacterId = "dog" | "cat" | "bird" | "butler" | "fairy";

type CharacterOption = {
  id: CharacterId;
  name: string;
  blessing: string;
  icon: typeof Dog;
  accent: string;
  image: string;
};

const roomCoordinates: Record<string, string> = {
  attic: "left-[49%] top-[17%]",
  bedroom: "left-[25%] top-[38%]",
  study: "left-[63%] top-[37%]",
  kitchen: "left-[28%] top-[69%]",
  lounge: "left-[51%] top-[70%]",
  bath: "left-[77%] top-[69%]",
};

const roomLabels: Record<string, string> = {
  attic: "Attic loft",
  bedroom: "Moon bedroom",
  study: "Writing study",
  kitchen: "Lantern kitchen",
  lounge: "Gathering room",
  bath: "Steam bath",
};

const relationshipOptions = [
  "Founder",
  "Partner",
  "Child",
  "Parent",
  "Grandparent",
  "Sibling",
  "Friend",
  "Caregiver",
];

const roomOptions = ["attic", "bedroom", "study", "kitchen", "lounge", "bath"];

const characterOptions: CharacterOption[] = [
  {
    id: "dog",
    name: "Watchdog",
    blessing: "Warm · dependable · playful",
    icon: Dog,
    accent: "bg-chart-1/20 text-primary border-primary/40",
    image: dogCharacter,
  },
  {
    id: "cat",
    name: "Hearth Cat",
    blessing: "Quiet · intuitive · comforting",
    icon: Cat,
    accent: "bg-secondary/20 text-secondary-foreground border-secondary/40",
    image: catCharacter,
  },
  {
    id: "bird",
    name: "Window Bird",
    blessing: "Lively · social · uplifting",
    icon: Bird,
    accent: "bg-accent/25 text-accent-foreground border-accent/40",
    image: birdCharacter,
  },
  {
    id: "butler",
    name: "House Butler",
    blessing: "Organised · attentive · elegant",
    icon: Home,
    accent: "bg-panel-muted text-panel-foreground border-border",
    image: butlerCharacter,
  },
  {
    id: "fairy",
    name: "Lantern Fairy",
    blessing: "Magical · gentle · imaginative",
    icon: WandSparkles,
    accent: "bg-sky-glow/20 text-foreground border-sky-glow/35",
    image: fairyCharacter,
  },
];

const initialMembers: Member[] = [
  { id: 1, name: "Ava", relationship: "Founder", email: "ava@example.com", room: "study" },
  { id: 2, name: "Noah", relationship: "Partner", email: "noah@example.com", room: "bedroom" },
  { id: 3, name: "Lena", relationship: "Child", email: "", room: "attic" },
];

const stepMeta: { id: Step; index: string; label: string }[] = [
  { id: 1, index: "01", label: "Name house" },
  { id: 2, index: "02", label: "Add members" },
  { id: 3, index: "03", label: "Assign rooms" },
  { id: 4, index: "04", label: "Send invites" },
  { id: 5, index: "05", label: "Review" },
  { id: 6, index: "06", label: "Character" },
];

export function OnboardingFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [houseName, setHouseName] = useState("Willowmere Cottage");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>("fairy");

  const filledRooms = useMemo(() => new Set(members.map((m) => m.room)), [members]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateMember = (id: number, key: keyof Member, value: string) =>
    setMembers((cur) => cur.map((m) => (m.id === id ? { ...m, [key]: value } : m)));

  const removeMember = (id: number) =>
    setMembers((cur) => (cur.length > 1 ? cur.filter((m) => m.id !== id) : cur));

  const addMember = () => {
    const openRoom = roomOptions.find((r) => !filledRooms.has(r)) ?? roomOptions[members.length % roomOptions.length];
    setMembers((cur) => [
      ...cur,
      { id: Date.now(), name: "", relationship: "Friend", email: "", room: openRoom },
    ]);
  };

  const goNext = () => setStep((s) => (s < 6 ? ((s + 1) as Step) : s));
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const finish = () => {
    saveHouseConfig({
      houseName: houseName.trim() || "Your house",
      members: members.map(({ id, name, relationship, email, room }) => ({
        id,
        name: name.trim(),
        relationship,
        email: email.trim(),
        room,
      })),
      character: selectedCharacter,
    });
    onClose();
    navigate({ to: "/house" });
  };

  return (
    <div className="cozy-onboarding fixed inset-0 z-50 overflow-y-auto">
      <main className="app-shell min-h-screen overflow-hidden text-foreground">
        <div className="mx-auto flex h-screen max-w-[1500px] flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
          <section className="story-border panel-surface relative flex h-[calc(100vh-1.5rem)] flex-1 flex-col overflow-hidden rounded-[28px] sm:h-[calc(100vh-2rem)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)]" />

            <header className="relative z-10 flex items-center justify-between gap-4 border-b border-border/70 px-5 py-3 sm:px-7">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Heart className="h-4 w-4 text-primary" />
                <span className="truncate">{houseName || "Your house"}</span>
              </div>
              <StepRail current={step} />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-panel-muted/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="relative z-10 grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[1.05fr_0.95fr] lg:p-5">
              <HouseScene step={step} members={members} houseName={houseName} />

              <div className="panel-surface story-border flex min-h-0 h-full flex-col rounded-[24px]">
                {step === 1 && (
                  <StepFrame
                    eyebrow="Step 01"
                    title="Name your house"
                    helper="One word, one mood. You can change it later."
                  >
                    <div className="space-y-3">
                      <Label htmlFor="house-name" className="text-muted-foreground">House name</Label>
                      <Input
                        id="house-name"
                        autoFocus
                        value={houseName}
                        onChange={(e) => setHouseName(e.target.value)}
                        placeholder="e.g. Willowmere Cottage"
                        className="field-surface h-12 rounded-2xl px-4 text-base"
                      />
                      <p className="text-xs text-muted-foreground">
                        This shows on every invite and on the front door of the cutaway house.
                      </p>
                    </div>
                  </StepFrame>
                )}

                {step === 2 && (
                  <StepFrame
                    eyebrow="Step 02"
                    title="Who lives here?"
                    helper="Just a name and how they relate to you."
                  >
                    <div className="flex h-full min-h-0 flex-col gap-3">
                      <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
                        {members.map((m, i) => (
                          <div key={m.id} className="rounded-2xl border border-border/70 bg-panel-elevated/55 p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-[11px] uppercase tracking-[0.22em] text-primary">Member {i + 1}</p>
                              {members.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMember(m.id)}
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label="Remove member"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <Input
                                value={m.name}
                                onChange={(e) => updateMember(m.id, "name", e.target.value)}
                                placeholder="Name"
                                className="field-surface h-10 rounded-xl px-3 text-sm"
                              />
                              <Select value={m.relationship} onValueChange={(v) => updateMember(m.id, "relationship", v)}>
                                <SelectTrigger className="field-surface h-10 rounded-xl px-3 text-sm">
                                  <SelectValue placeholder="Relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  {relationshipOptions.map((r) => (
                                    <SelectItem key={r} value={r}>{r}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="storyOutline" onClick={addMember} className="self-start">
                        <Plus className="h-4 w-4" />
                        Add member
                      </Button>
                    </div>
                  </StepFrame>
                )}

                {step === 3 && (
                  <StepFrame
                    eyebrow="Step 03"
                    title="Give everyone a room"
                    helper="Pick a corner of the house for each member."
                  >
                    <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
                      {members.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-panel-elevated/55 p-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{m.name || "Unnamed"}</p>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{m.relationship}</p>
                          </div>
                          <Select value={m.room} onValueChange={(v) => updateMember(m.id, "room", v)}>
                            <SelectTrigger className="field-surface h-10 w-44 rounded-xl px-3 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roomOptions.map((r) => (
                                <SelectItem key={r} value={r}>{roomLabels[r]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </StepFrame>
                )}

                {step === 4 && (
                  <StepFrame
                    eyebrow="Step 04"
                    title="Send the invites"
                    helper="A link goes to each email. They can join from anywhere."
                  >
                    <div className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
                      {members.map((m) => (
                        <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-panel-elevated/55 p-3">
                          <Mail className="h-4 w-4 shrink-0 text-primary" />
                          <div className="w-32 shrink-0">
                            <p className="truncate text-sm font-medium text-foreground">{m.name || "Unnamed"}</p>
                          </div>
                          <Input
                            type="email"
                            value={m.email}
                            onChange={(e) => updateMember(m.id, "email", e.target.value)}
                            placeholder="name@example.com"
                            className="field-surface h-10 flex-1 rounded-xl px-3 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </StepFrame>
                )}

                {step === 5 && (
                  <StepFrame
                    eyebrow="Step 05"
                    title="Does this feel like home?"
                    helper="One last look. Edit any step from the rail above."
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <MiniStat title="Members" value={`${members.length}`} />
                      <MiniStat title="Invites" value={`${members.filter((m) => m.email).length}`} />
                      <MiniStat title="Rooms lit" value={`${new Set(members.map((m) => m.room)).size}/6`} />
                      <MiniStat title="Palmakers" value={`${members.length} queued`} />
                    </div>
                    <div className="mt-3 rounded-2xl border border-border/70 bg-panel-muted/30 px-4 py-3 text-sm leading-5 text-muted-foreground">
                      A Tavus Palmaker will be created automatically for every member after you confirm.
                    </div>
                  </StepFrame>
                )}

                {step === 6 && (
                  <StepFrame
                    eyebrow="Step 06"
                    title="Pick a community character"
                    helper="They greet arrivals and set the mood of the house."
                  >
                    <div className="grid flex-1 min-h-0 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                      {characterOptions.map((opt) => {
                        const Icon = opt.icon;
                        const selected = opt.id === selectedCharacter;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedCharacter(opt.id)}
                            className={cn(
                              "group flex flex-col rounded-2xl border p-2 text-left transition-all",
                              selected
                                ? "border-primary/70 bg-primary/12 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_28%,transparent)]"
                                : "border-border/70 bg-panel-elevated/45 hover:bg-panel-elevated/65",
                            )}
                          >
                            <div className="relative overflow-hidden rounded-xl border border-border/60">
                              <img
                                src={opt.image}
                                alt={opt.name}
                                loading="lazy"
                                className="aspect-square w-full object-cover"
                              />
                              {selected && (
                                <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                  <Check className="h-3.5 w-3.5" />
                                </span>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                              <div className={cn("flex h-6 w-6 items-center justify-center rounded-md border", opt.accent)}>
                                <Icon className="h-3 w-3" />
                              </div>
                              <h3 className="truncate text-sm leading-none text-foreground">{opt.name}</h3>
                            </div>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{opt.blessing}</p>
                          </button>
                        );
                      })}
                    </div>
                  </StepFrame>
                )}

                <div className="flex items-center justify-between gap-3 border-t border-border/70 px-5 py-3">
                  <Button variant="storyOutline" onClick={goBack} disabled={step === 1}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <p className="hidden text-xs text-muted-foreground sm:block">
                    Step {step} of 6
                  </p>
                  {step < 6 ? (
                    <Button variant="story" onClick={goNext}>
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="story" onClick={finish}>
                      Confirm {characterOptions.find((o) => o.id === selectedCharacter)?.name}
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function HouseScene({ step, members, houseName }: { step: Step; members: Member[]; houseName: string }) {
  const proofreadMode = step >= 5;
  const houseImg = fairytaleHouseBg;

  const captions: Record<Step, { eyebrow: string; title: string; body: string }> = {
    1: { eyebrow: "House builder", title: "An empty house waiting for a name", body: "Once named, lanterns will start to glow in the windows." },
    2: { eyebrow: "House builder", title: "Members fill the rooms", body: "Each name becomes a tag pinned to a room in the cutaway." },
    3: { eyebrow: "House builder", title: "Place everyone in a room", body: "Tags shift in real time as you assign rooms on the right." },
    4: { eyebrow: "House builder", title: "Invites take flight", body: "Email links queue up for each member you've added." },
    5: { eyebrow: "Proofreader", title: `${houseName || "Your house"}, in miniature`, body: "A quiet final look before anyone moves in." },
    6: { eyebrow: "Proofreader", title: "Choose who greets the door", body: "The character lives in the doorway, welcoming members home." },
  };
  const cap = captions[step];

  return (
    <section className="relative min-h-0 overflow-hidden rounded-[24px] story-border">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `linear-gradient(to bottom, color-mix(in oklab, var(--canvas) 12%, transparent), color-mix(in oklab, var(--canvas) 62%, transparent)), url(${houseImg})`,
          transform: proofreadMode ? "scale(0.92)" : "scale(1)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(20,17,30,0.55)_100%)]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="max-w-sm rounded-2xl border border-border/60 bg-panel/65 px-4 py-3 backdrop-blur-md">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">{cap.eyebrow}</p>
          <h2 className="mt-1.5 text-xl leading-tight text-foreground sm:text-2xl">{cap.title}</h2>
          <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">{cap.body}</p>
        </div>

        <div className={cn("relative mx-auto w-full flex-1", proofreadMode ? "max-w-[460px]" : "max-w-[780px]")}>
          {step >= 2 &&
            members.map((m, i) => (
              <div
                key={m.id}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur-md",
                  roomCoordinates[m.room] ?? "left-[50%] top-[50%]",
                  i === 0
                    ? "border-primary/70 bg-primary/20 text-foreground"
                    : "border-border/70 bg-panel/75 text-panel-foreground",
                )}
              >
                <span className="block text-[9px] uppercase tracking-[0.2em] text-primary/90">
                  {roomLabels[m.room]}
                </span>
                <span>{m.name || "Unnamed"}</span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function StepFrame({
  eyebrow,
  title,
  helper,
  children,
}: {
  eyebrow: string;
  title: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-border/70 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
        <h2 className="mt-1.5 text-2xl leading-none text-foreground">{title}</h2>
        <p className="mt-1.5 text-sm leading-5 text-muted-foreground">{helper}</p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-5 py-4">{children}</div>
    </>
  );
}

function StepRail({ current }: { current: Step }) {
  return (
    <div className="hidden items-center gap-1.5 md:flex">
      {stepMeta.map((s) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <div
            key={s.id}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : done
                  ? "text-foreground"
                  : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[9px]",
                active
                  ? "bg-primary-foreground/20"
                  : done
                    ? "bg-primary/25 text-primary"
                    : "bg-panel-muted/50",
              )}
            >
              {done ? <Check className="h-2.5 w-2.5" /> : s.index}
            </span>
            <span className="hidden lg:inline">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-panel/60 p-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-primary">{title}</p>
      <p className="mt-1.5 text-xl leading-none text-foreground">{value}</p>
    </div>
  );
}
