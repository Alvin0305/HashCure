export const joinUser = async ({ user_id, socket }) => {
  socket.join(`user_${user_id}`);
  console.log("user joined ", user_id, socket.id);
};
