const { BACKEND_URL } = process.env;

export const dynamic = "force-dynamic";

const POST = async (req: any) => {
  const { uid, url } = await req.json();
  console.log(url);

  try {
    const response = await fetch(`${BACKEND_URL}/api/shorturl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: uid,
        fullurl: url,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.log("Error Occured: ", response.status);
    }

    const data = await response.json();
    console.log("response: ", data);
    return new Response(JSON.stringify(data), {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error(`url : ${error}`);
    return new Response(JSON.stringify(error), {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
};

export { POST };
