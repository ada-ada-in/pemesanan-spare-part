import React from "react";

export default function SearchData(data: any) {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data);

  React.useEffect(() => {
    if (data) {
      let filtered = data;

      if (startDate && endDate) {
        filtered = filtered.filter((searchData: any) => {
          const transactionDate = new Date(searchData.createdAt);
          return (
            transactionDate >= new Date(startDate) &&
            transactionDate <= new Date(endDate)
          );
        });
      }

      if (searchTerm) {
        filtered = filtered.filter((searchData: any) => {
          const { user, transaksi_number, isPaid, isStatus } = searchData;
          return (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaksi_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            isPaid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            isStatus.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      setFilteredData(filtered.length > 0 ? filtered : null);
    }
  }, [startDate, endDate, searchTerm, data]);
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border rounded p-2"
        placeholder="Start Date"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border rounded p-2"
        placeholder="End Date"
      />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded p-2"
        placeholder="Search by Name, Transaction Number, or Status"
      />
    </div>
  );
}
