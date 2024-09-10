import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';

interface ContributionData {
  date: string;
  count: number;
}

interface ContributionTotal {
  [year: string]: number;
}

interface ContributionTimelineProps {
  contributions: {
    total: ContributionTotal;
    contributions: ContributionData[];
  };
}

const ContributionTimeline: React.FC<ContributionTimelineProps> = ({ contributions }) => {
  console.log("ContributionTimeline received:", contributions);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contributions && contributions.total && contributions.contributions) {
      setLoading(false);
    } else {
      setError("No contribution timeline data available");
    }
  }, [contributions]);

  if (!contributions || !contributions.total || !contributions.contributions) {
    return <div>No contribution timeline data available</div>;
  }

  const dailyContributions = contributions.contributions;

  const getContributionsForMonth = () => {
    const monthContributions = dailyContributions.filter(contribution => {
      const date = new Date(contribution.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const contributionsMap: ContributionData[] = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dayContribution = monthContributions.find(contribution => 
        new Date(contribution.date).getDate() === date.getDate()
      );
      return dayContribution || { date: date.toISOString(), count: 0 };
    });

    return contributionsMap;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(year => year - 1);
      } else {
        setCurrentMonth(month => month - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(year => year + 1);
      } else {
        setCurrentMonth(month => month + 1);
      }
    }
  };

  const renderContributions = () => {
    const contributionsForMonth = getContributionsForMonth();
    const weeks: ContributionData[][] = [];
    let week: ContributionData[] = [];

    contributionsForMonth.forEach((day, index) => {
      week.push(day);
      if (week.length === 7 || index === contributionsForMonth.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-1 gap-1">
            {week.map((day) => (
              <motion.div
                key={day.date}
                className={`w-5 h-5 rounded-sm ${getColor(day.count)}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative group">
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p>{new Date(day.date).toDateString()}</p>
                    <p>{day.count} contribution{day.count !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-800';
    if (count < 3) return 'bg-green-900';
    if (count < 6) return 'bg-green-700';
    if (count < 9) return 'bg-green-500';
    return 'bg-green-300';
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-2xl max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Contribution Timeline</h2>
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <>
          <div className="flex justify-between mb-2">
            <button
              className="text-white bg-blue-600 p-2 rounded-full"
              onClick={() => navigateMonth('prev')}
            >
              <FaChevronLeft />
            </button>
            <h3 className="text-xl font-semibold text-white">{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</h3>
            <button
              className="text-white bg-blue-600 p-2 rounded-full"
              onClick={() => navigateMonth('next')}
            >
              <FaChevronRight />
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <div className="loader"></div>
            </div>
          ) : (
            renderContributions()
          )}
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Less</span>
              <div className="w-2 h-2 bg-gray-800 rounded-sm"></div>
              <div className="w-2 h-2 bg-green-900 rounded-sm"></div>
              <div className="w-2 h-2 bg-green-700 rounded-sm"></div>
              <div className="w-2 h-2 bg-green-500 rounded-sm"></div>
              <div className="w-2 h-2 bg-green-300 rounded-sm"></div>
              <span className="text-gray-400">More</span>
            </div>
            <div className="flex items-center text-orange-500">
              <FaFire className="mr-2" />
              <span>
                {dailyContributions.filter(day => new Date(day.date).getFullYear() === currentYear && new Date(day.date).getMonth() === currentMonth)
                  .reduce((sum: number, day: ContributionData) => sum + day.count, 0)} contributions in {`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContributionTimeline;