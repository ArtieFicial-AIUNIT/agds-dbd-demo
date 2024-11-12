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
        }
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
        }
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
        }
    }
};
