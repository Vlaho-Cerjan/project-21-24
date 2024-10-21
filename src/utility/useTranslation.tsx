import { AccessibilityContext, defaultLocale } from "../store/providers/accessibilityProvider";
import { useContext } from "react";

export default function useTranslation(strings: any) {
  const { accessibility } = useContext(AccessibilityContext);

  const locale = accessibility.language || defaultLocale;

  function t(key: string) {
    if(typeof strings[locale] !== "undefined"){
      if (!strings[locale][key]) {
        console.warn(`No string '${key}' for locale '${locale}'`);
      }
          if(strings[defaultLocale]){
              return strings[locale][key] || strings[defaultLocale][key] || "";
          }
      }
    }

  return { t, locale };
}