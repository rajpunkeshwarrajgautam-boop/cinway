"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import "./auth.css";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [variant, setVariant] = useState("login");

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => (currentVariant === "login" ? "register" : "login"));
  }, []);

  const login = useCallback(async () => {
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/profiles",
      });
    } catch (error) {
      console.log(error);
    }
  }, [email, password]);

  const register = useCallback(async () => {
    try {
      await axios.post("/api/register", {
        email,
        name,
        password,
      });

      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  return (
    <div className="authBackground">
      <div className="authOverlay">
        <nav className="authNav">
          <h1>CINWAY</h1>
        </nav>
        <div className="authContainer">
          <div className="authBox">
            <h2>
              {variant === "login" ? "Sign in" : "Register"}
            </h2>
            <div className="inputGroup">
              {variant === "register" && (
                <div className="relativeInput">
                  <input
                    onChange={(e: any) => setName(e.target.value)}
                    value={name}
                    id="name"
                    type="text"
                    className="authInput"
                    placeholder=" "
                  />
                  <label className="authLabel" htmlFor="name">
                    Username
                  </label>
                </div>
              )}
              <div className="relativeInput">
                <input
                  onChange={(e: any) => setEmail(e.target.value)}
                  value={email}
                  id="email"
                  type="email"
                  className="authInput"
                  placeholder=" "
                />
                <label className="authLabel" htmlFor="email">
                  Email
                </label>
              </div>
              <div className="relativeInput">
                <input
                  onChange={(e: any) => setPassword(e.target.value)}
                  value={password}
                  id="password"
                  type="password"
                  className="authInput"
                  placeholder=" "
                />
                <label className="authLabel" htmlFor="password">
                  Password
                </label>
              </div>
            </div>
            <button
              onClick={variant === "login" ? login : register}
              className="authButton"
            >
              {variant === "login" ? "Login" : "Sign up"}
            </button>
            <div className="oauthGroup">
              <div
                onClick={() => signIn("google", { callbackUrl: "/profiles" })}
                className="oauthIcon"
              >
                <FcGoogle size={30} />
              </div>
              <div
                onClick={() => signIn("github", { callbackUrl: "/profiles" })}
                className="oauthIcon"
              >
                <FaGithub size={30} />
              </div>
            </div>
            <p className="authSwitch">
              {variant === "login" ? "First time using Netflix?" : "Already have an account?"}
              <span
                onClick={toggleVariant}
              >
                {variant === "login" ? "Create an account" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
