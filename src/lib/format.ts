const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
});

export function formatDate(date: Date) {
  return DATE_FORMATTER.format(date);
}
