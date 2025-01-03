import React from "react";
import "../../../assets/css/auth.css";
import useAuthController from "./auth-controller";

const AuthPages: React.FC = () => {
  const {
    theme,
    isSignIn,
    formData,
    errors,
    handleChange,
    handleSubmit,
    handleFormChange,
  } = useAuthController();

  return (
    <div data-theme={`${theme}`}>
      <div className="auth-container">
        <div className="form-container">
          <div className="form-title">
            <h2>{isSignIn ? "Welcome Back!" : "Create Account"}</h2>
            <p>{isSignIn ? "Sign in to continue playing" : "Join the arena"}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder={isSignIn ? "Username or Email" : "Username"}
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "error" : ""}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {!isSignIn && (
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
            )}

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {!isSignIn && (
              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            <button type="submit" className="submit-btn">
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              {isSignIn ? "Don't have an account?" : "Already have an account?"}
              <button
                className="toggle-btn"
                onClick={() => {
                  handleFormChange();
                }}
              >
                {isSignIn ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;
