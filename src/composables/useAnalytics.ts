import { ref } from 'vue';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export function useAnalytics() {
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Helper to format date for chart labels
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const fetchAnalyticsOverview = async (storeId: string, period = 'week') => {
        loading.value = true;
        try {
            // Calculate date range
            const now = new Date();
            const startDate = new Date();
            if (period === 'week') startDate.setDate(now.getDate() - 7);
            else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
            else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);

            const ordersRef = collection(db, 'orders');
            const q = query(
                ordersRef,
                where('storeId', '==', storeId),
                where('createdAt', '>=', Timestamp.fromDate(startDate))
            );

            const snapshot = await getDocs(q);
            const orders: any[] = snapshot.docs.map(doc => doc.data());

            // Calculate metrics
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            // Mock views for conversion rate (since we don't track views yet)
            const mockViews = Math.max(totalOrders * 30, 100);
            const conversionRate = (totalOrders / mockViews) * 100;

            return [
                {
                    title: 'Total Revenue',
                    value: `$${totalRevenue.toFixed(2)}`,
                    icon: 'attach_money',
                    iconClass: 'text-success',
                    trend: { direction: 'up', label: 'vs previous' }
                },
                {
                    title: 'Total Orders',
                    value: totalOrders.toString(),
                    icon: 'shopping_bag',
                    iconClass: 'text-primary',
                    trend: { direction: 'up', label: 'vs previous' }
                },
                {
                    title: 'Avg. Order Value',
                    value: `$${avgOrderValue.toFixed(2)}`,
                    icon: 'receipt',
                    iconClass: 'text-info',
                    trend: { direction: 'down', label: 'vs previous' }
                },
                {
                    title: 'Conversion Rate',
                    value: `${conversionRate.toFixed(1)}%`,
                    icon: 'trending_up',
                    iconClass: 'text-warning',
                    trend: { direction: 'up', label: 'vs previous' }
                }
            ];
        } catch (e: any) {
            console.error('Error fetching analytics overview:', e);
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const fetchRevenueTrend = async (storeId: string, _period = 'week') => {
        // Real implementation would aggregate by day
        // For now, we'll fetch orders and group them client-side
        loading.value = true;
        try {
            const now = new Date();
            const startDate = new Date();
            startDate.setDate(now.getDate() - 7); // Default to week

            const ordersRef = collection(db, 'orders');
            const q = query(
                ordersRef,
                where('storeId', '==', storeId),
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                orderBy('createdAt', 'asc')
            );

            const snapshot = await getDocs(q);

            // Initialize last 7 days with 0
            const dailyRevenue: Record<string, number> = {};
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i);
                dailyRevenue[formatDate(d)] = 0;
            }

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const date = data.createdAt.toDate();
                const key = formatDate(date);
                if (dailyRevenue[key] !== undefined) {
                    dailyRevenue[key] += (data.total || 0);
                }
            });

            return {
                labels: Object.keys(dailyRevenue),
                datasets: [{
                    label: 'Revenue',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderColor: '#3b82f6',
                    data: Object.values(dailyRevenue),
                    fill: true,
                    tension: 0.4
                }]
            };
        } catch (e: any) {
            console.error('Error fetching revenue trend:', e);
            // Return empty data on error
            return { labels: [], datasets: [] };
        } finally {
            loading.value = false;
        }
    };

    const fetchTopProducts = async (storeId: string) => {
        loading.value = true;
        try {
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('storeId', '==', storeId), limit(5));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    // Mock performance data if fields don't exist
                    views: data.views || Math.floor(Math.random() * 1000),
                    sales: data.sales || Math.floor(Math.random() * 100),
                    revenue: (data.price * (data.sales || Math.floor(Math.random() * 100))).toFixed(2),
                    conversion: ((data.sales || 1) / (data.views || 100) * 100).toFixed(1)
                };
            });
        } catch (e: any) {
            console.error('Error fetching top products:', e);
            return [];
        } finally {
            loading.value = false;
        }
    };

    // Mock Data for Traffic Sources (Hard to track without dedicated analytics)
    const fetchTrafficSources = async () => {
        return {
            labels: ['Direct', 'Social', 'Search', 'Email'],
            datasets: [{
                backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
                data: [40, 25, 20, 15],
                borderWidth: 0
            }]
        };
    };

    // Mock Data for Sales Funnel
    const fetchSalesFunnel = async () => {
        return {
            labels: ['Views', 'Add to Cart', 'Checkout', 'Purchase'],
            datasets: [{
                label: 'Users',
                backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
                data: [5000, 1200, 600, 450],
                borderRadius: 8
            }]
        };
    };

    return {
        loading,
        error,
        fetchAnalyticsOverview,
        fetchRevenueTrend,
        fetchTopProducts,
        fetchTrafficSources,
        fetchSalesFunnel
    };
}
