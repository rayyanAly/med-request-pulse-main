// Mock data for the Marketing Analytics Panel

export const dashboardStats = {
  revenue: { value: 124580, change: 12.5, trend: 'up' as const },
  orders: { value: 1847, change: 8.2, trend: 'up' as const },
  aov: { value: 67.45, change: -2.1, trend: 'down' as const },
  customers: { value: 3421, change: 15.7, trend: 'up' as const },
  abandonedCarts: { value: 234, change: -5.3, trend: 'down' as const },
  conversionRate: { value: 3.42, change: 0.8, trend: 'up' as const },
};

export const revenueChartData = [
  { name: 'Jan', revenue: 45000, orders: 320 },
  { name: 'Feb', revenue: 52000, orders: 380 },
  { name: 'Mar', revenue: 48000, orders: 350 },
  { name: 'Apr', revenue: 61000, orders: 420 },
  { name: 'May', revenue: 55000, orders: 390 },
  { name: 'Jun', revenue: 67000, orders: 480 },
  { name: 'Jul', revenue: 72000, orders: 520 },
];

export const trafficSourcesData = [
  { name: 'Organic Search', value: 35, color: 'hsl(var(--chart-1))' },
  { name: 'Direct', value: 25, color: 'hsl(var(--chart-2))' },
  { name: 'Social Media', value: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Email', value: 12, color: 'hsl(var(--chart-4))' },
  { name: 'Referral', value: 8, color: 'hsl(var(--chart-5))' },
];

export const abandonedCarts = [
  { id: 'AC001', customer: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+971501234567', value: 345.00, items: 3, abandonedAt: '2024-01-12T14:30:00', status: 'pending', source: 'website' },
  { id: 'AC002', customer: 'Sarah Ali', email: 'sarah@email.com', phone: '+971502345678', value: 892.50, items: 5, abandonedAt: '2024-01-12T12:15:00', status: 'contacted', source: 'mobile' },
  { id: 'AC003', customer: 'Mohammed Omar', email: 'mohammed@email.com', phone: '+971503456789', value: 156.00, items: 2, abandonedAt: '2024-01-12T10:45:00', status: 'recovered', source: 'website' },
  { id: 'AC004', customer: 'Fatima Khalid', email: 'fatima@email.com', phone: '+971504567890', value: 1250.00, items: 8, abandonedAt: '2024-01-11T18:20:00', status: 'pending', source: 'mobile' },
  { id: 'AC005', customer: 'Omar Youssef', email: 'omar@email.com', phone: '+971505678901', value: 478.25, items: 4, abandonedAt: '2024-01-11T16:00:00', status: 'failed', source: 'website' },
  { id: 'AC006', customer: 'Layla Ibrahim', email: 'layla@email.com', phone: '+971506789012', value: 234.00, items: 2, abandonedAt: '2024-01-11T14:30:00', status: 'contacted', source: 'mobile' },
];

export const campaigns = [
  { id: 'CP001', name: 'Winter Sale 2024', type: 'whatsapp', status: 'active', audience: 5420, sent: 4890, delivered: 4756, opened: 2340, converted: 187, startDate: '2024-01-10', endDate: '2024-01-20' },
  { id: 'CP002', name: 'New Arrivals Announcement', type: 'email', status: 'scheduled', audience: 8200, sent: 0, delivered: 0, opened: 0, converted: 0, startDate: '2024-01-15', endDate: '2024-01-25' },
  { id: 'CP003', name: 'Cart Recovery', type: 'whatsapp', status: 'active', audience: 234, sent: 210, delivered: 198, opened: 156, converted: 45, startDate: '2024-01-01', endDate: '2024-01-31' },
  { id: 'CP004', name: 'Flash Sale Weekend', type: 'email', status: 'completed', audience: 12500, sent: 12500, delivered: 11890, opened: 4560, converted: 892, startDate: '2024-01-05', endDate: '2024-01-07' },
  { id: 'CP005', name: 'VIP Customer Rewards', type: 'whatsapp', status: 'draft', audience: 450, sent: 0, delivered: 0, opened: 0, converted: 0, startDate: '2024-01-20', endDate: '2024-01-30' },
];

export const templates = [
  { id: 'TM001', name: 'Cart Reminder', type: 'whatsapp', language: 'en', status: 'approved', usedCount: 1250, lastUsed: '2024-01-12' },
  { id: 'TM002', name: 'تذكير بالسلة', type: 'whatsapp', language: 'ar', status: 'approved', usedCount: 890, lastUsed: '2024-01-12' },
  { id: 'TM003', name: 'Welcome Email', type: 'email', language: 'en', status: 'approved', usedCount: 5600, lastUsed: '2024-01-11' },
  { id: 'TM004', name: 'Order Confirmation', type: 'email', language: 'en', status: 'approved', usedCount: 3400, lastUsed: '2024-01-12' },
  { id: 'TM005', name: 'Flash Sale Alert', type: 'whatsapp', language: 'en', status: 'pending', usedCount: 0, lastUsed: null },
  { id: 'TM006', name: 'Loyalty Points Update', type: 'email', language: 'en', status: 'rejected', usedCount: 0, lastUsed: null },
];

export const customers = [
  { id: 'CU001', name: 'Ahmed Hassan', email: 'ahmed@email.com', phone: '+971501234567', totalOrders: 12, totalSpent: 4560.00, lastOrder: '2024-01-10', segment: 'vip', language: 'ar' },
  { id: 'CU002', name: 'Sarah Ali', email: 'sarah@email.com', phone: '+971502345678', totalOrders: 8, totalSpent: 2340.00, lastOrder: '2024-01-08', segment: 'regular', language: 'en' },
  { id: 'CU003', name: 'Mohammed Omar', email: 'mohammed@email.com', phone: '+971503456789', totalOrders: 25, totalSpent: 8900.00, lastOrder: '2024-01-12', segment: 'vip', language: 'ar' },
  { id: 'CU004', name: 'Fatima Khalid', email: 'fatima@email.com', phone: '+971504567890', totalOrders: 3, totalSpent: 450.00, lastOrder: '2024-01-05', segment: 'new', language: 'en' },
  { id: 'CU005', name: 'Omar Youssef', email: 'omar@email.com', phone: '+971505678901', totalOrders: 15, totalSpent: 5670.00, lastOrder: '2024-01-11', segment: 'regular', language: 'ar' },
];

export const banners = [
  { id: 'BN001', title: 'Winter Sale Banner', placement: 'homepage-hero', status: 'active', platform: 'both', language: 'en', startDate: '2024-01-10', endDate: '2024-01-20', clicks: 2340 },
  { id: 'BN002', title: 'New Collection', placement: 'homepage-secondary', status: 'active', platform: 'website', language: 'en', startDate: '2024-01-01', endDate: '2024-01-31', clicks: 1560 },
  { id: 'BN003', title: 'تخفيضات الشتاء', placement: 'homepage-hero', status: 'active', platform: 'both', language: 'ar', startDate: '2024-01-10', endDate: '2024-01-20', clicks: 1890 },
  { id: 'BN004', name: 'Mobile App Promo', placement: 'app-hero', status: 'scheduled', platform: 'mobile', language: 'en', startDate: '2024-01-15', endDate: '2024-01-25', clicks: 0 },
  { id: 'BN005', name: 'Flash Sale', placement: 'category-banner', status: 'draft', platform: 'website', language: 'en', startDate: null, endDate: null, clicks: 0 },
];

export const activityLogs = [
  { id: 'LOG001', action: 'Campaign Started', user: 'Marketing Manager', details: 'Winter Sale 2024 campaign activated', timestamp: '2024-01-12T14:30:00', type: 'campaign' },
  { id: 'LOG002', action: 'Cart Recovery', user: 'System', details: 'WhatsApp sent to ahmed@email.com', timestamp: '2024-01-12T14:15:00', type: 'automation' },
  { id: 'LOG003', action: 'Banner Published', user: 'Marketing Agent', details: 'Winter Sale Banner set to active', timestamp: '2024-01-12T13:45:00', type: 'content' },
  { id: 'LOG004', action: 'Template Approved', user: 'Admin', details: 'Cart Reminder template approved', timestamp: '2024-01-12T12:30:00', type: 'template' },
  { id: 'LOG005', action: 'Delivery Failed', user: 'System', details: 'Email to omar@email.com bounced', timestamp: '2024-01-12T11:20:00', type: 'error' },
  { id: 'LOG006', action: 'Customer Segmented', user: 'System', details: 'Mohammed Omar upgraded to VIP', timestamp: '2024-01-12T10:00:00', type: 'customer' },
];

export const analyticsData = {
  visitors: { today: 2456, yesterday: 2180, change: 12.7 },
  sessions: { today: 3120, yesterday: 2890, change: 8.0 },
  bounceRate: { today: 42.3, yesterday: 45.1, change: -6.2 },
  avgDuration: { today: '3:24', yesterday: '3:10', change: 7.4 },
  pageViews: { today: 8940, yesterday: 7650, change: 16.9 },
  conversions: { today: 87, yesterday: 72, change: 20.8 },
};

export const deviceBreakdown = [
  { device: 'Mobile', sessions: 1872, percentage: 60 },
  { device: 'Desktop', sessions: 936, percentage: 30 },
  { device: 'Tablet', sessions: 312, percentage: 10 },
];

export const topPages = [
  { page: '/products/winter-collection', views: 2340, avgTime: '2:45' },
  { page: '/cart', views: 1890, avgTime: '1:30' },
  { page: '/checkout', views: 1234, avgTime: '4:20' },
  { page: '/products/new-arrivals', views: 1120, avgTime: '3:10' },
  { page: '/', views: 980, avgTime: '0:45' },
];
