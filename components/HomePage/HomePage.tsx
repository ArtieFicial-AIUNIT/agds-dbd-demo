import { PageContent } from '@ag.ds-next/react/content';
import { Prose } from '@ag.ds-next/react/prose';
import { AppLayout } from '../AppLayout';

export const HomePage = () => {
    return (
        <AppLayout>
            <PageContent>
                <Prose>
                    <h1>Trade Analysis and Market Planning</h1>
                    <p>
                        This tool assists Australian lobster exporters with market planning and cost analysis for international trade.
                    </p>
                    <p>
                        For detailed information on export costs, tariffs, regulatory compliance, and market demand, please explore the various sections of this application.
                    </p>
                </Prose>
            </PageContent>
        </AppLayout>
    );
};
