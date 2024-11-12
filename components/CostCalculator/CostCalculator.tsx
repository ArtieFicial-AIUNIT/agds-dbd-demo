import { useState } from 'react';
import { FormStack } from '@ag.ds-next/react/form-stack';
import { Select } from '@ag.ds-next/react/select';
import { TextInput } from '@ag.ds-next/react/text-input';
import { Button } from '@ag.ds-next/react/button';
import { Box } from '@ag.ds-next/react/box';
import { Text } from '@ag.ds-next/react/text';
import { Card } from '@ag.ds-next/react/card';
import { Table } from '@ag.ds-next/react/table';
import { Accordion, AccordionItem } from '@ag.ds-next/react/accordion';
import { marketData } from '../../data/marketData';
import { CostBreakdown } from '../../types/market';

export const CostCalculator = () => {
    const [destination, setDestination] = useState('');
    const [quantity, setQuantity] = useState('');
    const [breakdown, setBreakdown] = useState<CostBreakdown | null>(null);
    const [error, setError] = useState<string | null>(null);

    const calculateCosts = () => {
        try {
            setError(null);
            
            if (!destination) {
                setError('Please select a destination');
                return;
            }
            
            if (!quantity || parseFloat(quantity) <= 0) {
                setError('Please enter a valid quantity');
                return;
            }

            const market = marketData[destination];
            if (!market) {
                setError('Market data not found');
                return;
            }

            const qty = parseFloat(quantity);
            const baseCost = market.basePrice * qty;
            const shippingCost = market.shippingCost.baseRate + (market.shippingCost.perKgRate * qty);
            const tariffCost = baseCost * market.tariffRate;
            const regulatoryCost = market.regulations.reduce((sum, reg) => sum + reg.cost, 0);

            const newBreakdown: CostBreakdown = {
                baseCost,
                shippingCost,
                tariffCost,
                regulatoryCost,
                total: baseCost + shippingCost + tariffCost + regulatoryCost
            };

            setBreakdown(newBreakdown);
            
        } catch (err) {
            console.error('Calculation error:', err);
            setError('An error occurred while calculating costs');
        }
    };

    return (
        <Card>
            <FormStack>
                <Select 
                    label="Export destination"
                    required
                    options={[
                        { label: 'Select destination', value: '' },
                        ...Object.entries(marketData).map(([id, market]) => ({
                            label: market.name,
                            value: id
                        }))
                    ]}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <TextInput
                    label="Quantity (kg)"
                    type="number"
                    required
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                
                {error && (
                    <Box padding={1} background="shade" tone="error">
                        <Text>{error}</Text>
                    </Box>
                )}

                <Button onClick={calculateCosts}>Calculate costs</Button>
                
                {breakdown && (
                    <Box padding={1}>
                        <Text fontWeight="bold" fontSize="lg">
                            Total Cost: ${breakdown.total.toFixed(2)} AUD
                        </Text>
                        
                        <Accordion>
                            <AccordionItem title="View Cost Breakdown">
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
                                    </tbody>
                                </Table>
                            </AccordionItem>

                            {destination && (
                                <AccordionItem title="View Required Regulations">
                                    <Box padding={1}>
                                        <ul>
                                            {marketData[destination].regulations.map(reg => (
                                                <li key={reg.name}>
                                                    {reg.name} - ${reg.cost} - {reg.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </Box>
                                </AccordionItem>
                            )}
                        </Accordion>
                    </Box>
                )}
            </FormStack>
        </Card>
    );
};
