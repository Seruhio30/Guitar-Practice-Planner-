import { scalesLibrary } from "./practiceLibrary.js";

export function generateSession(level, focus) {

  // Ajustes por nivel 
  const levelAdjustments = {
    beginner: {
      minuteModifier: -2,
      tempo: "60–80 BPM",
      note: "Keep it slow and clean."
    },
    intermediate: {
      minuteModifier: 0,
      tempo: "75–95 BPM",
      note: "Focus on consistency."
    },
    advanced: {
      minuteModifier: +3,
      tempo: "90–120 BPM",
      note: "Push speed and accuracy."
    }
  };

  const adj = levelAdjustments[level] ?? levelAdjustments.beginner;

  //Templates por focus
  const focusTemplates = {
    chords: [
      {
        name: "Warm-up",
        minutes: 5,
        details: "Finger stretching + chromatic exercise",
        items: [
          { name: "Chromatic 1-2-3-4", reps: "2x", tips: "Slow and clean fretting" },
          { name: "Spider exercise", reps: "1x", tips: "Keep fingers close to the fretboard" }
        ]
      },
      {
        name: "Focus block",
        minutes: 10,
        details: "Practice chord changes smoothly",
        items: [
          { name: "G → C → D", reps: "10 changes", tempo: "60 BPM", tips: "No pauses between chords" },
          { name: "Am → F → C → G", reps: "6 rounds", tempo: "55–70 BPM", tips: "Strum lightly, focus on timing" }
        ]
      },
      {
        name: "Song practice",
        minutes: 15,
        details: "Apply chords in a simple song",
        items: [
          { name: "Strumming pattern", pattern: "Down Down Up Up Down Up", tips: "Keep wrist relaxed" },
          { name: "Play sections", reps: "Verse 2x, Chorus 2x", tips: "Slow first, then speed up" }
        ]
      }
    ],

    scales: [
      { name: "Warm-up", minutes: 5, details: "Basic finger independence exercise" },
      { name: "Focus block", minutes: 10, details: "Scale pattern practice with technique" },
      { name: "Application", minutes: 15, details: "Use scales in improvisation" }
    ],

    songs: [
      {
        name: "Warm-up",
        minutes: 5,
        details: "Review chord shapes used in the song",
        items: [
          { name: "Chord review", list: "G, D, Em, C", tips: "Check finger placement and clean sound" },
          { name: "Slow strumming", reps: "1 min", tips: "Count 1-2-3-4 with metronome" }
        ]
      },
      {
        name: "Focus block",
        minutes: 10,
        details: "Mini repertoire routine",
        items: [
          { name: "Chord transitions", reps: "8 changes per pair", tips: "Move fingers together if possible" },
          { name: "Rhythm practice", pattern: "Down Down Up Up Down Up", tempo: "60–80 BPM" }
        ]
      },
      {
        name: "Performance",
        minutes: 15,
        details: "Play the song start to finish",
        items: [
          { name: "Play-through", reps: "1x", tips: "Don’t stop—keep time even with mistakes" },
          { name: "Fix 1 weak spot", reps: "3x", tips: "Loop only the hard section" }
        ]
      }
    ],
  };

  //Elegir pasos base según focus 
  const baseSteps = structuredClone
    ? structuredClone(focusTemplates[focus] ?? focusTemplates.chords)
    : JSON.parse(JSON.stringify(focusTemplates[focus] ?? focusTemplates.chords));

  //Add scale recommendations only when focus === "scales"
  if (focus === "scales") {
    const picks = (scalesLibrary[level] ?? scalesLibrary.beginner).slice(0, 2);
    const focusStep = baseSteps.find((s) => s.name === "Focus block");
    if (focusStep) {
      focusStep.items = picks;
    }
  }

  //Aplicar ajustes por nivel a steps + items
  const adjustedSteps = baseSteps.map((step) => {
    const newStep = {
      ...step,
      minutes: Math.max(1, (step.minutes ?? 0) + adj.minuteModifier),
    };

    if (Array.isArray(step.items)) {
      newStep.items = step.items.map((item) => ({
        ...item,
        // si ya tiene tempo, lo dejamos; si no, ponemos el del nivel
        tempo: item.tempo ?? adj.tempo,
        // combinamos tips existentes con nota del nivel
        tips: item.tips ? `${item.tips} • ${adj.note}` : adj.note,
      }));
    }

    return newStep;
  });

  //DEVOLVER la sesión
  return {
    title: "Today's Practice Session",
    level,
    focus,
    createdAt: new Date().toISOString(),
    steps: adjustedSteps
  };
}
