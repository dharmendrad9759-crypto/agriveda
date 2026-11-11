export function isProductionRuntime(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.AGRIVEDA_FORCE_PROD_AUTH === "true"
  );
}
