const { BACKEND_URL } = process.env;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("userid");

  try {
    const res = await fetch(`${BACKEND_URL}/api/deleteusersurl/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.log("error", res.status, res.statusText);
    }

    const data = await res.json();
    // console.log(data);
    return new Response(JSON.stringify(data), {
      status: res.status,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }
}
