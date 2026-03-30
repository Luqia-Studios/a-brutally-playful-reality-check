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
type ContextKey = "love" | "career" | "business" | "travel" | "money" | "purchase" | "life";
type BandKey = "grounded" | "plausible" | "unstable" | "delusional" | "iconic";
type SpecialScenario =
  | "writeToEx"
  | "quitNoClients"
  | "escapeNoPlan"
  | "buyNoMoney"
  | "businessNoClients"
  | null;

type PlanFlags = {
  noMoney: boolean;
  noPlan: boolean;
  noClients: boolean;
  noExperience: boolean;
  writeToEx: boolean;
  moveAbroad: boolean;
  quitJob: boolean;
  buyingThing: boolean;
  openBusiness: boolean;
  dramaticReset: boolean;
  hasBudget: boolean;
  hasTimeline: boolean;
  hasSafetyNet: boolean;
  hasSupport: boolean;
  hasClients: boolean;
  immediate: boolean;
};

type VerdictLibrary = Record<BandKey, { default: string[] } & Partial<Record<ContextKey, string[]>>>;

const PLANNING_WORDS = [
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
  "timeline",
  "mercato",
  "validare",
  "validazione",
  "preordini",
  "tabella",
  "step",
  "conti",
  "margine",
  "preventivo",
  "provo",
  "testare",
  "check"
];

const SAFETY_WORDS = [
  "backup",
  "piano b",
  "rete",
  "contatti",
  "con calma",
  "intanto",
  "mantengo il lavoro",
  "tengo il lavoro",
  "senza mollare tutto",
  "prima testo",
  "prima provo",
  "riserva",
  "uscita",
  "uscite",
  "entrate"
];

const TIMELINE_WORDS = [
  "entro",
  "fra",
  "tra",
  "settimana",
  "settimane",
  "mese",
  "mesi",
  "anno",
  "anni",
  "quest'anno",
  "nel frattempo"
];

const IMPULSIVE_WORDS = [
  "lascio tutto",
  "mollo tutto",
  "subito",
  "domani",
  "adesso",
  "parto",
  "one way",
  "all in",
  "non ci penso",
  "senza pensarci",
  "poi si vede",
  "tanto",
  "appena posso",
  "fanculo"
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
  "vendetta",
  "torno da lei",
  "torno da lui",
  "mi riprendo"
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
  "investo",
  "spendo",
  "rata",
  "mutuo",
  "capitale"
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
  "improvviso",
  "a caso",
  "senza sapere",
  "sulla fiducia"
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
  "reset",
  "ricomincio da zero",
  "nuova vita"
];

const EXPERIENCE_GAP_WORDS = [
  "zero esperienza",
  "senza esperienza",
  "non l'ho mai fatto",
  "non l'ho mai fatta",
  "non so farlo",
  "non so farla"
];

const CLIENT_POSITIVE_WORDS = ["clienti", "cliente", "richieste", "preordini", "domanda", "lead"];

const CONTEXT_PATTERNS: Record<ContextKey, string[]> = {
  love: ["ex", "le scrivo", "gli scrivo", "le riscrivo", "gli riscrivo", "appuntamento", "relazione"],
  career: ["lavoro", "ufficio", "carriera", "mi licenzio", "freelance", "colloquio"],
  business: ["bar", "studio", "agenzia", "negozio", "startup", "attivita", "azienda", "clienti"],
  travel: ["portogallo", "van", "parto", "viaggio", "mondo", "trasferisco", "volo"],
  money: ["soldi", "budget", "prestito", "debito", "capitale", "investo", "rata"],
  purchase: ["compro", "moto", "macchina", "auto", "casa", "van", "acquisto"],
  life: ["reset", "cambio vita", "sparisco", "ricomincio", "nuova vita", "mollo tutto"]
};

const CONTEXT_TRAITS: Record<ContextKey, string[]> = {
  love: ["nostalgico", "tardivo", "romantico", "esposto"],
  career: ["ambizioso", "stanco", "scoperto", "determinato"],
  business: ["visionario", "sottocapitalizzato", "ostinato", "teatrale"],
  travel: ["cinematico", "irrequieto", "romantico", "leggero"],
  money: ["costoso", "fragile", "ottimista", "scoperto"],
  purchase: ["impulsivo", "viziato", "convinto", "ottimista"],
  life: ["teatrale", "instabile", "convinto", "irrequieto"]
};

const TRAIT_POOLS: Record<SignalKey | "grounded", string[]> = {
  grounded: ["lucido", "misurato", "composto", "concreto"],
  realismo: ["lucido", "strutturato", "ragionato", "solido"],
  impulsivita: ["impulsivo", "affrettato", "sbilanciato", "scoperto"],
  emotivo: ["esposto", "sentimentale", "nostalgico", "romantico"],
  economico: ["costoso", "sottocapitalizzato", "fragile", "mal coperto"],
  pratico: ["confuso", "teorico", "instabile", "mal supportato"],
  cinema: ["cinematico", "teatrale", "visionario", "ostinato"]
};

const CATEGORY_LABELS = [
  { max: 20, label: "Fin troppo lucido" },
  { max: 40, label: "Ambizioso ma plausibile" },
  { max: 60, label: "Instabile ma difendibile" },
  { max: 80, label: "Delirante con metodo" },
  { max: 100, label: "Iconicamente delirante" }
];

const VERDICT_LIBRARY: VerdictLibrary = {
  grounded: {
    default: [
      "Sorprendentemente ragionato",
      "Poco delirio, molta struttura",
      "Quasi adulto",
      "Insolitamente solido"
    ],
    love: ["Sentimentale con freni funzionanti", "Romantico ma non scomposto"],
    career: ["Ambizione con ancora qualche freno", "Cambio di rotta abbastanza lucido"],
    business: ["Visione con base minima credibile", "Brand first, ma con appigli veri"],
    travel: ["Fuga moderata, logistica presente", "Cinema ridotto, piano aumentato"],
    purchase: ["Acquisto quasi giustificabile", "Impulso con un minimo di conti"],
    life: ["Reset con qualche cintura di sicurezza", "Crisi esistenziale insolitamente ordinata"]
  },
  plausible: {
    default: [
      "Ambizioso ma plausibile",
      "Rischioso con criterio",
      "Coraggioso, non sconsiderato",
      "Visione forte, piedi ancora a terra"
    ],
    love: ["Emotivo ma non completamente cieco", "Romantico, ma con un minimo di tempismo"],
    career: ["Svolta seria con qualche buco", "Cambio professionale ancora difendibile"],
    business: ["Idea viva, struttura appena sufficiente", "Business acerbo ma non inventato"],
    travel: ["Fuga ben narrata, logistica quasi presente", "Partenza ambiziosa, ancora plausibile"],
    money: ["Rischio economico sotto osservazione", "Finanziariamente teso ma non assurdo"],
    purchase: ["Acquisto emotivo ma ancora spiegabile", "Spesa discutibile, non folle"],
    life: ["Cambio vita con una bozza di mappa", "Reset con qualche coordinata"]
  },
  unstable: {
    default: [
      "Instabile ma difendibile",
      "Molto coraggio, poco sistema",
      "Piu slancio che tenuta",
      "Non impossibile, solo fragile"
    ],
    love: ["Nostalgia con scarsa copertura", "Tempismo debole, sentimento fortissimo"],
    career: ["Cambiamento esposto", "Ambizione alta, rete bassa"],
    business: ["Business plan in bozza emotiva", "Molta identita, poca ossatura"],
    travel: ["Fuga elegante, logistica intermittente", "Molto orizzonte, poca terra sotto"],
    money: ["Costoso gia in teoria", "Ottimismo finanziario poco protetto"],
    purchase: ["Acquisto impulsivo con storytelling", "Desiderio alto, giustificazione media"],
    life: ["Reset con forte trailer, debole secondo atto", "Molto cambio vita, poca continuita"]
  },
  delusional: {
    default: [
      "Delirante con metodo",
      "Bellissimo, ma poco realistico",
      "Molta narrativa, poca protezione",
      "Convinto. I fatti un po meno."
    ],
    love: ["Emotivamente finanziato", "Grande fiducia, scarso contesto", "Sentimenti sopra logistica"],
    career: ["Svolta professionale senza airbag", "Molta uscita, poco atterraggio"],
    business: ["Visione forte, struttura debole", "Brand energy, business fragile"],
    travel: ["Piu cinema che logistica", "Fuga con ottima fotografia, pessima preparazione"],
    money: ["Entusiasmo ad alto costo", "Poco margine, ottimo coraggio"],
    purchase: ["Checkout romantico, copertura assente", "Acquisto molto convinto, molto scoperto"],
    life: ["Reset personale mal sostenuto", "Nuova vita, vecchia logistica"]
  },
  iconic: {
    default: [
      "Iconicamente delirante",
      "Magnificamente mal sostenuto",
      "Prestigio narrativo, copertura minima",
      "Piu leggenda che piano"
    ],
    love: ["Delirio sentimentale di fascia alta", "Romanticamente instabile", "Cuore in overdrive, logistica assente"],
    career: ["Licenziamento con ambizione cinematica", "Svolta epica, protezione nulla"],
    business: ["Impresa con ottimo poster e poca sostanza", "Startup spirituale, struttura assente"],
    travel: ["Cinema puro, produzione assente", "Fuga da poster con logistica decorativa"],
    money: ["Molto sogno, poca cassa", "Economicamente coraggioso nel modo sbagliato"],
    purchase: ["Acquisto leggendario, copertura simbolica", "Troppo caro per essere un'intuizione"],
    life: ["Cambio vita da trailer ufficiale", "Reset totale con supporto immaginario"]
  }
};

const SPECIAL_VERDICTS: Record<Exclude<SpecialScenario, null>, Record<BandKey, string[]>> = {
  writeToEx: {
    grounded: ["Sorprendentemente composto per essere una pessima idea"],
    plausible: ["Romantico ma ancora gestibile", "Ritorno emotivo con qualche freno"],
    unstable: ["Tempismo sentimentale discutibile", "Nostalgia con ambizioni operative"],
    delusional: ["Emotivamente finanziato", "Riapertura di lore non autorizzata"],
    iconic: ["Delirio sentimentale premium", "Sequel non richiesto ma prodotto benissimo"]
  },
  quitNoClients: {
    grounded: ["Hai almeno una mezza rete sotto"],
    plausible: ["Svolta scoperta ma ancora difendibile"],
    unstable: ["Molto coraggio, zero fatturato", "Dimissioni con fede, non con clienti"],
    delusional: ["Studio creativo con pubblico immaginario", "Licenziamento con ottimo branding interno"],
    iconic: ["Business basato su aura personale", "Impresa mistica a fatturato futuro"]
  },
  escapeNoPlan: {
    grounded: ["Fuga ordinata, evento raro"],
    plausible: ["Partenza romantica, ancora spiegabile"],
    unstable: ["Cambio vita con logistica intermittente", "Biglietto emotivo, piano assente"],
    delusional: ["Molto cinema, poca mappa", "Road movie senza produzione esecutiva"],
    iconic: ["Poster fortissimo, struttura nulla", "Fuga da festival con conti da improvvisazione"]
  },
  buyNoMoney: {
    grounded: ["Desiderio costoso, ancora controllato"],
    plausible: ["Acquisto discutibile ma non devastato"],
    unstable: ["Piu desiderio che copertura", "Conto fragile, entusiasmo robusto"],
    delusional: ["Spesa emotiva ad alta intensita", "Ottimo storytelling, pessimo budget"],
    iconic: ["Checkout mitologico, portafoglio assente", "Acquisto di prestigio a copertura simbolica"]
  },
  businessNoClients: {
    grounded: ["Hai almeno capito che servono clienti"],
    plausible: ["Idea viva, domanda da verificare"],
    unstable: ["Studio senza clienti, ma con molta autostima", "Business in fase di immaginazione assistita"],
    delusional: ["Brand gia acceso, mercato non pervenuto", "Molta identita, zero trazione"],
    iconic: ["Azienda spirituale a fatturato futuro", "Impresa bellissima, domanda opzionale"]
  }
};

const SUMMARY_OPENERS: Record<ContextKey, string[]> = {
  love: [
    "Qui non stai gestendo un piano: stai gestendo un ritorno emotivo.",
    "L'energia di questa idea e sentimentale prima ancora che pratica.",
    "Si sente subito che il motore non e la strategia ma il sentimento."
  ],
  career: [
    "Questa idea nasce da una spinta professionale forte, ma non ancora ben protetta.",
    "Il desiderio di cambiare lavoro e chiaro. Il piano di atterraggio molto meno.",
    "Sembra una svolta seria raccontata con ancora troppo slancio e poca rete."
  ],
  business: [
    "L'intuizione di brand arriva forte. La struttura operativa entra dopo.",
    "Qui c'e visione imprenditoriale, ma ancora in versione trailer.",
    "L'idea si vende bene. E' la sostenibilita a restare piu timida."
  ],
  travel: [
    "La fantasia di fuga e chiarissima. La parte terrestre un po meno.",
    "Questo piano profuma di partenza molto prima che di organizzazione.",
    "L'orizzonte e forte. La logistica sta ancora cercando di raggiungerlo."
  ],
  money: [
    "Il denaro entra in questa storia con piu tensione che serenita.",
    "La parte economica sembra la prima a chiedere spiegazioni.",
    "Qui il rischio finanziario non e un dettaglio: e quasi un personaggio."
  ],
  purchase: [
    "Sembra un acquisto raccontato come un destino.",
    "L'oggetto ha molto fascino, la giustificazione un po meno.",
    "C'e una forte energia da checkout emotivo in tutta la scena."
  ],
  life: [
    "Questa idea suona come un reset personale con ottima colonna sonora.",
    "Piace perche promette una nuova versione di te, non perche sia tranquilla.",
    "Qui la narrativa del cambiamento e piu sviluppata della struttura."
  ]
};

const SUMMARY_TENSIONS: Record<SignalKey, string[]> = {
  realismo: [
    "Almeno una parte del piano ha invitato anche la realta alla riunione.",
    "La differenza la fa il fatto che non stai ignorando del tutto i dettagli.",
    "La base e meno improvvisata di quanto il tono farebbe pensare."
  ],
  impulsivita: [
    "Il problema e che accelera prima di aver capito bene dove atterrare.",
    "La sua fragilita maggiore e la fretta con cui vuole diventare vero.",
    "Sta correndo piu veloce della struttura che dovrebbe sostenerlo."
  ],
  emotivo: [
    "Il motore principale qui e emotivo, non operativo.",
    "La parte sentimentale e molto piu pronta della parte logistica.",
    "C'e piu carica interiore che architettura esterna."
  ],
  economico: [
    "La copertura economica e il primo punto che inizia a tremare.",
    "I numeri sembrano l'unica parte non ancora convinta.",
    "Finanziariamente la tenuta e piu aspirazionale che concreta."
  ],
  pratico: [
    "La parte esecutiva e ancora un cantiere con ottimo tono di voce.",
    "La teoria c'e. E' l'implementazione a essere ancora ornamentale.",
    "Si capisce cosa vuoi fare. Molto meno come dovrebbe stare in piedi."
  ],
  cinema: [
    "La narrativa personale e fortissima. Il supporto reale molto meno.",
    "Ha grande presenza scenica, che non e la stessa cosa di stabilita.",
    "Funziona benissimo come trailer. Meno come piano operativo."
  ]
};

const SUMMARY_ENDINGS: Record<BandKey, string[]> = {
  grounded: [
    "Per questo il delirio resta sorprendentemente basso.",
    "Non e noioso, ma e molto meno scomposto di quanto sembri.",
    "La parte adulta sta ancora vincendo."
  ],
  plausible: [
    "Regge ancora, anche se non senza attrito.",
    "E' una scommessa, ma non ancora una fantasia pura.",
    "Ha dei buchi, non ancora un collasso."
  ],
  unstable: [
    "Non e follia piena, ma i punti di cedimento si vedono gia.",
    "Tiene in piedi il tono, non ancora tutto il resto.",
    "La struttura esiste, ma non abbastanza da rilassare nessuno."
  ],
  delusional: [
    "Al momento convince piu per energia che per tenuta.",
    "Si salva soprattutto perche ha fascino, non perche sia robusto.",
    "E' li che il piano inizia a sembrare piu seducente che solido."
  ],
  iconic: [
    "Ed e proprio questo che lo rende affascinante e pericoloso insieme.",
    "E' spettacolare per le stesse ragioni per cui e mal protetto.",
    "Funziona quasi solo perche l'hai raccontato benissimo."
  ]
};

const FINAL_LINES: Record<ContextKey, string[]> = {
  love: [
    "Il cuore e gia partito. Il resto sta ancora cercando parcheggio.",
    "Il problema non e il messaggio. E' tutto quello che lo circonda.",
    "Molto sentimento. Pochissima copertura."
  ],
  career: [
    "Hai la svolta. Ti manca ancora la rete.",
    "L'uscita e pronta. L'atterraggio meno.",
    "L'ambizione c'e. La protezione arriva dopo."
  ],
  business: [
    "Il brand vive. Il modello operativo attende istruzioni.",
    "Hai una visione. Ti manca la parte che fattura.",
    "La forma c'e. La trazione e ancora in bozza."
  ],
  travel: [
    "Il biglietto mentale c'e. Il piano di terra no.",
    "La fuga ha stile. La logistica non ancora.",
    "L'orizzonte e pronto. Il resto deve ancora vestirsi."
  ],
  money: [
    "Ottimo entusiasmo. Scarsa copertura.",
    "Il sogno e carino. Il cashflow non applaude.",
    "Grande slancio. Piccolo margine."
  ],
  purchase: [
    "L'oggetto ha fascino. Il conto molto meno.",
    "Desiderio alto. Giustificazione fragile.",
    "Lo vuoi tantissimo. Questo non e ancora un piano."
  ],
  life: [
    "Grande scena di apertura. Secondo atto da scrivere.",
    "Molta rinascita narrativa. Poca manutenzione pratica.",
    "Nuova vita, vecchie vulnerabilita."
  ]
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[’]/g, "'");
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

function scoreToBand(score: number): BandKey {
  if (score <= 20) {
    return "grounded";
  }

  if (score <= 40) {
    return "plausible";
  }

  if (score <= 60) {
    return "unstable";
  }

  if (score <= 80) {
    return "delusional";
  }

  return "iconic";
}

function categoriaPerScore(score: number) {
  return CATEGORY_LABELS.find((item) => score <= item.max)?.label ?? "Iconicamente delirante";
}

function leadingSignal(values: Array<{ key: SignalKey; value: number }>) {
  return values.slice().sort((left, right) => right.value - left.value)[0]?.key ?? "pratico";
}

function detectFlags(text: string): PlanFlags {
  const noMoney = hasAny(text, ["non ho soldi", "senza soldi", "senza budget", "soldi non ne ho"]);
  const noPlan = hasAny(text, ["senza piano", "nessun piano", "poi si vede", "senza sapere come"]);
  const noClients = hasAny(text, ["senza clienti", "nessun cliente", "zero clienti"]);
  const noExperience = hasAny(text, EXPERIENCE_GAP_WORDS);
  const writeToEx = hasAny(text, ["le riscrivo", "gli riscrivo", "le scrivo", "gli scrivo", " ex"]);
  const moveAbroad = hasAny(text, ["portogallo", "giro del mondo", "parto", "trasferisco", "cambio paese"]);
  const quitJob = hasAny(text, ["mi licenzio", "lascio il lavoro", "mollo il lavoro", "mollo tutto"]);
  const buyingThing = hasAny(text, ["compro", "mi compro", "moto", "macchina", "auto", "van", "casa"]);
  const openBusiness = hasAny(text, ["apro", "bar", "studio", "agenzia", "locale", "attivita", "azienda"]);
  const dramaticReset = hasAny(text, ["reset", "cambio vita", "sparisco", "ricomincio da zero", "nuova vita"]);
  const hasBudget = hasAny(text, ["budget", "risparmi", "risparmio", "cassa", "margine", "capitale"]);
  const hasTimeline = hasAny(text, TIMELINE_WORDS);
  const hasSafetyNet = hasAny(text, SAFETY_WORDS);
  const hasSupport = hasAny(text, ["partner", "socio", "rete", "contatti", "amico che", "insieme a"]);
  const hasClients = hasAny(text, CLIENT_POSITIVE_WORDS) && !noClients;
  const immediate = hasAny(text, ["subito", "domani", "adesso", "ora", "tra una settimana"]);

  return {
    noMoney,
    noPlan,
    noClients,
    noExperience,
    writeToEx,
    moveAbroad,
    quitJob,
    buyingThing,
    openBusiness,
    dramaticReset,
    hasBudget,
    hasTimeline,
    hasSafetyNet,
    hasSupport,
    hasClients,
    immediate
  };
}

function detectContext(text: string, flags: PlanFlags) {
  const scores: Record<ContextKey, number> = {
    love: countHits(text, CONTEXT_PATTERNS.love),
    career: countHits(text, CONTEXT_PATTERNS.career),
    business: countHits(text, CONTEXT_PATTERNS.business),
    travel: countHits(text, CONTEXT_PATTERNS.travel),
    money: countHits(text, CONTEXT_PATTERNS.money),
    purchase: countHits(text, CONTEXT_PATTERNS.purchase),
    life: countHits(text, CONTEXT_PATTERNS.life)
  };

  if (flags.writeToEx) scores.love += 5;
  if (flags.quitJob) scores.career += 4;
  if (flags.openBusiness) scores.business += 4;
  if (flags.moveAbroad) scores.travel += 5;
  if (flags.buyingThing) scores.purchase += 4;
  if (flags.noMoney) scores.money += 3;
  if (flags.dramaticReset) scores.life += 4;

  return (Object.entries(scores).sort((left, right) => right[1] - left[1])[0]?.[0] as ContextKey) ?? "life";
}

function detectSpecialScenario(flags: PlanFlags): SpecialScenario {
  if (flags.writeToEx) {
    return "writeToEx";
  }

  if (flags.quitJob && flags.noClients) {
    return "quitNoClients";
  }

  if (flags.moveAbroad && flags.noPlan) {
    return "escapeNoPlan";
  }

  if (flags.buyingThing && flags.noMoney) {
    return "buyNoMoney";
  }

  if (flags.openBusiness && flags.noClients) {
    return "businessNoClients";
  }

  return null;
}

function pickContextualValues(
  library: { default: string[] } & Partial<Record<ContextKey, string[]>>,
  context: ContextKey
) {
  return library[context] ?? library.default;
}

function buildVerdict({
  band,
  context,
  scenario,
  dominantSignal,
  seed
}: {
  band: BandKey;
  context: ContextKey;
  scenario: SpecialScenario;
  dominantSignal: SignalKey;
  seed: number;
}) {
  if (scenario) {
    return pickFrom(SPECIAL_VERDICTS[scenario][band], seed);
  }

  const contextValues = pickContextualValues(VERDICT_LIBRARY[band], context);
  const offset = dominantSignal === "cinema" || dominantSignal === "pratico" ? 1 : 0;
  return pickFrom(contextValues, seed, offset);
}

function buildSintesi({
  band,
  context,
  dominantSignal,
  scenario,
  seed
}: {
  band: BandKey;
  context: ContextKey;
  dominantSignal: SignalKey;
  scenario: SpecialScenario;
  seed: number;
}) {
  if (scenario === "writeToEx") {
    return pickFrom(
      [
        "Il piano si regge soprattutto su nostalgia, tempismo retroattivo e fiducia molto creativa.",
        "C'e piu memoria selettiva che strategia, e si sente subito.",
        "L'intenzione e forte. Il contesto favorevole molto meno."
      ],
      seed
    );
  }

  if (scenario === "quitNoClients") {
    return pickFrom(
      [
        "La visione professionale c'e, ma il lato commerciale sta ancora in pre-produzione.",
        "Hai gia il gesto epico. Ti manca la parte in cui qualcuno paga davvero.",
        "L'uscita e chiara. La sostituzione di reddito no."
      ],
      seed
    );
  }

  if (scenario === "escapeNoPlan") {
    return pickFrom(
      [
        "La parte romantica della fuga e impeccabile. La parte pratica e quasi teorica.",
        "Si sente il bisogno di movimento, non ancora una vera infrastruttura di partenza.",
        "Il piano e suggestivo soprattutto perche sta evitando i dettagli piu costosi."
      ],
      seed
    );
  }

  if (scenario === "buyNoMoney") {
    return pickFrom(
      [
        "Qui il desiderio sta parlando molto piu forte del conto corrente.",
        "La logica dell'acquisto e emotivamente chiarissima, economicamente molto meno.",
        "La parte che vuole comprare e pronta. La parte che dovrebbe coprirla no."
      ],
      seed
    );
  }

  if (scenario === "businessNoClients") {
    return pickFrom(
      [
        "Hai gia l'identita del progetto, ma non ancora la prova che qualcuno ne abbia bisogno.",
        "L'idea si presenta bene. La trazione reale resta ancora ipotetica.",
        "E' un business soprattutto nella direzione artistica, per ora."
      ],
      seed
    );
  }

  const opener = pickFrom(SUMMARY_OPENERS[context], seed);
  const tension = pickFrom(SUMMARY_TENSIONS[dominantSignal], seed, 1);
  const ending = pickFrom(SUMMARY_ENDINGS[band], seed, 2);

  return `${opener} ${tension} ${ending}`;
}

function buildFinalLine({
  context,
  scenario,
  band,
  seed
}: {
  context: ContextKey;
  scenario: SpecialScenario;
  band: BandKey;
  seed: number;
}) {
  if (scenario === "writeToEx") {
    return pickFrom(
      [
        "Il cuore e gia in chat. Il buon senso no.",
        "Il messaggio parte facile. Il dopo quasi mai.",
        "Molto coraggio tardivo. Poco vantaggio reale."
      ],
      seed
    );
  }

  if (scenario === "quitNoClients") {
    return pickFrom(
      [
        "Hai il manifesto. Ti manca il fatturato.",
        "Grande identita. Scarsa rete.",
        "La scena e pronta. Il mercato no."
      ],
      seed
    );
  }

  if (scenario === "escapeNoPlan") {
    return pickFrom(
      [
        "Il biglietto mentale c'e. Il resto deve ancora presentarsi.",
        "L'orizzonte e pronto. Il piano di terra no.",
        "Molta fuga. Poca infrastruttura."
      ],
      seed
    );
  }

  if (scenario === "buyNoMoney") {
    return pickFrom(
      [
        "Lo vuoi tantissimo. Questo non vale come copertura.",
        "Ottimo desiderio. Scarso margine.",
        "L'oggetto ha fascino. Il conto molto meno."
      ],
      seed
    );
  }

  if (band === "grounded") {
    return pickFrom(
      [
        "Non e delirio. E' solo ambizione con un minimo di ordine.",
        "Poco glamour, molta tenuta.",
        "Hai tolto abbastanza caos da renderlo credibile."
      ],
      seed
    );
  }

  return pickFrom(FINAL_LINES[context], seed);
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

function buildTraits({
  realismo,
  orderedSignals,
  context,
  band,
  seed
}: {
  realismo: number;
  orderedSignals: SignalKey[];
  context: ContextKey;
  band: BandKey;
  seed: number;
}) {
  const used = new Set<string>();
  const traits: string[] = [];

  if (band === "grounded" || realismo >= 62) {
    traits.push(uniqueTrait(TRAIT_POOLS.grounded, used, seed, 0));
  } else {
    traits.push(uniqueTrait(CONTEXT_TRAITS[context], used, seed, 0));
  }

  traits.push(uniqueTrait(CONTEXT_TRAITS[context], used, seed, 1));

  for (let index = 0; index < orderedSignals.length && traits.length < 3; index += 1) {
    const signal = orderedSignals[index];
    traits.push(uniqueTrait(TRAIT_POOLS[signal], used, seed, index + 2));
  }

  return traits.slice(0, 3);
}

export function analyzePlan(input: string): AnalysisResult {
  const piano = input.trim();
  const normalized = normalizeText(piano);
  const seed = hashText(normalized);
  const flags = detectFlags(normalized);
  const context = detectContext(normalized, flags);
  const scenario = detectSpecialScenario(flags);

  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const punctuationCount = (piano.match(/[!?]/g) ?? []).length;
  const clauseCount = piano.split(/[,.!?;:]+/).filter((chunk) => chunk.trim().length > 0).length;
  const multiStepCount = Math.max(0, clauseCount - 1);

  const planningHits = countHits(normalized, PLANNING_WORDS);
  const safetyHits = countHits(normalized, SAFETY_WORDS);
  const timelineHits = countHits(normalized, TIMELINE_WORDS);
  const impulsiveHits = countHits(normalized, IMPULSIVE_WORDS);
  const emotionalHits = countHits(normalized, EMOTIONAL_WORDS);
  const financialHits = countHits(normalized, FINANCIAL_WORDS);
  const practicalHits = countHits(normalized, PRACTICAL_RISK_WORDS);
  const cinematicHits = countHits(normalized, CINEMATIC_WORDS);

  const planningStrength = clamp(
    18 +
      planningHits * 9 +
      safetyHits * 9 +
      timelineHits * 5 +
      (flags.hasBudget ? 10 : 0) +
      (flags.hasSafetyNet ? 10 : 0) +
      (flags.hasSupport ? 7 : 0) +
      (flags.hasClients ? 8 : 0) +
      (wordCount >= 18 ? 5 : 0) +
      (wordCount >= 28 ? 4 : 0) -
      (flags.noPlan ? 22 : 0) -
      (flags.noExperience ? 12 : 0),
    4,
    100
  );

  const realismo = clamp(
    32 +
      planningStrength * 0.56 -
      impulsiveHits * 5 -
      emotionalHits * 3 -
      practicalHits * 8 -
      (flags.noMoney ? 6 : 0) -
      (flags.noPlan ? 10 : 0) -
      (flags.noExperience ? 8 : 0) -
      (flags.writeToEx ? 10 : 0) +
      (multiStepCount > 0 ? 3 : 0),
    5,
    96
  );

  const impulsivita = clamp(
    12 +
      impulsiveHits * 16 +
      punctuationCount * 4 +
      multiStepCount * 4 +
      (flags.immediate ? 12 : 0) +
      (flags.quitJob ? 8 : 0) -
      planningHits * 5 -
      safetyHits * 6,
    5,
    98
  );

  const esposizioneEmotiva = clamp(
    8 +
      emotionalHits * 18 +
      punctuationCount * 2 +
      (flags.writeToEx ? 18 : 0) +
      (context === "love" ? 8 : 0),
    4,
    98
  );

  const rischioPratico = clamp(
    16 +
      practicalHits * 18 +
      multiStepCount * 5 +
      (flags.noPlan ? 22 : 0) +
      (flags.noClients ? 18 : 0) +
      (flags.noExperience ? 14 : 0) +
      (flags.quitJob && !flags.hasSafetyNet ? 12 : 0) +
      (flags.moveAbroad ? 8 : 0) -
      planningStrength * 0.28,
    6,
    98
  );

  const dannoEconomico = clamp(
    12 +
      financialHits * 14 +
      (flags.buyingThing ? 10 : 0) +
      (flags.openBusiness ? 12 : 0) +
      (flags.moveAbroad ? 8 : 0) +
      (flags.noMoney ? 26 : 0) +
      (flags.noClients ? 6 : 0) -
      (flags.hasBudget ? 12 : 0) -
      planningHits * 2,
    4,
    98
  );

  const mainCharacterEnergy = clamp(
    14 +
      cinematicHits * 18 +
      impulsivita * 0.2 +
      esposizioneEmotiva * 0.14 +
      (flags.moveAbroad ? 10 : 0) +
      (flags.quitJob ? 8 : 0) +
      (flags.dramaticReset ? 12 : 0),
    8,
    100
  );

  const score = clamp(
    (100 - realismo) * 0.29 +
      impulsivita * 0.19 +
      esposizioneEmotiva * 0.12 +
      dannoEconomico * 0.16 +
      rischioPratico * 0.17 +
      Math.max(0, mainCharacterEnergy - 55) * 0.08 -
      planningStrength * 0.04,
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

  const dominantSignal = leadingSignal(signals);
  const band = scoreToBand(score);
  const verdict = buildVerdict({
    band,
    context,
    scenario,
    dominantSignal,
    seed
  });
  const categoria = categoriaPerScore(score);
  const sintesi = buildSintesi({
    band,
    context,
    dominantSignal,
    scenario,
    seed
  });
  const fraseFinale = buildFinalLine({
    context,
    scenario,
    band,
    seed
  });
  const tratti = buildTraits({
    realismo,
    orderedSignals,
    context,
    band,
    seed
  });
  const shareText = `Indice di delirio: ${score}/100 su ${APP_NAME} - ${verdict}.`;

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
