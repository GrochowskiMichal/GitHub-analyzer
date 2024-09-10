// components/gh/UserSince.tsx

import React from 'react';

interface UserSinceProps {
  createdAt: string;
}

const calculateUserSince = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();

  const years = currentDate.getFullYear() - createdDate.getFullYear();
  const months = currentDate.getMonth() - createdDate.getMonth();
  const days = currentDate.getDate() - createdDate.getDate();

  const correctedMonths = months < 0 ? months + 12 : months;
  const correctedYears = months < 0 ? years - 1 : years;
  const correctedDays = days < 0 ? days + 30 : days;

  return `${correctedYears} years, ${correctedMonths} months, ${correctedDays} days`;
};

const UserSince: React.FC<UserSinceProps> = ({ createdAt }) => {
  const userSince = calculateUserSince(createdAt);

  return <span>{userSince}</span>;
};

export default UserSince;
