"use client";

import { BaseInput } from "@/components/BaseInput";
import { BaseButton } from "@/components/Button/BaseButton";
import { SecondaryButton } from "@/components/Button/SecondaryButton";
import { Modal } from "@/components/Modal";
import { useModal } from "@/hook/useModal";
import { selectInfo } from "@/redux/features/user/userSlice";
import {
  useLazyGetKecamatanQuery,
  useLazyGetKelurahanQuery,
} from "@/redux/services/RegionService";
import { RootState, useSelector } from "@/redux/store";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import { DayPicker } from "react-day-picker";
import { id } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { BaseSelect } from "@/components/Select/BaseSelect";
import axios from "axios";
import { useSession } from "next-auth/react";

type DefaulRecapType = {
  range_date: any;
  kecamatan_id: string;
  kelurahan_id: string;
};

const RekapPelaporan: React.FC = () => {
  const { data: session } = useSession();
  const userInfo = useSelector((state: RootState) => selectInfo(state));

  const { isOpen, openModal, closeModal } = useModal();

  const defaultRecapValue = {
    range_date: "",
    kecamatan_id: "",
    kelurahan_id: "",
  };

  const {
    control: recapControll,
    handleSubmit: recapSubmit,
    setValue: setFieldValue,
    getValues: getFieldValue,
    watch: recapWatch,
    formState: { errors: recapError },
  } = useForm<DefaulRecapType>({
    mode: "onSubmit",
    defaultValues: defaultRecapValue,
  });

  const [
    getKecamatan,
    { data: dataKecamatan, isFetching: isFetchingKecamatan },
  ] = useLazyGetKecamatanQuery();
  const [
    getKelurahan,
    { data: dataKelurahan, isFetching: isFetchingKelurahan },
  ] = useLazyGetKelurahanQuery();

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0, jadi tambahkan 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const recap = async (data: DefaulRecapType) => {
    const { kecamatan_id, kelurahan_id } = data;

    const datas = {
      start_date: formatDate(recapWatch("range_date").from),
      end_date: formatDate(recapWatch("range_date").to),
      ...(kecamatan_id ? { kecamatan_id } : {}),
      ...(kelurahan_id ? { kelurahan_id } : {}),
    };

    let url: any;

    switch (userInfo?.type_user) {
      case "pelapor":
        url = new URL(
          "/api/pelapor/buildings/export/excel",
          process.env.NEXT_PUBLIC_API_URL
        );
        break;
      case "petugas":
        url = new URL(
          "/api/petugas/buildings/export/excel",
          process.env.NEXT_PUBLIC_API_URL
        );
        break;
      case "admin":
        url = new URL(
          "/api/admin/buildings/export/excel",
          process.env.NEXT_PUBLIC_API_URL
        );
        break;
    }

    if (Object.keys(datas).length > 0) {
      Object.entries(datas).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    try {
      const response = await axios.get(url.toString(), {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      });

      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      const name = `Rekap Bangunan ${formatDate(
        recapWatch("range_date").from
      )} - ${formatDate(recapWatch("range_date").to)}.xlsx`;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
    } catch (error) {
      console.error("Gagal mengunduh file:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Rekap Bangunan
        </h3>
        <p className="mb-6 text-base text-gray-500 dark:text-gray-400 lg:mb-7">
          Lengkapi formulir dibawah ini untuk membuat rekap bangunan.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <Controller
            name="range_date"
            control={recapControll}
            rules={{
              required: true,
            }}
            render={({ field: { value } }) => (
              <BaseInput
                id="range_date"
                label={"Rentang Waktu Rekap"}
                placeholder="Pilih rentang waktu yang diinginkan"
                type={"text"}
                required
                value={
                  value
                    ? `${formatDate(
                        recapWatch("range_date").from
                      )} - ${formatDate(recapWatch("range_date").to)}`
                    : ""
                }
                disable
                error={!!recapError.range_date}
                className="pr-16"
                endDecorator={
                  <div className="flex flex-row ml-1">
                    <BaseButton
                      className="flex items-center gap-2"
                      onClick={() => {
                        openModal();
                      }}
                    >
                      <HiMiniCalendarDateRange className="w-5 h-5" />
                    </BaseButton>
                  </div>
                }
              />
            )}
          />

          <Controller
            name="kecamatan_id"
            control={recapControll}
            render={({ field: { value, onChange } }) => (
              <BaseSelect
                label="Kecamatan"
                placeholder="Pilih kecamatan"
                value={value}
                onChange={(item) => {
                  onChange(item?.value);
                  setFieldValue("kelurahan_id", "", {
                    shouldDirty: true,
                  });
                }}
                isSearch
                data={dataKecamatan?.data.map((item: any) => {
                  const label = item.name as string;
                  return {
                    value: item.code,
                    label: label
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase()),
                  };
                })}
                loading={isFetchingKecamatan}
                error={!!recapError.kecamatan_id}
                onOpen={() => {
                  getKecamatan({});
                }}
              />
            )}
          />

          <Controller
            name="kelurahan_id"
            control={recapControll}
            render={({ field: { value, onChange } }) => (
              <BaseSelect
                label="Kelurahan"
                placeholder="Pilih kelurahan"
                value={value}
                data={dataKelurahan?.data.map((item: any) => {
                  const label = item.name as string;
                  return {
                    value: item.code,
                    label: label
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase()),
                  };
                })}
                isSearch
                onOpen={() => {
                  getKelurahan({ id: getFieldValue("kecamatan_id") });
                }}
                onChange={(item) => {
                  onChange(item?.value);
                }}
                loading={isFetchingKelurahan}
                error={!!recapError.kecamatan_id}
              />
            )}
          />
        </div>

        {(Object.keys(recapError) as Array<keyof typeof recapError>).some(
          (field) => recapError[field]?.type === "required"
        ) && (
          <p className="text-base font-normal text-error-500">
            Silakan lengkapi semua formulir terlebih dahulu
          </p>
        )}
        <BaseButton
          className="mt-8 !w-[300px]"
          label="Buat Rekap"
          onClick={() => {
            recapSubmit(async (data: DefaulRecapType) => {
              recap(data);
            })();
          }}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900">
          <div className="">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Pilih rentang waktu
            </h4>
          </div>
          <div className="w-full flex justify-center items-center p-4">
            <DayPicker
              captionLayout="dropdown"
              dir="ltr"
              fixedWeeks
              mode="range"
              numberOfMonths={1}
              showOutsideDays
              timeZone="Asia/Makassar"
              locale={id}
              selected={recapWatch("range_date")}
              onSelect={(selected) => {
                setFieldValue("range_date", selected);
              }}
            />
          </div>
          <div className="flex items-center gap-3 lg:justify-end">
            <SecondaryButton
              className="!w-[200px]"
              label="Batal"
              onClick={closeModal}
            />
            <BaseButton label="Simpan" onClick={closeModal} />
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default RekapPelaporan;
