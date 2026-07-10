import { COLORS } from '../constants/colors';

export const getExpiryText = (epochSeconds: number) => {
    const diffMs = (epochSeconds * 1000) - Date.now();
    if (diffMs <= 0) return 'Expired';
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    return `In ${diffHours} Hour${diffHours === 1 ? '' : 's'}`;
};

export const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'ACTIVE': return '#007bff';
        case 'ACCEPTED': return '#ffc107';
        case 'COMPLETED': return COLORS.primary || 'green';
        case 'EXPIRED': return '#dc3545';
        default: return '#6c757d';
    }
};

export const formatReceiverAddress = (addressStr?: string) => {
    if (!addressStr) return '';
    try {
        const parsed = JSON.parse(addressStr);
        return parsed.formatted || addressStr;
    } catch {
        return addressStr;
    }
};
