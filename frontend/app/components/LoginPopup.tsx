"use client";
import { Phone, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { loginSwitch } from "../redux/slices/Popup";
import { LogInWithGoogle } from "../services/GoogleAuth";
import { setLoginStatus, setUser } from "../redux/slices/User";
import { FcGoogle } from "react-icons/fc";
import { SiRefinedgithub } from "react-icons/si";
import { useState } from "react";

export default function LoginPopup() {
  const [loading, setLoading] = useState<boolean>(false);
  const loginPopup = useAppSelector((store) => store.popup.login);
  const dispatch = useAppDispatch();
  return (
    loginPopup && (
      <section className="bg-transparent backdrop-blur-sm fixed top-0 left-0 w-full h-full flex items-center-safe justify-center-safe">
        <div className="relative w-100 max-w-9/10 bg-bgsec rounded-xl p-8 flex flex-col items-center gap-3">
          <h2 className="text-2xl">Log in or sign up</h2>
          <p className="text-center font-light">
            You’ll get smarter responses and can upload files, images, and more.
          </p>
          {/* Google */}
          <div
            className="rounded-full cursor-pointer bg-bgpri/30 hover:bg-transparent active:bg-transparent border border-borderhl p-3 w-full flex items-center justify-center gap-2 transition-all"
            onClick={async () => {
              if (loading) return;
              try {
                setLoading(true);
                const userData = await LogInWithGoogle();
                if (!userData || !userData.data) {
                  dispatch(setLoginStatus("unauthenticated"));
                  return;
                }
                if (userData.actk) localStorage.setItem("actk", userData.actk);
                dispatch(setUser(userData.data));
                dispatch(setLoginStatus("authenticated"));
                dispatch(loginSwitch(false));
                window.location.reload();
              } catch (error) {
              } finally {
                setLoading(false);
              }
            }}
          >
            <FcGoogle className="size-6" />
            <p className="font-medium">Continue with Google</p>
          </div>
          {/* Github */}
          <div className="rounded-full cursor-pointer bg-bgpri/30 hover:bg-transparent active:bg-transparent border border-borderhl p-3 w-full flex items-center justify-center gap-2 transition-all">
            <SiRefinedgithub className="size-5" />
            <p className="font-medium">Continue with Github</p>
          </div>
          {/* Phone */}
          <div className="rounded-full cursor-pointer bg-bgpri/30 hover:bg-transparent active:bg-transparent border border-borderhl p-3 w-full flex items-center justify-center gap-2 transition-all">
            <Phone className="size-5" />
            <p className="font-medium">Continue with phone</p>
          </div>
          {/* intersection OR`` */}
          <div className="flex flex-nowrap items-center w-full">
            <hr className="grow border-borderhl" />
            <small className="px-3">OR</small>
            <hr className="grow border-borderhl" />
          </div>

          {/* by email */}
          <div className="flex flex-col gap-3 w-full">
            <input
              type="email"
              name="email"
              id="email"
              className="w-full bg-bgpri rounded-full p-3"
              placeholder="emal@example.com"
            />
            <button className="w-full rounded-full bg-white text-black p-3 font-medium cursor-pointer hover:bg-white/90 active:bg-white/90 transition-all">
              Continue
            </button>
          </div>

          <X
            size={16}
            onClick={() => dispatch(loginSwitch(false))}
            className="text-txpri absolute top-8 right-8 cursor-pointer"
          />
        </div>
      </section>
    )
  );
}
