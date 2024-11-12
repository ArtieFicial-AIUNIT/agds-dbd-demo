import { useState, useMemo } from 'react';
import { Card } from '@ag.ds-next/react/card';
import { Text } from '@ag.ds-next/react/text';
import { Box } from '@ag.ds-next/react/box';
import { Button } from '@ag.ds-next/react/button';
import { Callout } from '@ag.ds-next/react/callout';
import { Table } from '@ag.ds-next/react/table';
import { TextInput } from '@ag.ds-next/react/text-input';
import { Stack } from '@ag.ds-next/react/stack';
import { marketData } from '../../data/marketData';
import { MarketRecommendation } from '../../types/market';

export const MarketSimulator = () => {
    const [simulatedClosures, setSimulatedClosures] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<MarketRecommendation[]>([]);
    const [quantity, setQuantity] = useState<string>('100'); // Default quantity
    const [impactAnalysis, setImpactAnalysis] = useState<{
        beforeClosure: number;
        afterClosure: number;
        lostRevenue: number;
    } | null>(null);

    const toggleMarketClosure = (marketId: string) => {
        setSimulatedClosures(prev => 
            prev.includes(marketId) 
                ? prev.filter(id => id !== marketId)
                : [...prev, marketId]
        );
    };

    const calculateTotalCost = (marketId: string, qty: number) => {
        const market = marketData[marketId];
        const baseCost = market.basePrice * qty;
        const shippingCost = market.shippingCost.baseRate + (market.shippingCost.perKgRate * qty);
        const tariffCost = baseCost * market.tariffRate;
        const regulatoryCost = market.regulations.reduce((sum, reg) => sum + reg.cost, 0);
        return baseCost + shippingCost + tariffCost + regulatoryCost;
    };

    const calculateMarketScore = (market: typeof marketData[keyof typeof marketData]) => {
        const currentMonth = new Date().getMonth() + 1;
        const monthStr = currentMonth.toString().padStart(2, '0');
        const isInPeakSeason = market.seasonalDemand.peak.includes(monthStr);
        const isInLowSeason = market.seasonalDemand.low.includes(monthStr);
        
        const demandScore = market.demandLevel * 0.4;
        const tariffScore = (1 - market.tariffRate) * 0.3;
        const seasonalityScore = (isInPeakSeason ? 2 : isInLowSeason ? 0.5 : 1) * 0.3;
        
        return {
            total: demandScore + tariffScore + seasonalityScore,
            components: {
                demand: demandScore,
                tariff: tariffScore,
                seasonality: seasonalityScore
            }
        };
    };

    const generateReasons = (market: typeof marketData[keyof typeof marketData]) => {
        const reasons = [];
        if (market.demandLevel >= 8) reasons.push('High market demand');
        if (market.tariffRate <= 0.15) reasons.push('Favorable tariff rates');
        if (market.shippingCost.perKgRate <= 2.5) reasons.push('Competitive shipping rates');
        return reasons;
    };

    const generateRecommendations = () => {
        const qty = parseFloat(quantity) || 100;
        
        // Calculate total cost before closures
        const beforeCost = Object.entries(marketData)
            .filter(([id]) => !simulatedClosures.includes(id))
            .reduce((sum, [id]) => sum + calculateTotalCost(id, qty), 0);

        // Generate recommendations and calculate new total cost
        const recommendations = Object.entries(marketData)
            .filter(([id]) => !simulatedClosures.includes(id))
            .map(([id, market]) => {
                const scoreDetails = calculateMarketScore(market);
                return {
                    marketId: id,
                    score: scoreDetails.total,
                    scoreComponents: scoreDetails.components,
                    reasons: generateReasons(market),
                    estimatedCost: calculateTotalCost(id, qty)
                };
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const afterCost = recommendations.reduce((sum, rec) => sum + rec.estimatedCost, 0);

        setImpactAnalysis({
            beforeClosure: beforeCost,
            afterClosure: afterCost,
            lostRevenue: beforeCost - afterCost
        });

        setRecommendations(recommendations);
    };

    return (
        <Card>
            <Stack gap={1}>
                <Text as="h3">Market Scenario Simulator</Text>
                
                <Box padding={1}>
                    <TextInput
                        label="Export Quantity (kg)"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </Box>

                <Box padding={1} display="flex" gap={1}>
                    {Object.entries(marketData).map(([id, market]) => (
                        <Button
                            key={id}
                            onClick={() => toggleMarketClosure(id)}
                            variant={simulatedClosures.includes(id) ? 'negative' : 'secondary'}
                        >
                            {market.name}: {simulatedClosures.includes(id) ? 'Closed' : 'Open'}
                        </Button>
                    ))}
                </Box>

                <Button onClick={generateRecommendations}>Analyze Impact & Get Recommendations</Button>

                {impactAnalysis && (
                    <Callout title="Market Closure Impact Analysis" tone={impactAnalysis.lostRevenue > 0 ? 'warning' : 'success'}>
                        <Table>
                            <tbody>
                                <tr>
                                    <td>Total Cost Before Closures:</td>
                                    <td>${impactAnalysis.beforeClosure.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Estimated Cost After Closures:</td>
                                    <td>${impactAnalysis.afterClosure.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Potential Revenue Impact:</td>
                                    <td>${Math.abs(impactAnalysis.lostRevenue).toFixed(2)} {impactAnalysis.lostRevenue > 0 ? 'Loss' : 'Gain'}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Callout>
                )}

                {recommendations.length > 0 && (
                    <Box padding={1}>
                        <Text as="h4">Recommended Alternative Markets:</Text>
                        {recommendations.map((rec) => (
                            <Callout 
                                key={rec.marketId} 
                                title={`${marketData[rec.marketId].name} (Score: ${rec.score.toFixed(2)})`}
                            >
                                <Stack gap={0.5}>
                                    <Text>Estimated Cost: ${rec.estimatedCost.toFixed(2)}</Text>
                                    <Text weight="bold">Score Components:</Text>
                                    <ul>
                                        <li>Market Demand: {(rec.scoreComponents.demand * 100 / 0.4).toFixed(1)}%</li>
                                        <li>Tariff Impact: {(rec.scoreComponents.tariff * 100 / 0.3).toFixed(1)}%</li>
                                        <li>Seasonal Timing: {(rec.scoreComponents.seasonality * 100 / 0.3).toFixed(1)}%</li>
                                    </ul>
                                    <Text weight="bold">Key Advantages:</Text>
                                    <ul>
                                        {rec.reasons.map((reason, i) => (
                                            <li key={i}>{reason}</li>
                                        ))}
                                    </ul>
                                </Stack>
                            </Callout>
                        ))}
                    </Box>
                )}
            </Stack>
        </Card>
    );
};
