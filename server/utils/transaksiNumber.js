export const toTransactionNumber = () => {
  const timestamp = Date.now();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const transactionNumber = `YMH${timestamp}${randomPart}`;
  return transactionNumber;
};
