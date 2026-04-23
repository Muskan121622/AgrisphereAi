import baseTranslation from "./translation";
import navbarTranslation from "./navbar";
import homeTranslation from "./home";
import footerTranslation from "./footer";

const translation = {
  ...baseTranslation,
  nav: navbarTranslation,
  home: {
    ...homeTranslation,
    footer: footerTranslation,
  },
};

export default translation;
