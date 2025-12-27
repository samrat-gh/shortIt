async function getServerTime = () => {
    const res = await fetch('/api/now', {
        method: "GET",
        cache: 'no-cache'
    })
    return 
}