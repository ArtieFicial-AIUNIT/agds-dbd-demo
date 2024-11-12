import { useState } from 'react';
import { FormStack } from '@ag.ds-next/react/form-stack';
import { Select } from '@ag.ds-next/react/select';
import { TextInput } from '@ag.ds-next/react/text-input';
import { Button } from '@ag.ds-next/react/button';
import { Box } from '@ag.ds-next/react/box';
import { Text } from '@ag.ds-next/react/text';
import { Card } from '@ag.ds-next/react/card';
import { Table } from '@ag.ds-next/react/table';
import { marketData } from '../../data/marketData';
import { CostBreakdown } from '../../types/market';

export const CostCalculator = () => {
    const [destination, setDestination] = useState('');
    const [quantity, setQuantity] = useState('');
    const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null);

    const calculateCosts = () => {
        if (!destination || !quantity) return;

        const market = marketData[destination];
        const qty = parseFloat(quantity) || 0;

        const baseCost = market.basePrice * qty;
        const shippingCost = market.shippingCost.baseRate + (market.shippingCost.perKgRate * qty);
        const tariffCost = baseCost * market.tariffRate;
        const regulatoryCost = market.regulations.reduce((sum, reg) => sum + reg.cost, 0);

        const breakdown: CostBreakdown = {
            baseCost,
            shippingCost,
            tariffCost,
            regulatoryCost,
            total: baseCost + shippingCost + tariffCost + regulatoryCost
        };

        setBreakdown(breakdown);
    };

    return (
        <Card>
            <FormStack>
                <Select 
                    label="Export destination"
                    options={[
                        { label: 'Select destination', value: '' },
                        ...Object.values(marketData).map(market => ({
                            label: market.name,
                            value: market.id
                        }))
                    ]}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <TextInput
                    label="Quantity (kg)"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <Button onClick={calculateCosts}>Calculate costs</Button>
                
                {breakdown && (
                    <Box padding={1}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Cost Component</th>
                                    <th>Amount (AUD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Base Cost</td>
                                    <td>${breakdown.baseCost.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Shipping</td>
                                    <td>${breakdown.shippingCost.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Tariffs</td>
                                    <td>${breakdown.tariffCost.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Regulatory Compliance</td>
                                    <td>${breakdown.regulatoryCost.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Total Cost</strong></td>
                                    <td><strong>${breakdown.total.toFixed(2)}</strong></td>
                                </tr>
                            </tbody>
                        </Table>
                        
                        {destination && (
                            <Box padding={1}>
                                <Text>Required Regulations:</Text>
                                <ul>
                                    {marketData[destination].regulations.map(reg => (
                                        <li key={reg.name}>
                                            {reg.name} - ${reg.cost} - {reg.description}
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </Box>
                )}
            </FormStack>
        </Card>
    );
};
