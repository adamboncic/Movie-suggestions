export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatRating = (rating) => {
  return rating ? `${rating.toFixed(1)}/10` : 'N/A';
};