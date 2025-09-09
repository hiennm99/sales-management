import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: React.ReactNode;
    bgColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
                                                        title,
                                                        value,
                                                        change,
                                                        changeType,
                                                        icon,
                                                        bgColor
                                                    }) => {
    return (
        <div className={`${bgColor} rounded-xl p-6 text-white relative overflow-hidden`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-white/80 text-sm mb-1">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    <div className={`text-sm mt-2 ${changeType === 'positive' ? 'text-green-200' : 'text-red-200'}`}>
                        {changeType === 'positive' ? '↗' : '↘'} {change}
                    </div>
                </div>
                <div className="opacity-80">
                    {icon}
                </div>
            </div>
        </div>
    );
};