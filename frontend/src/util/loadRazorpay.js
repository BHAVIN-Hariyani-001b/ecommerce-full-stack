export const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    const script = existing || document.createElement("script");
    let settled = false;

    const finish = (loaded) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      resolve(loaded && !!window.Razorpay);
    };

    const timeoutId = setTimeout(() => finish(false), 10000);
    script.onload = () => finish(true);
    script.onerror = () => finish(false);

    if (!existing) {
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  });
};
