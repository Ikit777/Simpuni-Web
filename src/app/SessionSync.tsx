"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from "@/redux/store";
import { setInfo } from "@/redux/features/user/userSlice";

const SessionSync = () => {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const prevSessionRef = useRef(session);
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setShouldFetch(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session && shouldFetch) {
      if (
        prevSessionRef.current?.user.access_token === session.user.access_token
      ) {
        return;
      }

      const fetchUserInfo = async () => {
        try {
          const { access_token } = session.user;
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          );

          const userInfo = response.data;
          if (userInfo) {
            const result = userInfo.data;
            const user = {
              id: result.id,
              username: result.username,
              email: result.email,
              name: result.name,
              position: result.posisi,
              instansi: result.instansi,
              type_user: result.type_user,
              avatar: result.avatar,
              slug: result.slug,
              fcm_token: "",
            };
            dispatch(setInfo(user));
          } else {
            console.error("Failed to get user info:", userInfo.message);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        } finally {
          setShouldFetch(false);
        }
      };

      fetchUserInfo();
      prevSessionRef.current = session;
    }
  }, [session, status, dispatch, shouldFetch]);

  return null;
};

export default SessionSync;
