import type { APIContext } from "astro";
import { defineMiddleware } from "astro:middleware";
import { SITE } from "astrowind:config";

const routeHandler = defineMiddleware(({  url, redirect }: APIContext, next) => {
  // intercept response data from a request
  if (!SITE.publish && url.pathname !== "/coming-soon") {
    return redirect("/coming-soon"+url.search);
  }
  // return a Response or the result of calling `next()`
  return next();
})

export default routeHandler
