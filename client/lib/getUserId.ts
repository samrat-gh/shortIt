const getUserId = () => {
  const userId = localStorage.getItem("si-uid");

  if (userId) {
    // console.log(userId);
    return userId;
  }

  const hash = Math.random().toString(36).substring(2, 8);
  const uid = `usr_${Date.now()}_${hash}`;
  localStorage.setItem("si-uid", uid);
  return uid;
};

export { getUserId };
