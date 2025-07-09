"use client";

import { Bar } from "@/components/Chart/Bar";
import { Donut } from "@/components/Chart/Donut";
import Loading2 from "@/components/Loading2";
import {
  useLazyCountBuildingPermitQuery,
  useLazyCountDoneQuery,
  useLazyCountEveryStateQuery,
} from "@/redux/services/GlobalService";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const Dashboard: React.FC = () => {
  const date = useMemo(() => new Date(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [getEveryState, { data: dataEveryState }] =
    useLazyCountEveryStateQuery();

  const [getDone, { data: dataDone }] = useLazyCountDoneQuery();

  const [getBuildingPermit, { data: dataBuildingPermit }] =
    useLazyCountBuildingPermitQuery();

  const fetchData = useCallback(async () => {
    const responses = await Promise.all([
      getEveryState({
        month: date.toLocaleString("id-ID", {
          timeZone: "Asia/Makassar",
          month: "numeric",
        }),
        year: date.toLocaleString("id-ID", {
          timeZone: "Asia/Makassar",
          year: "numeric",
        }),
      }),
      getDone({
        year: date.toLocaleString("id-ID", {
          timeZone: "Asia/Makassar",
          year: "numeric",
        }),
      }),
      getBuildingPermit({}),
    ]);

    const isAllSuccess = responses.every((response) => response.isSuccess);

    if (isAllSuccess) {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      setError(true);
    }
  }, [date, getBuildingPermit, getDone, getEveryState]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transformData = (data: any) => {
    const mapping = {
      done: { label: "Selesai", color: "#F564A9" },
      sent: { label: "Terkirim", color: "#F0BB78" },
      diterima: { label: "Diterima", color: "#437de0" },
      reject: { label: "Ditolak", color: "#CD5C08" },
      teguran_lisan: { label: "Teguran Lisan", color: "#B6A28E" },
      sp1: { label: "SP1", color: "#1fab5e" },
      sp2: { label: "SP2", color: "#f2df0a" },
      sp3: { label: "SP3", color: "#D32F2F" },
      sk_bongkar: { label: "Pembongkaran", color: "#34495e" },
    };

    const result = Object.keys(mapping).map((key) => {
      const typedKey = key as keyof typeof mapping;
      return {
        value: parseInt(data[typedKey] || 0, 10),
        name: mapping[typedKey].label,
        itemStyle: { color: mapping[typedKey].color },
      };
    });

    return result;
  };

  const transformMonthData = (data: any) => {
    const monthMapping = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "Mei",
      "06": "Jun",
      "07": "Jul",
      "08": "Agu",
      "09": "Sep",
      "10": "Okt",
      "11": "Nov",
      "12": "Des",
    } as const;

    const monthOrder: (keyof typeof monthMapping)[] = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const result = monthOrder.map((key) => {
      return {
        value: parseInt(
          data.find((item: any) => item.month === key)?.done || "0",
          10
        ),
        name: monthMapping[key],
      };
    });

    return result;
  };

  return (
    <React.Fragment>
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-7 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {`Index Pelaporan Berdasarkan Status Terakhir Pada Bulan ${date.toLocaleString(
                  "id-ID",
                  {
                    timeZone: "Asia/Makassar",
                    month: "long",
                  }
                )} Tahun ${date.toLocaleString("id-ID", {
                  timeZone: "Asia/Makassar",
                  year: "numeric",
                })}`}
              </h3>
            </div>

            <div className="max-w-full overflow-x-auto no-scrollbar">
              <div className="w-full">
                {loading ? (
                  <div className="h-[450px] p-4">
                    <p className="font-lg font-semibold text-slate-800">
                      Chart Sedang Dimuat
                    </p>
                    <div className="flex justify-center items-center h-[90%]">
                      <Loading2 />
                    </div>
                  </div>
                ) : error ? (
                  <div className="h-[450px] p-4 items-center justify-center">
                    <p className="font-lg font-semibold text-slate-800">
                      Chart Gagal Dimuat
                    </p>
                    <div className="flex justify-center items-center h-[90%]">
                      <Image
                        src={"/images/error.png"}
                        objectFit="contain"
                        width={400}
                        height={400}
                        alt="Error Chart"
                      />
                    </div>
                  </div>
                ) : (
                  <Donut
                    height={450}
                    data={transformData(dataEveryState?.[0] ?? [])}
                    style={{ top: -25, marginBottom: 0 }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                Statistik Bangunan Berizin dan Tidak Berizin
              </h3>
            </div>

            <div className="max-w-full overflow-x-auto no-scrollbar">
              <div className="w-full">
                {loading ? (
                  <div className="h-[450px] p-4">
                    <p className="font-lg font-semibold text-slate-800">
                      Chart Sedang Dimuat
                    </p>
                    <div className="flex justify-center items-center h-[90%]">
                      <Loading2 />
                    </div>
                  </div>
                ) : error ? (
                  <div className="h-[450px] p-4 items-center justify-center">
                    <p className="font-lg font-semibold text-slate-800">
                      Chart Gagal Dimuat
                    </p>
                    <div className="flex justify-center items-center h-[90%]">
                      <Image
                        src={"/images/error.png"}
                        objectFit="contain"
                        width={400}
                        height={400}
                        alt="Error Chart"
                      />
                    </div>
                  </div>
                ) : (
                  <Donut
                    height={450}
                    data={[
                      { value: dataBuildingPermit?.berizin, name: "Berizin" },
                      {
                        value: dataBuildingPermit?.tidak_berizin,
                        name: "Tidak Berizin",
                      },
                    ]}
                    style={{ top: -25, marginBottom: 0 }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                {`Statistik Pelaporan Selesai Tahun ${date.toLocaleString(
                  "id-ID",
                  {
                    timeZone: "Asia/Makassar",
                    year: "numeric",
                  }
                )}`}
              </h3>
            </div>

            <div className="max-w-full overflow-x-auto no-scrollbar">
              <div className="w-full">
                {loading ? (
                  <div className="h-[450px] p-4">
                    <p className="font-lg font-semibold text-slate-800">
                      Chart Sedang Dimuat
                    </p>
                    <div className="flex justify-center items-center h-[90%]">
                      <Loading2 />
                    </div>
                  </div>
                ) : error ? (
                  <div className="h-[450px] p-4 items-center justify-center">
                    <p className="font-lg font-semibold text-slate-800">
                      Chart Gagal Dimuat
                    </p>
                    <div className="flex justify-center items-center h-[90%]">
                      <Image
                        src={"/images/error.png"}
                        objectFit="contain"
                        width={400}
                        height={400}
                        alt="Error Chart"
                      />
                    </div>
                  </div>
                ) : (
                  <Bar
                    data={transformMonthData(dataDone ?? [])}
                    xData={[
                      "Jan", // Januari
                      "Feb", // Februari
                      "Mar", // Maret
                      "Apr", // April
                      "Mei", // Mei
                      "Jun", // Juni
                      "Jul", // Juli
                      "Agu", // Agustus
                      "Sep", // September
                      "Okt", // Oktober
                      "Nov", // November
                      "Des", // Desember
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
