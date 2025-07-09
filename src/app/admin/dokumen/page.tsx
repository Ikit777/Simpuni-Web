"use client";

import { BaseButton } from "@/components/Button/BaseButton";
import { selectInfo } from "@/redux/features/user/userSlice";
import {
  useAddMutation,
  useDeleteMutation,
  useLazyListQuery,
  useUpdateMutation,
} from "@/redux/services/DocumentService";
import { RootState, useSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { SecondaryButton } from "@/components/Button/SecondaryButton";
import { IoCalendarOutline, IoPricetagOutline } from "react-icons/io5";
import { MdOutlineDescription } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { toast } from "sonner";
import Loading2 from "@/components/Loading2";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import clsx from "clsx";
import { Modal } from "@/components/Modal";
import { useModal } from "@/hook/useModal";
import { Controller, useForm } from "react-hook-form";
import { BaseInput } from "@/components/BaseInput";
import { BaseSelect } from "@/components/Select/BaseSelect";
import { AiOutlineFileAdd } from "react-icons/ai";

type DefaulDocumentType = {
  name: string;
  year: string;
  type: string;
  description: string;
  attachment: any;
};

const typeData = [
  { value: "pbg", label: "Dokumen Perjanjian Bangunan Gedung" },
  { value: "slf", label: "Dokumen Sertifikat Laik Fungsi" },
  { value: "lainnya", label: "Dokumen Lainnya" },
];

const ALLOWED_TYPES = [
  "application/pdf", // PDF
  "application/vnd.ms-excel", // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "text/csv", // CSV
  "image/jpeg", // JPG
  "image/png", // PNG
  "image/jpg", // JPG (redundant, tapi bisa dipakai)
];
const MAX_SIZE_MB = 3;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const Document: React.FC = () => {
  const { data: session } = useSession();
  const userInfo = useSelector((state: RootState) => selectInfo(state));

  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isOpen, openModal, closeModal } = useModal();
  const {
    isOpen: isOpenConfirmation,
    openModal: openModalConfirmation,
    closeModal: closeModalConfirmation,
  } = useModal();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<any>();
  const [state, setState] = useState<any>();

  const [data, setData] = useState<any[]>([]);
  const [next, setNext] = useState(0);
  const [prev, setPrev] = useState(0);
  const [page, setPage] = useState(1);
  const [params, setParams] = useState<{
    [key: string]: any;
  }>({});

  const [listDocument] = useLazyListQuery();
  const [deleteDocument] = useDeleteMutation();
  const [addDocument] = useAddMutation();
  const [updateDocument] = useUpdateMutation();

  const defaultDocumentValue = {
    name: "",
    year: "",
    type: "",
    description: "",
    attachment: "",
  };

  const {
    control: documentControll,
    handleSubmit: documentSubmit,
    setValue: setFieldValue,
    reset: documentReset,
    formState: { errors: documentError },
  } = useForm<DefaulDocumentType>({
    mode: "onSubmit",
    defaultValues: defaultDocumentValue,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const fetchList = useCallback(() => {
    listDocument(params)?.then((response) => {
      if (response.isSuccess) {
        const result = response.data;
        setData(result.data);
        setNext(result.pagination.next_page);
        setPrev(result.pagination.prev_page);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        setError(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    });
  }, [listDocument, params]);

  useEffect(() => {
    fetchList();
  }, [fetchList, params]);

  const debouncedSearch = debounce((value: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (abortControllerRef.current.signal.aborted) {
      return;
    }

    setParams((prevParams) => {
      const updatedParams = { ...prevParams };

      const propertiesToRemove = ["next_page", "previous_page"];

      propertiesToRemove.forEach((prop) => {
        delete updatedParams[prop];
      });

      if ("q" in updatedParams && value === "") {
        delete updatedParams.q;
      }

      if (value !== "") {
        return { ...updatedParams, q: value };
      }

      return updatedParams;
    });
  }, 500);

  const handleSearch = useCallback(
    (value: string) => {
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handlePrevPage = (value: number) => {
    setPage(page - 1);
    setParams((prevParams) => {
      const updatedParams = { ...prevParams };

      const propertiesToRemove = ["older_than"];

      propertiesToRemove.forEach((prop) => {
        delete updatedParams[prop];
      });

      if (!("newer_than" in updatedParams)) {
        return { ...updatedParams, newer_than: value };
      } else if ("newer_than" in updatedParams) {
        return { ...updatedParams, newer_than: value };
      }

      return updatedParams;
    });
  };

  const handleNextPage = (value: number) => {
    setPage(page + 1);
    setParams((prevParams) => {
      const updatedParams = { ...prevParams };

      const propertiesToRemove = ["newer_than"];

      propertiesToRemove.forEach((prop) => {
        delete updatedParams[prop];
      });

      if (!("older_than" in updatedParams)) {
        return { ...updatedParams, older_than: value };
      } else if ("older_than" in updatedParams) {
        return { ...updatedParams, older_than: value };
      }
      return updatedParams;
    });
  };

  const handleState = (newType: string) => {
    setParams((prev) => {
      if (prev.type === newType) {
        const rest = { ...prev };
        delete rest.type;
        return rest;
      }

      return { ...prev, type: newType };
    });
  };

  const showDocument = async (title: string, source: string) => {
    try {
      const getQueryParam = (url: string, param: string) => {
        const match = url.match(new RegExp(`[?&]${param}=([^&]*)`));
        return match ? decodeURIComponent(match[1]) : null;
      };

      const extension = getQueryParam(source, "extension") || "pdf";
      const fileName = `${title}.${extension}`;

      const showPromise = fetch(source, {
        headers: {
          Authorization: `Bearer ${session?.user.access_token}`,
        },
      }).then(async (response) => {
        if (!response.ok) throw new Error("Failed to download file");
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);

        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.title = fileName;

          // Tambahkan style global untuk body
          const style = newWindow.document.createElement("style");
          style.textContent = `
        body {
          margin: 0;
          padding: 0;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `;
          newWindow.document.head.appendChild(style);

          // Tambahkan iframe ke dalam tab baru
          const iframe = newWindow.document.createElement("iframe");
          iframe.src = fileURL;
          iframe.setAttribute("frameborder", "0");
          iframe.setAttribute("scrolling", "no");

          newWindow.document.body.appendChild(iframe);
        } else {
          console.error(
            "Failed to open new window. Please check your popup blocker settings."
          );
        }
      });

      toast.promise(showPromise, {
        loading: "Loading",
        error: () => {
          return `Terjadi kesalahan saat mendapatkan dokumen, silakan coba kembali`;
        },
      });
    } catch (err) {
      console.error("Error opening document:", err);
    }
  };

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
        toast.error(`Ukuran file melebihi batas, maksimal ${MAX_SIZE_MB} MB.`);
        return;
      }
      setFieldValue("attachment", file, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const addFunction = (data: DefaulDocumentType) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const addPromise = addDocument({ data: formData }).then((response) => {
      if (!response.error) {
        closeModal();
        documentReset(defaultDocumentValue);
        fetchList();
      } else {
        throw new Error();
      }
    });

    toast.promise(addPromise, {
      loading: "Loading",
      success: () => {
        return `Dokumen berhasil ditambahkan`;
      },
      error: () => {
        return `Terjadi kesalahan saat menambahkan dokumen, silakan coba kembali`;
      },
    });
  };

  const updateFunction = (data: DefaulDocumentType) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "attachment" && !(value instanceof File)) {
        return; // Skip jika avatar bukan File
      }

      if (typeof value !== "string" && !(value instanceof File)) {
        value = JSON.stringify(value); // Konversi object menjadi string
      }

      formData.append(key, value);
    });

    const updatePromise = updateDocument({
      slug: selected.slug,
      data: formData,
    }).then((response) => {
      if (!response.error) {
        closeModal();
        documentReset(defaultDocumentValue);
        fetchList();
      } else {
        throw new Error();
      }
    });

    toast.promise(updatePromise, {
      loading: "Loading",
      success: () => {
        return `Dokumen berhasil diperbarui`;
      },
      error: () => {
        return `Terjadi kesalahan saat memperbarui dokumen, silakan coba kembali`;
      },
    });
  };

  const deleteFunction = () => {
    const deletePromise = deleteDocument({ slug: selected.slug }).then(
      (response) => {
        if (!response.error) {
          closeModalConfirmation();
          fetchList();
        } else {
          throw new Error();
        }
      }
    );

    toast.promise(deletePromise, {
      loading: "Loading",
      success: () => {
        return `Dokumen berhasil dihapus`;
      },
      error: () => {
        return `Terjadi kesalahan saat menghapus dokumen, silakan coba kembali`;
      },
    });
  };

  const itemList = (data: any) => {
    return (
      <div
        key={data.name}
        className="p-4 rounded-md ring-1 ring-slate-400 shadow-sm"
      >
        <div className="gap-4">
          <p className="text-xl font-medium line-clamp-3 text-ellipsis capitalize">
            {data.name}
          </p>
          <div className="my-4 grid grid-cols-2 gap-4">
            <div className="flex flex-row items-start gap-2 font-medium">
              <IoPricetagOutline className="h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-gray-400 text-sm font-medium">
                  Tipe Dokumen
                </span>
                <span className="text-base font-semibold">
                  {typeData.find((item) => item.value === data.type)?.label ??
                    "-"}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-start gap-2 font-medium">
              <IoCalendarOutline className="h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-gray-400 text-sm font-medium">Tahun</span>
                <span className="text-base font-semibold">
                  {data.year ?? "-"}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-start gap-2 font-medium">
              <MdOutlineDescription className="h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-gray-400 text-sm font-medium">
                  Deskripsi
                </span>
                <span className="text-base font-semibold">
                  {data.description ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="h-0.5 w-full bg-slate-300" />
          <div className="flex flex-row items-center justify-between flex-1 mt-4">
            {userInfo?.type_user === "admin" && (
              <button
                onClick={() => {
                  setState("edit");
                  setSelected(data);
                  const value = {
                    name: data.name,
                    year: data.year,
                    type: data.type,
                    description: data.description,
                    attachment: data.attachment,
                  };
                  documentReset(value);
                  openModal();
                }}
                className="mr-6"
              >
                <FiEdit
                  className={"h-5 w-5 text-slate-800 dark:text-slate-100"}
                />
              </button>
            )}
            {userInfo?.type_user === "admin" && (
              <button
                onClick={() => {
                  setSelected(data);
                  openModalConfirmation();
                }}
              >
                <FiTrash2 className={"h-5 w-5 text-error-500"} />
              </button>
            )}

            <SecondaryButton
              label="Lihat"
              onClick={() => {
                showDocument(data?.name, data?.attachment);
              }}
              className="ml-auto !w-[120px] h-[32px]"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80dvh]">
        <Loading2 />
      </div>
    );
  }

  if (error) {
    throw { message: "Error load page" };
  }

  return (
    <React.Fragment>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row items-center w-full gap-2 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:border-b-0 lg:py-4">
          <div className="w-full lg:w-[500px]">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Pencarian dokumen"
                  onChange={(value) => {
                    handleSearch(value.target.value);
                  }}
                  className="h-11 w-full rounded-md border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-base font-normal text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 lg:w-[500px]"
                />

                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-md border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button>
              </div>
            </form>
          </div>

          <BaseButton
            className="!w-full lg:!w-[200px]"
            label="Tambah Dokumen"
            onClick={() => {
              setState("add");
              documentReset(defaultDocumentValue);
              openModal();
            }}
          />
        </div>

        <div className="py-2 px-0.5">
          <div className="py-2">
            <ToggleGroup
              type="single"
              value={params?.type}
              onValueChange={(val) => handleState(val || "")}
              className="flex gap-2 p-0.5 overflow-x-auto"
            >
              {typeData.map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  className={clsx(
                    "px-3 py-1 text-sm ring-1 ring-slate-400 rounded-md",
                    params?.type === item.value
                      ? "bg-slate-400 text-slate-100"
                      : "bg-white"
                  )}
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="overflow-auto gap-4 grid grid-cols-1 lg:grid-cols-2 py-2 px-0.5">
            {data && data.length != 0 ? (
              data
                .slice()
                .reverse()
                .map((item: any) => itemList(item))
            ) : (
              <div className="border col-span-2 border-dashed shadow-sm rounded-lg flex items-center justify-center py-20 px-10 text-center">
                <div className="flex flex-col items-center">
                  <HiOutlineClipboardDocumentList className="w-10 h-10 text-gray-600 dark:text-slate-200" />
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    Dokumen tidak ditemukan
                  </h3>
                  <p className="font-medium text-slate-500 dark:text-gray-400">
                    <span>
                      Silakan tambahkan dokumen terlebih dahulu dengan menekan
                      tombol &ldquo;Tambah Dokumen&rdquo;.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between w-full mt-4">
            <div className="text-sm text-muted-foreground w-[50vw]">
              {`Halaman ke - ${page}`}
            </div>
            <Pagination className="justify-end">
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    isActive={page != 1}
                    onClick={() => {
                      if (page != 1) {
                        handlePrevPage(prev);
                      }
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    isActive={next != undefined}
                    onClick={() => {
                      if (next != undefined) {
                        handleNextPage(next);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-lg m-4">
        <div className="no-scrollbar relative w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900">
          <div className="">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Buat atau Perbarui Dokumen
            </h4>
            <p className="mb-6 text-base text-gray-500 dark:text-gray-400 lg:mb-3">
              Lengkapi formulir dibawah untuk menambahkan atau memperbarui
              dokumen.
            </p>
          </div>
          <div className="flex flex-col space-y-4 max-h-[50dvh] overflow-y-auto p-0.5">
            <Controller
              name="name"
              control={documentControll}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange, onBlur } }) => (
                <BaseInput
                  id="name"
                  label={"Nama Dokumen"}
                  placeholder="Masukkan nama dokumen"
                  type={"text"}
                  required
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!documentError.name}
                />
              )}
            />
            <Controller
              name="year"
              control={documentControll}
              render={({ field: { value, onChange, onBlur } }) => (
                <BaseInput
                  id="year"
                  label={"Tahun Dokumen"}
                  placeholder="Masukkan tahun dokumen"
                  type={"number"}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!documentError.year}
                />
              )}
            />
            <Controller
              name="description"
              control={documentControll}
              render={({ field: { value, onChange, onBlur } }) => (
                <BaseInput
                  id="year"
                  label={"Deskripsi Dokumen"}
                  placeholder="Masukkan deskripsi dokumen"
                  type={"text"}
                  value={value}
                  multiple
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!documentError.description}
                />
              )}
            />
            <Controller
              name="type"
              control={documentControll}
              rules={{
                required: true,
              }}
              render={({ field: { value, onChange } }) => (
                <BaseSelect
                  label={"Tipe Dokumen"}
                  required
                  placeholder="Pilih tipe dokumen"
                  data={typeData}
                  value={value}
                  onChange={(item) => {
                    onChange(item.value);
                  }}
                  error={!!documentError.type}
                />
              )}
            />

            <Controller
              name="attachment"
              control={documentControll}
              rules={{
                required: true,
              }}
              render={({ field: { value } }) => (
                <BaseInput
                  id="attachment"
                  label={"Unggah Dokumen"}
                  placeholder="Pilih dokumen yang akan diunggah"
                  type={"text"}
                  required
                  value={value?.name || ""}
                  disable
                  error={!!documentError.attachment}
                  className="pr-16"
                  endDecorator={
                    <div className="flex flex-row ml-1">
                      <BaseButton
                        className="flex items-center gap-2"
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                      >
                        <AiOutlineFileAdd className="w-5 h-5" />
                      </BaseButton>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/csv, image/jpeg, image/png, image/jpg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  }
                />
              )}
            />

            {(
              Object.keys(documentError) as Array<keyof typeof documentError>
            ).some((field) => documentError[field]?.type === "required") && (
              <p className="text-base font-normal text-error-500">
                Silakan lengkapi semua formulir terlebih dahulu
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-6 lg:justify-end">
            <SecondaryButton
              className="!w-[200px]"
              label="Batal"
              onClick={closeModal}
            />
            <BaseButton
              label={state === "add" ? "Tambah Dokumen" : "Simpan Perubahan"}
              onClick={() => {
                documentSubmit((data: DefaulDocumentType) => {
                  if (state === "add") {
                    addFunction(data);
                  } else {
                    updateFunction(data);
                  }
                })();
              }}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isOpenConfirmation}
        onClose={closeModalConfirmation}
        className="max-w-lg m-4"
      >
        <div className="no-scrollbar relative w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-4 dark:bg-gray-900">
          <div className="">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Konfirmasi
            </h4>
          </div>
          <div className="flex flex-col space-y-4 max-h-[50dvh] overflow-y-auto p-0.5">
            <p className="text-base font-normal text-slate-800 dark:text-slate-100">
              Apakah Anda yakin ingin menghapus dokumen ini?
            </p>
          </div>
          <div className="flex items-center gap-3 mt-6 lg:justify-end">
            <SecondaryButton
              className="!w-[200px]"
              label="Batal"
              onClick={closeModalConfirmation}
            />
            <BaseButton
              label={"Hapus Dokumen"}
              onClick={() => {
                deleteFunction();
              }}
            />
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default Document;
