import proxy from "express-http-proxy";

export const eProxy = (target: string, basePath: string) => {
  return proxy(target, {
    proxyReqPathResolver: (req) => {
      return `${basePath}${req.url}`;
    },
  });
};
