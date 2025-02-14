const { BACKEND_URL } = process.env;

const POST = async (req: Request) => {
  const { url } = await req.json();
  // console.log("URL ->", params);
  try {
    //localhost:8000/api/shorturl/iYK6j84DxG
    http: const response = await fetch(`${BACKEND_URL}/api/shorturl/${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
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
