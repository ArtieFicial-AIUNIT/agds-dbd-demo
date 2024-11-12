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
        alternativeMarkets: ['china', 'singapore'] // Updated alternatives
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
        alternativeMarkets: ['japan', 'singapore'] // Updated alternatives
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
        alternativeMarkets: ['japan', 'china'] // Updated alternatives
    }
};
