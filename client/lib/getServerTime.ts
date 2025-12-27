async function getServerTime() {
  const res = await fetch("/api/now", {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok) {
    console.log(res.status, res.statusText);
  }
  const response = await res.json();

  return response;
}
