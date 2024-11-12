import { PageContent } from '@ag.ds-next/react/content';
import { Prose } from '@ag.ds-next/react/prose';
import { Stack } from '@ag.ds-next/react/stack';
import { AppLayout } from '../AppLayout';
import { CostCalculator } from '../CostCalculator/CostCalculator';
import { MarketSimulator } from '../MarketSimulator/MarketSimulator';

export const HomePage = () => {
    return (
        <AppLayout>
            <PageContent>
                <Stack gap={2}>
                    <Prose>
                        <h1>Trade Analysis and Market Planning</h1>
                        <p>
                            This tool assists Australian lobster exporters with market planning and cost analysis for international trade.
                        </p>
                        <p>
                            For detailed information on export costs, tariffs, regulatory compliance, and market demand, please explore the various sections of this application.
                        </p>
                        <h2>Export Cost Calculator</h2>
                        <p>Use the calculator below to estimate your export costs:</p>
                    </Prose>
                    <CostCalculator />
                    <Prose>
                        <h2>Market Scenario Planning</h2>
                        <p>Simulate market closures and find alternative export destinations:</p>
                    </Prose>
                    <MarketSimulator />
                </Stack>
            </PageContent>
        </AppLayout>
    );
};
