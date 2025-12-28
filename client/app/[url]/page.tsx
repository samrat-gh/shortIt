import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { url: string } }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shorturl/${params.url}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    },
  );

  if (!res.ok) {
    console.log(res.status, res.statusText);
  }

  const data = await res.json();
  // console.log("Hello: ", data);

  if (data.success) {
    // console.log(data);
    redirect(data.data[0].url);
  } else {
    return null;
  }

  return (
    <div>
      {params.url}
      {/* {JSON.stringify(data)} */}
    </div>
  );
};

export default Page;
