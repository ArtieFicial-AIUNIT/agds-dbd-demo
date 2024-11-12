import { useState } from 'react';
import { Card } from '@ag.ds-next/react/card';
import { Text } from '@ag.ds-next/react/text';
import { Box } from '@ag.ds-next/react/box';
import { Button } from '@ag.ds-next/react/button';
import { Callout } from '@ag.ds-next/react/callout';
import { TextInput } from '@ag.ds-next/react/text-input';
import { Stack } from '@ag.ds-next/react/stack';
import { marketData } from '../../data/marketData';

export const MarketSimulator = () => {
    const [quantity, setQuantity] = useState<string>('100');
    const [simulatedClosures, setSimulatedClosures] = useState<string[]>([]);
    const [analyses, setAnalyses] = useState<Record<string, {
        closedMarketCost: number;
        alternatives: Array<{
            marketId: string;
            name: string;
            estimatedCost: number;
            netCostDifference: number;
            advantages: string[];
        }>;
    }>>({});

    const calculateTotalCost = (marketId: string, qty: number) => {
        const market = marketData[marketId];
        const baseCost = market.basePrice * qty;
        const shippingCost = market.shippingCost.baseRate + (market.shippingCost.perKgRate * qty);
        const tariffCost = baseCost * market.tariffRate;
        const regulatoryCost = market.regulations.reduce((sum, reg) => sum + reg.cost, 0);
        return baseCost + shippingCost + tariffCost + regulatoryCost;
    };

    const generateAdvantages = (market: typeof marketData[keyof typeof marketData]) => {
        const advantages = [];
        if (market.shippingCost.perKgRate <= 2.5) advantages.push('Lower shipping costs');
        if (market.tariffRate <= 0.15) advantages.push('Lower tariff rates');
        if (market.regulations.length <= 1) advantages.push('Simpler regulatory requirements');
        return advantages;
    };

    const toggleMarketClosure = (marketId: string) => {
        setSimulatedClosures(prev => {
            const newClosures = prev.includes(marketId)
                ? prev.filter(id => id !== marketId)
                : [...prev, marketId];
            
            // If market is being opened, remove its analysis
            if (prev.includes(marketId)) {
                setAnalyses(current => {
                    const { [marketId]: _, ...rest } = current;
                    return rest;
                });
            } else {
                // If market is being closed, generate analysis
                analyzeAlternatives(marketId);
            }
            
            return newClosures;
        });
    };

    const analyzeAlternatives = (marketId: string) => {
        const qty = parseFloat(quantity) || 100;
        const closedMarketCost = calculateTotalCost(marketId, qty);

        const alternatives = Object.entries(marketData)
            .filter(([id]) => id !== marketId && !simulatedClosures.includes(id))
            .map(([id, market]) => ({
                marketId: id,
                name: market.name,
                estimatedCost: calculateTotalCost(id, qty),
                netCostDifference: calculateTotalCost(id, qty) - closedMarketCost,
                advantages: generateAdvantages(market)
            }))
            .sort((a, b) => a.estimatedCost - b.estimatedCost);

        setAnalyses(current => ({
            ...current,
            [marketId]: {
                closedMarketCost,
                alternatives
            }
        }));
    };

    return (
        <Card>
            <Stack gap={2}>
                <Text as="h3" fontSize="xl" weight="bold">Market Alternative Analysis</Text>
                
                <Box padding={1}>
                    <TextInput
                        label="Export Quantity (kg)"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value);
                            // Recalculate all existing analyses with new quantity
                            simulatedClosures.forEach(marketId => analyzeAlternatives(marketId));
                        }}
                    />
                </Box>

                <Box padding={1}>
                    <Text weight="bold" fontSize="md">Select markets to close:</Text>
                    <Box display="flex" flexWrap="wrap" gap={1} paddingTop={1}>
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
                </Box>

                {simulatedClosures.map(marketId => (
                    <Stack key={marketId} gap={2}>
                        {analyses[marketId] && (
                            <>
                                <Callout 
                                    title={
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Text fontSize="xl" weight="bold" fontFamily="heading">
                                                {marketData[marketId].name} Market Analysis
                                            </Text>
                                            <Text 
                                                background="warning" 
                                                color="white" 
                                                padding={0.5} 
                                                borderRadius="sm"
                                                fontSize="xs"
                                            >
                                                Market Closure Scenario
                                            </Text>
                                        </Box>
                                    }
                                    tone="warning"
                                >
                                    <Box padding={1.5}>
                                        <Stack gap={2}>
                                            {/* Current Market Stats */}
                                            <Box 
                                                background="bodyAlt" 
                                                padding={1.5} 
                                                borderRadius="lg"
                                                shadow
                                            >
                                                <Stack gap={1}>
                                                    <Text fontSize="sm" color="muted" fontFamily="heading">
                                                        CURRENT MARKET PERFORMANCE
                                                    </Text>
                                                    <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                                                        <Box>
                                                            <Text fontSize="sm" color="muted">Total Export Cost</Text>
                                                            <Text fontSize="xxl" weight="bold">
                                                                ${analyses[marketId].closedMarketCost.toFixed(2)}
                                                            </Text>
                                                            <Text fontSize="xs" color="muted">AUD</Text>
                                                        </Box>
                                                        <Box>
                                                            <Text fontSize="sm" color="muted">Export Volume</Text>
                                                            <Text fontSize="lg" weight="bold">
                                                                {quantity} kg
                                                            </Text>
                                                        </Box>
                                                    </Box>
                                                </Stack>
                                            </Box>

                                            {/* Market Details Grid */}
                                            <Box 
                                                display="grid" 
                                                gap={1.5}
                                                style={{
                                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
                                                }}
                                            >
                                                <Box padding={1.5} background="shade" borderRadius="sm">
                                                    <Stack gap={0.5}>
                                                        <Text fontSize="xs" color="muted">BASE PRICE</Text>
                                                        <Text fontSize="lg" weight="bold">
                                                            ${marketData[marketId].basePrice}
                                                            <Text as="span" fontSize="sm" color="muted">/kg</Text>
                                                        </Text>
                                                    </Stack>
                                                </Box>

                                                <Box padding={1.5} background="shade" borderRadius="sm">
                                                    <Stack gap={0.5}>
                                                        <Text fontSize="xs" color="muted">TARIFF RATE</Text>
                                                        <Text fontSize="lg" weight="bold">
                                                            {(marketData[marketId].tariffRate * 100).toFixed(1)}%
                                                        </Text>
                                                    </Stack>
                                                </Box>

                                                <Box padding={1.5} background="shade" borderRadius="sm">
                                                    <Stack gap={0.5}>
                                                        <Text fontSize="xs" color="muted">SHIPPING RATE</Text>
                                                        <Text fontSize="lg" weight="bold">
                                                            ${marketData[marketId].shippingCost.perKgRate}
                                                            <Text as="span" fontSize="sm" color="muted">/kg</Text>
                                                        </Text>
                                                    </Stack>
                                                </Box>

                                                <Box padding={1.5} background="shade" borderRadius="sm">
                                                    <Stack gap={0.5}>
                                                        <Text fontSize="xs" color="muted">PEAK SEASON</Text>
                                                        <Text fontSize="md" weight="bold">
                                                            {marketData[marketId].seasonalDemand.peak
                                                                .map(month => new Date(2024, parseInt(month) - 1)
                                                                .toLocaleString('default', { month: 'short' }))
                                                                .join(', ')}
                                                        </Text>
                                                    </Stack>
                                                </Box>
                                            </Box>

                                            {/* Regulatory Requirements */}
                                            <Box borderTop borderColor="muted" paddingTop={1.5}>
                                                <Text fontSize="sm" color="muted" weight="bold" fontFamily="heading">
                                                    REGULATORY REQUIREMENTS
                                                </Text>
                                                <Box 
                                                    display="grid" 
                                                    gap={1}
                                                    paddingTop={1}
                                                    style={{
                                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                                                    }}
                                                >
                                                    {marketData[marketId].regulations.map(reg => (
                                                        <Box 
                                                            key={reg.name} 
                                                            padding={1.5}
                                                            background="shade" 
                                                            borderRadius="sm"
                                                            shadow
                                                        >
                                                            <Stack gap={0.5}>
                                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                                    <Text fontSize="md" weight="bold" fontFamily="heading">
                                                                        {reg.name}
                                                                    </Text>
                                                                    <Text 
                                                                        fontSize="sm" 
                                                                        background="success"
                                                                        color="white"
                                                                        padding={0.5}
                                                                        borderRadius="sm"
                                                                        fontFamily="monospace"
                                                                    >
                                                                        ${reg.cost} AUD
                                                                    </Text>
                                                                </Box>
                                                                <Text fontSize="sm" color="muted">
                                                                    {reg.description}
                                                                </Text>
                                                            </Stack>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Callout>

                                <Box padding={1}>
                                    <Text as="h4" fontSize="lg" weight="bold" fontFamily="heading">
                                        Alternative Markets
                                    </Text>
                                    
                                    <Box 
                                        display="grid" 
                                        gap={1.5} 
                                        paddingTop={1}
                                        style={{
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                                            alignItems: 'stretch'
                                        }}
                                    >
                                        {analyses[marketId].alternatives.map(alt => (
                                            <Card 
                                                key={alt.marketId} 
                                                shadow
                                                style={{ 
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}
                                                background="shade"
                                            >
                                                <Stack gap={0} style={{ height: '100%' }}>
                                                    <Box 
                                                        padding={1.5} 
                                                        background={alt.netCostDifference <= 0 ? 'success' : 'error'}
                                                        style={{
                                                            borderTopLeftRadius: '4px',
                                                            borderTopRightRadius: '4px'
                                                        }}
                                                    >
                                                        <Text 
                                                            as="h5" 
                                                            fontSize="lg" 
                                                            weight="bold"
                                                            color="white"
                                                        >
                                                            {alt.name}
                                                        </Text>
                                                    </Box>

                                                    <Box padding={1.5} style={{ flex: 1 }}>
                                                        <Stack gap={1} style={{ height: '100%' }}>
                                                            <Box>
                                                                <Text fontSize="sm" color="muted">
                                                                    Estimated Cost
                                                                </Text>
                                                                <Text fontSize="xl" weight="bold">
                                                                    ${alt.estimatedCost.toFixed(2)} AUD
                                                                </Text>
                                                                <Box paddingTop={0.5}>
                                                                    <Text 
                                                                        fontSize="sm"
                                                                        weight="bold"
                                                                        color={alt.netCostDifference > 0 ? 'error' : 'success'}
                                                                    >
                                                                        {alt.netCostDifference > 0 ? '↑' : '↓'} 
                                                                        ${Math.abs(alt.netCostDifference).toFixed(2)} AUD
                                                                    </Text>
                                                                </Box>
                                                            </Box>

                                                            <Box borderTop borderColor="muted" paddingTop={1}>
                                                                <Text fontSize="sm" color="muted" weight="bold">
                                                                    Market Details:
                                                                </Text>
                                                                <Box 
                                                                    display="grid" 
                                                                    gap={0.5} 
                                                                    paddingTop={0.5}
                                                                    style={{
                                                                        gridTemplateColumns: 'auto 1fr',
                                                                        fontSize: '0.875rem'
                                                                    }}
                                                                >
                                                                    <Text>Base Price:</Text>
                                                                    <Text>${marketData[alt.marketId].basePrice}/kg</Text>
                                                                    
                                                                    <Text>Tariff Rate:</Text>
                                                                    <Text>{(marketData[alt.marketId].tariffRate * 100).toFixed(1)}%</Text>
                                                                    
                                                                    <Text>Shipping:</Text>
                                                                    <Text>${marketData[alt.marketId].shippingCost.perKgRate}/kg</Text>
                                                                    
                                                                    <Text>Regulations:</Text>
                                                                    <Text>{marketData[alt.marketId].regulations.length} requirements</Text>

                                                                    <Text>Peak Season:</Text>
                                                                    <Text>
                                                                        {marketData[alt.marketId].seasonalDemand.peak
                                                                            .map(month => new Date(2024, parseInt(month) - 1).toLocaleString('default', { month: 'short' }))
                                                                            .join(', ')}
                                                                    </Text>
                                                                </Box>
                                                            </Box>

                                                            <Box borderTop borderColor="muted" paddingTop={1}>
                                                                <Text fontSize="sm" color="muted" weight="bold">
                                                                    Regulatory Requirements:
                                                                </Text>
                                                                <Box 
                                                                    display="flex" 
                                                                    flexDirection="column"
                                                                    gap={0.5} 
                                                                    paddingTop={0.5}
                                                                >
                                                                    {marketData[alt.marketId].regulations.map(reg => (
                                                                        <Box 
                                                                            key={reg.name} 
                                                                            padding={1} 
                                                                            background="shade" 
                                                                            borderRadius="sm"
                                                                        >
                                                                            <Text fontSize="sm" weight="bold">
                                                                                {reg.name}
                                                                            </Text>
                                                                            <Text fontSize="sm" color="muted">
                                                                                Cost: ${reg.cost} AUD
                                                                            </Text>
                                                                            <Text fontSize="sm">
                                                                                {reg.description}
                                                                            </Text>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            </Box>

                                                            {alt.advantages.length > 0 && (
                                                                <Box>
                                                                    <Text fontSize="sm" color="muted" weight="bold">
                                                                        Key Advantages:
                                                                    </Text>
                                                                    <Box 
                                                                        paddingTop={0.5} 
                                                                        display="flex" 
                                                                        flexDirection="column" 
                                                                        gap={0.5}
                                                                    >
                                                                        {alt.advantages.map((adv, i) => (
                                                                            <Text 
                                                                                key={i} 
                                                                                fontSize="sm"
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '0.5rem'
                                                                                }}
                                                                            >
                                                                                ✓ {adv}
                                                                            </Text>
                                                                        ))}
                                                                    </Box>
                                                                </Box>
                                                            )}
                                                        </Stack>
                                                    </Box>
                                                </Stack>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </Stack>
                ))}

                {simulatedClosures.length > 0 && (
                    <Box paddingTop={2}>
                        <Text fontSize="sm" color="muted" fontStyle="italic">
                            * Cost comparisons are based on your current export quantity of {quantity}kg
                        </Text>
                    </Box>
                )}
            </Stack>
        </Card>
    );
};
