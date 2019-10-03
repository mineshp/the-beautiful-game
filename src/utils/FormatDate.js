const displayAvailabilityConfirmation = (date) => {
  const getDayMonthString = Date(date).toLocaleString('en-GB').slice(0, 10);
  const getTimeString = Date(date).toLocaleString('en-GB').slice(16, 24);
  return `${getDayMonthString} ${getTimeString}`;
}

module.exports = {
  displayAvailabilityConfirmation
};
