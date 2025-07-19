import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";

const gProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const createUser = (Email, Password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, Email, Password);
  };

  const login = (Email, Password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, Email, Password);
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, gProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Fixed function name to match what Profile component expects
  const updateUserProfile = (profileData) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: profileData.displayName,
      photoURL: profileData.photoURL,
    })
      .then(() => {
        // Update the user state immediately after Firebase update
        setUser((prevUser) => ({
          ...prevUser,
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get the Firebase ID token
        const token = await user.getIdToken();
        // Store it in localStorage
        localStorage.setItem("access-token", token);
      } else {
        // Remove token if logged out
        localStorage.removeItem("access-token");
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync the token with the server on initial load
  useEffect(() => {
    auth.currentUser?.getIdToken(true).then((token) => {
      localStorage.setItem("access-token", token);
    });
  }, []);

  const authData = {
    user,
    loading,
    setUser,
    createUser,
    logOut,
    login,
    googleLogin,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
