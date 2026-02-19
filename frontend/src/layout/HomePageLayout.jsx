import Layout from '@/components/Layout';
import SiteStatsTemplate from '@/templates/SiteStatsTemplate'
import CustomerQuestionsTemplate from '@/templates/CustomerQuestionsTemplate';
import FeaturesTemplate from '@/templates/FeaturesTemplate';
import HighlightsTemplate from '@/templates/HighlightsTemplate';
import WorkflowTemplate from '@/templates/WorkflowTemplate';
import ServicesTemplate from '@/templates/ServicesTemplate';
import TeamTemplate from '@/templates/TeamTemplate';
import PricesTemplate from '@/templates/PricesTemplate';
import TopDeliveryDriversTemplate from '@/templates/TopDeliveryDriversTemplate';
import UserRatingsTemplate from '@/templates/UserRatingsTemplate';

export default function HomePageLayout() {
    return (
        <Layout>
            <HighlightsTemplate/>
            <SiteStatsTemplate/>
            <FeaturesTemplate/>
            <TopDeliveryDriversTemplate/>
            <TeamTemplate/>
            <WorkflowTemplate/>
            <ServicesTemplate/>
            <PricesTemplate/>
            <UserRatingsTemplate/>
            <CustomerQuestionsTemplate/>
        </Layout>
    );
}