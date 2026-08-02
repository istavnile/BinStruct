import { getLang } from "@/lib/lang";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const lang = getLang();
  return <LoginForm lang={lang} />;
}
