import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useTheme } from "../../../context/theme-context";
import { useLocation, useNavigate } from "react-router-dom";
import { useSignin, useSignup } from "../service";
import Cookies from "js-cookie";
import { USER_ACCESS_KEY } from "../../../utils/enum";
import { useUser } from "../../../context/user-context";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const useAuthController = () => {
  const { theme } = useTheme();
  const { setUser } = useUser();
  const { search } = useLocation();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const signin = useSignin();
  const signup = useSignup();

  useEffect(() => {
    const urlParams = new URLSearchParams(search);
    if (urlParams.get("signin")) {
      setIsSignIn(true);
    } else if (urlParams.get("signup")) {
      setIsSignIn(false);
    }
  }, [search]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isSignIn) {
      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email format is invalid";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else {
      if (!formData.username) {
        newErrors.username = "Username or Email is required";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (isSignIn) {
        signin.mutate(formData);
      } else {
        signup.mutate(formData);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFormChange = () => {
    setErrors({});
    navigate(`?${!isSignIn ? "signin=true" : "signup=true"}`);
  };

  useEffect(() => {
    if (
      (signin.isSuccess && signin.data) ||
      (signup.isSuccess && signup.data)
    ) {
      if (isSignIn && signin.data) {
        Cookies.set(USER_ACCESS_KEY.TOKEN, signin.data?.token, {
          secure: true,
          sameSite: "lax",
        });
      } else if (!isSignIn && signup.data) {
        Cookies.set(USER_ACCESS_KEY.TOKEN, signup.data?.token, {
          secure: true,
          sameSite: "lax",
        });
      }
      setUser({
        id: isSignIn ? signin.data?.id : signup.data?.id,
        email: isSignIn ? signin.data?.email : signup.data?.email,
        name: isSignIn ? signin.data?.username : signup.data?.username,
      });
      const urlParams = new URLSearchParams(search);
      const redirect = urlParams.get("redirect");

      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signin.isSuccess, signin.data, signup.isSuccess, signup.data]);

  return {
    theme,
    isSignIn,
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleFormChange,
  };
};

export default useAuthController;
