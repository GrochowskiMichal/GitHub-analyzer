import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ContributionData {
  date: string;
  count: number;
  level: number;
}

interface ContributionsProps {
  contributions: {
    total: { [year: string]: number };
    contributions: ContributionData[];
  };
}

const Contributions: React.FC<ContributionsProps> = ({ contributions }) => {
  console.log("Contributions received:", contributions);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  useEffect(() => {
    if (contributions && contributions.total && contributions.contributions) {
      setLoading(false);
    } else {
      setError('No contributions data available');
      setLoading(false);
    }
  }, [contributions]);
  const [expandedTotal, setExpandedTotal] = useState<boolean>(false);
  const [expandedYears, setExpandedYears] = useState<{ [year: string]: boolean }>({});
  const [expandedMonths, setExpandedMonths] = useState<{ [year: string]: { [month: string]: boolean } }>({});


  const toggleTotal = () => {
    setExpandedTotal((prev) => !prev);
  };

  const toggleYear = (year: string) => {
    setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleMonth = (year: string, month: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [year]: {
        ...prev[year],
        [month]: !prev[year]?.[month]
      }
    }));
  };

  const groupByYearAndMonth = (contributions: ContributionData[]) => {
    return contributions.reduce((acc: { [year: string]: { [month: string]: ContributionData[] } }, contribution) => {
      const date = new Date(contribution.date);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString('default', { month: 'long' });

      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      acc[year][month].push(contribution);

      return acc;
    }, {});
  };

  if (loading) {
    return <div>Loading contributions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!contributions || !contributions.total || !contributions.contributions) {
    return <div>No contributions data available</div>;
  }

  const groupedContributions = groupByYearAndMonth(contributions.contributions);
  const totalContributionsCount = Object.values(contributions.total).reduce((acc, count) => acc + count, 0);

  return (
    <div className="mt-4 p-4 bg-gray-900 text-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold">Contributions Overview</h2>
      
      <div className="mt-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center cursor-pointer" onClick={toggleTotal}>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <h3 className="text-xl font-semibold">Total Contributions</h3>
            </div>
            <span className="text-2xl">{totalContributionsCount}</span>
            {expandedTotal ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <AnimatePresence>
            {expandedTotal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="ml-4 mt-2"
              >
                {Object.entries(contributions.total).map(([year, count]) => (
                  <div key={year} className="bg-gray-700 p-4 rounded-lg shadow-md mt-2">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleYear(year)}>
                      <div className="flex items-center">
                        <FaCalendarWeek className="mr-2" />
                        <h4 className="text-lg font-bold">{year}</h4>
                      </div>
                      <span className="text-2xl">{count}</span>
                      {expandedYears[year] ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                    <AnimatePresence>
                      {expandedYears[year] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="ml-4 mt-2"
                        >
                          {Object.entries(groupedContributions[year]).map(([month, contributions]) => (
                            <div key={month} className="bg-gray-600 p-4 rounded-lg shadow-md mt-2">
                              <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleMonth(year, month)}>
                                <div className="flex items-center">
                                  <FaCalendarDay className="mr-2" />
                                  <h5 className="text-md font-semibold">{month}</h5>
                                </div>
                                {expandedMonths[year]?.[month] ? <FaChevronUp /> : <FaChevronDown />}
                              </div>
                              <AnimatePresence>
                                {expandedMonths[year]?.[month] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="ml-4 mt-2"
                                  >
                                    {contributions.map((contribution) => (
                                      <div key={contribution.date} className="flex justify-between items-center bg-gray-500 p-3 rounded-md mt-2">
                                        <span>{new Date(contribution.date).toLocaleDateString()}</span>
                                        <span>{contribution.count} contributions (Level {contribution.level})</span>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Contributions;
