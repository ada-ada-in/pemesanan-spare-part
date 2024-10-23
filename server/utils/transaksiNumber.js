export const toTransactionNumber = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const transactionNumber = `TRX${datePart}${timePart}`;

  return transactionNumber;
};
