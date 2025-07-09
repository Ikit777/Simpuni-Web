import { redirect } from "next/navigation";

const RedirectPage = () => {
  redirect("/admin/dashboard");
};

export default RedirectPage;
