import { withPluginApi } from "discourse/lib/plugin-api";
import PreloadStore from "discourse/lib/preload-store";
import { setDefaultHomepage } from "discourse/lib/utilities";

export default {
  name: "discourse-custom-homepage",
  initialize() {
    withPluginApi("0.11.4", (api) => {
      const user = api.getCurrentUser();

      if (user) {
        if (user.primary_group_name && settings.group_page_map) {
          let groupMap = settings.group_page_map.replace(",", ":").split("|");
          const mapEntry = groupMap.find((value) =>
            RegExp(user.primary_group_name).test(value)
          );
          if (mapEntry) {
            const url = mapEntry.split(":")[1].replace(/^\/+/g, "");
            setDefaultHomepage(url);
            PreloadStore.remove("topic_list");
          }
        }
      }
    });
  },
};
