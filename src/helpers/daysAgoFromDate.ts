export const daysAgoFromDate = (dateString: string): string => {
  const date = new Date(dateString);
  const currentDate = new Date();

  const differenceInMs = currentDate.getTime() - date.getTime();
  const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

  if (differenceInDays === 0) {
    return `today`;
  } else if (differenceInDays === 1) {
    return `1 day ago`;
  } else {
    return `${differenceInDays} days ago`;
  }
};
