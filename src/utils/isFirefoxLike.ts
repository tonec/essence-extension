export const isFirefoxLike = () => {
  return (
    import.meta.env.EXTENSION_PUBLIC_BROWSER === "firefox" ||
    import.meta.env.EXTENSION_PUBLIC_BROWSER === "gecko-based"
  );
};
