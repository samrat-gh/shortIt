const { BACKEND_API } = process.env;

const GET = async (params: any) => {
  console.log("hi I am here", params.params.url);

  console.log(`${BACKEND_API}/api/shorturl/${params.params.url}`);
  try {
    const response = await fetch(
      `${BACKEND_API}/api/shorturl/${params.params.url}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      },
    );
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

export { GET };
