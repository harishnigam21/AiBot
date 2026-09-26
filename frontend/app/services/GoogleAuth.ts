import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { eAxios } from "@/utils/axios";
import { User } from "../redux/slices/User";
import { Data } from "@/types/data";

export const LogInWithGoogle = async (): Promise<Data<User> | null> => {
  try {
    const response = await signInWithPopup(auth, googleProvider);
    if (!response.user) return null;
    const idToken = await response.user.getIdToken();
    const { data } = await eAxios.post("api/auth/login", { token: idToken });
    return data;
  } catch (error) {
    console.error("Error from LogInWithGoogle func", error);
    return null;
  }
};
