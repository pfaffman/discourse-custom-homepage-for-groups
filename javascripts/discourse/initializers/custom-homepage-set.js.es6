import mobile from "discourse/lib/mobile";
import { withPluginApi } from "discourse/lib/plugin-api";
import PreloadStore from "discourse/lib/preload-store";

export default {
  name: "discourse-custom-homepage",
  initialize() {
    withPluginApi("0.11.4", (api) => {
      // const router = container.lookup("router:main");
      const user = api.getCurrentUser();
      const { setDefaultHomepage } = require("discourse/lib/utilities");

      if (settings.custom_default_homepage) {
        const url = settings.custom_default_homepage.replace(/^\/+/g, "");
        setDefaultHomepage(url);
        PreloadStore.remove("topic_list");
      }

      if (!user && settings.anon_page) {
        const url = settings.anon_page.replace(/^\/+/g, "");
        setDefaultHomepage(url);
        PreloadStore.remove("topic_list");
      }

      if (mobile.isMobileDevice && settings.mobile_homepage) {
        const url = settings.mobile_homepage.replace(/^\/+/g, "");
        setDefaultHomepage(url);
        PreloadStore.remove("topic_list");
      }

      if (user) {
        if (user.primary_group_name && settings.group_page_map) {
          let groupMap = settings.group_page_map.replace(",", ":").split("|");
          const mapEntry = groupMap.find((value) =>
            RegExp(user.primary_group_name).test(value)
          );
          if (mapEntry) {
            const url = mapEntry.split(":")[1].replace(/^\/+/g, "");
            window.console.log("setting url", url);
            setDefaultHomepage(url);
            PreloadStore.remove("topic_list");
          }
        }
      }
    });
  },
};
