import Chat from "@/components/@new/chat/chat";
import { getUserAction, getUserChatInfo, getUserFullDetailsAction } from "@/server-actions/user/actions";

const MessagePage = async ({ searchParams }: { searchParams: { [key: string]: string } }) => {
  const openChat = searchParams.userId ? await getUserChatInfo(Number(searchParams.userId)) : null;
  const user = await getUserAction();
  return <div className="min-h-[70vh]">{user && <Chat other={openChat?.data || null} />}</div>;
};

export default MessagePage;
