const BACKEND_API = process.env.BACKEND_API;

const POST = async (req: any) => {
  const { url } = await req.json();
  console.log(url);

  try {
    const response = await fetch(`${BACKEND_API}/api/shorturl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullurl: url,
      }),
    });
    if (!response.ok) {
      console.log("Error Occured: ", response.status);
    }

    const data = await response.json();
    console.log("response: ", data);
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(`url : ${error}`);
    return new Response(JSON.stringify(error));
  }
};

export { POST };
