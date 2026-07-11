"use client";

import React, { useState } from "react";
import RevenueChart from "./RevenueChart";
import { TimeFrame, Transaction } from "./types";

export default function RevenueChartWrapper({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("Month");

  return (
    <RevenueChart
      timeFrame={timeFrame}
      setTimeFrame={setTimeFrame}
      transactions={transactions}
    />
  );
}

