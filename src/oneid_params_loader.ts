let success = false;

while (!success) {
  await fetch(
    "https://sso-cloud.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=savdo_uzavtosanoat_uz&redirect_uri=https://savdo.uzavtosanoat.uz/oauth2/oneid&scope=savdo_uzavtosanoat_uz&state=763c1710-a3e2-11ee-b54f-1d25f9069388",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language":
          "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uz;q=0.6,de;q=0.5,ko;q=0.4",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Linux"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      referrer: "https://savdo.uzavtosanoat.uz/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "omit",
    }
  ).then(async (data) => {
    success = data.status !== 404;
    console.log("Status", data.status);

    await new Promise((resolve) => setTimeout(resolve, 15000));
  });
}
