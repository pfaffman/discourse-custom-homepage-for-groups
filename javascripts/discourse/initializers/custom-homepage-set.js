import { withPluginApi } from "discourse/lib/plugin-api";
import PreloadStore from "discourse/lib/preload-store";
import { setDefaultHomepage } from "discourse/lib/utilities";

export default {
  name: "discourse-custom-homepage",
  initialize() {
    withPluginApi("0.11.4", (api) => {
      const user = api.getCurrentUser();
      let url = null;

      if (settings.custom_default_homepage) {
        url = settings.custom_default_homepage.replace(/^\/+/g, "");
      }

      if (user) {
        if (user.primary_group_name && settings.group_page_map) {
          let groupMap = settings.group_page_map.replace(",", ":").split("|");
          const mapEntry = groupMap.find((value) =>
            RegExp(user.primary_group_name).test(value)
          );
          if (mapEntry) {
            url = mapEntry.split(":")[1].replace(/^\/+/g, "");
          }
        }
      } else if (settings.anon_page) {
        url = settings.anon_page.replace(/^\/+/g, "");
      }

      if (url) {
        setDefaultHomepage(url);
        PreloadStore.remove("topic_list");
      }
    });
  },
};
