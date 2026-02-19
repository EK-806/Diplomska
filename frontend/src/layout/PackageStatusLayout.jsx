import { useEffect, useMemo, useState } from "react";
import axiosApiCall from "@/lib/axiosApiCall";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import Chart from "react-apexcharts";

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const pick = (obj, keys, fallback = 0) => {
  for (const k of keys) {
    const val = obj?.[k];
    if (val !== undefined && val !== null) return val;
  }
  return fallback;
};

const normalizeDateLabel = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const sortByDateAsc = (arr, key = "date") =>
  [...arr].sort((a, b) => {
    const ta = new Date(a?.[key] ?? 0).getTime();
    const tb = new Date(b?.[key] ?? 0).getTime();
    return (Number.isFinite(ta) ? ta : 0) - (Number.isFinite(tb) ? tb : 0);
  });

const buildCharts = (payload) => {
  const barRaw = Array.isArray(payload?.barChartData)
    ? payload.barChartData
    : [];
  const lineRaw = Array.isArray(payload?.lineChartData)
    ? payload.lineChartData
    : [];

  const barData = sortByDateAsc(barRaw)
    .map((item) => {
      const label = normalizeDateLabel(item?.date);
      if (!label) return null;
      return { ...item, __label: label };
    })
    .filter(Boolean);

  const lineData = sortByDateAsc(lineRaw)
    .map((item) => {
      const label = normalizeDateLabel(item?.date);
      if (!label) return null;
      return { ...item, __label: label };
    })
    .filter(Boolean);

  const barCategories = barData.map((i) => i.__label);
  const barValues = barData.map((i) =>
    toNum(
      pick(i, [
        "totalPackagesAppointed",
        "appointedTotal",
        "appointed",
        "totalAppointed",
        "count",
      ])
    )
  );

  const lineCategories = lineData.map((i) => i.__label);

  const appointedValues = lineData.map((i) =>
    toNum(
      pick(i, [
        "appointed",
        "Appointed",
        "totalAppointed",
        "appointedTotal",
        "totalPackagesAppointed",
        "appointedPackages",
      ])
    )
  );

  const deliveredValues = lineData.map((i) =>
    toNum(
      pick(i, [
        "delivered",
        "Delivered",
        "totalDelivered",
        "deliveredTotal",
        "deliveredPackages",
      ])
    )
  );

  const safeBarLen = Math.min(barCategories.length, barValues.length);
  const safeLineLen = Math.min(
    lineCategories.length,
    appointedValues.length,
    deliveredValues.length
  );

  return {
    bar: {
      categories: barCategories.slice(0, safeBarLen),
      series: [
        {
          name: "Total Appointed Packages",
          data: barValues.slice(0, safeBarLen),
        },
      ],
    },
    line: {
      categories: lineCategories.slice(0, safeLineLen),
      series: [
        { name: "Appointed Packages", data: appointedValues.slice(0, safeLineLen) },
        { name: "Delivered Packages", data: deliveredValues.slice(0, safeLineLen) },
      ],
    },
  };
};

export default function PackageStatusLayout() {
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [barKey, setBarKey] = useState(0);
  const [lineKey, setLineKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosApiCall.get("/api/v1/package/stats-data");
        const payload = response?.data?.data || {};

        const built = buildCharts(payload);
        setBarChartData(built.bar);
        setLineChartData(built.line);
        setBarKey((k) => k + 1);
        setLineKey((k) => k + 1);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to fetch stats data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatsData();
  }, []);

  const barOptions = useMemo(() => {
    const cats = barChartData?.categories ?? [];
    return {
      chart: { type: "bar", toolbar: { show: true }, foreColor: "#ffffff" },
      colors: ["#CE0000"],
      xaxis: { categories: cats },
      title: { text: "Appointed Packages Date", align: "center" },
      dataLabels: { enabled: false },
    };
  }, [barChartData?.categories]);

  const lineOptions = useMemo(() => {
    const cats = lineChartData?.categories ?? [];
    return {
      chart: { type: "line", toolbar: { show: true }, foreColor: "#ffffff" },
      colors: ["#CE0000", "#FFCC00"],
      xaxis: { categories: cats },
      title: { text: "Appointed vs Delivered Packages", align: "center" },
      stroke: { curve: "smooth", width: 3 },
      dataLabels: { enabled: false },
    };
  }, [lineChartData?.categories]);

  const canRenderBar =
    barChartData &&
    barChartData.categories?.length &&
    barChartData.series?.[0]?.data?.length === barChartData.categories.length;

  const canRenderLine =
    lineChartData &&
    lineChartData.categories?.length &&
    lineChartData.series?.every(
      (s) => s?.data?.length === lineChartData.categories.length
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert variant="destructive">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Package Stats</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 border-2 border-black dark:border-white">
          <h2 className="text-xl font-semibold mb-4">Appointed Date</h2>

          {canRenderBar ? (
            <Chart
              key={barKey}
              options={barOptions}
              series={barChartData.series}
              type="bar"
              height={300}/>
          ) : (
            <div className="text-sm text-muted-foreground">
              No valid bar chart data.
            </div>
          )}
        </Card>

        <Card className="p-4 border-2 border-black dark:border-white">
          <h2 className="text-xl font-semibold mb-4">
            Appointed vs Delivered Packages
          </h2>

          {canRenderLine ? (
            <Chart
              key={lineKey}
              options={lineOptions}
              series={lineChartData.series}
              type="line"
              height={300}/>
          ) : (
            <div className="text-sm text-muted-foreground">
              No valid line chart data.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}