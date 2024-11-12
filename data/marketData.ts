import { MarketData } from '../types/market';

export const marketData: Record<string, MarketData> = {
    china: {
        id: 'china',
        name: 'China',
        basePrice: 50,
        tariffRate: 0.20,
        regulations: [
            {
                name: 'Health Certificate',
                cost: 250,
                description: 'Required health certification for seafood imports'
            },
            {
                name: 'Export Permit',
                cost: 150,
                description: 'Standard export permit'
            }
        ],
        shippingCost: {
            baseRate: 500,
            perKgRate: 2.5
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01',
            restrictions: ['Limited import quota']
        },
        demandLevel: 9,
        seasonalDemand: {
            peak: ['01', '02', '12'], // Lunar New Year period
            low: ['07', '08']
        },
        alternativeMarkets: ['japan', 'singapore']
    },
    japan: {
        id: 'japan',
        name: 'Japan',
        basePrice: 45,
        tariffRate: 0.15,
        regulations: [
            {
                name: 'Quality Certification',
                cost: 200,
                description: 'JAS certification requirement'
            }
        ],
        shippingCost: {
            baseRate: 450,
            perKgRate: 2.0
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01'
        },
        demandLevel: 8,
        seasonalDemand: {
            peak: ['12', '01'],
            low: ['06', '07']
        },
        alternativeMarkets: ['korea', 'southKorea']
    },
    usa: {
        id: 'usa',
        name: 'USA',
        basePrice: 48,
        tariffRate: 0.10,
        regulations: [
            {
                name: 'FDA Registration',
                cost: 300,
                description: 'FDA import registration'
            }
        ],
        shippingCost: {
            baseRate: 600,
            perKgRate: 3.0
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01'
        },
        demandLevel: 7,
        seasonalDemand: {
            peak: ['11', '12'],
            low: ['05', '06']
        },
        alternativeMarkets: ['canada', 'mexico']
    },
    singapore: {
        id: 'singapore',
        name: 'Singapore',
        basePrice: 52,
        tariffRate: 0.05, // Low tariff rate as a trade hub
        regulations: [
            {
                name: 'SFA Certification',
                cost: 180,
                description: 'Singapore Food Agency safety certification'
            }
        ],
        shippingCost: {
            baseRate: 400,
            perKgRate: 2.0
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01'
        },
        demandLevel: 8,
        seasonalDemand: {
            peak: ['01', '12'], // New Year period
            low: ['06', '07']
        },
        alternativeMarkets: ['malaysia', 'indonesia']
    },
    vietnam: {
        id: 'vietnam',
        name: 'Vietnam',
        basePrice: 42,
        tariffRate: 0.12,
        regulations: [
            {
                name: 'Import License',
                cost: 150,
                description: 'Standard import licensing'
            },
            {
                name: 'Food Safety Cert',
                cost: 180,
                description: 'Local food safety requirements'
            }
        ],
        shippingCost: {
            baseRate: 450,
            perKgRate: 2.2
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01'
        },
        demandLevel: 7,
        seasonalDemand: {
            peak: ['01', '02'], // Lunar New Year
            low: ['08', '09']
        },
        alternativeMarkets: ['thailand', 'cambodia']
    },
    southKorea: {
        id: 'southKorea',
        name: 'South Korea',
        basePrice: 47,
        tariffRate: 0.15,
        regulations: [
            {
                name: 'KFDA Approval',
                cost: 280,
                description: 'Korean Food & Drug Administration certification'
            }
        ],
        shippingCost: {
            baseRate: 480,
            perKgRate: 2.3
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01'
        },
        demandLevel: 8,
        seasonalDemand: {
            peak: ['12', '01'], // Winter season
            low: ['07', '08']
        },
        alternativeMarkets: ['japan', 'china']
    },
    thailand: {
        id: 'thailand',
        name: 'Thailand',
        basePrice: 43,
        tariffRate: 0.14,
        regulations: [
            {
                name: 'FDA Registration',
                cost: 220,
                description: 'Thai FDA import registration'
            },
            {
                name: 'Quality Control',
                cost: 160,
                description: 'Product quality certification'
            }
        ],
        shippingCost: {
            baseRate: 440,
            perKgRate: 2.1
        },
        status: {
            isOpen: true,
            lastUpdated: '2024-01-01'
        },
        demandLevel: 6,
        seasonalDemand: {
            peak: ['11', '12'], // Tourist season
            low: ['05', '06']
        },
        alternativeMarkets: ['vietnam', 'malaysia']
    }
};
