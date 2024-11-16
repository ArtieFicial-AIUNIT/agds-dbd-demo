import { Select } from '@ag.ds-next/react/select';
import { Stack } from '@ag.ds-next/react/stack';
import { Card } from '@ag.ds-next/react/card';
import { Box } from '@ag.ds-next/react/box';
import { Text } from '@ag.ds-next/react/text';
import { useState } from 'react';

const markets = {
    china: { status: 'closed', alternatives: ['japan', 'singapore', 'vietnam'] },
    japan: { status: 'open', alternatives: [] },
    singapore: { status: 'open', alternatives: [] },
    vietnam: { status: 'open', alternatives: [] },
};

const costs = {
    china: { freight: 5000, tariff: 25 },
    japan: { freight: 4500, tariff: 10 },
    singapore: { freight: 3500, tariff: 5 },
    vietnam: { freight: 3000, tariff: 15 },
};

export const TradeScenario = () => {
    const [destination, setDestination] = useState('');

    const handleDestinationChange = (value: string) => {
        setDestination(value);
    };

    return (
        <Stack gap={1.5}>
            <Select
                label="Select destination market"
                options={Object.keys(markets).map(market => ({
                    label: market.charAt(0).toUpperCase() + market.slice(1),
                    value: market,
                }))}
                value={destination}
                onChange={e => handleDestinationChange(e.target.value)}
            />

            {destination && (
                <Card>
                    <Box padding={1.5}>
                        <Stack gap={1}>
                            <Text>
                                Market status: {markets[destination].status.toUpperCase()}
                            </Text>
                            {markets[destination].status === 'closed' && (
                                <>
                                    <Text weight="bold">Alternative markets:</Text>
                                    {markets[destination].alternatives.map(alt => (
                                        <Card key={alt}>
                                            <Box padding={1}>
                                                <Text>{alt.charAt(0).toUpperCase() + alt.slice(1)}</Text>
                                                <Text>Freight cost: ${costs[alt].freight}</Text>
                                                <Text>Tariff rate: {costs[alt].tariff}%</Text>
                                            </Box>
                                        </Card>
                                    ))}
                                </>
                            )}
                            {markets[destination].status === 'open' && (
                                <>
                                    <Text>Freight cost: ${costs[destination].freight}</Text>
                                    <Text>Tariff rate: {costs[destination].tariff}%</Text>
                                </>
                            )}
                        </Stack>
                    </Box>
                </Card>
            )}
        </Stack>
    );
};
