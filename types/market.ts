export interface MarketData {
    id: string;
    name: string;
    basePrice: number;
    tariffRate: number;
    regulations: RegulationRequirement[];
    shippingCost: ShippingCost;
    status: MarketStatus;
    demandLevel: number; // 0-10 scale
    seasonalDemand: SeasonalDemand;
    alternativeMarkets: string[];
}

export interface RegulationRequirement {
    name: string;
    cost: number;
    description: string;
}

export interface ShippingCost {
    baseRate: number;
    perKgRate: number;
}

export interface CostBreakdown {
    baseCost: number;
    shippingCost: number;
    tariffCost: number;
    regulatoryCost: number;
    total: number;
}

export interface MarketStatus {
    isOpen: boolean;
    lastUpdated: string;
    restrictions?: string[];
}

export interface SeasonalDemand {
    peak: string[];    // months
    low: string[];     // months
}

export interface MarketRecommendation {
    marketId: string;
    score: number;
    reasons: string[];
}
