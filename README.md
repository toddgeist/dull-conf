# dull-config
Configuration should be dull. Less abracadabra.

## Philosophy
Just use plain javascript files for configuration. This allows for comments and computed configurations. You can break up the configuration into as many files as you like. They can be where ever you like.

Keep configs for different environments in the same file. I find this is easier than swtiching back and forth between production.config.js and development.config.js

Keep the approach simple. No globbing for files. Just load require()'d config modules.
