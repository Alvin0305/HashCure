export const join = async ({ user_id, socket }) => {
  socket.join(`user_${user_id}`);
};
