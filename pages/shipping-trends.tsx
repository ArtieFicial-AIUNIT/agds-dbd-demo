import { PageContent } from '@ag.ds-next/react/content';
import { DocumentTitle } from '../components/DocumentTitle';
import { AppLayout } from '../components/AppLayout';
import { ShippingTrendDashboard } from '../components/ShippingTrendDashboard/ShippingTrendDashboard';

export default function ShippingTrendsPage() {
    return (
        <AppLayout>
            <DocumentTitle title="Shipping Cost Trends" />
            <PageContent>
                <ShippingTrendDashboard />
            </PageContent>
        </AppLayout>
    );
}
