export const ScrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    const navbarHeight = 70;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: sectionTop - navbarHeight,
      behavior: "smooth",
    });
  }
};
