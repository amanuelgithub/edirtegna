module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
      // @caution react-native-reanimated/plugin has to be listed last.
      "react-native-reanimated/plugin",
    ],
  };
};
