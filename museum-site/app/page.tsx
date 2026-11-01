import { getChatGPTUser } from "./chatgpt-auth";
import Museum from "@/components/museum";

export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await getChatGPTUser();
  return <Museum signedIn={!!user} sessionScope={user?.userId} />;
}
