const { BACKEND_URL } = process.env;

export async function GET(req: Request) {
  if (!BACKEND_URL) {
    console.error("BACKEND_URL is not defined");
    return new Response(JSON.stringify({ error: "BACKEND_URL is not set" }), {
      status: 500,
    });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/shorturl`, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      console.error(
        `Error Occurred: ${response.status} - ${response.statusText}`,
      );
      return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("Response: ", data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
