// StatsCard.tsx - Updated với light theme và handle optional props
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
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
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-2 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className={`text-sm mt-3 flex items-center gap-1 font-medium ${
                            changeType === 'positive' ? 'text-green-600' :
                                changeType === 'negative' ? 'text-red-500' :
                                    'text-gray-600'
                        }`}>
                            {changeType && (
                                <span>{changeType === 'positive' ? '↗' : '↘'}</span>
                            )}
                            {change}
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${bgColor}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};