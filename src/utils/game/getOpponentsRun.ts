const getOpponentRuns = (isBatting: boolean) => {
  if (isBatting) {
    return Math.floor(Math.random() * 6) + 1;
  }
  const weightedNumbers = [1, 2, 3, 4, 4, 5, 5, 6, 6, 6];
  const randomIndex = Math.floor(Math.random() * weightedNumbers.length);
  return weightedNumbers[randomIndex];
};
export default getOpponentRuns;
