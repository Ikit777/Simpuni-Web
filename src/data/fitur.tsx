import {
  FiBriefcase,
  FiPieChart,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

import { IBenefit } from "@/types/types";
import {
  HiOutlineDocumentReport,
  HiOutlineDocumentSearch,
} from "react-icons/hi";
import { TbHeartRateMonitor } from "react-icons/tb";
import { MdOutlineAnalytics } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";

export const fitur: IBenefit[] = [
  {
    title: "Sistem Pelaporan",
    description:
      "Sistem pelaporan yang terintegrasi dengan baik, memudahkan pengguna melakukan pelaporan dan pengelolaan pelaporan.",
    bullets: [
      {
        title: "Pembuatan Pelaporan",
        description:
          "Menyediakan platform yang mudah digunakan untuk membuat pelaporan yang komprehensif dan terperinci.",
        icon: <HiOutlineDocumentReport size={26} />,
      },
      {
        title: "Pengelolaan Pelaporan",
        description:
          "Memungkinkan pengguna untuk mengelola pelaporan yang telah dibuat dengan mudah dan efisien.",
        icon: <FiBriefcase size={26} />,
      },
      {
        title: "Pelacakan Pelaporan",
        description:
          "Memantau perkembangan pelaporan memastikan semua proses berjalan sesuai rencana.",
        icon: <HiOutlineDocumentSearch size={26} />,
      },
    ],
    imageSrc: "/images/mockup-1.png",
  },
  {
    title: "Pemantauan",
    description:
      "Pemantauan dan perkembangan kinerja petugas dalam waktu nyata dengan data yang akurat.",
    bullets: [
      {
        title: "Pelacakan Langsung",
        description:
          "Memungkinkan pemantauan posisi petugas secara langsung, memastikan tugas diselesaikan dengan benar.",
        icon: <TbHeartRateMonitor size={26} />,
      },
      {
        title: "Hasil Penugasan",
        description:
          "Ringkasan atau detail dari tugas yang telah diselesaikan petugas.",
        icon: <FiPieChart size={26} />,
      },
      {
        title: "Akuntabilitas Tugas",
        description:
          "Memastikan setiap tugas yang diberikan tercatat dengan jelas dan transparan.",
        icon: <FiTrendingUp size={26} />,
      },
    ],
    imageSrc: "/images/mockup-2.png",
  },
  {
    title: "Evaluasi Terintegrasi",
    description:
      "Analisis dan evaluasi terintegrasi untuk membantu pengambilan keputusan.",
    bullets: [
      {
        title: "Analisis Data",
        description:
          "Menampilkan data hasil anaisis berupa chart atau grafik.",
        icon: <MdOutlineAnalytics size={26} />,
      },
      {
        title: "Evaluasi Pelaporan",
        description:
          "Mengevelauasi pelaporan berdasarkan hasil penugasan petugas.",
        icon: <CgFileDocument size={26} />,
      },
      {
        title: "Rekap Data",
        description:
          "Mengumpulkan dan menyusun berbagai informasi menjadi satu file terorganisir.",
        icon: <FiShield size={26} />,
      },
    ],
    imageSrc: "/images/mockup-3.png",
  },
];
