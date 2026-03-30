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

type Theme = "relazioni" | "lavoro" | "soldi" | "viaggio" | "acquisto" | "fuga" | "creativo" | "misto" | "altro";
type Driver = "fuga" | "impulsivita" | "nostalgia" | "ego" | "romanticismo" | "saturazione" | "rivalsa" | "noia" | "reset" | "controllo";
type Band = "grounded" | "plausible" | "unstable" | "delusional" | "iconic";
type IndicatorKey = "dissociazione" | "impulsivita" | "dannoPratico" | "poetico";
type Scenario = "ex_late" | "abroad_weak" | "business_weak" | "buy_uncovered" | "career_pivot" | null;

export type AnalysisResult = {
  piano: string;
  tema: string;
  driver: string;
  safetyMode: boolean;
  blocked: boolean;
  score: number;
  categoria: string;
  verdict: string;
  sintesi: string;
  cosaRegge: string;
  cosaNonRegge: string;
  puntoCieco: string;
  fraseFinale: string;
  tratti: string[];
  indicatori: { dissociazione: number; impulsivita: number; dannoPratico: number; poetico: number };
  shareText: string;
};

type Flags = {
  noMoney: boolean; noPlan: boolean; noSupport: boolean; noLanguage: boolean; noDocuments: boolean; noWork: boolean; noClients: boolean; noExperience: boolean;
  hasBudget: boolean; hasPlan: boolean; hasSupport: boolean; hasLanguage: boolean; hasDocuments: boolean; hasJob: boolean; hasClients: boolean; hasTimeline: boolean; gradual: boolean; admitted: boolean;
  immediate: boolean; abroad: boolean; quitJob: boolean; business: boolean; purchase: boolean; exContact: boolean; reset: boolean; creative: boolean; debt: boolean;
  housingRisk: boolean; legalRisk: boolean; physicalRisk: boolean; relationshipRisk: boolean; hardPivot: boolean; adultWork: boolean; exposedPivot: boolean;
  urgentHits: number; poeticHits: number; supportCount: number; missingCount: number; abroadMissing: number;
};

const CAT = [{ max: 20, label: "Fin troppo lucido" }, { max: 40, label: "Ambizioso ma plausibile" }, { max: 60, label: "Instabile ma difendibile" }, { max: 80, label: "Delirante con metodo" }, { max: 100, label: "Iconicamente delirante" }];
const THEME_LABEL: Record<Theme, string> = { relazioni: "relazioni", lavoro: "lavoro", soldi: "soldi", viaggio: "viaggio", acquisto: "acquisto", fuga: "fuga / cambio vita", creativo: "progetto creativo", misto: "misto", altro: "altro" };
const DRIVER_LABEL: Record<Driver, string> = { fuga: "fuga", impulsivita: "impulsivita", nostalgia: "nostalgia", ego: "ego", romanticismo: "romanticismo", saturazione: "saturazione", rivalsa: "rivalsa", noia: "noia", reset: "bisogno di reset", controllo: "fantasia di controllo" };
const SAFETY = { violence: ["uccido", "ammazzo", "picchio", "picchiare", "picchiarlo", "picchiarla", "menare", "prendere a pugni", "violenza", "aggressione"], abuse: ["costringo", "obbligo", "ricatto", "minaccio", "coercizione"], drugs: ["cocaina", "eroina", "mdma", "spaccio", "droga illegale"], crime: ["rubare", "truffa", "truffare", "evasione", "documenti falsi", "reato"], stalking: ["stalking", "la seguo", "lo seguo", "la controllo", "lo controllo"], self: ["suicidio", "uccidermi", "ammazzarmi", "mi faccio male", "mi taglio", "autolesionismo"], noncons: ["senza consenso", "non consensuale", "minorenne", "minori", "bambino", "bambini", "ragazzino", "ragazzini", "sfruttamento", "revenge porn"], toxic: ["candeggina", "varechina", "ammoniaca", "detersivo", "detergente", "solvente", "veleno", "disinfettante", "alcool denaturato", "acido muriatico", "antigelo"] } as const;
const T = {
  relazioni: ["le scrivo", "gli scrivo", "le riscrivo", "gli riscrivo", "ex", "relazione", "appuntamento"],
  lavoro: ["lavoro", "ufficio", "mi licenzio", "licenziarsi", "carriera", "colloquio", "freelance", "dimissioni"],
  soldi: ["soldi", "prestito", "debito", "rata", "mutuo", "budget", "capitale"],
  viaggio: ["portogallo", "berlino", "thailandia", "spagna", "lisbona", "londra", "estero", "all'estero", "master", "viaggio", "trasferisco", "parto", "volo", "van"],
  acquisto: ["compro", "moto", "macchina", "auto", "van", "casa", "acquisto"],
  fuga: ["cambio vita", "nuova vita", "reset", "sparisco", "ricomincio", "mollo tutto", "lascio tutto"],
  creativo: ["apro", "bar", "studio", "agenzia", "startup", "locale", "brand", "progetto", "collettivo"]
} as const;
const D = {
  fuga: ["scappo", "fuga", "sparisco", "parto", "cambio vita", "mollo tutto", "lascio tutto"],
  impulsivita: ["subito", "domani", "adesso", "ora", "senza pensarci", "lo faccio e basta", "poi si vede"],
  nostalgia: ["ex", "mi manca", "nostalgia", "come se niente fosse", "le riscrivo", "gli riscrivo"],
  ego: ["dimostrare", "gliela faccio vedere", "far vedere", "li stupisco"],
  romanticismo: ["seguo l'istinto", "destino", "sogno", "cuore", "visione", "magia"],
  saturazione: ["non ne posso piu", "saturo", "burnout", "esausto", "mi sono rotto"],
  rivalsa: ["vendetta", "rivalsa", "mi riprendo"],
  noia: ["mi annoio", "per noia", "tanto per"],
  reset: ["ricomincio da zero", "nuova vita", "reset", "riparto"],
  controllo: ["controllo", "gestisco tutto io", "tengo tutto sotto controllo"]
} as const;
const P = { plan: ["piano", "budget", "ricerca", "test", "step", "timeline", "conti", "preventivo", "validare", "provo"], support: ["appoggi", "rete", "contatti", "socio", "partner", "insieme a", "con un amico"], budget: ["budget", "risparmi", "risparmio", "cassa", "capitale", "soldi da parte"], timeline: ["entro", "fra", "tra", "settimana", "settimane", "mese", "mesi", "anno", "anni"], gradual: ["prima testo", "prima provo", "graduale", "part time", "senza mollare tutto", "con calma"], language: ["parlo inglese", "parlo la lingua", "inglese", "spagnolo", "tedesco", "portoghese"], docs: ["visto", "documenti", "permesso", "ammissione", "sono ammesso", "gia ammesso"], job: ["contratto", "offerta", "gia assunto", "lavoro gia", "master gia ammesso"], clients: ["clienti", "cliente", "richieste", "lead", "domanda", "preordini"], poetic: ["sparisco", "ricomincio da zero", "nuova vita", "reset", "seguo l'istinto", "destino", "sogno", "cuore", "visione", "van", "giro del mondo"], urgent: ["subito", "domani", "adesso", "ora", "la prossima settimana", "mollo tutto", "lascio tutto", "lo faccio e basta", "senza pensarci"] } as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(v)));
const normalize = (v: string) => v.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[’‘`]/g, "'");
const countHits = (t: string, p: readonly string[]) => p.reduce((n, x) => n + Number(t.includes(x)), 0);
const hasAny = (t: string, p: readonly string[]) => p.some((x) => t.includes(x));
const hash = (t: string) => Math.abs([...t].reduce((n, c) => ((n * 31 + c.charCodeAt(0)) | 0), 0));
const pick = <T,>(a: T[], s: number, o = 0) => a[(s + o) % a.length];
const bandOf = (score: number): Band => score <= 20 ? "grounded" : score <= 40 ? "plausible" : score <= 60 ? "unstable" : score <= 80 ? "delusional" : "iconic";
const catOf = (score: number) => CAT.find((x) => score <= x.max)?.label ?? "Iconicamente delirante";

function polishItalian(text: string) {
  return text
    .replace(/\bc'e\b/g, "c'è")
    .replace(/\bC'e\b/g, "C'è")
    .replace(/\bpiu\b/g, "più")
    .replace(/\bPiu\b/g, "Più")
    .replace(/\bgia\b/g, "già")
    .replace(/\bGia\b/g, "Già")
    .replace(/\bpero\b/g, "però")
    .replace(/\bPero\b/g, "Però")
    .replace(/\bperche\b/g, "perché")
    .replace(/\bPerche\b/g, "Perché")
    .replace(/\brealta\b/g, "realtà")
    .replace(/\bRealta\b/g, "Realtà")
    .replace(/\boperativita\b/g, "operatività")
    .replace(/\bOperativita\b/g, "Operatività")
    .replace(/\bsostenibilita\b/g, "sostenibilità")
    .replace(/\bSostenibilita\b/g, "Sostenibilità")
    .replace(/\bfattibilita\b/g, "fattibilità")
    .replace(/\bFattibilita\b/g, "Fattibilità")
    .replace(/\bidentita\b/g, "identità")
    .replace(/\bIdentita\b/g, "Identità")
    .replace(/\bvelocita\b/g, "velocità")
    .replace(/\bVelocita\b/g, "Velocità")
    .replace(/L'intuizione c'e/g, "L'intuizione c'è")
    .replace(/L'idea c'e/g, "L'idea c'è")
    .replace(/La visione c'e/g, "La visione c'è")
    .replace(/La narrativa e piu pronta dell'operativita/g, "La narrativa è più pronta dell'operatività")
    .replace(/La narrativa e più pronta dell'operatività/g, "La narrativa è più pronta dell'operatività")
    .replace(/Qui il problema e un rischio tossico reale/g, "Qui il problema è un rischio tossico reale")
    .replace(/Qui il problema non e la visione/g, "Qui il problema non è la visione")
    .replace(/Il gesto e sentimentale/g, "Il gesto è sentimentale")
    .replace(/L'ambizione c'e/g, "L'ambizione c'è");
}

function detectSafety(t: string) {
  const violent = hasAny(t, SAFETY.violence), abusive = hasAny(t, SAFETY.abuse), drugs = hasAny(t, SAFETY.drugs), crime = hasAny(t, SAFETY.crime), stalking = hasAny(t, SAFETY.stalking), self = hasAny(t, SAFETY.self), noncons = hasAny(t, SAFETY.noncons);
  const ingest = hasAny(t, ["bere", "bermi", "berne", "ingerire", "inghiottire", "mangiare", "assumere", "iniettare"]);
  const toxic = hasAny(t, SAFETY.toxic);
  const poison = toxic && ingest;
  const harmfulRemedy = poison || (toxic && hasAny(t, ["raffreddore", "influenza", "febbre", "mal di gola", "tosse", "guarire", "curare"]));
  const safetyMode = violent || abusive || drugs || crime || stalking || self || noncons || harmfulRemedy;
  const blocked = violent || abusive || stalking || self || noncons || harmfulRemedy;
  return { safetyMode, blocked, severity: clamp(84 + Number(blocked) * 8 + Number(drugs || crime) * 4 + Number(self) * 4 + Number(harmfulRemedy) * 6, 85, 100), reason: self ? "self" : noncons ? "noncons" : harmfulRemedy ? "poison" : violent ? "violence" : abusive ? "abuse" : stalking ? "stalking" : drugs ? "drugs" : crime ? "crime" : null };
}

function polishOutput(text: string) {
  return polishItalian(text)
    .replace(/\bc'e\b/g, "c'è")
    .replace(/\bC'e\b/g, "C'è")
    .replace(/\bNon e\b/g, "Non è")
    .replace(/\bnon e\b/g, "non è")
    .replace(/\bE un\b/g, "È un")
    .replace(/\bE una\b/g, "È una")
    .replace(/\be chiarissimo\b/g, "è chiarissimo")
    .replace(/\be chiara\b/g, "è chiara")
    .replace(/\be gia\b/g, "è già")
    .replace(/\bHai gia\b/g, "Hai già")
    .replace(/\bLa svolta e\b/g, "La svolta è")
    .replace(/\bIl gesto e\b/g, "Il gesto è")
    .replace(/\bpiu\b/g, "più")
    .replace(/\bPiu\b/g, "Più")
    .replace(/\bgia\b/g, "già")
    .replace(/\bGia\b/g, "Già")
    .replace(/\bpero\b/g, "però")
    .replace(/\bPero\b/g, "Però")
    .replace(/\bperche\b/g, "perché")
    .replace(/\bPerche\b/g, "Perché")
    .replace(/\brealta\b/g, "realtà")
    .replace(/\bRealta\b/g, "Realtà")
    .replace(/\boperativita\b/g, "operatività")
    .replace(/\bOperativita\b/g, "Operatività")
    .replace(/\bsostenibilita\b/g, "sostenibilità")
    .replace(/\bSostenibilita\b/g, "Sostenibilità")
    .replace(/\bfattibilita\b/g, "fattibilità")
    .replace(/\bFattibilita\b/g, "Fattibilità")
    .replace(/\bidentita\b/g, "identità")
    .replace(/\bIdentita\b/g, "Identità")
    .replace(/\bvelocita\b/g, "velocità")
    .replace(/\bVelocita\b/g, "Velocità")
    .replace(/L'intuizione c'e/g, "L'intuizione c'è")
    .replace(/L'idea c'e/g, "L'idea c'è")
    .replace(/La visione c'e/g, "La visione c'è")
    .replace(/La narrativa e piu pronta dell'operativita/g, "La narrativa è più pronta dell'operatività")
    .replace(/Qui il problema e un rischio tossico reale/g, "Qui il problema è un rischio tossico reale")
    .replace(/Qui il problema non e la visione/g, "Qui il problema non è la visione")
    .replace(/Il gesto e sentimentale/g, "Il gesto è sentimentale")
    .replace(/L'ambizione c'e/g, "L'ambizione c'è");
}

function detectFlags(t: string): Flags {
  const noMoney = hasAny(t, ["senza soldi", "non ho soldi", "senza budget", "soldi non ne ho", "zero soldi"]);
  const noPlan = hasAny(t, ["senza piano", "nessun piano", "poi si vede", "senza sapere come", "a caso"]);
  const noSupport = hasAny(t, ["senza appoggi", "senza rete", "senza contatti", "da solo", "da sola"]);
  const noLanguage = hasAny(t, ["senza sapere la lingua", "senza lingua", "non parlo inglese"]);
  const noDocuments = hasAny(t, ["senza documenti", "senza visto", "senza permesso", "senza contratto"]);
  const noWork = hasAny(t, ["senza lavoro", "nessun lavoro", "senza entrate", "senza stipendio"]);
  const noClients = hasAny(t, ["senza clienti", "nessun cliente", "zero clienti"]);
  const noExperience = hasAny(t, ["senza esperienza", "zero esperienza", "non l'ho mai fatto", "non so farlo", "non so farla"]);
  const hasBudget = hasAny(t, P.budget), hasPlan = hasAny(t, P.plan), hasSupport = hasAny(t, P.support), hasLanguage = hasAny(t, P.language), hasDocuments = hasAny(t, P.docs), hasJob = hasAny(t, P.job), hasClients = hasAny(t, P.clients) && !noClients, hasTimeline = hasAny(t, P.timeline), gradual = hasAny(t, P.gradual), admitted = hasAny(t, ["gia ammesso", "sono ammesso", "ammissione", "offerta gia"]);
  const abroad = hasAny(t, T.viaggio), quitJob = hasAny(t, ["mi licenzio", "licenziarsi", "licenziarmi", "lascio il lavoro", "lasciare il lavoro", "mollo il lavoro", "mollare il lavoro", "mollo tutto"]), business = hasAny(t, ["apro", "bar", "studio", "agenzia", "startup", "locale", "azienda"]), purchase = hasAny(t, ["compro", "moto", "macchina", "auto", "van", "casa", "acquisto"]), exContact = hasAny(t, ["le scrivo", "gli scrivo", "le riscrivo", "gli riscrivo", " ex"]), reset = hasAny(t, ["cambio vita", "nuova vita", "reset", "sparisco", "ricomincio da zero"]), creative = hasAny(t, ["studio creativo", "brand", "progetto", "collettivo", "agenzia creativa"]), immediate = hasAny(t, P.urgent);
  const adultWork = hasAny(t, ["prostituta", "prostituirmi", "escort", "camgirl", "camboy", "onlyfans", "sex worker", "pornostar", "attrice porno", "attore porno"]);
  const roleLeap = hasAny(t, ["per andare a fare", "per mettermi a fare", "per fare il", "per fare la", "per fare l'", "per lavorare come", "per reinventarmi come"]);
  const supportCount = [hasBudget, hasPlan, hasSupport, hasLanguage, hasDocuments, hasJob, hasClients, hasTimeline, gradual, admitted].filter(Boolean).length;
  const hardPivot = quitJob && roleLeap && supportCount <= 1;
  const exposedPivot = adultWork && (hardPivot || quitJob);
  const debt = hasAny(t, ["debito", "debiti", "prestito", "rata", "mutuo", "mi indebito"]), housingRisk = hasAny(t, ["lascio casa", "senza casa", "mollo casa"]), legalRisk = hasAny(t, ["documenti falsi", "evasione", "truffa", "reato"]), physicalRisk = hasAny(t, ["pericoloso", "senza casco", "senza patente", "rischio fisico"]) || exposedPivot, relationshipRisk = exContact || hasAny(t, ["sparisco senza dire nulla", "tradisco"]);
  return { noMoney, noPlan, noSupport, noLanguage, noDocuments, noWork, noClients, noExperience, hasBudget, hasPlan, hasSupport, hasLanguage, hasDocuments, hasJob, hasClients, hasTimeline, gradual, admitted, immediate, abroad, quitJob, business, purchase, exContact, reset, creative, debt, housingRisk, legalRisk, physicalRisk, relationshipRisk, hardPivot, adultWork, exposedPivot, urgentHits: countHits(t, P.urgent), poeticHits: countHits(t, P.poetic), supportCount, missingCount: [noMoney, noPlan, noSupport, noLanguage, noDocuments, noWork, noClients, noExperience].filter(Boolean).length, abroadMissing: [noMoney, noPlan, noSupport, noLanguage, noDocuments, noWork].filter(Boolean).length };
}

function detectTheme(t: string, f: Flags, safety: ReturnType<typeof detectSafety>): Theme {
  if (safety.safetyMode) return "altro";
  const scores: Record<Exclude<Theme, "misto" | "altro">, number> = {
    relazioni: countHits(t, T.relazioni) + Number(f.exContact) * 5,
    lavoro: countHits(t, T.lavoro) + Number(f.quitJob) * 4,
    soldi: countHits(t, T.soldi) + Number(f.noMoney || f.debt) * 3,
    viaggio: countHits(t, T.viaggio) + Number(f.abroad) * 6,
    acquisto: countHits(t, T.acquisto) + Number(f.purchase) * 5,
    fuga: countHits(t, T.fuga) + Number(f.reset) * 5,
    creativo: countHits(t, T.creativo) + Number(f.business || f.creative) * 5
  };
  const ordered = Object.entries(scores).sort((a, b) => b[1] - a[1]) as Array<[Theme, number]>;
  const [aKey, aScore] = ordered[0] ?? ["altro", 0];
  const [bKey, bScore] = ordered[1] ?? ["altro", 0];
  if (aKey === "acquisto" && bKey === "viaggio" && Math.abs(aScore - bScore) <= 2 && hasAny(t, ["parto", "viaggio", "trasferisco"])) return "viaggio";
  if (aKey === "viaggio" && bKey === "creativo" && Math.abs(aScore - bScore) <= 1 && (f.business || f.abroad)) return "misto";
  if (aScore === 0) return "altro";
  if (aScore > 1 && bScore > 1 && Math.abs(aScore - bScore) <= 1) return "misto";
  return aKey;
}

function detectDriver(t: string, f: Flags): Driver {
  const scores: Record<Driver, number> = {
    fuga: countHits(t, D.fuga) + Number(f.reset || f.abroad) * 2,
    impulsivita: countHits(t, D.impulsivita) + f.urgentHits,
    nostalgia: countHits(t, D.nostalgia) + Number(f.exContact) * 4,
    ego: countHits(t, D.ego),
    romanticismo: countHits(t, D.romanticismo) + f.poeticHits,
    saturazione: countHits(t, D.saturazione) + Number(f.quitJob) * 2,
    rivalsa: countHits(t, D.rivalsa),
    noia: countHits(t, D.noia),
    reset: countHits(t, D.reset) + Number(f.reset) * 3,
    controllo: countHits(t, D.controllo)
  };
  const [topKey, topScore] = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0] ?? ["controllo", 0]) as [Driver, number];
  if (topScore > 0) return topKey;
  if (f.exContact) return "nostalgia";
  if (f.abroad || f.reset) return "fuga";
  if (f.quitJob) return "saturazione";
  if (f.business) return "romanticismo";
  if (f.purchase) return "impulsivita";
  return "controllo";
}

function detectScenario(t: string, f: Flags): Scenario {
  if (f.exContact && hasAny(t, ["dopo sei mesi", "dopo 6 mesi", "dopo otto mesi", "dopo 8 mesi", "come se niente fosse"])) return "ex_late";
  if (f.abroad && (f.abroadMissing >= 2 || (f.noPlan && (f.purchase || f.quitJob || f.reset)))) return "abroad_weak";
  if (f.business && (f.noClients || !f.hasBudget || f.noExperience)) return "business_weak";
  if (f.purchase && (f.noMoney || f.debt)) return "buy_uncovered";
  if (f.hardPivot) return "career_pivot";
  return null;
}

function safetyResult(input: string, seed: number, s: ReturnType<typeof detectSafety>): AnalysisResult {
  const verdict = pick(["Questo non rientra nel delirio poetico.", "Qui il problema non e la visione.", "Questo esce dal gioco."], seed);
  const tail =
    s.reason === "self"
      ? "Qui serve fermarsi, non romanticizzare."
      : s.reason === "poison"
        ? "Qui il problema e un rischio tossico reale, non una soluzione creativa."
        : "Rientra nel danno reale.";
  const dissociazione = clamp(s.severity - 2, 85, 98), impulsivita = clamp(58 + (seed % 24), 58, 92), dannoPratico = clamp(s.severity + 4, 90, 100), poetico = clamp(10 + (seed % 12), 8, 26);
  const score = clamp(dissociazione * 0.3 + impulsivita * 0.25 + dannoPratico * 0.25 + poetico * 0.2, 85, 100);
  return { piano: input.trim(), tema: "illegale / dannoso", driver: DRIVER_LABEL.controllo, safetyMode: true, blocked: s.blocked, score, categoria: s.blocked ? "Danno reale" : "Alta allerta", verdict: polishOutput(verdict), sintesi: polishOutput(`${verdict} ${tail}`), cosaRegge: polishOutput("Qui non c'e nulla da glamourizzare."), cosaNonRegge: polishOutput("Non regge perche il rischio concreto viene prima di qualsiasi narrativa."), puntoCieco: polishOutput("Stai trattando un danno reale come se fosse ancora una scena da raccontare."), fraseFinale: polishOutput(pick(["Qui non serve fascino. Serve fermarsi.", "Non c'e niente di cinematografico nel danno.", "Il rischio concreto cancella ogni glamour."], seed)), tratti: ["pericoloso", "lesivo", "grave"], indicatori: { dissociazione, impulsivita, dannoPratico, poetico }, shareText: polishOutput(`Indice di delirio: ${score}/100 - ${verdict} ${tail}`) };
}

function buildVerdict(theme: Theme, band: Band, scenario: Scenario, top: IndicatorKey, seed: number) {
  if (scenario === "ex_late") return pick(["Emotivamente finanziato", "Nostalgia con logistica debole", "Ritorno emotivo con basi leggere"], seed);
  if (scenario === "abroad_weak") return pick(["Piu cinema che logistica", "Molto altrove, poca base", "Trasferimento senza struttura"], seed);
  if (scenario === "business_weak") return pick(["Molto coraggio, zero fatturato", "Visione forte, domanda debole", "Brand acceso, basi leggere"], seed);
  if (scenario === "buy_uncovered") return pick(["Piu desiderio che copertura", "Checkout emotivo, conto fragile", "Acquisto convinto, margine assente"], seed);
  if (scenario === "career_pivot") return pick(["Svolta netta, ponte assente", "Cambio di ruolo, basi corte", "Taglio deciso, atterraggio opaco"], seed);
  if (theme === "viaggio" && top === "poetico") return pick(["Poster fortissimo, basi medie", "Partenza narrata bene, sostenuta meno"], seed);
  if (theme === "relazioni" && top === "dissociazione") return pick(["Sentimento alto, contesto basso", "Tempismo emotivo, basi leggere"], seed);
  if (theme === "acquisto" && top === "dannoPratico") return pick(["Spesa rapida, copertura lenta", "Costo reale, razionalita piu timida"], seed);
  return pick(({ grounded: ["Sorprendentemente lucido", "Poco delirio, molta struttura"], plausible: ["Ambizioso ma plausibile", "Rischioso con criterio"], unstable: ["Instabile ma difendibile", "Piu slancio che tenuta"], delusional: ["Delirante con metodo", "Molto coraggio. Poco piano."], iconic: ["Iconicamente delirante", "Magnificamente mal sostenuto"] })[band], seed);
}

function buildSintesi(theme: Theme, driver: Driver, f: Flags, scenario: Scenario, seed: number) {
  if (scenario === "ex_late") return pick(["Qui parla la nostalgia, non il contesto attuale.", "Stai rimettendo in moto una storia che nel frattempo e cambiata.", "Il gesto e sentimentale. La finestra reale molto meno."], seed);
  if (scenario === "abroad_weak") return pick(["Il cambio scena e chiarissimo. Meno la sua infrastruttura.", "L'altrove seduce, ma sotto mancano troppi appoggi.", "La partenza ha immagine. Le basi stanno ancora arrivando."], seed);
  if (scenario === "business_weak") return pick(["Hai gia il tono del progetto, non ancora la sua tenuta.", "L'idea si presenta bene. Domanda e copertura restano piu indietro.", "Il progetto ha identita. La sostenibilita molto meno."], seed);
  if (scenario === "buy_uncovered") return pick(["L'oggetto convince piu dei conti.", "Qui il desiderio sta parlando molto piu forte della copertura.", "La spesa e gia concreta. La giustificazione no abbastanza."], seed);
  if (scenario === "career_pivot") {
    return f.exposedPivot
      ? pick(
          [
            "Non e un semplice cambio lavoro. E un salto molto esposto senza ponte operativo.",
            "Qui la rottura e drastica e il nuovo ruolo arriva senza una rampa visibile.",
            "Hai gia deciso l'uscita. Il passaggio reale verso il nuovo mestiere resta quasi tutto implicito."
          ],
          seed
        )
      : pick(
          [
            "Qui non c'e solo una dimissione. C'e un cambio di identita professionale senza ponte.",
            "La svolta e chiara. Il passaggio concreto verso il nuovo ruolo molto meno.",
            "Stai trattando un salto di mestiere come se bastasse il taglio iniziale."
          ],
          seed
        );
  }
  const open = pick(({ relazioni: ["Qui si sente soprattutto il ritorno emotivo.", "La parte sentimentale arriva prima della strategia."], lavoro: ["Questa e una svolta raccontata con piu slancio che protezione.", "L'ambizione c'e. L'atterraggio ancora no."], soldi: ["La parte economica entra subito nella conversazione.", "Qui i numeri sono piu nervosi del tono."], viaggio: ["Questo piano punta soprattutto sul cambio scena.", "L'orizzonte e molto chiaro. La logistica meno."], acquisto: ["Qui c'e una forte energia da checkout emotivo.", "L'acquisto e raccontato come se fosse inevitabile."], fuga: ["La narrativa del reset e avanti rispetto alla struttura.", "Qui il gesto simbolico pesa piu del piano."], creativo: ["L'intuizione c'e. Il sistema intorno ancora no.", "La direzione creativa e avanti rispetto alla sostenibilita."], misto: ["Qui si mescolano piu impulsi nello stesso gesto.", "Ci sono piu spinte che struttura."], altro: ["L'intenzione si capisce. La fattibilita molto meno.", "Qui c'e una spinta chiara, ma basi ancora incerte."] })[theme], seed);
  const ends: string[] = [];
  if (f.noPlan) ends.push("Mancano passaggi veri tra immagine e realta.");
  if (f.noMoney) ends.push("La copertura economica parte gia in affanno.");
  if (f.noSupport) ends.push("Gli appoggi sono piu immaginati che presenti.");
  if (f.noClients) ends.push("La domanda reale non si vede ancora.");
  if (f.quitJob && !f.hasJob && !f.hasClients && !f.gradual && !f.hasTimeline) ends.push("Hai tagliato la parte certa prima di descrivere davvero il ponte.");
  if (f.noLanguage || f.noDocuments || f.noWork) ends.push("La parte pratica del salto e ancora troppo scoperta.");
  if (f.hasBudget || f.hasTimeline || f.gradual || f.hasClients || f.admitted) ends.push("Almeno un pezzo concreto, pero, esiste davvero.");
  if (ends.length === 0) ends.push(driver === "romanticismo" ? "Il fascino del piano e piu forte della sua disciplina." : "La sostenibilita non corre ancora alla stessa velocita del gesto.");
  return `${open} ${pick(ends, seed, 1)}`;
}

function buildCosaRegge(f: Flags, theme: Theme) {
  if (f.admitted || f.hasDocuments || f.hasJob) return "Regge perche esiste almeno una base formale da cui partire.";
  if (f.hasClients) return "Regge perche una domanda reale si intravede gia.";
  if (f.hasBudget) return "Regge perche i conti non sono del tutto fuori dalla stanza.";
  if (f.hasTimeline || f.gradual || f.hasPlan) return "Regge perche qualche passaggio concreto c'e gia.";
  if (f.hasSupport || f.hasLanguage) return "Regge perche non stai partendo completamente senza appoggi.";
  if (theme === "relazioni") return "Regge perche il desiderio di fare qualcosa sembra autentico.";
  return "Regge perche la spinta sembra vera, non inventata.";
}

function buildCosaNonRegge(f: Flags, s: Scenario) {
  if (s === "abroad_weak") return "Non regge perche estero, tempi e basi concrete non sono ancora allineati.";
  if (s === "business_weak") return "Non regge perche progetto, domanda e copertura stanno viaggiando a velocita diverse.";
  if (s === "ex_late") return "Non regge perche il contesto attuale conta piu del ricordo che hai in testa.";
  if (s === "buy_uncovered") return "Non regge perche la spesa arriva prima della copertura.";
  if (s === "career_pivot") return "Non regge perche il taglio e netto, ma il ponte verso il nuovo lavoro resta quasi tutto implicito.";
  if (f.noPlan && f.noMoney) return "Non regge perche mancano insieme struttura e margine.";
  if (f.noPlan) return "Non regge perche i passaggi intermedi restano quasi tutti impliciti.";
  if (f.noMoney || f.debt) return "Non regge perche la parte economica parte gia in affanno.";
  if (f.noSupport) return "Non regge perche stai immaginando appoggi che non si vedono ancora.";
  return "Non regge perche la sostenibilita resta indietro rispetto al fascino.";
}

function buildBlindSpot(driver: Driver, s: Scenario, top: IndicatorKey) {
  if (s === "ex_late") return "Stai leggendo nostalgia come se fosse contesto favorevole.";
  if (s === "abroad_weak") return "Stai trattando il trasferimento come cambio scena, non come infrastruttura.";
  if (s === "business_weak") return "Stai scambiando identita di progetto per prova di domanda.";
  if (s === "buy_uncovered") return "Stai chiamando inevitabile una spesa che resta scoperta.";
  if (s === "career_pivot") return "Stai trattando una svolta di identita professionale come se bastasse nominarla per renderla praticabile.";
  if (driver === "fuga") return "Stai usando la distanza come se sostituisse la struttura.";
  if (driver === "romanticismo") return "Stai confondendo fascino e fattibilita.";
  if (top === "impulsivita") return "Stai usando urgenza al posto dei passaggi.";
  if (top === "dannoPratico") return "Stai sottopesando il costo concreto del gesto.";
  return "La narrativa e piu pronta dell'operativita.";
}

function buildFinalLine(theme: Theme, driver: Driver, s: Scenario, top: IndicatorKey, seed: number) {
  if (s === "abroad_weak") return pick(["Il poster e gia pronto. Il piano di terra no.", "L'altrove seduce. La logistica chiede conto.", "La scena parte. La struttura rincorre."], seed);
  if (s === "ex_late") return pick(["Molto ricordo. Poco presente.", "Il cuore spinge. Il contesto frena.", "La memoria accelera. La realta no."], seed);
  if (s === "business_weak") return pick(["La visione c'e. La trazione no abbastanza.", "Il progetto vive. La tenuta ancora no.", "L'idea e avanti. Il sostegno rincorre."], seed);
  if (s === "buy_uncovered") return pick(["L'oggetto convince. Il conto protesta.", "Grande desiderio. Copertura piccola.", "Il checkout corre. Il margine no."], seed);
  if (s === "career_pivot") return pick(["Hai il taglio netto. Ti manca il ponte.", "Hai deciso l'uscita. Non l'atterraggio.", "La rottura e chiara. Il passaggio reale no."], seed);
  if (driver === "fuga") return pick(["Il sogno corre. Il piano rincorre.", "La scena parte. La struttura arriva dopo.", "La distanza seduce. La logistica meno."], seed);
  if (top === "dissociazione") return pick(["Nella testa e gia fatto. Fuori, molto meno.", "Il piano vive gia nell'immagine. Nel reale non ancora.", "L'idea e avanti di parecchi metri rispetto alle basi."], seed);
  if (top === "impulsivita") return pick(["Il gesto corre. I passaggi restano indietro.", "La decisione e gia partita. La sequenza no.", "L'urgenza parla piu del metodo."], seed);
  if (top === "dannoPratico") return pick(["Il costo arriva prima della poesia.", "La fattura del gesto e piu concreta del suo fascino.", "Il conto materiale si vede prima del lato epico."], seed);
  if (top === "poetico") return pick(["Bella immagine. Base corta.", "Molta scena. Pochi appigli.", "Funziona bene come film. Meno come procedura."], seed);
  return pick(({ relazioni: ["Il messaggio e pronto. Il dopo molto meno.", "Molto sentimento. Poca copertura."], lavoro: ["La svolta c'e. La rete arriva dopo.", "L'uscita e pronta. L'atterraggio meno."], soldi: ["Grande slancio. Piccolo margine.", "Il sogno corre. Il cashflow no."], viaggio: ["L'orizzonte e pronto. Il piano di terra no.", "La fuga ha stile. La logistica meno."], acquisto: ["Lo vuoi tantissimo. Questo non basta.", "L'oggetto ha fascino. Il conto molto meno."], fuga: ["Nuova vita, vecchie vulnerabilita.", "Il reset seduce. La manutenzione pratica no."], creativo: ["L'idea ha gusto. Le basi chiedono rinforzi.", "La visione c'e. La trazione ancora no."], misto: ["Molto slancio. Troppo poco ordine.", "Il fascino c'e. La tenuta no abbastanza."], altro: ["L'idea c'e. Il sostegno va ancora costruito.", "Visione presente. Tenuta incerta."] })[theme], seed);
}

function buildTraits(theme: Theme, driver: Driver, top: IndicatorKey, score: number, seed: number) {
  const a = ({ relazioni: ["romantico", "tardivo", "esposto"], lavoro: ["ambizioso", "scoperto", "teso"], soldi: ["costoso", "fragile", "teso"], viaggio: ["cinematico", "irrequieto", "leggero"], acquisto: ["impulsivo", "convinto", "costoso"], fuga: ["teatrale", "instabile", "convinto"], creativo: ["visionario", "ostinato", "teatrale"], misto: ["confuso", "teso", "convinto"], altro: ["fragile", "sbilanciato", "teorico"] })[theme];
  const b = ({ fuga: ["irrequieto", "evasivo", "sospeso"], impulsivita: ["impulsivo", "affrettato", "rapido"], nostalgia: ["nostalgico", "tardivo", "sentimentale"], ego: ["orgoglioso", "performativo", "teso"], romanticismo: ["romantico", "cinematico", "visionario"], saturazione: ["stanco", "saturo", "fragile"], rivalsa: ["reattivo", "teso", "spigoloso"], noia: ["incostante", "leggero", "irrequieto"], reset: ["teatrale", "convinto", "sospeso"], controllo: ["rigido", "teso", "controllante"] })[driver];
  const c = ({ dissociazione: ["scoperto", "mal ancorato", "sospeso"], impulsivita: ["rapido", "impulsivo", "affrettato"], dannoPratico: ["rischioso", "esposto", "fragile"], poetico: ["cinematico", "romantico", "teatrale"] })[top];
  const used = new Set<string>(), out: string[] = [];
  for (const pool of [score <= 20 ? ["lucido", "misurato", "composto"] : a, b, c]) for (let i = 0; i < pool.length; i += 1) { const x = pool[(seed + i) % pool.length]; if (!used.has(x)) { used.add(x); out.push(x); break; } }
  return out.slice(0, 3);
}

export function analyzePlan(input: string): AnalysisResult {
  const piano = input.trim(), text = normalize(piano), seed = hash(text), safety = detectSafety(text);
  if (safety.safetyMode) return safetyResult(piano, seed, safety);

  const f = detectFlags(text), theme = detectTheme(text, f, safety), driver = detectDriver(text, f), scenario = detectScenario(text, f);
  const punctuation = (piano.match(/[!?]/g) ?? []).length, steps = Math.max(0, piano.split(/[,.!?;:]+/).filter((x) => x.trim()).length - 1), objectiveScale = [f.abroad, f.quitJob, f.business, f.purchase, f.reset].filter(Boolean).length;
  const dissociazione = clamp(18 + objectiveScale * 9 + f.missingCount * 7 + Number(f.quitJob) * 10 + Number(scenario === "abroad_weak") * 22 + Number(scenario === "business_weak") * 18 + Number(scenario === "ex_late") * 20 + Number(scenario === "career_pivot") * 24 + Number(f.noPlan) * 8 + Number(f.noMoney) * 6 + Number(f.exposedPivot) * 8 - f.supportCount * 5, 1, 100);
  const impulsivita = clamp(12 + f.urgentHits * 16 + Number(f.immediate) * 10 + Number(f.quitJob) * 12 + Number(scenario === "career_pivot") * 10 + Number(scenario === "ex_late") * 12 + punctuation * 3 + steps * 2 - Number(f.gradual) * 12 - Number(f.hasTimeline) * 5 - Number(f.hasPlan) * 4, 1, 100);
  const dannoPratico = clamp(12 + f.missingCount * 6 + Number(f.noMoney) * 16 + Number(f.debt) * 14 + Number(f.quitJob) * 18 + Number(f.noWork) * 10 + Number(f.noDocuments) * 10 + Number(f.noClients) * 8 + Number(f.housingRisk) * 15 + Number(f.legalRisk) * 20 + Number(f.physicalRisk) * 18 + Number(f.relationshipRisk) * 10 + Number(scenario === "abroad_weak") * 16 + Number(scenario === "business_weak") * 14 + Number(scenario === "ex_late") * 14 + Number(scenario === "career_pivot") * 22 + Number(f.exposedPivot) * 10 - f.supportCount * 3, 1, 100);
  const poetico = clamp(8 + f.poeticHits * 15 + Number(f.reset) * 10 + Number(f.abroad) * 8 + Number(f.exContact) * 10 + Number(driver === "romanticismo") * 10 + Number(driver === "fuga") * 7 + Number(driver === "reset") * 8 + Number(scenario === "abroad_weak") * 6 + Number(scenario === "business_weak") * 4 + Number(scenario === "ex_late") * 10 + Number(scenario === "career_pivot") * 2, 1, 100);
  const rawScore = dissociazione * 0.3 + impulsivita * 0.25 + dannoPratico * 0.25 + poetico * 0.2;
  const scenarioLift =
    scenario === "ex_late"
      ? 20
      : scenario === "abroad_weak"
        ? 18
        : scenario === "business_weak"
          ? 14
          : scenario === "buy_uncovered"
            ? 14
            : scenario === "career_pivot"
              ? 12
              : 0;
  const scoreLift =
    scenarioLift +
    Number(f.noPlan) * 6 +
    Number(f.exContact) * 6 +
    Number(f.exposedPivot) * 8 +
    Number(f.purchase && f.abroad) * 4 +
    Number(f.business && f.noClients) * 4 +
    Number(f.quitJob && !f.hasJob && !f.gradual) * 4 -
    Number(f.supportCount >= 4) * 10;
  const score = clamp(rawScore + scoreLift, 1, 100);
  const indicatori = { dissociazione, impulsivita, dannoPratico, poetico }, top = (Object.entries(indicatori).sort((a, b) => b[1] - a[1])[0]?.[0] as IndicatorKey) ?? "dissociazione";
  const verdict = buildVerdict(theme, bandOf(score), scenario, top, seed), sintesi = buildSintesi(theme, driver, f, scenario, seed), cosaRegge = buildCosaRegge(f, theme), cosaNonRegge = buildCosaNonRegge(f, scenario), puntoCieco = buildBlindSpot(driver, scenario, top), fraseFinale = buildFinalLine(theme, driver, scenario, top, seed), tratti = buildTraits(theme, driver, top, score, seed);
  return { piano, tema: THEME_LABEL[theme], driver: DRIVER_LABEL[driver], safetyMode: false, blocked: false, score, categoria: catOf(score), verdict: polishOutput(verdict), sintesi: polishOutput(sintesi), cosaRegge: polishOutput(cosaRegge), cosaNonRegge: polishOutput(cosaNonRegge), puntoCieco: polishOutput(puntoCieco), fraseFinale: polishOutput(fraseFinale), tratti, indicatori, shareText: polishOutput(`Indice di delirio: ${score}/100 su ${APP_NAME} - ${verdict}.`) };
}
