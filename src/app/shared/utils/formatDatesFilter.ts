function formatDatesFilter(dates: Date[]) {
  let dateFrom;
  let dateTo;

  if (dates.length > 0) {
    dateFrom = new Date(dates[0])
    dateTo = new Date(dates[1]);
  } else {
    dateFrom = new Date()
    dateTo = new Date();
  }


  dateFrom.setHours(0, 0, 0, 0);
  dateTo.setHours(22, 59, 0, 0)

  return [
    dateFrom.toISOString(),
    dateTo.toISOString()
  ]
}

export default formatDatesFilter;
