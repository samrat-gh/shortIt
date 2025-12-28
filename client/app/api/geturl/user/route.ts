const { BACKEND_URL } = process.env;

const POST = async (req: Request) => {
  const { userId } = await req.json();

  try {
    const response = await fetch(`${BACKEND_URL}/api/shorturl/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),

      cache: "no-store",
    });
    if (!response.ok) {
      console.log("Error Occured: ", response.status);
    }

    const data = await response.json();

    // console.log("response: ", data);
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error(`url : ${error}`);
    return new Response(JSON.stringify(error));
  }
};

export { POST };
