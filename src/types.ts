export type LevelLabel = 'unterer Mindeststandard' | 'Mindeststandard' | 'Regelstandard' | 'Regelstandard plus' | 'Optimalstandard'

export const LEVEL_MAP: Record<LevelLabel, number> = {
    'unterer Mindeststandard': 1,
    Mindeststandard: 2,
    Regelstandard: 3,
    'Regelstandard plus': 4,
    Optimalstandard: 5,
}

export const ROMAN_TO_LABEL: Record<string, LevelLabel> = {
    'I': 'unterer Mindeststandard',
    'II': 'Mindeststandard',
    'III': 'Regelstandard',
    'IV': 'Regelstandard plus',
    'V': 'Optimalstandard',
}

export type GuideKey = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export type GuideLabel =
    | 'Zahl und Operation'
    | 'Größen und Messen'
    | 'Raum und Form'
    | 'Strukturen und funktionaler Zusammenhang'
    | 'Daten und Zufall'
    | 'Guide6'

export const GUIDE_MAP: Record<GuideKey, GuideLabel> = {
    L1: 'Zahl und Operation',
    L2: 'Größen und Messen',
    L3: 'Raum und Form',
    L4: 'Strukturen und funktionaler Zusammenhang',
    L5: 'Daten und Zufall',
}


export type CompetenceKey = 'K1' | 'K2' | 'K3' | 'K4' | 'K5' | 'K6'

export type CompetenceLabel =
    | 'Mathematisch argumentieren'
    | 'Probleme mathematisch lösen'
    | 'Mathematisch modellieren'
    | 'Mathematisch darstellen'
    | 'Mit mathematischen Objekten umgehen'
    | 'Mathematisch kommunizieren'

export const COMPETENCE_MAP: Record<CompetenceKey, CompetenceLabel> = {
    K1: 'Mathematisch argumentieren',
    K2: 'Probleme mathematisch lösen',
    K3: 'Mathematisch modellieren',
    K4: 'Mathematisch darstellen',
    K5: 'Mit mathematischen Objekten umgehen',
    K6: 'Mathematisch kommunizieren'
}