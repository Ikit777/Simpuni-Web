"use client";

import { BaseInput } from "@/components/BaseInput";
import { BaseButton } from "@/components/Button/BaseButton";
import { SecondaryButton } from "@/components/Button/SecondaryButton";
import { Modal } from "@/components/Modal";
import { useModal } from "@/hook/useModal";
import { selectInfo, setInfo } from "@/redux/features/user/userSlice";
import { useUpdateProfileMutation } from "@/redux/services/AuthService";
import { dispatch, RootState, useSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

type DefaultProfileType = {
  name: string;
  posisi: string;
  instansi: string;
  avatar: any;
};

const MAX_SIZE_KB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const Profil: React.FC = () => {
  const { data: session } = useSession();
  const userInfo = useSelector((state: RootState) => selectInfo(state));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const defaultProfileValues = {
    name: userInfo?.name,
    posisi: userInfo?.position,
    instansi: userInfo?.instansi,
    avatar: userInfo?.avatar,
  };

  const {
    control: profileControll,
    handleSubmit: profileSubmit,
    setValue: setFieldValue,
    getValues: getFieldValue,
    watch: profileWatch,
    formState: { errors: profileError },
  } = useForm<DefaultProfileType>({
    mode: "onSubmit",
    defaultValues: defaultProfileValues,
  });

  const [authUpdate] = useUpdateProfileMutation();

  const onSubmit = (data: DefaultProfileType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar" && !(value instanceof File)) {
        return; // Skip jika avatar bukan File
      }

      if (typeof value !== "string" && !(value instanceof File)) {
        value = JSON.stringify(value); // Konversi object menjadi string
      }

      formData.append(key, value);
    });

    const updatePromise = authUpdate({ data: formData }).then((response) => {
      if (!response.error) {
        const result = response.data.data;
        const user = {
          id: result.id,
          username: result.username,
          email: result.email,
          name: result.name,
          position: result.posisi,
          instansi: result.instansi,
          type_user: result.type_user,
          avatar: result.avatar,
          slug: result.slug,
          fcm_token: userInfo?.fcm_token || "",
        };
        dispatch(setInfo(user));
        closeModal();
      } else {
        throw new Error();
      }
    });

    toast.promise(updatePromise, {
      loading: "Loading",
      success: () => {
        return `Informasi pengguna berhasil diperbarui`;
      },
      error: () => {
        return `Terjadi kesalahan saat menyimpan memperbarui pengguna, silakan coba kembali`;
      },
    });
  };

  useEffect(() => {
    const fetchImage = async () => {
      const avatarUrl = userInfo?.avatar;

      if (avatarUrl) {
        try {
          const response = await fetch(avatarUrl, {
            headers: {
              Authorization: `Bearer ${session?.user.access_token}`,
            },
          });
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
          setFieldValue("avatar", objectUrl);
        } catch (error) {
          console.error("Error fetching image:", error);
        }
      } else {
        setImageUrl("/images/avatar.png"); // Default avatar jika tidak ada
      }
    };

    fetchImage();
  }, [session?.user.access_token, setFieldValue, userInfo]);

  const avatarSrc = profileWatch("avatar")
    ? profileWatch("avatar") instanceof File
      ? URL.createObjectURL(profileWatch("avatar"))
      : imageUrl
    : "/images/avatar.png";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(
          `Terjadi kesalahan saat menambahkan file, silakan coba kembali`
        );
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`Ukuran file melebihi batas, maksimal ${MAX_SIZE_KB} KB.`);
        return;
      }
      setFieldValue("avatar", file);
    }
  };

  return (
    <React.Fragment>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-xl font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
                <Image
                  width={80}
                  height={80}
                  src={imageUrl || "/images/avatar.png"}
                  alt="user"
                  className="object-cover  shadow-md w-20 h-20 border border-gray-200 rounded-full dark:border-gray-800"
                />
                <div className="order-3 xl:order-2">
                  <h4 className="mb-2 text-xl font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                    {userInfo?.name}
                  </h4>
                  <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      {userInfo?.position}
                    </p>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      {userInfo?.instansi}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={openModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                    fill=""
                  />
                </svg>
                Edit
              </button>
            </div>
          </div>

          <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Pribadi
                </h4>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-y-7 lg:gap-x-32 2xl:gap-x-32">
                  <div>
                    <p className="mb-2 text-base leading-normal text-gray-500 dark:text-gray-400">
                      Nama Lengkap
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {userInfo?.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-base leading-normal text-gray-500 dark:text-gray-400">
                      Posisi / Jabatan
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {userInfo?.position}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-base leading-normal text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {userInfo?.email}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-base leading-normal text-gray-500 dark:text-gray-400">
                      Instansi
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-white/90">
                      {userInfo?.instansi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900">
          <div className="">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Perbarui Profil
            </h4>
            <p className="mb-6 text-base text-gray-500 dark:text-gray-400 lg:mb-3">
              Perbarui informasi personal Anda.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="relative flex flex-col items-center mt-4">
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="relative"
              >
                <Image
                  src={avatarSrc}
                  alt="Profile Avatar"
                  width={112}
                  height={112}
                  className="object-cover rounded-full shadow-md h-28 w-28"
                  {...(getFieldValue("avatar") && {
                    headers: {
                      Authorization: `Bearer ${session?.user.access_token}`,
                    },
                  })}
                />
              </button>

              <button
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="absolute top-0 right-40 w-8 h-8 flex items-center justify-center bg-slate-50 rounded-full shadow-md hover:bg-slate-200"
              >
                ✏️
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpg, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <Controller
              name="name"
              control={profileControll}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <BaseInput
                  id="name"
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap Anda"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  type="text"
                  error={!!profileError.name}
                />
              )}
            />
            <Controller
              name="posisi"
              control={profileControll}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <BaseInput
                  id="posisi"
                  label="Posisi/Jabatan"
                  placeholder="Masukkan posisi atau jabatan Anda"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  type="text"
                  error={!!profileError.posisi}
                />
              )}
            />
            <Controller
              name="instansi"
              control={profileControll}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <BaseInput
                  id="instansi"
                  label="Instansi"
                  placeholder="Masukkan instansi Anda"
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  type="text"
                  error={!!profileError.instansi}
                />
              )}
            />

            {(Object.keys(profileError) as Array<keyof typeof profileError>).some(
              (field) => profileError[field]?.type === "required"
            ) && (
              <p className="text-base font-normal text-error-500">
                Silakan lengkapi semua formulir terlebih dahulu
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-8 lg:justify-end">
            <SecondaryButton
              className="!w-[200px]"
              label="Batal"
              onClick={closeModal}
            />
            <BaseButton
              label="Simpan Perubahan"
              onClick={profileSubmit(onSubmit)}
            />
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Profil;
