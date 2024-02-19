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

function formatSingleDateFilter(d: Date, at: 0 | 1) {
  let date = new Date(d);

  if (at === 0) {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(22, 59, 0, 0)
  }

  return date.toISOString()
}

export {formatDatesFilter, formatSingleDateFilter};
