const Page = async ({ params }: { params: { url: string } }) => {
  console.log(params.url);

  const res = await fetch(`http://localhost:8000/api/shorturl`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-cache",
  });

  if (!res.ok) {
    console.log(res.status, res.statusText);
  }

  const data = await res.json();
  console.log("Hello: ", data);

  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
