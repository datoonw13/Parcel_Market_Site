import { getUserAction, getUserToken } from "@/server-actions/user/actions";
import EventSourceListener from "./event-source-listener";

const EventSourceWrapper = async () => {
  const jwt = await getUserToken();
  const user = await getUserAction();
  return jwt && user && <EventSourceListener jwt={jwt} userId={user.id} />;
};

export default EventSourceWrapper;
