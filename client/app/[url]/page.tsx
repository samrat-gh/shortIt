import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { url: string } }) => {
  console.log(params.url);

  const res = await fetch(
    `https://shortit-7r2p.onrender.com/api/shorturl/${params.url}`,
    {
      method: "GET",
    },
  );

  if (!res.ok) {
    console.log(res);
  }

  if (res.ok) {
    console.log("i");
  }

  const data = await res.json();
  console.log("Hello: ", data);

  if (data.success) {
    redirect(data.data[0].url);
  }
  return (
    <div>
      {params.url} {JSON.stringify(data)}
    </div>
  );
};

export default Page;
