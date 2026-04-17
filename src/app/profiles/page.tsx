"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";
import "./profiles.css";

const Profiles = () => {
  const router = useRouter();

  const selectProfile = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div className="profilesContainer">
      <div className="flex flex-col">
        <h1 className="profilesTitle">Who's watching?</h1>
        <div className="profilesGrid">
          <div onClick={() => selectProfile()}>
            <div className="profileItem">
              <div className="profileImageWrapper">
                <Image
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Profile"
                  width={200}
                  height={200}
                  className="profileImage"
                />
              </div>
              <div className="profileName">User 1</div>
            </div>
          </div>
          <div onClick={() => selectProfile()}>
            <div className="profileItem">
              <div className="profileImageWrapper">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Profile"
                  width={200}
                  height={200}
                  className="profileImage"
                />
              </div>
              <div className="profileName">Guest</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
