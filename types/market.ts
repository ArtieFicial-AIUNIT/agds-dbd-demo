export interface MarketData {
    id: string;
    name: string;
    basePrice: number;
    tariffRate: number;
    regulations: RegulationRequirement[];
    shippingCost: ShippingCost;
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
