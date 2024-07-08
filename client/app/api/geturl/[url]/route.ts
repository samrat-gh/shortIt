const { BACKEND_URL } = process.env;

const GET = async (params: { params: { url: string } }) => {
  console.log("URL ->", params);
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/shorturl/${params.params.url}`,
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
