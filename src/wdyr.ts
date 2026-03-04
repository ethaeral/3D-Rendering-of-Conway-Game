import React from "react";

if (import.meta.env.DEV) {
  const whyDidYouRender = await import(
    "@welldone-software/why-did-you-render"
  ).then((m) => m.default);
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackHooks: true,
  });
}
