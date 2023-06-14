import { useState, ChangeEvent } from "react";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { loginRequest } from "../../api/authService";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import {
  faEye,
  faEyeSlash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const signinSchema = Yup.object().shape({
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required."),
});

type FormValues = {
  username: string;
  password: string;
};

const Login = () => {
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // It is used to get the previous location of the web page from which the login page is accessed. If either of the "state" or "from" properties does not exist, the default value "/" is returned.

  const initialValues: FormValues = {
    username: "",
    password: "",
  };

  const togglePasswordVisibility = () => () => {
    setShowPassword(!showPassword);
  };

  // Overriding formik's handleChange function
  const customHandleChange =
    (handleChangeFn: (e: ChangeEvent<any>) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChangeFn(e);
      setServerMsg("");
    };

  const handleSubmit = async (
    values: FormValues,
    { resetForm, setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const response = await loginRequest(values);
      const accessToken = response?.data?.accessToken;
      setAuth({ user: values.username, accessToken });
      resetForm();
      navigate(from, { replace: true }); // The first argument of the navigate function is the location to which you want to redirect the user. "replace: true" is an options object used to replace the current entry in the browser history instead of adding a new entry. This means that if the user clicks the "Back" button in the browser, they will not return to the login page, but instead return to the page before the login page.
    } catch (err: any) {
      if (!err?.response) {
        setServerMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setServerMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setServerMsg("Unauthorized");
        resetForm();
      } else {
        setServerMsg("Login Failed");
        resetForm({
          values: {
            ...values,
            username: "",
          },
        });
      }
    }
    setSubmitting(false);
  };

  return (
    <section>
      <h1>Sign In</h1>
      {/* SERVER INFO */}
      {serverMsg && <p className="errmsg">{serverMsg}</p>}
      <Formik
        initialValues={initialValues}
        validationSchema={signinSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, handleChange }) => (
          <Form>
            {/* USERNAME */}
            <label htmlFor="username">Username:</label>
            <Field
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={customHandleChange(handleChange)}
              autoComplete="off"
            />
            <ErrorMessage name="username" component="p">
              {(errorMsg) => (
                <div className="instructions">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </ErrorMessage>

            {/* PASSWORD */}
            <label htmlFor="password">Contraseña:</label>
            <div className="controlPwd">
              <Field
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={values.password}
                onChange={customHandleChange(handleChange)}
                autoComplete="off"
                className="inputPwd"
              />
              <i onClick={togglePasswordVisibility()} className="iconEye">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </i>
            </div>
            <ErrorMessage name="password" component="p">
              {(errorMsg) => (
                <div className="instructions">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </ErrorMessage>
            {/* BUTTON SUBMITTING */}
            <button type="submit" disabled={isSubmitting}>
              Sign In
            </button>
          </Form>
        )}
      </Formik>

      <p>
        Need an Account?
        <br />
        <span className="line">
          {/*put router link here*/}
          <a href="/register">Sign Up</a>
        </span>
      </p>
    </section>
  );
};

export default Login;
