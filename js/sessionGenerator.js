import { scalesLibrary } from "./practiceLibrary.js";

export function generateSession(level, focus) {

  //Templates por focus
  const focusTemplates = {
    chords: [
      { name: "Warm-up", minutes: 5, details: "Finger stretching + chromatic exercise" },
      { name: "Focus block", minutes: 10, details: "Practice chord changes smoothly" },
      { name: "Song practice", minutes: 15, details: "Apply chords in a simple song" }
    ],
    scales: [
      { name: "Warm-up", minutes: 5, details: "Basic finger independence exercise" },
      { name: "Focus block", minutes: 10, details: "Scale pattern practice with technique" },
      { name: "Application", minutes: 15, details: "Use scales in improvisation" }
    ],
    songs: [
      { name: "Warm-up", minutes: 5, details: "Review chord shapes used in the song" },
      { name: "Focus block", minutes: 10, details: "Mini repertoire routine" },
      { name: "Performance", minutes: 15, details: "Play the song start to finish" }
    ]
  };

  //Elegir pasos base según focus
  const baseSteps = focusTemplates[focus] ?? focusTemplates.chords;
  // Add scale recommendations only when focus === "scales"
  if (focus === "scales") {
    const picks = (scalesLibrary[level] ?? scalesLibrary.beginner).slice(0, 2);

    const focusStep = baseSteps.find((s) => s.name === "Focus block");
    if (focusStep) {
      focusStep.items = picks;
    }
  }


  //DEVOLVER la sesión 
  return {
    title: "Today's Practice Session",
    level,
    focus,
    createdAt: new Date().toISOString(),
    steps: baseSteps
  };
}
