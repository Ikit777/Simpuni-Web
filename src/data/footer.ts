import { IMenuItem, ISocials } from "@/types";

export const footerDetails: {
  subheading: string;
  quickLinks: IMenuItem[];
  email: string;
  telephone: string;
  socials: ISocials;
} = {
  subheading:
    "Sistem Informasi Manajemen Pengawasan Pendataan Bangunan dan Perizinan",
  quickLinks: [
    {
      text: "Home",
      id: "home",
    },
    {
      text: "Fitur",
      id: "fitur",
    },
    {
      text: "Tentang",
      id: "tentang",
    },
  ],
  email: "simpunibanjarbaru@gmail.com",
  telephone: "+1 (123) 456-7890",
  socials: {
    facebook: "https://facebook.com",
    instagram: "https://www.instagram.com",
  },
};
