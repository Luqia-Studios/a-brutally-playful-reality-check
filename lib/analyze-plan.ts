import { APP_NAME } from "@/lib/brand";

export const PLAN_SESSION_KEY = "delusion-meter:plan";
export const MIN_PLAN_LENGTH = 20;
export const MAX_PLAN_LENGTH = 280;

export const SAMPLE_INPUTS = [
  "Lascio tutto e apro un bar in Portogallo.",
  "Le riscrivo dopo sei mesi come se niente fosse.",
  "Compro un van e parto senza piano.",
  "Mi licenzio e apro uno studio creativo senza clienti."
];

export type AnalysisResult = {
  piano: string;
  score: number;
  categoria: string;
  verdict: string;
  sintesi: string;
  fraseFinale: string;
  tratti: string[];
  indicatori: {
    realismo: number;
    impulsivita: number;
    dannoEconomico: number;
    mainCharacterEnergy: number;
  };
  shareText: string;
};

type SignalKey = "realismo" | "impulsivita" | "emotivo" | "economico" | "pratico" | "cinema";

const REALISM_WORDS = [
  "piano",
  "budget",
  "ricerca",
  "test",
  "prima",
  "graduale",
  "gradualmente",
  "part time",
  "risparmi",
  "risparmio",
  "clienti",
  "cliente",
  "mercato",
  "validare",
  "timeline",
  "backup"
];

const IMPULSIVE_WORDS = [
  "lascio tutto",
  "mollo tutto",
  "subito",
  "domani",
  "parto",
  "one way",
  "non ci penso",
  "all in",
  "poi si vede",
  "senza pensarci",
  "tanto",
  "adesso"
];

const EMOTIONAL_WORDS = [
  "le riscrivo",
  "gli riscrivo",
  "le scrivo",
  "gli scrivo",
  "ex",
  "mi manca",
  "nostalgia",
  "amore",
  "cuore",
  "dopo sei mesi",
  "dopo 6 mesi",
  "dopo otto mesi",
  "dopo 8 mesi",
  "dimostrare",
  "vendetta"
];

const FINANCIAL_WORDS = [
  "compro",
  "bar",
  "van",
  "moto",
  "macchina",
  "auto",
  "studio",
  "attivita",
  "azienda",
  "locale",
  "portogallo",
  "giro del mondo",
  "prestito",
  "affitto",
  "investo"
];

const PRACTICAL_RISK_WORDS = [
  "senza piano",
  "senza clienti",
  "senza soldi",
  "non ho soldi",
  "zero esperienza",
  "senza esperienza",
  "nessun cliente",
  "senza rete",
  "senza contatti",
  "non so come",
  "vediamo",
  "improvviso"
];

const CINEMATIC_WORDS = [
  "portogallo",
  "giro del mondo",
  "van",
  "sparisco",
  "bar",
  "studio creativo",
  "mi licenzio",
  "lascio tutto",
  "parto",
  "cambio vita",
  "reset"
];

const TRAIT_POOLS: Record<string, string[]> = {
  grounded: ["lucido", "composto", "concreto", "misurato"],
  impulsivita: ["impulsivo", "affrettato", "scoperto", "sbilanciato"],
  emotivo: ["romantico", "esposto", "nostalgico", "sentimentale"],
  economico: ["sottocapitalizzato", "costoso", "fragile", "scoperto"],
  pratico: ["confuso", "teorico", "fragile", "mal supportato"],
  cinema: ["cinematico", "teatrale", "visionario", "ostinato"]
};

const CATEGORY_LABELS = [
  { max: 20, label: "Fin troppo lucido" },
  { max: 40, label: "Ambizioso ma plausibile" },
  { max: 60, label: "Instabile ma difendibile" },
  { max: 80, label: "Delirante con metodo" },
  { max: 100, label: "Iconicamente delirante" }
];

const VERDICTS = {
  low: [
    "Fin troppo lucido",
    "Quasi responsabile",
    "Poco cinema, molta struttura",
    "Sorprendentemente solido"
  ],
  mid: [
    "Ambizioso ma plausibile",
    "Rischioso ma difendibile",
    "Visione forte, piedi ancora a terra",
    "Coraggioso, non sconsiderato"
  ],
  unstable: {
    default: [
      "Instabile ma difendibile",
      "Molto coraggio. Poco piano.",
      "Piu slancio che sistema",
      "Non impossibile. Solo mal supportato."
    ],
    emotivo: ["Emotivamente esposto", "Molta intenzione, poco tempismo", "Più nostalgia che strategia"],
    economico: ["Rischioso e costoso", "Copertura debole, entusiasmo forte", "Più acquisto che piano"],
    cinema: ["Piu cinema che strategia", "Visione forte, struttura debole", "Scenico, ma scoperto"]
  },
  high: {
    default: [
      "Delirante con metodo",
      "Bellissimo, ma poco realistico",
      "Visione forte, struttura debole",
      "Convinto. I fatti un po' meno."
    ],
    emotivo: ["Emotivamente finanziato", "Nostalgia con ottima autostima", "Sentimenti sopra logistica"],
    economico: ["Sottocapitalizzato con stile", "Più fascino che copertura", "Entusiasmo ad alto costo"],
    cinema: ["Molto cinema, poca struttura", "Delirante con fascino", "Main character, nessuna rete"]
  },
  iconic: {
    default: [
      "Iconicamente delirante",
      "Romantico, costoso, mal sostenuto",
      "Magnificamente scoperto",
      "Più leggenda che piano"
    ],
    emotivo: ["Delirio sentimentale di fascia alta", "Cuore in overdrive, logistica assente", "Romanticamente instabile"],
    economico: ["Economicamente coraggioso in modo sbagliato", "Molto sogno, poca cassa", "Elegante, ma non coperto"],
    cinema: ["Delirante con fascino", "Prestigio narrativo, supporto pratico nullo", "Cinema puro, produzione assente"]
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function countHits(text: string, patterns: string[]) {
  return patterns.reduce((total, pattern) => total + Number(text.includes(pattern)), 0);
}

function hasAny(text: string, patterns: string[]) {
  return patterns.some((pattern) => text.includes(pattern));
}

function hashText(text: string) {
  let hash = 0;

  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0;
  }

  return Math.abs(hash);
}

function pickFrom<T>(values: T[], seed: number, offset = 0) {
  return values[(seed + offset) % values.length];
}

function categoriaPerScore(score: number) {
  return CATEGORY_LABELS.find((item) => score <= item.max)?.label ?? "Iconicamente delirante";
}

function leadingSignal(values: Array<{ key: SignalKey; value: number }>) {
  return values.slice().sort((left, right) => right.value - left.value)[0]?.key ?? "pratico";
}

function verdictPerScore(score: number, signal: SignalKey, seed: number) {
  if (score <= 20) {
    return pickFrom(VERDICTS.low, seed);
  }

  if (score <= 40) {
    return pickFrom(VERDICTS.mid, seed);
  }

  if (score <= 60) {
    if (signal === "emotivo") {
      return pickFrom(VERDICTS.unstable.emotivo, seed);
    }

    if (signal === "economico") {
      return pickFrom(VERDICTS.unstable.economico, seed);
    }

    if (signal === "cinema" || signal === "pratico") {
      return pickFrom(VERDICTS.unstable.cinema, seed);
    }

    return pickFrom(VERDICTS.unstable.default, seed);
  }

  if (score <= 80) {
    if (signal === "emotivo") {
      return pickFrom(VERDICTS.high.emotivo, seed);
    }

    if (signal === "economico") {
      return pickFrom(VERDICTS.high.economico, seed);
    }

    if (signal === "cinema" || signal === "pratico") {
      return pickFrom(VERDICTS.high.cinema, seed);
    }

    return pickFrom(VERDICTS.high.default, seed);
  }

  if (signal === "emotivo") {
    return pickFrom(VERDICTS.iconic.emotivo, seed);
  }

  if (signal === "economico") {
    return pickFrom(VERDICTS.iconic.economico, seed);
  }

  if (signal === "cinema" || signal === "pratico") {
    return pickFrom(VERDICTS.iconic.cinema, seed);
  }

  return pickFrom(VERDICTS.iconic.default, seed);
}

function uniqueTrait(pool: string[], used: Set<string>, seed: number, shift: number) {
  for (let index = 0; index < pool.length; index += 1) {
    const candidate = pool[(seed + shift + index) % pool.length];

    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
  }

  return pool[0];
}

function buildTraits(
  realismo: number,
  orderedSignals: SignalKey[],
  seed: number
) {
  const used = new Set<string>();
  const traits: string[] = [];
  const groundedPool = realismo >= 58 ? TRAIT_POOLS.grounded : TRAIT_POOLS.pratico;

  traits.push(uniqueTrait(groundedPool, used, seed, 0));

  for (let index = 0; index < orderedSignals.length && traits.length < 3; index += 1) {
    const signal = orderedSignals[index];
    const pool = TRAIT_POOLS[signal];

    if (pool) {
      traits.push(uniqueTrait(pool, used, seed, index + 1));
    }
  }

  return traits.slice(0, 3);
}

function buildSintesi({
  score,
  realismo,
  rischioPratico,
  esposizioneEmotiva,
  dannoEconomico,
  mainCharacterEnergy,
  noMoney,
  noPlan,
  noClients,
  writeToEx,
  moveAbroad,
  seed
}: {
  score: number;
  realismo: number;
  rischioPratico: number;
  esposizioneEmotiva: number;
  dannoEconomico: number;
  mainCharacterEnergy: number;
  noMoney: boolean;
  noPlan: boolean;
  noClients: boolean;
  writeToEx: boolean;
  moveAbroad: boolean;
  seed: number;
}) {
  if (score <= 20) {
    return pickFrom(
      [
        "Più piano che fantasia. Meno interessante, ma molto più solido.",
        "Qui il delirio è basso. Hai fatto entrare anche la realtà nella stanza.",
        "L'idea respira bene perché non sta ignorando i dettagli."
      ],
      seed
    );
  }

  if (writeToEx) {
    return pickFrom(
      [
        "Il piano si regge soprattutto su nostalgia, coraggio tardivo e memoria selettiva.",
        "C'è più carica emotiva che struttura. E si vede subito.",
        "L'intenzione è chiara. Il contesto molto meno favorevole."
      ],
      seed
    );
  }

  if (noClients) {
    return pickFrom(
      [
        "L'idea ha identità, ma il lato commerciale è ancora ornamentale.",
        "La visione è presente. La domanda reale non si è ancora presentata.",
        "Hai già il tono del brand. Ti manca la parte in cui qualcuno paga."
      ],
      seed
    );
  }

  if (noMoney) {
    return pickFrom(
      [
        "Il fascino c'è, ma il supporto economico al momento è più poetico che concreto.",
        "Sembra una decisione con energia. Non ancora con copertura.",
        "Il problema non è il sogno. È chi deve finanziarlo."
      ],
      seed
    );
  }

  if (noPlan && moveAbroad) {
    return pickFrom(
      [
        "La fuga ha una sua eleganza. La logistica molto meno.",
        "La visione è forte, ma si appoggia ancora a un vuoto operativo piuttosto serio.",
        "Si sente il desiderio di cambio vita. Manca quasi tutta l'infrastruttura."
      ],
      seed
    );
  }

  if (esposizioneEmotiva >= 72 && rischioPratico >= 62) {
    return pickFrom(
      [
        "Molta convinzione personale, poca protezione pratica.",
        "L'idea ha intensità, ma al momento si regge più sullo slancio che sulle basi.",
        "La parte emotiva è arrivata puntuale. Il resto sta ancora cercando parcheggio."
      ],
      seed
    );
  }

  if (dannoEconomico >= 70 && realismo <= 46) {
    return pickFrom(
      [
        "L'energia è alta. La sostenibilità economica decisamente meno.",
        "Sembra un piano costoso con poche difese laterali.",
        "Hai preso una decisione che chiede solidità. Per ora hai soprattutto entusiasmo."
      ],
      seed
    );
  }

  if (mainCharacterEnergy >= 78 && rischioPratico >= 65) {
    return pickFrom(
      [
        "C'è una forte narrativa personale. Il supporto pratico non ha ancora firmato.",
        "Molto carisma, poca infrastruttura.",
        "Il piano ha presenza scenica. La parte operativa arriva dopo, forse."
      ],
      seed
    );
  }

  return pickFrom(
    [
      "Il piano ha energia, ma al momento si regge più sulla convinzione che sulla logistica.",
      "La visione c'è. È la struttura a sembrare ancora opzionale.",
      "Non manca il coraggio. Manca la parte che lo rende tranquillo."
    ],
    seed
  );
}

function buildFinalLine({
  score,
  realismo,
  rischioPratico,
  noMoney,
  noPlan,
  noClients,
  writeToEx,
  seed
}: {
  score: number;
  realismo: number;
  rischioPratico: number;
  noMoney: boolean;
  noPlan: boolean;
  noClients: boolean;
  writeToEx: boolean;
  seed: number;
}) {
  if (writeToEx) {
    return pickFrom(
      [
        "Il tempismo non è dalla tua. La fantasia sì.",
        "L'idea è semplice. Le conseguenze quasi mai lo sono.",
        "Più ritorno emotivo che strategia relazionale."
      ],
      seed
    );
  }

  if (noClients) {
    return pickFrom(
      [
        "La visione è viva. Il piano commerciale non ancora.",
        "Hai il manifesto. Ti manca il mercato.",
        "Il brand esiste già. Il business deve ancora presentarsi."
      ],
      seed
    );
  }

  if (noMoney) {
    return pickFrom(
      [
        "Molto fascino. Poco margine.",
        "Il sogno è in forma. Il budget meno.",
        "Hai una visione. Ti manca il capitale emotivamente neutro."
      ],
      seed
    );
  }

  if (noPlan) {
    return pickFrom(
      [
        "Il problema non è il sogno. È l'infrastruttura.",
        "Coraggio alto. Piano operativo in ritardo.",
        "Il movimento c'è. La direzione è ancora decorativa."
      ],
      seed
    );
  }

  if (score <= 20 || realismo >= 70) {
    return pickFrom(
      [
        "Non è delirio. È preparazione con un po' di ambizione.",
        "Hai tolto abbastanza caos da rendere il piano credibile.",
        "Poco glamour, molta tenuta."
      ],
      seed
    );
  }

  if (rischioPratico >= 65) {
    return pickFrom(
      [
        "Non è impossibile. È solo scarsamente preparato.",
        "Hai una visione. Ti manca quasi tutto il resto.",
        "Sei convinto. I fatti un po' meno."
      ],
      seed
    );
  }

  return pickFrom(
    [
      "Il sogno è vivo. Il piano operativo non ancora.",
      "La parte bella c'è. La parte solida è in ritardo.",
      "Più stile che copertura, ma con ottima presenza."
    ],
    seed
  );
}

export function analyzePlan(input: string): AnalysisResult {
  const piano = input.trim();
  const normalized = normalizeText(piano);
  const seed = hashText(normalized);
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const punctuationCount = (piano.match(/[!?]/g) ?? []).length;
  const clauseCount = piano.split(/[,.!?;:]+/).filter((chunk) => chunk.trim().length > 0).length;
  const multiStepCount = Math.max(0, clauseCount - 1);

  const realismHits = countHits(normalized, REALISM_WORDS);
  const impulsiveHits = countHits(normalized, IMPULSIVE_WORDS);
  const emotionalHits = countHits(normalized, EMOTIONAL_WORDS);
  const financialHits = countHits(normalized, FINANCIAL_WORDS);
  const practicalHits = countHits(normalized, PRACTICAL_RISK_WORDS);
  const cinematicHits = countHits(normalized, CINEMATIC_WORDS);

  const noMoney = hasAny(normalized, ["non ho soldi", "senza soldi", "senza budget"]);
  const noPlan = hasAny(normalized, ["senza piano", "nessun piano", "poi si vede"]);
  const noClients = hasAny(normalized, ["senza clienti", "nessun cliente"]);
  const writeToEx = hasAny(normalized, ["le riscrivo", "gli riscrivo", "le scrivo", "gli scrivo", " ex"]);
  const moveAbroad = hasAny(normalized, ["portogallo", "giro del mondo", "parto", "cambio vita"]);

  const realismo = clamp(
    62 +
      realismHits * 12 -
      impulsiveHits * 7 -
      emotionalHits * 5 -
      practicalHits * 12 -
      financialHits * 2 -
      multiStepCount * 4 -
      (noPlan ? 14 : 0) -
      (noClients ? 12 : 0) -
      (noMoney ? 14 : 0) +
      (wordCount >= 18 ? 5 : -4) +
      (wordCount >= 28 ? 3 : 0),
    6,
    96
  );

  const impulsivita = clamp(
    18 +
      impulsiveHits * 18 +
      punctuationCount * 5 +
      multiStepCount * 5 +
      (normalized.includes("domani") ? 10 : 0) +
      (normalized.includes("subito") ? 8 : 0) -
      realismHits * 8,
    6,
    98
  );

  const esposizioneEmotiva = clamp(
    10 +
      emotionalHits * 20 +
      punctuationCount * 3 +
      (writeToEx ? 16 : 0),
    4,
    98
  );

  const rischioPratico = clamp(
    20 +
      practicalHits * 18 +
      cinematicHits * 4 +
      multiStepCount * 4 +
      (noPlan ? 20 : 0) +
      (noClients ? 18 : 0) +
      (noMoney ? 14 : 0) -
      realismHits * 10,
    8,
    98
  );

  const dannoEconomico = clamp(
    14 +
      financialHits * 16 +
      practicalHits * 5 +
      (noMoney ? 22 : 0) +
      (moveAbroad ? 8 : 0) -
      realismHits * 6,
    6,
    98
  );

  const mainCharacterEnergy = clamp(
    16 +
      cinematicHits * 20 +
      impulsivita * 0.2 +
      esposizioneEmotiva * 0.16 +
      (moveAbroad ? 8 : 0),
    8,
    100
  );

  const score = clamp(
    (100 - realismo) * 0.34 +
      impulsivita * 0.22 +
      esposizioneEmotiva * 0.12 +
      rischioPratico * 0.18 +
      dannoEconomico * 0.14 +
      Math.max(0, mainCharacterEnergy - 65) * 0.05,
    4,
    99
  );

  const signals = [
    { key: "realismo" as SignalKey, value: 100 - realismo },
    { key: "impulsivita" as SignalKey, value: impulsivita },
    { key: "emotivo" as SignalKey, value: esposizioneEmotiva },
    { key: "economico" as SignalKey, value: dannoEconomico },
    { key: "pratico" as SignalKey, value: rischioPratico },
    { key: "cinema" as SignalKey, value: mainCharacterEnergy }
  ];

  const orderedSignals = signals
    .slice()
    .sort((left, right) => right.value - left.value)
    .map((item) => item.key);

  const verdict = verdictPerScore(score, leadingSignal(signals), seed);
  const categoria = categoriaPerScore(score);
  const sintesi = buildSintesi({
    score,
    realismo,
    rischioPratico,
    esposizioneEmotiva,
    dannoEconomico,
    mainCharacterEnergy,
    noMoney,
    noPlan,
    noClients,
    writeToEx,
    moveAbroad,
    seed
  });
  const fraseFinale = buildFinalLine({
    score,
    realismo,
    rischioPratico,
    noMoney,
    noPlan,
    noClients,
    writeToEx,
    seed
  });
  const tratti = buildTraits(realismo, orderedSignals, seed);
  const shareText = `Il mio piano ha preso ${score}/100 su ${APP_NAME}. ${verdict}.`;

  return {
    piano,
    score,
    categoria,
    verdict,
    sintesi,
    fraseFinale,
    tratti,
    indicatori: {
      realismo,
      impulsivita,
      dannoEconomico,
      mainCharacterEnergy
    },
    shareText
  };
}
