import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("privacy-policy", "routes/privacy-policy.tsx"),
  route("terms-of-use", "routes/terms-of-use.tsx"),
  route("refund-policy", "routes/refund-policy.tsx"),
  route("contact", "routes/contact.tsx"),
  route("settings", "routes/settings.tsx"),
] satisfies RouteConfig;
