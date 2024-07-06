const Page = ({ params }: { params: { url: string } }) => {
  console.log(params.url);

  return <div>{params.url}</div>;
};

export default Page;
