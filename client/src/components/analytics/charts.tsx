import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

interface ChartProps {
  data: any[];
  title: string;
  height?: number;
  interactive?: boolean;
  onDataPointClick?: (data: any) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (value: any, name: string) => [string, string];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const LineChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300, 
  interactive = true,
  onDataPointClick 
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (data: any) => {
    if (interactive && onDataPointClick) {
      onDataPointClick(data);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#8884d8', strokeWidth: 2 }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            strokeWidth={3}
            dot={{ 
              fill: '#8884d8', 
              strokeWidth: 2, 
              r: 4,
              cursor: interactive ? 'pointer' : 'default'
            }}
            activeDot={{ 
              r: 6, 
              stroke: '#8884d8', 
              strokeWidth: 2,
              fill: '#fff'
            }}
            onClick={handleClick}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="count" 
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3}
            strokeWidth={2}
            onClick={onDataPointClick}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            cursor={interactive ? 'pointer' : 'default'}
            onClick={onDataPointClick}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            cursor={interactive ? 'pointer' : 'default'}
            onClick={onDataPointClick}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DonutChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="count"
            cursor={interactive ? 'pointer' : 'default'}
            onClick={onDataPointClick}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ComposedChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
            cursor={interactive ? 'pointer' : 'default'}
            onClick={onDataPointClick}
          />
          <Line 
            type="monotone" 
            dataKey="trend" 
            stroke="#ff7300" 
            strokeWidth={2}
            dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RadarChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data}>
          <PolarGrid stroke="#f0f0f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            stroke="#666"
            fontSize={12}
          />
          <PolarRadiusAxis 
            stroke="#666"
            fontSize={12}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="A"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.3}
            cursor={interactive ? 'pointer' : 'default'}
            onClick={onDataPointClick}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FunnelChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <FunnelChart>
          <Tooltip content={<CustomTooltip />} />
          <Funnel
            dataKey="value"
            data={data}
            cursor={interactive ? 'pointer' : 'default'}
            onClick={onDataPointClick}
          >
            <LabelList position="right" fill="#000" stroke="none" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

// Multi-line chart for comparing multiple metrics
export const MultiLineChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];
  
  // Get all data keys except the x-axis key
  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'month' && key !== 'name') : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ 
                fill: colors[index % colors.length], 
                strokeWidth: 2, 
                r: 4,
                cursor: interactive ? 'pointer' : 'default'
              }}
              activeDot={{ 
                r: 6, 
                stroke: colors[index % colors.length], 
                strokeWidth: 2,
                fill: '#fff'
              }}
              onClick={onDataPointClick}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Stacked bar chart for comparing categories
export const StackedBarChartComponent: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 300,
  interactive = true,
  onDataPointClick 
}) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000'];
  
  // Get all data keys except the x-axis key
  const dataKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'name' && key !== 'month') : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#666"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="a"
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              cursor={interactive ? 'pointer' : 'default'}
              onClick={onDataPointClick}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 