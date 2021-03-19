# discourse-custom-homepage-for-groups

When installed and added to the active theme, this theme component allows setting a user home page according to their primary group.

There is a Theme Setting called `group page map` that allows for multiple entries. Each
entry should be of the format `group_name:path`, where `group_name` is the group name (not the group `Full Name`) and the `path` is the desired home page (e.g., "/c/great-category/4").

If the theme setting or the user primary group is changed, a reload will be required to have the change take effect.

An earlier release of this plugin, which I think no one was using, used a comma (`,`) rather than a colon to separate the `group_name` and `path`. Though this still works, support for that format may be removed in the future.

Anonymous (i.e., not logged in) users have a null `primary_group_name`, but a logged in user will have a `primary_group_name` of 'undefined'. To have a different default home page for logged in vs anonymous users, you could set the global default home page to some page encouraging users to log in and use this component to set the home page to, say `/latest`.