import { setDefaultHomepage } from "discourse/lib/utilities";
import { ajax } from "discourse/lib/ajax";
import DiscourseURL from "discourse/lib/url";
import { withPluginApi } from "discourse/lib/plugin-api";
import { computed } from "@ember/object";
import getURL from "discourse-common/lib/get-url";
import mobile from "discourse/lib/mobile";

export default {
  name: "discourse-custom-homepage",
  initialize(container) {
    withPluginApi("0.11.4", (api) => {
      const router = container.lookup("router:main");
      window.console.log(
        `doing the cool router! for`,
        router.currentURL,
        router,
        this
      );
      const user = api.getCurrentUser();
      window.console.log("s,u", settings, user, settings.group_page_map);
      const { setDefaultHomepage } = require("discourse/lib/utilities");
      if (user && user.primary_group_name) {
        if (settings.group_page_map) {
          window.console.log("map", settings.group_page_map);
          var groupMap = settings.group_page_map.replace(",", ":").split("|");
          const mapEntry = groupMap.find((value) =>
            RegExp(user.primary_group_name).test(value)
          );
          if (mapEntry) {
            const url = mapEntry.split(":")[1];
            setDefaultHomepage(url);
            window.console.log("calling ajax", url);
            ajax(url, {
              type: "GET",
            })
              .then(function (result) {
                let isHomePage = null;
                if (router.currentURL === "/") {
                  isHomePage = true;
                  window.console.log("set homepage true");
                }

                window.console.log("result", result);
                if (result) {
                  setDefaultHomepage(url);
                  window.console.log(`setting url ${url}, ${isHomePage}`);
                  if (isHomePage) {
                    window.console.log(`doing redirect`);
                    DiscourseURL.redirectTo(url);
                  }
                }
              })
              .catch(function (err) {
                console.log({ err });
              })
              .finally(function () {
                // placeholder
              });
          }
        }
      }
    });
  },
};
