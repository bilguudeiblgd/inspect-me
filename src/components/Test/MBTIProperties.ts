export enum MBTI_TYPES {
    INTJ = "INTJ",
    INTP = "INTP", 
    ENTJ = "ENTJ",
    ENTP = "ENTP",
    INFJ = "INFJ",
    INFP = "INFP",
    ENFJ = "ENFJ",
    ENFP = "ENFP",
    ISTJ = "ISTJ",
    ISTP = "ISTP",
    ESTJ = "ESTJ",
    ESTP = "ESTP",
    ISFJ = "ISFJ",
    ISFP = "ISFP",
    ESFJ = "ESFJ",
    ESFP = "ESFP"
}

export enum MBTI_PHASE {
    PHASE1_SLIDERS,
    PHASE2_TRAITS,
    PHASE3_VALUES,
    PHASE_DONE
}

// Backward compatibility
export interface SliderDimension {
    name: string;
    leftLabel: string;
    rightLabel: string;
    leftTypes: MBTI_TYPES[];
    rightTypes: MBTI_TYPES[];
}

// Part 1: Slider dimensions with updated questions
export interface SliderQuestion {
    name: string;
    question: string;
    leftLabel: string;
    rightLabel: string;
    leftTypes: MBTI_TYPES[];
    rightTypes: MBTI_TYPES[];
}

export const SLIDER_DIMENSIONS: SliderQuestion[] = [
    {
        name: "E_I",
        question: "They are more likely to:",
        leftLabel: "Take action",
        rightLabel: "Think & Reflect",
        leftTypes: [MBTI_TYPES.ENTJ, MBTI_TYPES.ENTP, MBTI_TYPES.ENFJ, MBTI_TYPES.ENFP, MBTI_TYPES.ESTJ, MBTI_TYPES.ESTP, MBTI_TYPES.ESFJ, MBTI_TYPES.ESFP],
        rightTypes: [MBTI_TYPES.INTJ, MBTI_TYPES.INTP, MBTI_TYPES.INFJ, MBTI_TYPES.INFP, MBTI_TYPES.ISTJ, MBTI_TYPES.ISTP, MBTI_TYPES.ISFJ, MBTI_TYPES.ISFP]
    },
    {
        name: "N_S",
        question: "They are more drawn to:",
        leftLabel: "Innovative ideas",
        rightLabel: "Proven methods",
        leftTypes: [MBTI_TYPES.INTJ, MBTI_TYPES.INTP, MBTI_TYPES.ENTJ, MBTI_TYPES.ENTP, MBTI_TYPES.INFJ, MBTI_TYPES.INFP, MBTI_TYPES.ENFJ, MBTI_TYPES.ENFP],
        rightTypes: [MBTI_TYPES.ISTJ, MBTI_TYPES.ISTP, MBTI_TYPES.ESTJ, MBTI_TYPES.ESTP, MBTI_TYPES.ISFJ, MBTI_TYPES.ISFP, MBTI_TYPES.ESFJ, MBTI_TYPES.ESFP]
    },
    {
        name: "T_F",
        question: "They prefer to do what is:",
        leftLabel: "Logical",
        rightLabel: "Right",
        leftTypes: [MBTI_TYPES.INTJ, MBTI_TYPES.INTP, MBTI_TYPES.ENTJ, MBTI_TYPES.ENTP, MBTI_TYPES.ISTJ, MBTI_TYPES.ISTP, MBTI_TYPES.ESTJ, MBTI_TYPES.ESTP],
        rightTypes: [MBTI_TYPES.INFJ, MBTI_TYPES.INFP, MBTI_TYPES.ENFJ, MBTI_TYPES.ENFP, MBTI_TYPES.ISFJ, MBTI_TYPES.ISFP, MBTI_TYPES.ESFJ, MBTI_TYPES.ESFP]
    },
    {
        name: "J_P",
        question: "They like to be:",
        leftLabel: "Organized",
        rightLabel: "Adaptable",
        leftTypes: [MBTI_TYPES.INTJ, MBTI_TYPES.ENTJ, MBTI_TYPES.INFJ, MBTI_TYPES.ENFJ, MBTI_TYPES.ISTJ, MBTI_TYPES.ESTJ, MBTI_TYPES.ISFJ, MBTI_TYPES.ESFJ],
        rightTypes: [MBTI_TYPES.INTP, MBTI_TYPES.ENTP, MBTI_TYPES.INFP, MBTI_TYPES.ENFP, MBTI_TYPES.ISTP, MBTI_TYPES.ESTP, MBTI_TYPES.ISFP, MBTI_TYPES.ESFP]
    }
];

// Part 2: Personality Traits for ranking
export interface PersonalityTrait {
    code: string;
    name: string;
    types: MBTI_TYPES[];
}

export const PERSONALITY_TRAITS: PersonalityTrait[] = [
    {
        code: "analytical",
        name: "Analytical",
        types: [MBTI_TYPES.ISTP, MBTI_TYPES.INTP]
    },
    {
        code: "decisive", 
        name: "Decisive",
        types: [MBTI_TYPES.ENTJ, MBTI_TYPES.ESTJ]
    },
    {
        code: "authentic",
        name: "Authentic",
        types: [MBTI_TYPES.ISFP, MBTI_TYPES.INFP]
    },
    {
        code: "harmonizing",
        name: "Harmonizing", 
        types: [MBTI_TYPES.ESFJ, MBTI_TYPES.ENFJ]
    },
    {
        code: "insightful",
        name: "Insightful",
        types: [MBTI_TYPES.INTJ, MBTI_TYPES.INFJ]
    },
    {
        code: "inventive", 
        name: "Inventive",
        types: [MBTI_TYPES.ENTP, MBTI_TYPES.ENFP]
    },
    {
        code: "dependable",
        name: "Dependable", 
        types: [MBTI_TYPES.ISTJ, MBTI_TYPES.ISFJ]
    },
    {
        code: "active",
        name: "Active",
        types: [MBTI_TYPES.ESTP, MBTI_TYPES.ESFP]
    }
];

// Part 3: Value-based Groups for elimination
export interface ValueGroup {
    name: string;
    description: string;
    types: MBTI_TYPES[];
}

export const VALUE_GROUPS: ValueGroup[] = [
    {
        name: "Curiosity and Community",
        description: "Values exploration of ideas and building connections with others",
        types: [MBTI_TYPES.INTP, MBTI_TYPES.ENTP, MBTI_TYPES.ESFJ, MBTI_TYPES.ISFJ]
    },
    {
        name: "Boldness and Empathy", 
        description: "Values taking action and understanding others deeply",
        types: [MBTI_TYPES.ESTP, MBTI_TYPES.ISTP, MBTI_TYPES.ENFJ, MBTI_TYPES.INFJ]
    },
    {
        name: "Duty and Authenticity",
        description: "Values responsibility and being true to oneself", 
        types: [MBTI_TYPES.ESTJ, MBTI_TYPES.ISTJ, MBTI_TYPES.ENFP, MBTI_TYPES.INFP]
    },
    {
        name: "Strategy and Passion",
        description: "Values long-term planning and pursuing what energizes them",
        types: [MBTI_TYPES.ENTJ, MBTI_TYPES.INTJ, MBTI_TYPES.ESFP, MBTI_TYPES.ISFP]
    }
];

// Test info interface
export interface MBTITestInfo {
    sliders: { [key: string]: number }; // dimension name -> value (1-5)
    traits: string[]; // ordered list of trait codes (top 3 get points)
    groups: string[]; // selected group names from elimination
}

// Score type for MBTI
export interface MBTIScoreType {
    personality_type: MBTI_TYPES;
    score: number;
}

export interface MBTITestRequestPayload {
    testReceiver: string;
    testGiver?: string;
    info: MBTIScoreType[];
    group?: string;
}

// MBTI Scoring Function
export function calculateMBTIScores(testInfo: MBTITestInfo): MBTIScoreType[] {
    // Initialize all 16 MBTI types with 0 points
    const scores: Record<MBTI_TYPES, number> = {
        [MBTI_TYPES.INTJ]: 0,
        [MBTI_TYPES.INTP]: 0,
        [MBTI_TYPES.ENTJ]: 0,
        [MBTI_TYPES.ENTP]: 0,
        [MBTI_TYPES.INFJ]: 0,
        [MBTI_TYPES.INFP]: 0,
        [MBTI_TYPES.ENFJ]: 0,
        [MBTI_TYPES.ENFP]: 0,
        [MBTI_TYPES.ISTJ]: 0,
        [MBTI_TYPES.ISTP]: 0,
        [MBTI_TYPES.ESTJ]: 0,
        [MBTI_TYPES.ESTP]: 0,
        [MBTI_TYPES.ISFJ]: 0,
        [MBTI_TYPES.ISFP]: 0,
        [MBTI_TYPES.ESFJ]: 0,
        [MBTI_TYPES.ESFP]: 0
    };

    // Part 1: Slider scoring
    SLIDER_DIMENSIONS.forEach(dimension => {
        const sliderValue = testInfo.sliders[dimension.name];
        if (sliderValue !== undefined) {
            let points = 0;
            let targetTypes: MBTI_TYPES[] = [];

            // Convert slider value (1-5) to points and determine which side
            if (sliderValue === 1) {
                // Strongly left side
                points = 2;
                targetTypes = dimension.leftTypes;
            } else if (sliderValue === 2) {
                // Slightly left side
                points = 1;
                targetTypes = dimension.leftTypes;
            } else if (sliderValue === 3) {
                // Neutral - no points
                points = 0;
            } else if (sliderValue === 4) {
                // Slightly right side
                points = 1;
                targetTypes = dimension.rightTypes;
            } else if (sliderValue === 5) {
                // Strongly right side
                points = 2;
                targetTypes = dimension.rightTypes;
            }

            // Add points to all types that contain the chosen letter
            targetTypes.forEach(type => {
                scores[type] += points;
            });
        }
    });

    // Part 2: Trait ranking scoring
    testInfo.traits.forEach((traitCode, index) => {
        if (index < 3) { // Only top 3 traits get points
            const trait = PERSONALITY_TRAITS.find(t => t.code === traitCode);
            if (trait) {
                let points = 0;
                if (index === 0) points = 3; // Top 1 = +3
                else if (index === 1) points = 2; // Top 2 = +2
                else if (index === 2) points = 1; // Top 3 = +1

                trait.types.forEach(type => {
                    scores[type] += points;
                });
            }
        }
    });

    // Part 3: Value group scoring
    if (testInfo.groups.length > 0) {
        const winningGroupName = testInfo.groups[0]; // Assuming the first group is the winner
        const winningGroup = VALUE_GROUPS.find(group => group.name === winningGroupName);
        if (winningGroup) {
            winningGroup.types.forEach(type => {
                scores[type] += 1;
            });
        }
    }

    // Convert scores to sorted result array
    const results: MBTIScoreType[] = Object.entries(scores)
        .map(([type, score]) => ({
            personality_type: type as MBTI_TYPES,
            score: score
        }))
        .sort((a, b) => b.score - a.score); // Sort by score descending

    return results;
} 