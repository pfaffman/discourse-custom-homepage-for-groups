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
      const user = api.getCurrentUser();
      const { setDefaultHomepage } = require("discourse/lib/utilities");
      if (user && user.primary_group_name) {
        if (settings.group_page_map) {
          var groupMap = settings.group_page_map.replace(",", ":").split("|");
          const mapEntry = groupMap.find((value) =>
            RegExp(user.primary_group_name).test(value)
          );
          if (mapEntry) {
            const url = mapEntry.split(":")[1];
            setDefaultHomepage(url);
            // pull in a page so that the router gets defined
            // TODO: write this as a function to be called in all 3 cases
            ajax(`${url}.json`, {
              type: "GET",
            })
              .then(function (result) {
                if (router.currentURL === "/") {
                  DiscourseURL.redirectTo(url);
                }
              })
              .catch(function (err) {
                console.log("error on then", { err });
              })
              .finally(function () {
                // placeholder
              });
          }
        }
      } else {
        if (mobile.isMobileDevice && settings.mobile_homepage && !user) {
          const url = settings.mobile_homepage;
          setDefaultHomepage(url);
          ajax(`${url}.json`, {
            type: "GET",
          })
            .then(function (result) {
              setDefaultHomepage(url);
              if (router.currentURL === "/") {
                DiscourseURL.redirectTo(url);
              }
            })
            .catch(function (err) {
              console.log({ err });
            })
            .finally(function () {
              // placeholder
            });
        } else if (settings.anon_page && !user) {
          const url = settings.anon_page;
          setDefaultHomepage(url);
          ajax(`${url}.json`, {
            type: "GET",
          })
            .then(function (result) {
              setDefaultHomepage(url);
              if (router.currentURL === "/") {
                DiscourseURL.redirectTo(url);
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
    });
  },
};
