import baseTranslation from "./translation";
import navbarTranslation from "./navbar";
import homeTranslation from "./home";
import footerTranslation from "./footer";

const translation = {
  ...baseTranslation,
  nav: navbarTranslation,
  seedFinder: baseTranslation.seedFinder,
  advisoryHub: baseTranslation.advisoryHub,
  home: {
    ...homeTranslation,
    footer: footerTranslation,
  },
};

export default translation;
