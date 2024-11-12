import { useState } from 'react';
import { Card } from '@ag.ds-next/react/card';
import { Text } from '@ag.ds-next/react/text';
import { Box } from '@ag.ds-next/react/box';
import { Stack } from '@ag.ds-next/react/stack';
import { Button } from '@ag.ds-next/react/button';
import { Callout } from '@ag.ds-next/react/callout';
import { marketData } from '../../data/marketData';
import { predictionData } from '../../data/predictionData';
import { SimpleChart } from './SimpleChart';

const MARKET_COLORS = {
    china: '#ff6b6b',
    japan: '#4dabf7',
    usa: '#69db7c',
    singapore: '#ffd43b'
};

export const ShippingTrendDashboard = () => {
    const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['china', 'japan']);

    // Calculate max cost for scaling
    const maxCost = Math.max(
        ...predictionData.flatMap(market => 
            market.trends.map(t => t.cost)
        )
    );

    // Process data for visualization
    const processedData = predictionData.map(market => ({
        marketId: market.marketId,
        data: market.trends.map(trend => ({
            month: new Date(trend.month).toLocaleDateString('default', { 
                month: 'short',
                year: '2-digit'
            }),
            cost: trend.cost,
            height: (trend.cost / maxCost) * 100 + '%'
        }))
    }));

    return (
        <Stack gap={2}>
            <Box padding={1}>
                <Text as="h2" fontSize="xl" weight="bold">
                    Shipping Cost Predictions
                </Text>
                <Text color="muted">
                    Forecasted shipping costs per kg from December 2024 to December 2025
                </Text>
            </Box>

            <Box padding={1}>
                <Stack gap={1}>
                    <Text weight="bold">Select Markets:</Text>
                    <Box display="flex" gap={1} flexWrap="wrap">
                        {Object.entries(marketData).map(([id, market]) => (
                            <Button
                                key={id}
                                onClick={() => {
                                    setSelectedMarkets(prev =>
                                        prev.includes(id)
                                            ? prev.filter(m => m !== id)
                                            : [...prev, id]
                                    );
                                }}
                                variant={selectedMarkets.includes(id) ? 'primary' : 'secondary'}
                            >
                                {market.name}
                            </Button>
                        ))}
                    </Box>
                </Stack>
            </Box>

            <Box display="grid" gap={2}>
                {processedData
                    .filter(market => selectedMarkets.includes(market.marketId))
                    .map(market => (
                        <Card key={market.marketId} shadow>
                            <Box padding={1.5}>
                                <SimpleChart 
                                    data={market.data}
                                    marketName={marketData[market.marketId].name}
                                    color={MARKET_COLORS[market.marketId as keyof typeof MARKET_COLORS]}
                                />
                            </Box>
                        </Card>
                    ))}
            </Box>

            <Box display="grid" gap={2} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                {selectedMarkets.map(marketId => {
                    const latestTrend = predictionData
                        .find(m => m.marketId === marketId)
                        ?.trends.slice(-1)[0];
                    
                    return (
                        <Card key={marketId} shadow background="shade">
                            <Stack gap={1} padding={1}>
                                <Text weight="bold">{marketData[marketId].name}</Text>
                                <Text>Latest Prediction (Dec 2025):</Text>
                                <Text fontSize="xl" weight="bold">
                                    ${latestTrend?.cost.toFixed(2)} AUD/kg
                                </Text>
                                <Text fontSize="sm" color="muted">
                                    Confidence: {(latestTrend?.confidence || 0) * 100}%
                                </Text>
                            </Stack>
                        </Card>
                    );
                })}
            </Box>
        </Stack>
    );
};
