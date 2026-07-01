import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function PerformanceCharts({ history }) {
  const evaluatedInterviews = history.filter(item => item.evaluation);
  const totalInterviews = history.length;
  
  const averageScore = evaluatedInterviews.length > 0 
    ? (evaluatedInterviews.reduce((acc, curr) => acc + curr.evaluation.overallScore, 0) / evaluatedInterviews.length).toFixed(1)
    : 0;
    
  const highestScore = evaluatedInterviews.length > 0
    ? Math.max(...evaluatedInterviews.map(item => item.evaluation.overallScore))
    : 0;

  const roleCounts = {};
  history.forEach(item => {
    roleCounts[item.role] = (roleCounts[item.role] || 0) + 1;
  });
  const roleData = Object.keys(roleCounts).map(key => ({ name: key, value: roleCounts[key] }));

  const diffCounts = {};
  history.forEach(item => {
    diffCounts[item.difficulty] = (diffCounts[item.difficulty] || 0) + 1;
  });
  const diffData = Object.keys(diffCounts).map(key => ({ name: key, value: diffCounts[key] }));

  const dateCounts = {};
  history.forEach(item => {
    const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });
  const activityData = Object.keys(dateCounts).map(date => ({ date, count: dateCounts[date] })).reverse().slice(-7);

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <>
      {/* Metrics Row */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <div className="text-gray-400 font-bold mb-2 uppercase tracking-wider text-sm">Total Interviews</div>
          <div className="text-4xl font-extrabold text-blue-500">{totalInterviews}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <div className="text-gray-400 font-bold mb-2 uppercase tracking-wider text-sm">Avg Score</div>
          <div className="text-4xl font-extrabold text-green-500">{averageScore}%</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <div className="text-gray-400 font-bold mb-2 uppercase tracking-wider text-sm">Highest Score</div>
          <div className="text-4xl font-extrabold text-purple-500">{highestScore}%</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center">
          <div className="text-gray-400 font-bold mb-2 uppercase tracking-wider text-sm">Pass Rate</div>
          <div className="text-4xl font-extrabold text-orange-500">
            {evaluatedInterviews.length > 0 ? Math.round((evaluatedInterviews.filter(i => i.evaluation.overallScore >= 70).length / evaluatedInterviews.length) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Charts Row */}
      {history.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-6 text-gray-300">Weekly Activity</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" tick={{fill: '#9ca3af'}} />
                  <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} allowDecimals={false} />
                  <RechartsTooltip cursor={{fill: '#374151'}} contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px'}} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-xl flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-gray-300">Role Distribution</h3>
            <div className="h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </>
  );
}
