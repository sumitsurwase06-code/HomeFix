import React from 'react';
import Card from '../common/Card';
import './StatCard.css';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'primary', // 'primary' | 'secondary' | 'warning' | 'error' | 'info'
}) {
  return (
    <Card className="stat-card">
      <div className="stat-card-inner">
        <div className="stat-meta">
          <span className="stat-title">{title}</span>
          <h3 className="stat-value">{value}</h3>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
          {trend && (
            <div className={`stat-trend ${trendPositive ? 'positive' : 'negative'}`}>
              <span>{trendPositive ? '↑' : '↓'} {trend}</span>
              <span className="trend-context">vs last month</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className={`stat-icon-wrapper scheme-${colorScheme}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </Card>
  );
}
